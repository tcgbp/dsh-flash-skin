// src/community.js
// C2 community-directory channel for the dsh-flash-skin share + like set.
//
// Model (per the approved plan):
//   - The community directory is a plain text bank inside a GitHub repo the
//     *plugin owner* designates through the `communityDirectory` config:
//       <root>/<entryId>/<setId>.txt   (root defaults to "shares")
//   - Each entry file is a tiny text pointer whose first non-comment line is the
//     http(s) URL of the sharer's own hosted zip. Zips NEVER go into the repo;
//     sharers keep custody of their archive URL (hard user constraint).
//   - READING is anonymous over GitHub's public read APIs (git/trees recursive +
//     raw.githubusercontent.com), merged into the community directory.
//   - WRITING is a GitHub pull-request flow using a sharer-provided personal
//     access token (contents:write). The plugin performs a pre-write directory
//     scan and answers 409 when the same set id already exists, then forks,
//     creates a branch, writes the pointer file and opens a PR. Merging stays
//     with the target repo's own review policy (+ optional owner-side
//     .github/workflows/auto-merge.yml, NOT shipped by this plugin).
//
// Nothing here throws outward: every step resolves to { ok, entries|entry|pr } or
// { ok:false, error:{ code, status?, step?, message? } } so the client can render
// structured Chinese notices and fall back to empty/zero values.

import { readBody, sendJson } from "./likes.js";

/** Exact-match route for GET community-directory snapshots. */
export const COMMUNITY_PATH = "/plugins/dsh-flash-skin/community";
/** Exact-match route for POST share submissions. */
export const COMMUNITY_SUBMIT_PATH = "/plugins/dsh-flash-skin/community/submit";

const GH_API = "https://api.github.com";
const RAW_BASE = "https://raw.githubusercontent.com";
const DEFAULT_ROOT = "shares";
/** Max set-id length after normalization. */
export const COMMUNITY_SET_ID_MAX = 64;
/** Hard cap on directory entries served in one response. */
export const COMMUNITY_MAX_ENTRIES = 200;
/** Hard cap per pointer file / per URL line. */
export const COMMUNITY_ENTRY_MAX_BYTES = 64 * 1024;
export const COMMUNITY_URL_MAX = 2048;
/** Tree listing read cap so a huge repo cannot blow the response buffer. */
const MAX_TREE_BYTES = 2 * 1024 * 1024;
/** Submit body budget: token + url + id metadata. */
export const MAX_SUBMIT_BODY_BYTES = 256 * 1024;
const TOKEN_MAX = 4096;
/** GitHub token scope hint for the UI copy. */
export const SUBMIT_TOKEN_HINT = "Fine-grained PAT with read/write on contents (contents: write).";

const SET_ID_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

/** Lowercase ASCII slug used for set ids / file names. Returns null when empty. */
export function normalizeCommunitySetId(raw) {
  if (typeof raw !== "string") return null;
  let slug = raw.trim().toLowerCase();
  if (slug.length === 0 || slug.length > COMMUNITY_SET_ID_MAX) return null;
  slug = slug.replace(/[^a-z0-9-]+/g, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
  return slug.length > 0 && slug.length <= COMMUNITY_SET_ID_MAX ? slug : null;
}

/** Pointer file name for a normalized set id. */
export function buildCommunityEntryName(setId) {
  return `${setId}.txt`;
}

/** Extract a valid normalized set id from a pointer file name, else null. */
export function parseCommunityEntryName(name) {
  if (typeof name !== "string" || !name.endsWith(".txt")) return null;
  const inner = name.slice(0, -4);
  if (inner.length === 0 || inner.length > COMMUNITY_SET_ID_MAX) return null;
  return SET_ID_RE.test(inner) ? inner : null;
}

/** First meaningful line of a pointer file must be a bare http(s) URL. */
export function parseCommunityEntryText(text) {
  if (typeof text !== "string" || text.length > COMMUNITY_ENTRY_MAX_BYTES) return null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith("#")) continue;
    if (line.length > COMMUNITY_URL_MAX) return null;
    if (!/^https?:\/\//i.test(line)) return null;
    if (/[\u0000-\u0020\u007f]/.test(line)) return null;
    return line;
  }
  return null;
}

/**
 * Extract { entryId, setId, path } entries from a `git/trees` path list for the
 * configured root, deduped by set id (first wins, others ignored).
 */
export function parseCommunityTreePaths(paths, root = DEFAULT_ROOT) {
  const out = [];
  const seen = new Set();
  const prefix = `${root}/`;
  for (const p of Array.isArray(paths) ? paths : []) {
    if (typeof p !== "string" || !p.startsWith(prefix)) continue;
    const parts = p.slice(prefix.length).split("/");
    if (parts.length !== 2) continue;
    const [entryId, filename] = parts;
    const setId = parseCommunityEntryName(filename);
    if (!setId || !entryId || entryId.length === 0 || entryId.length > 64) continue;
    if (seen.has(setId)) continue;
    seen.add(setId);
    out.push({ entryId, setId, path: p });
  }
  return out;
}

/** Folder-ish slug for the community directory target fields. */
function cleanSegment(raw, { max = 64, allowDot = true } = {}) {
  if (typeof raw !== "string") return "";
  const cleaned = raw
    .trim()
    .replace(new RegExp(allowDot ? "[^A-Za-z0-9._-]+" : "[^A-Za-z0-9_-]+", "g"), "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned.length > max ? "" : cleaned;
}

const enc = encodeURIComponent;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Thin GitHub REST + raw CDN client over an injectable fetch (real client uses
 * globalThis.fetch; tests inject a fake). Every call resolves, never throws.
 */
export function createGitHubClient(fetchImpl = globalThis.fetch) {
  const fetchFn = typeof fetchImpl === "function" ? fetchImpl : globalThis.fetch;
  const controllerTimeout = (timeout) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    return { controller, timer, clear: () => clearTimeout(timer) };
  };

  return {
    fetchImpl: fetchFn,
    /** @returns {Promise<{status:number, json: any|null, error?: {code:string}}>} */
    async ghJson(path, { method = "GET", token, body, timeout = 15_000, maxBytes = 64 * 1024 } = {}) {
      const { controller, timer, clear } = controllerTimeout(timeout);
      try {
        const response = await fetchFn(GH_API + path, {
          method,
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "dsh-flash-skin",
            ...(token ? { Authorization: `Bearer ${token}`, "X-GitHub-Api-Version": "2022-11-28" } : {}),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        });
        const text = await response.text();
        if (text.length > maxBytes) return { status: response.status, error: { code: "too-large" } };
        let json = null;
        try {
          json = JSON.parse(text);
        } catch {
          json = null;
        }
        return { status: response.status, json };
      } catch {
        return { status: 0, error: { code: "network" } };
      } finally {
        clear();
      }
    },

    /** Fetch a raw.githubusercontent.com blob; null on any failure/oversize. */
    async rawText(relPath, { timeout = 15_000, maxBytes = COMMUNITY_ENTRY_MAX_BYTES } = {}) {
      const { controller, timer, clear } = controllerTimeout(timeout);
      try {
        const response = await fetchFn(`${RAW_BASE}/${relPath}`, {
          headers: { "User-Agent": "dsh-flash-skin" },
          signal: controller.signal,
        });
        if (!response.ok) return null;
        const text = await response.text();
        return text.length <= maxBytes ? text : null;
      } catch {
        return null;
      } finally {
        clear();
      }
    },
  };
}

/**
 * Tree helper used by both the directory reader and the submit pre-check.
 * Returns the parsed entries or null when the tree could not be read.
 */
async function readDirectoryEntries(client, target) {
  const path = `/repos/${enc(target.owner)}/${enc(target.repo)}/git/trees/${enc(target.branch)}?recursive=1`;
  const res = await client.ghJson(path, { maxBytes: MAX_TREE_BYTES });
  if (res.status !== 200 || !Array.isArray(res?.json?.tree)) return null;
  const paths = res.json.tree.filter((t) => t && t.type === "blob").map((t) => t.path);
  return parseCommunityTreePaths(paths, target.path);
}

/**
 * Anonymous community-directory snapshot. When the target repo is not
 * configured, or the tree cannot be read (private/rate-limit/offline), the
 * result stays { ok:true, configured:…, entries:[] } with an optional error so
 * the UI can show a soft notice instead of crashing.
 */
export async function fetchCommunityDirectory(client, target) {
  if (!target) return { ok: true, configured: false, entries: [], error: null };
  const entries = await readDirectoryEntries(client, target);
  if (entries === null) {
    return {
      ok: true,
      configured: true,
      entries: [],
      error: { code: "directory-unavailable", message: "Community directory is currently unavailable." },
    };
  }
  const capped = entries.slice(0, COMMUNITY_MAX_ENTRIES);
  const out = [];
  for (const { entryId, setId, path } of capped) {
    const parts = path.split("/").map(enc);
    const text = await client.rawText([enc(target.owner), enc(target.repo), enc(target.branch), ...parts].join("/"));
    const url = text === null ? null : parseCommunityEntryText(text);
    if (!url) continue;
    out.push({ entryId, setId, url });
  }
  out.sort((a, b) => a.setId.localeCompare(b.setId));
  return { ok: true, configured: true, entries: out, error: null };
}

function ghError(res, step) {
  const rawMsg = typeof res?.json?.message === "string" ? res.json.message : "";
  const status = typeof res?.status === "number" ? res.status : 0;
  let code = "github";
  if (status === 0 || res?.error?.code === "network") code = "network";
  else if (status === 401 || status === 403) code = "auth";
  if (status === 403 && /rate limit/i.test(rawMsg)) code = "rate-limited";
  if (status === 409) code = "exists";
  if (status === 404) code = "not-found";
  if (status === 422) code = "unprocessable";
  return {
    ok: false,
    error: {
      code,
      status,
      step,
      message: rawMsg || "GitHub request failed.",
    },
  };
}

/** Wait for a freshly created fork to become readable (forking is async). */
async function waitForkReady(client, forkOwner, repo, token, attempts = 12) {
  for (let i = 0; i < attempts; i += 1) {
    const res = await client.ghJson(`/repos/${enc(forkOwner)}/${enc(repo)}`, { token, timeout: 10_000 });
    if (res.status === 200) return true;
    await sleep(1_500);
  }
  return false;
}

/**
 * Submit a community share as a pull request.
 * Steps: validate → best-effort set-id de-dup (409) → fork → wait-ready →
 * read fork default head → create branch → PUT pointer file → open PR.
 * Sharer keeps custody of the zip URL; the repo only ever stores the pointer.
 */
export async function submitCommunityShare(client, target, { token, setId, url }) {
  if (!target) {
    return { ok: false, error: { code: "not-configured", message: "Community directory is not configured." } };
  }
  if (typeof token !== "string" || token.trim().length === 0 || token.length > TOKEN_MAX) {
    return { ok: false, error: { code: "bad-token", message: "A GitHub token is required to submit." } };
  }
  const cleanedId = normalizeCommunitySetId(setId);
  if (!cleanedId) {
    return { ok: false, error: { code: "bad-set-id", message: "Set id must be 1..64 ASCII letters/digits/hyphens." } };
  }
  if (typeof url !== "string" || !/^https?:\/\//i.test(url.trim()) || url.trim().length > COMMUNITY_URL_MAX || /[\u0000-\u0020\u007f]/.test(url.trim())) {
    return { ok: false, error: { code: "bad-url", message: "Share url must be a bare http(s) link (no spaces/controls)." } };
  }
  const accessToken = token.trim();
  const cleanUrl = url.trim();
  const entryId = `d${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`;
  const fileName = buildCommunityEntryName(cleanedId);
  const filePath = `${target.path}/${entryId}/${fileName}`;
  const pidBranch = `flash-skin-shares-${cleanedId}-${entryId}`;

  // 1) De-dup pre-check: same set id anywhere under the root → 409.
  const existing = await readDirectoryEntries(client, target);
  if (Array.isArray(existing) && existing.some((e) => e.setId === cleanedId)) {
    return {
      ok: false,
      error: {
        code: "exists",
        message: `A share named "${cleanedId}" already exists in the community directory.`,
        setId: cleanedId,
      },
    };
  }

  // 2) Fork the target repo.
  const forkRes = await client.ghJson(`/repos/${enc(target.owner)}/${enc(target.repo)}/forks`, {
    method: "POST", token: accessToken, body: {}, maxBytes: 256 * 1024, timeout: 20_000,
  });
  if (forkRes.status !== 202 && forkRes.status !== 200 && forkRes.status !== 201) {
    return ghError(forkRes, "fork");
  }
  const forkOwner = forkRes?.json?.owner?.login || forkRes?.json?.full_name?.split("/")[0] || "";
  if (!forkOwner) return ghError(forkRes, "fork");
  if (!(await waitForkReady(client, forkOwner, target.repo, accessToken))) {
    return { ok: false, error: { code: "fork-timeout", message: "The fork is not ready yet; please retry shortly." } };
  }

  // 3) Fork default branch head sha.
  const forkRepo = await client.ghJson(`/repos/${enc(forkOwner)}/${enc(target.repo)}`, { token: accessToken, timeout: 15_000 });
  const forkDefault = forkRepo?.json?.default_branch || target.branch;
  const headRes = await client.ghJson(`/repos/${enc(forkOwner)}/${enc(target.repo)}/branches/${enc(forkDefault)}`, {
    token: accessToken, timeout: 15_000,
  });
  const headSha = headRes?.json?.commit?.sha;
  if (!headSha) return ghError(headRes, "fork-head");

  // 4) Create the working branch on the fork.
  const refRes = await client.ghJson(`/repos/${enc(forkOwner)}/${enc(target.repo)}/git/refs`, {
    method: "POST", token: accessToken, body: { ref: `refs/heads/${pidBranch}`, sha: headSha }, timeout: 15_000,
  });
  if (refRes.status !== 201) return ghError(refRes, "branch");

  // 5) Write the pointer file on the fork branch.
  const pointer =
    `${cleanUrl}\n\n` +
    `# dsh-flash-skin community share\n` +
    `# ${filePath}\n` +
    `# The zip lives at the sharer's own URL; the repo only keeps this pointer.\n`;
  const putPath = `${target.path}/${entryId}/${fileName}`.split("/").map(enc).join("/");
  const putRes = await client.ghJson(`/repos/${enc(forkOwner)}/${enc(target.repo)}/contents/${putPath}`, {
    method: "PUT",
    token: accessToken,
    body: { message: `share ${cleanedId}`, content: Buffer.from(pointer, "utf8").toString("base64"), branch: pidBranch },
    timeout: 20_000,
  });
  if (putRes.status !== 201) return ghError(putRes, "write");

  // 6) Open the PR against the target base branch.
  const body =
    `社区分享人物组《${cleanedId}》\n\n` +
    `压缩包地址：${cleanUrl}\n\n` +
    `> 该条目为人工审核制（默认），是否即时可见取决于仓库的合入策略。`;
  const prRes = await client.ghJson(`/repos/${enc(target.owner)}/${enc(target.repo)}/pulls`, {
    method: "POST",
    token: accessToken,
    body: {
      title: `分享：${cleanedId}`,
      head: `${forkOwner}:${pidBranch}`,
      base: target.branch,
      body,
    },
    timeout: 20_000,
  });
  if (prRes.status !== 201) return ghError(prRes, "pr");

  return {
    ok: true,
    entry: { entryId, setId: cleanedId, path: filePath },
    pr: {
      number: prRes?.json?.number ?? null,
      htmlUrl: prRes?.json?.html_url ?? null,
      state: prRes?.json?.state ?? null,
    },
  };
}

/**
 * Register the community routes against the host webServer and wire the config
 * target accessor. Returns disposers; index.js folds them into teardown.
 */
export function installCommunityRoutes(ctx, opts = {}) {
  const client = opts.client || createGitHubClient(globalThis.fetch);
  const getTarget = opts.getTarget || (() => null);

  const directory = async (req, res) => {
    try {
      if ((req.method ?? "GET") !== "GET") {
        sendJson(res, 405, { ok: false, error: { code: "method", message: "GET only." } });
        return;
      }
      const result = await fetchCommunityDirectory(client, getTarget());
      sendJson(res, 200, result);
    } catch {
      res.writeHead(500, { "X-Content-Type-Options": "nosniff", "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: false, error: { code: "internal", message: "Unexpected error." } }));
    }
  };

  const submit = async (req, res) => {
    try {
      if ((req.method ?? "GET") !== "POST") {
        res.writeHead(405, { "Content-Type": "application/json; charset=utf-8", "X-Content-Type-Options": "nosniff" });
        res.end(JSON.stringify({ ok: false, error: { code: "method", message: "POST only." } }));
        return;
      }
      const body = await readBody(req, MAX_SUBMIT_BODY_BYTES);
      if (body === null) {
        res.writeHead(413, { "X-Content-Type-Options": "nosniff" });
        res.end();
        return;
      }
      let envelope = null;
      try {
        envelope = JSON.parse(String(body));
      } catch {
        envelope = null;
      }
      const token = typeof envelope?.token === "string" ? envelope.token : "";
      const setId = typeof envelope?.setId === "string" ? envelope.setId : "";
      const url = typeof envelope?.url === "string" ? envelope.url : "";
      const result = await submitCommunityShare(client, getTarget(), { token, setId, url });
      res.writeHead(result.ok ? 200 : 409, {
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(JSON.stringify(result));
    } catch {
      res.writeHead(500, { "X-Content-Type-Options": "nosniff", "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: false, error: { code: "internal", message: "Unexpected error." } }));
    }
  };

  return {
    client,
    directoryRoute: ctx.webServer.register({ kind: "exact", path: COMMUNITY_PATH, handler: directory }),
    submitRoute: ctx.webServer.register({ kind: "exact", path: COMMUNITY_SUBMIT_PATH, handler: submit }),
  };
}
