import { createReadStream, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import z from "@deepseek-ai/schemastery";
import { z as zod } from "zod";
import { parseSingleRange } from "./range.js";
import { installLikeRoutes } from "./likes.js";
import { COMMUNITY_PROVIDERS, createCommunityClient, installCommunityRoutes, readCommunityLikes, submitCommunityLikes } from "./community.js";

export { parseSingleRange } from "./range.js";

export const PACKAGE_ID = "dsh-flash-skin";
export const SETTINGS_NAMESPACE = "flash-skin";

// Attachment-backed routes used by the client's archive importer. The client
// strips images out of a .zip/.tar archive locally and POSTs them here in
// ≤16-image batches; the server persists each batch into the host's
// `attachments` store (content-addressed sha256 files) and returns URL refs.
// Those URLs are what get embedded into `portraitGroups.images[]`, so the
// config only ever holds references, never base64 payloads. When the host does
// not expose an attachments store this degrades to an HTTP error and the
// client shows the normal import-failure notice.
const ATTACHMENT_PATH = `/plugins/${PACKAGE_ID}/attachment`;
// Serve URLs are one path segment deeper (`<slug>/<hex>`), so the prefix route
// registers the bare path and the handler binds `/`-separated suffixes.
const ATTACHMENT_PREFIX = `${ATTACHMENT_PATH}/`;
const MAX_UPLOAD_IMAGES_PER_BATCH = 16;
// Server-side body budget: one batch of at most 16 images, each already capped
// at MAX_LOCAL_IMAGE_BYTES and carried as base64 (~ +33%). Doubled for slack so
// the check only ever trips on genuinely-malicious payloads.
const MAX_UPLOAD_BODY_BYTES = Math.ceil(MAX_UPLOAD_IMAGES_PER_BATCH * 2 * 1024 * 1024 * 1.34) + 64 * 1024;
const MEDIA_TYPE_BY_SLUG = Object.freeze({
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
});
const SLUG_BY_MEDIA_TYPE = Object.freeze(
  Object.fromEntries(Object.entries(MEDIA_TYPE_BY_SLUG).map(([slug, mediaType]) => [mediaType, slug])),
);
const HEX64_RE = /^[0-9a-f]{64}$/;

// ── Compaction projection unit ──────────────────────────────────────────────
// A projection registers as a *unit* in the host's `sessionProjections` seam:
// the registry folds every committed `session/event` through this unit's `apply`
// (eager drive), keeps a per-session watermark cell, and streams the client
// view to the bundle's `useProjection`. This skin registers a real-event clock
// so the 压缩 (compaction) pulse is driven by an actual completed compaction
// (a `compaction/summary` event) instead of a mere heuristic.
//
// The unit is registered under `ctx.inject(['sessionProjections'], …)`, so on a
// host where the seam (or a registrant of the same key/stateVersion) is absent
// the whole block is inert and the plugin keeps working standalone — the client
// degrades to its pressure-drop heuristic, as the AGENTS.md rule requires.
//
// State is deliberately tiny and plain-JSON-safe so it ships across the wire
// unchanged. `apply` returns a *fresh reference only when* a real
// `compaction/summary` lands, so the host's `Object.is` change feed fires once
// per completed compaction; every other event returns `state` unchanged (same
// reference → zero downstream churn). `event.time` is the host's monotonic wall
// clock in ms; `event.seq` is the session sequence the event was committed at.
const COMPACTION_PROJECTION_KEY = "flash-skin-compaction";
const COMPACTION_PROJECTION_STATE_VERSION = 1;

const compactionProjectionInit = () => ({
  seq: -1,
  atWallMs: 0,
  model: "",
});

/**
 * @param {object} state
 * @param {{ seq:number, time:number, type:string, data?:Record<string, unknown> }} event
 * @returns {object}
 */
function compactionProjectionApply(state, event) {
  // Only a genuine completed compaction anchors a pulse. Non-summary events
  // (compaction/start, compaction/end, anything else) must not move the clock.
  if (event.type !== "compaction/summary") return state;
  const data = event.data ?? {};
  const provider = typeof data.provider === "string" && data.provider ? data.provider : "unknown";
  const model = typeof data.model === "string" && data.model ? data.model : "";
  return {
    seq: event.seq,
    atWallMs: event.time,
    model: model ? `${provider}:${model}` : provider,
  };
}

// The wire block is what makes this key client-visible. The client actually
// consumes the raw plain-JSON snapshot (seq/atWallMs/model), so `view` is the
// identity map and `viewSchema` mirrors the state shape for downstream checks.
const compactionProjectionWire = {
  viewSchema: zod.object({
    seq: zod.number(),
    atWallMs: zod.number(),
    model: zod.string(),
  }),
  view: (state) => state,
};

const compactionProjectionDefinition = {
  key: COMPACTION_PROJECTION_KEY,
  stateVersion: COMPACTION_PROJECTION_STATE_VERSION,
  stateSchema: zod.object({
    seq: zod.number(),
    atWallMs: zod.number(),
    model: zod.string(),
  }),
  init: compactionProjectionInit,
  apply: compactionProjectionApply,
  wire: compactionProjectionWire,
};

// ── Bundled example archives ────────────────────────────────────────────────
// The four/ﬁve demo archives ship inside the package (`examples/portrait-archives/`,
// whitelisted in package.json `files`) and are served back to any client over the
// webServer so the picker can import them from a plain same-origin URL. The file
// list is an allowlist, so the handler never touches anything outside these exact
// names (no path traversal, no sibling reads).
const EXAMPLES_PATH = `/plugins/${PACKAGE_ID}/examples`;
const EXAMPLES_PREFIX = `${EXAMPLES_PATH}/`;
const EXAMPLES_DIR = fileURLToPath(new URL("../examples/portrait-archives/", import.meta.url));
const EXAMPLE_FILES = Object.freeze([
  "liangsheng-demo.zip",
  "liangshen-demo.zip",
  "liangzu-demo.zip",
  "liangshen-url-demo.zip",
  "hanli-demo.zip",
]);

// ── Remote archive proxy ────────────────────────────────────────────────────
// Lets the user import any archive reachable over http(s) by pasting its URL. The
// server fetches it (so a hosting site's CORS policy never blocks the browser) and
// returns the raw bytes; the client then runs the normal parse/upload pipeline. A
// size cap and an http(s)-only scheme guard keep this a bounded, proxy-shaped helper
// rather than an open SSRF fleecing endpoint.
const REMOTE_ARCHIVE_PATH = `/plugins/${PACKAGE_ID}/archive`;
const MAX_REMOTE_ARCHIVE_BYTES = 64 * 1024 * 1024;
const REMOTE_FETCH_TIMEOUT_MS = 20_000;

// Handlers for the two "import from network" routes. `example` streams the
// allow-listed bundled archive back over HTTP; `remote` proxies an arbitrary
// http(s) archive URL so a hosting site's CORS policy cannot block the browser
// import. `activeStreams` tracks in-flight reads so teardown can drain them.
function createNetworkHandlers(activeStreams) {
  const example = (req, res) => {
    const method = req.method ?? "GET";
    if (method !== "GET" && method !== "HEAD") {
      send(res, 405, { Allow: "GET, HEAD" });
      return;
    }
    let pathname;
    try {
      pathname = new URL(req.url ?? "/", "http://dsh.local").pathname;
    } catch {
      send(res, 404);
      return;
    }
    if (!pathname.startsWith(EXAMPLES_PREFIX)) {
      send(res, 404);
      return;
    }
    const file = pathname.slice(EXAMPLES_PREFIX.length);
    if (!EXAMPLE_FILES.includes(file)) {
      send(res, 404);
      return;
    }
    const assetPath = join(EXAMPLES_DIR, file);
    let info;
    try {
      info = statSync(assetPath);
    } catch {
      send(res, 404);
      return;
    }
    if (!info.isFile()) {
      send(res, 404);
      return;
    }
    writeAsset(req, res, method, {
      path: assetPath,
      type: "application/octet-stream",
      size: info.size,
      etag: `W/"${info.size.toString(16)}-${Math.trunc(info.mtimeMs).toString(16)}"`,
    }, activeStreams);
  };

  const remote = async (req, res) => {
    const method = req.method ?? "GET";
    if (method !== "GET" && method !== "HEAD") {
      send(res, 405, { Allow: "GET, HEAD" });
      return;
    }
    let url;
    try {
      url = new URL(req.url ?? "/", "http://dsh.local");
    } catch {
      send(res, 400);
      return;
    }
    const rawTarget = url.searchParams.get("url") ?? "";
    let target;
    try {
      target = rawTarget ? new URL(rawTarget) : null;
    } catch {
      target = null;
    }
    if (!target || (target.protocol !== "http:" && target.protocol !== "https:")) {
      send(res, 400);
      return;
    }
    if (typeof fetch !== "function") {
      send(res, 501);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REMOTE_FETCH_TIMEOUT_MS);
    let remoteRes;
    try {
      remoteRes = await fetch(target, { redirect: "follow", signal: controller.signal });
    } catch {
      clearTimeout(timer);
      send(res, 503);
      return;
    }
    clearTimeout(timer);
    if (!remoteRes.ok) {
      send(res, remoteRes.status >= 500 ? 502 : 400);
      return;
    }
    let body;
    try {
      body = Buffer.from(await remoteRes.arrayBuffer());
    } catch {
      send(res, 503);
      return;
    }
    if (body.byteLength > MAX_REMOTE_ARCHIVE_BYTES) {
      send(res, 413);
      return;
    }
    if (method === "HEAD") {
      send(res, 200, {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(body.byteLength),
        "Cache-Control": "private, max-age=3600, must-revalidate",
      });
      return;
    }
    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(body.byteLength),
      "Cache-Control": "private, max-age=3600, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(body);
  };

  return { example, remote };
}

/**
 * The plugin's settings section (settings namespace `flash-skin`), surfaced
 * under the bundle's page while the Bundle Manager serves it. `portraitGroups`
 * is declared volatile on the WHOLE array so every sub-path stays writable by
 * editors that talk through the "flash-skin" ConfigForms entry. Each group is
 * a named, ordered list of image URLs; the client maps slots low → high
 * reasoning level, so order is the group's visual rank.
 */
export const Config = z.object({
  portraitGroups: z
    .array(z.object({
      id: z.string().min(1).required(),
      name: z.string().min(1).required(),
      images: z.array(z.string().min(1)).default([]),
      // Optional per-group slider level (0..MAX_LEVEL) at which the set flips
      // to the dark shell. Object fields are optional unless `.required()`, so
      // an absent value resolves to the default threshold (MAX_LEVEL - 1),
      // keeping older persisted configs working unchanged.
      darkLevel: z.natural().min(0).max(6),
      // Optional bilingual display names, editable from the plugin detail page.
      // Absent values fall back to `name` / the other language at render time,
      // so pre-bilingual persisted configs keep working unchanged.
      zh: z.string().min(1),
      en: z.string().min(1),
    }))
    .default([])
    .volatile(),
  // Optional community-directory target for the C2 share channel. Points at a
  // public GitHub repo whose tree holds `<path>/<entryId>/<setId>.txt` pointer
  // files; sharers keep custody of their zip URL (the repo only ever stores the
  // text pointer — never archive bytes). When absent the community routing is
  // inert and the C1 text-share channel still works standalone.
  // Keep non-volatile: this is deliberate admin metadata, not per-user runtime
  // state, so it persists in the profile patch like any other exposed config.
  communityDirectory: z.object({
      /**
       * GitHub user or organization owning the target repo. Defaults to the
       * plugin owner's shared directory repo (`tcgbp`), so an unconfigured
       * install is still able to browse out of the box; a site admin may
       * override it to point at their own directory. Object sub-fields stay
       * optional so an absent object validates as `{}` without failing
       * activation — getCommunityTarget then falls back to these defaults at
       * request time.
       */
      owner: z.string().min(1).default("tcgbp"),
      /** Repo name holding the community directory tree. Default: dsh-flash-skin. */
      repo: z.string().min(1).default("dsh-flash-skin"),
      /**
       * Community platform for the directory channel: `github` (default) or
       * `gitee`. Selects the provider shim used for every read (tree/raw) and
       * write (fork→branch→contents→PR) call. Unknown values fall back to
       * github to keep the config backward compatible.
       */
      provider: z.string().default("github"),
      /** Default: master. */
      branch: z.string().default("master"),
      /** Tree root; default: shares. */
      path: z.string().default("shares"),
      /**
       * Optional GitHub PAT (contents: write) used by the *server* to persist
       * aggregated like counts into the community directory via PR
       * (`<path>/likes.json`). When present, the like route batches incremental
       * local likes into a folder and periodically pushes them through the same
       * fork→branch→PUT→PR flow as share submissions. When absent (or the whole
       * communityDirectory is unset) likes gracefully fall back to the local
       * T1/T3 ledger only — standalone-safe, no credentials required.
       * Deliberately a config-supplied token, not user-supplied: likes are
       * triggered by anonymous visitors, so there is no per-user credential.
       */
      likesToken: z.string().min(1),
    })
    // Object fields are optional unless `.required()`, so an absent top-level
    // `communityDirectory` validates as `{}` instead of failing activation;
    // getCommunityTarget then resolves it to null and the C2 channel stays
    // inert while the C1 text share keeps working.
  ,
});

// Live mirror of the volatile section: the loader re-reads it whenever the
// profile's volatile values move, so host-side readers always observe the
// latest committed portrait groups without coupling to the settings section.
let portraitGroupsSnapshot = [];
export function getPortraitGroups() {
  return portraitGroupsSnapshot;
}

function send(res, status, headers = {}) {
  res.writeHead(status, {
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  res.end();
}

// Stream a stat'd file asset with full HTTP semantics — GET/HEAD only, ETag
// revalidation (304), If-Range, single byte ranges (206/416) and stream
// lifetime tracking so teardown can drain/abort in-flight reads. Used by the
// attachment-backed serve route.
function writeAsset(req, res, method, asset, activeStreams) {
  if (req.headers["if-none-match"] === asset.etag) {
    send(res, 304, { ETag: asset.etag });
    return;
  }

  const ifRange = req.headers["if-range"];
  const rangeHeader = ifRange !== undefined && ifRange !== asset.etag
    ? undefined
    : req.headers.range;
  const range = parseSingleRange(rangeHeader, asset.size);
  if (range === false) {
    send(res, 416, { "Content-Range": `bytes */${asset.size}` });
    return;
  }

  const start = range?.start ?? 0;
  const end = range?.end ?? asset.size - 1;
  const status = range === null ? 200 : 206;
  const headers = {
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=3600, must-revalidate",
    "Content-Length": String(end - start + 1),
    "Content-Type": asset.type,
    ETag: asset.etag,
    ...(range === null ? {} : { "Content-Range": `bytes ${start}-${end}/${asset.size}` }),
  };

  if (method === "HEAD") {
    send(res, status, headers);
    return;
  }

  res.writeHead(status, {
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  const stream = createReadStream(asset.path, { start, end });
  activeStreams.add(stream);
  const release = () => activeStreams.delete(stream);
  stream.once("close", release);
  stream.once("end", release);
  stream.once("error", () => {
    release();
    if (!res.headersSent) send(res, 500);
    else res.destroy();
  });
  res.once("close", () => {
    if (!stream.destroyed) stream.destroy();
  });
  stream.pipe(res);
}

// Read a request body into a `Buffer`, bailing with `null` when it exceeds the
// configured budget so an over-large payload never gets buffered wholesale.
async function readRequestBody(req, maxBytes) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > maxBytes) return null;
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, total);
}

// Attachment-backed importer endpoints. The client uploads archive-extracted
// images in ≤16-image batches; the host attachments store persists normalized
// files and the server answers with content-addressed serve URLs that the
// client embeds as plain image refs in `portraitGroups.images[]`. When the
// host exposes no attachments store both handlers degrade to HTTP errors (the
// client surfaces the usual import-failure notice) — never a throw.
function createAttachmentHandlers(ctx, activeStreams) {
  const attachments = ctx.get("attachments");

  const upload = async (req, res) => {
    if ((req.method ?? "GET") !== "POST") {
      send(res, 405, { Allow: "POST" });
      return;
    }
    if (attachments === undefined) {
      send(res, 503);
      return;
    }
    const body = await readRequestBody(req, MAX_UPLOAD_BODY_BYTES);
    if (body === null) {
      // Refuse without buffering. The request stream still carries unread bytes,
      // so keep draining it (and ask for a connection close) so the client
      // reliably receives the 413 instead of a mid-upload socket reset.
      req.resume();
      send(res, 413, { Connection: "close" });
      return;
    }
    let envelope;
    try {
      envelope = JSON.parse(String(body));
    } catch {
      send(res, 400);
      return;
    }
    const images = Array.isArray(envelope?.images) ? envelope.images : null;
    if (!images || images.length === 0 || images.length > MAX_UPLOAD_IMAGES_PER_BATCH) {
      send(res, 400);
      return;
    }
    const inputs = [];
    for (const item of images) {
      const mediaType = typeof item?.mediaType === "string" ? item.mediaType : "";
      if (!SLUG_BY_MEDIA_TYPE[mediaType]) {
        send(res, 415);
        return;
      }
      const name = typeof item?.name === "string" && item.name.length > 0 ? item.name : undefined;
      let data;
      try {
        data = typeof item?.data === "string" ? Uint8Array.from(Buffer.from(item.data, "base64")) : null;
      } catch {
        data = null;
      }
      if (!data || data.byteLength === 0) {
        send(res, 400);
        return;
      }
      inputs.push({ data, mediaType, name });
    }
    let refs;
    try {
      refs = await attachments.saveImages(inputs);
    } catch {
      send(res, 400);
      return;
    }
    const urls = refs.map((ref) => {
      const hex = String(ref.attachmentId ?? "").replace(/^sha256:/, "");
      const slug = SLUG_BY_MEDIA_TYPE[ref.mediaType] ?? "webp";
      const imageUrl = HEX64_RE.test(hex) ? `${ATTACHMENT_PREFIX}${slug}/${hex}` : "";
      return {
        name: typeof ref.name === "string" ? ref.name : undefined,
        url: imageUrl,
      };
    });
    res.writeHead(200, {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(JSON.stringify({ images: urls }));
  };

  const serve = (req, res) => {
    const method = req.method ?? "GET";
    if (method !== "GET" && method !== "HEAD") {
      send(res, 405, { Allow: "GET, HEAD" });
      return;
    }
    if (attachments === undefined) {
      send(res, 404);
      return;
    }
    let pathname;
    try {
      pathname = new URL(req.url ?? "/", "http://dsh.local").pathname;
    } catch {
      send(res, 404);
      return;
    }
    if (!pathname.startsWith(ATTACHMENT_PREFIX)) {
      send(res, 404);
      return;
    }
    const rest = pathname.slice(ATTACHMENT_PREFIX.length);
    const slash = rest.indexOf("/");
    const slug = slash === -1 ? rest : rest.slice(0, slash);
    const hex = slash === -1 ? "" : rest.slice(slash + 1);
    const mediaType = MEDIA_TYPE_BY_SLUG[slug];
    if (mediaType === undefined || !HEX64_RE.test(hex)) {
      send(res, 404);
      return;
    }
    let hostPath;
    try {
      hostPath = attachments.imageHostPath({ attachmentId: `sha256:${hex}`, mediaType });
    } catch {
      send(res, 404);
      return;
    }
    let info;
    try {
      info = statSync(hostPath);
    } catch {
      send(res, 404);
      return;
    }
    if (!info.isFile()) {
      send(res, 404);
      return;
    }
    writeAsset(req, res, method, {
      path: hostPath,
      type: mediaType,
      size: info.size,
      etag: `W/"${info.size.toString(16)}-${Math.trunc(info.mtimeMs).toString(16)}"`,
    }, activeStreams);
  };

  return { upload, serve };
}

export const inject = ["webServer"];

export function apply(ctx, config) {
  portraitGroupsSnapshot = config?.portraitGroups?.get() ?? [];
  ctx.effect(() => {
    const unregister = ctx.on("loader/volatile-update", () => {
      portraitGroupsSnapshot = config?.portraitGroups?.get() ?? [];
    });
    return () => unregister();
  }, "flash-skin: portrait groups mirror");

  // Compaction pulse driver: register the real-event projection unit onto the
  // host's `sessionProjections` seam. `ctx.inject(['sessionProjections'], …)`
  // runs this contribution only when the seam is present and mounts its disposer
  // on a child fiber, so on hosts without the seam (or with a registrant already
  // holding this key at the same stateVersion) this block is inert and the
  // plugin still loads and works standalone. The registry adds its own effect
  // wrap, so the unit (and its cached cells) rides the plugin's unload.
  ctx.effect(() => {
    const deregister = ctx.inject(["sessionProjections"], (scoped) => {
      return scoped.sessionProjections.register(compactionProjectionDefinition);
    }, "flash-skin: compaction projection");
    return () => deregister?.();
  }, "flash-skin: compaction projection scope");

  const activeStreams = new Set();
  ctx.effect(() => {
    const { upload, serve } = createAttachmentHandlers(ctx, activeStreams);
    // The upload route is an exact match on the bare path; the serve route
    // registers the same path as a prefix (matched as `pathname === path ||
    // pathname.startsWith(path + "/")`), so both coexist on the same router.
    const uploadRoute = ctx.webServer.register({ kind: "exact", path: ATTACHMENT_PATH, handler: upload });
    const serveRoute = ctx.webServer.register({ kind: "prefixes", path: ATTACHMENT_PATH, handler: serve });
    // Network-import routes: bundled example archives plus the remote-URL proxy.
    const { example, remote } = createNetworkHandlers(activeStreams);
    const exampleRoute = ctx.webServer.register({ kind: "prefixes", path: EXAMPLES_PATH, handler: example });
    const remoteRoute = ctx.webServer.register({ kind: "exact", path: REMOTE_ARCHIVE_PATH, handler: remote });
    // Community share + like channels. Likes stay T1-in-memory (+ optional T3
    // durable mirror when a storage backend is present and an optional PR-backed
    // community sync when a likesToken is configured); the community-directory
    // target resolves at request time from the configured repo, else inert.
    // Built lazily so the provider (github|gitee) always matches the current
    // config value; every operation resolves its own fresh client. Falls back
    // to the GitHub shim when the provider field is absent or unknown.
    // Read the resolved communityDirectory config, tolerating both a
    // schemastery wrapper exposing `.get()` and a plain (already-resolved)
    // object — the latter is what an unconfigured/configured Config() yields,
    // so we must not call `.get()` blind or an absent field throws inside the
    // community handler (which rejects outward, turning a reader bug into an
    // opaque 500). Falls back to {} so the C2 channel stays inert when unset.
    const readCommunityDirectory = () => {
      const raw = config?.communityDirectory;
      if (!raw) return {};
      if (typeof raw.get === "function") {
        try { return raw.get() ?? {}; } catch { return {}; }
      }
      return raw && typeof raw === "object" ? raw : {};
    };
    const clientForConfig = () => {
      const dir = readCommunityDirectory();
      const kind = dir && typeof dir.provider === "string" && dir.provider ? dir.provider : "github";
      return createCommunityClient(COMMUNITY_PROVIDERS[kind] || COMMUNITY_PROVIDERS.github, globalThis.fetch);
    };
    const getCommunityClient = () => clientForConfig();
    const communityRoutesClient = {
      get provider() { return clientForConfig().provider; },
      ghJson: (path, opts) => clientForConfig().ghJson(path, opts),
      rawText: (rel, opts) => clientForConfig().rawText(rel, opts),
    };
    const getCommunityTarget = () => {
      const dir = readCommunityDirectory();
      const owner = typeof dir.owner === "string" && dir.owner ? dir.owner : "tcgbp";
      const repo = typeof dir.repo === "string" && dir.repo ? dir.repo : "dsh-flash-skin";
      const kind = typeof dir.provider === "string" && dir.provider ? dir.provider : "github";
      return {
        owner,
        repo,
        provider: COMMUNITY_PROVIDERS[kind] ? kind : "github",
        branch: typeof dir.branch === "string" && dir.branch ? dir.branch : "master",
        path: typeof dir.path === "string" && dir.path ? dir.path : "shares",
      };
    };
    const getLikesToken = () => {
      const dir = readCommunityDirectory();
      return dir && typeof dir.likesToken === "string" && dir.likesToken ? dir.likesToken : null;
    };
    const {
      likeRoute, likesRoute, flushCommunityLikes, communityDispose,
    } = installLikeRoutes(ctx, {
      // PR-backed like aggregation: reads the remote <path>/likes.json once to
      // seed the ledger, then debounced-flushes the merged snapshot through a
      // single PR channel. Absent/disabled → pure local T1 (+optional T3).
      community: {
        getClient: getCommunityClient,
        getTarget: getCommunityTarget,
        getLikesToken,
        readCommunityLikes,
        submitCommunityLikes,
        debounceMs: 30_000,
      },
    });
    const { directoryRoute, submitRoute } = installCommunityRoutes(ctx, { getTarget: getCommunityTarget, client: communityRoutesClient });
    return () => {
      uploadRoute();
      serveRoute();
      exampleRoute();
      remoteRoute();
      communityDispose();
      likeRoute();
      likesRoute();
      directoryRoute();
      submitRoute();
    };
  }, "flash-skin: attachment import & serve routes");
}
