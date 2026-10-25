import { createReadStream, statSync } from "node:fs";
import z from "@deepseek-ai/schemastery";
import { parseSingleRange } from "./range.js";

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
      darkLevel: z.number().min(0).max(6),
      // Optional bilingual display names, editable from the plugin detail page.
      // Absent values fall back to `name` / the other language at render time,
      // so pre-bilingual persisted configs keep working unchanged.
      zh: z.string().min(1),
      en: z.string().min(1),
    }))
    .default([])
    .volatile(),
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

  const activeStreams = new Set();
  ctx.effect(() => {
    const { upload, serve } = createAttachmentHandlers(ctx, activeStreams);
    // The upload route is an exact match on the bare path; the serve route
    // registers the same path as a prefix (matched as `pathname === path ||
    // pathname.startsWith(path + "/")`), so both coexist on the same router.
    const uploadRoute = ctx.webServer.register({ kind: "exact", path: ATTACHMENT_PATH, handler: upload });
    const serveRoute = ctx.webServer.register({ kind: "prefixes", path: ATTACHMENT_PATH, handler: serve });
    return () => {
      uploadRoute();
      serveRoute();
    };
  }, "flash-skin: attachment import & serve routes");
}
