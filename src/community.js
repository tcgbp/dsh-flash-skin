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
const GITEE_API = "https://gitee.com/api/v5";
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

/**
 * Provider registry for the C2 community-directory channel. Each provider
 * captures every GitHub/Gitee divergence so the fork→branch→write→PR flow is
 * written once and reused: base URL, auth injection (Bearer header vs
 * `?access_token=` query), fork response parsing, branch creation endpoint,
 * write-file method, PR payload, and per-step expected status codes.
 *
 * The default `github` provider reproduces the exact requests the legacy
 * implementation issued, so existing clients/fakes keep working unchanged.
 */

const GITHUB_PROVIDER = {
  kind: "github",
  label: "GitHub",
  apiBase: "https://api.github.com",
  acceptJson: "application/vnd.github+json",
  /** GitHub authenticates via an Authorization header; no query params. */
  auth(token) {
    return token
      ? { headers: { Authorization: `Bearer ${token}`, "X-GitHub-Api-Version": "2022-11-28" }, query: "" }
      : { headers: {}, query: "" };
  },
  forkOwner(json) {
    return json?.owner?.login || (typeof json?.full_name === "string" ? json.full_name.split("/")[0] : "") || "";
  },
  forkOK: new Set([200, 201, 202]),
  fork(client, { owner, repo, token }) {
    return client.ghJson(`/repos/${enc(owner)}/${enc(repo)}/forks`, {
      method: "POST",
      token,
      body: {},
      maxBytes: 256 * 1024,
      timeout: 20_000,
    });
  },
  readForkHead(client, { forkOwner, repo, branch, token }) {
    // Discover the fork's actual default branch, then its head sha.
    return client.ghJson(`/repos/${enc(forkOwner)}/${enc(repo)}`, { token, timeout: 15_000 }).then(async (repoRes) => {
      const defaultBranch = repoRes?.json?.default_branch || branch;
      const head = await client.ghJson(`/repos/${enc(forkOwner)}/${enc(repo)}/branches/${enc(defaultBranch)}`, {
        token,
        timeout: 15_000,
      });
      return { defaultBranch, sha: head?.json?.commit?.sha || null };
    });
  },
  createBranch(client, { forkOwner, repo, branch, headSha, sourceBranch, token }) {
    return client.ghJson(`/repos/${enc(forkOwner)}/${enc(repo)}/git/refs`, {
      method: "POST",
      token,
      body: { ref: `refs/heads/${branch}`, sha: headSha },
      timeout: 15_000,
    });
  },
  branchOK: new Set([201]),
  writeFile(client, { forkOwner, repo, branch, path, content, message, token }) {
    const putPath = path.split("/").map(enc).join("/");
    return client.ghJson(`/repos/${enc(forkOwner)}/${enc(repo)}/contents/${putPath}`, {
      method: "PUT",
      token,
      body: { message, content: Buffer.from(content, "utf8").toString("base64"), branch },
      timeout: 20_000,
    });
  },
  writeOK: new Set([201]),
  openPr(client, { owner, repo, title, head, base, body, token }) {
    return client.ghJson(`/repos/${enc(owner)}/${enc(repo)}/pulls`, {
      method: "POST",
      token,
      body: { title, head, base, body },
      timeout: 20_000,
    });
  },
  prOK: new Set([201]),
};

const GITEE_PROVIDER = {
  kind: "gitee",
  label: "Gitee",
  apiBase: "https://gitee.com/api/v5",
  acceptJson: "application/json",
  /** Gitee authenticates via an `access_token` query param (user oauth token). */
  auth(token) {
    return { headers: {}, query: token ? `access_token=${enc(token)}` : "" };
  },
  forkOwner(json) {
    return json?.namespace?.path || (typeof json?.full_name === "string" ? json.full_name.split("/")[0] : "") || "";
  },
  forkOK: new Set([200]),
  fork(client, { owner, repo, token }) {
    return client.ghJson(`/repos/${enc(owner)}/${enc(repo)}/forks`, {
      method: "POST",
      token,
      body: {},
      maxBytes: 256 * 1024,
      timeout: 20_000,
    });
  },
  readForkHead(client, { forkOwner, repo, branch, token }) {
    // Fork default branch is the source branch; read its head sha directly.
    return client.ghJson(`/repos/${enc(forkOwner)}/${enc(repo)}/branches/${enc(branch)}`, {
      token,
      timeout: 15_000,
    }).then((head) => ({ defaultBranch: branch, sha: head?.json?.commit?.sha || null }));
  },
  createBranch(client, { forkOwner, repo, branch, headSha, sourceBranch, token }) {
    // Gitee starts the new branch from a source branch NAME (refs), not a sha.
    return client.ghJson(`/repos/${enc(forkOwner)}/${enc(repo)}/branches`, {
      method: "POST",
      token,
      body: { refs: sourceBranch, branch_name: branch },
      timeout: 15_000,
    });
  },
  branchOK: new Set([200, 201]),
  writeFile(client, { forkOwner, repo, branch, path, content, message, token }) {
    // Gitee creates blobs with POST (not PUT) to /contents/{path}.
    const putPath = path.split("/").map(enc).join("/");
    return client.ghJson(`/repos/${enc(forkOwner)}/${enc(repo)}/contents/${putPath}`, {
      method: "POST",
      token,
      body: { message, content: Buffer.from(content, "utf8").toString("base64"), branch },
      timeout: 20_000,
    });
  },
  writeOK: new Set([200, 201]),
  openPr(client, { owner, repo, title, head, base, body, token, forkPath }) {
    // Cross-repo PRs need the fork's owning repo path (fork_path) on Gitee.
    return client.ghJson(`/repos/${enc(owner)}/${enc(repo)}/pulls`, {
      method: "POST",
      token,
      body: { title, head, base, body, ...(forkPath ? { fork_path: forkPath } : {}) },
      timeout: 20_000,
    });
  },
  prOK: new Set([200, 201]),
};

/** All known providers, keyed by the `provider` config value. */
export const COMMUNITY_PROVIDERS = { github: GITHUB_PROVIDER, gitee: GITEE_PROVIDER };

/**
 * Resolve the provider for a community directory target. Falls back to GitHub
 * when the target or its provider field is absent/unknown (backward compatible).
 */
export function providerFor(target) {
  const kind = target?.provider;
  return COMMUNITY_PROVIDERS[kind] || GITHUB_PROVIDER;
}

/** Resolve a client's provider; clients without one default to GitHub. */
function providerOf(client) {
  return client?.provider || GITHUB_PROVIDER;
}

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
 * Thin community REST + raw client over an injectable fetch (real client uses
 * globalThis.fetch; tests inject a fake). Every call resolves, never throws.
 * The client is provider-aware: base URL, auth injection, and raw-fetch URL are
 * delegated to the provider so the same code drives GitHub and Gitee.
 */
export function createCommunityClient(provider = GITHUB_PROVIDER, fetchImpl = globalThis.fetch) {
  const active = provider || GITHUB_PROVIDER;
  const fetchFn = typeof fetchImpl === "function" ? fetchImpl : globalThis.fetch;
  const controllerTimeout = (timeout) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    return { controller, timer, clear: () => clearTimeout(timer) };
  };
  const authFor = (token) => active.auth(typeof token === "string" && token.length > 0 ? token : undefined);
  /** Append a provider auth query onto a path that already holds `/repos/...`. */
  const withAuth = (path, auth) => {
    if (!auth.query) return path;
    return path.includes("?") ? `${path}&${auth.query}` : `${path}?${auth.query}`;
  };

  return {
    fetchImpl: fetchFn,
    provider: active,
    /** @returns {Promise<{status:number, json: any|null, error?: {code:string}}>} */
    async ghJson(path, { method = "GET", token, body, timeout = 15_000, maxBytes = 64 * 1024 } = {}) {
      const { controller, timer, clear } = controllerTimeout(timeout);
      const auth = authFor(token);
      const hasBody = body !== undefined;
      try {
        const response = await fetchFn(withAuth(active.apiBase + path, auth), {
          method,
          headers: {
            Accept: active.acceptJson,
            "User-Agent": "dsh-flash-skin",
            ...auth.headers,
            ...(hasBody ? { "Content-Type": "application/json" } : {}),
          },
          body: hasBody ? JSON.stringify(body) : undefined,
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

    /** Fetch a provider raw blob; null on any failure/oversize. */
    async rawText(relPath, { timeout = 15_000, maxBytes = COMMUNITY_ENTRY_MAX_BYTES } = {}) {
      const { controller, timer, clear } = controllerTimeout(timeout);
      try {
        const url = expandRawUrl(active, relPath);
        const response = await fetchFn(url, {
          headers: { "User-Agent": "dsh-flash-skin", Accept: "text/plain" },
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

/** Keep the legacy entry point: GitHub provider by default. */
export function createGitHubClient(fetchImpl = globalThis.fetch) {
  return createCommunityClient(GITHUB_PROVIDER, fetchImpl);
}

/**
 * Build the provider-specific raw URL from the universal relPath contract
 * `owner/repo/branch/<enc path segments>` used by the readers.
 */
function expandRawUrl(provider, relPath) {
  if (provider.kind === "github") {
    return `${RAW_BASE}/${relPath}`;
  }
  // Gitee raw read: /api/v5/repos/{o}/{r}/raw/{path}?ref={branch}
  const segs = String(relPath).split("/");
  const owner = decodeURIComponent(segs[0] || "");
  const repo = decodeURIComponent(segs[1] || "");
  const branch = decodeURIComponent(segs[2] || "");
  const rawPath = segs.slice(3).join("/");
  const auth = provider.auth(undefined);
  return `${GITEE_API}/repos/${enc(owner)}/${enc(repo)}/raw/${rawPath}?ref=${enc(branch)}${auth.query ? `&${auth.query}` : ""}`;
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
  const provider = providerOf(client);
  const forkRes = await provider.fork(client, { owner: target.owner, repo: target.repo, token: accessToken });
  if (!provider.forkOK.has(forkRes.status)) return ghError(forkRes, "fork");
  const forkOwner = provider.forkOwner(forkRes?.json);
  if (!forkOwner) return ghError(forkRes, "fork");
  if (!(await waitForkReady(client, forkOwner, target.repo, accessToken))) {
    return { ok: false, error: { code: "fork-timeout", message: "The fork is not ready yet; please retry shortly." } };
  }

  // 3) Fork default branch head sha.
  const { defaultBranch: forkDefault, sha: headSha } = await provider.readForkHead(client, {
    forkOwner,
    repo: target.repo,
    branch: target.branch,
    token: accessToken,
  });
  if (!headSha) return ghError(forkRes, "fork-head");

  // 4) Create the working branch on the fork.
  const refRes = await provider.createBranch(client, {
    forkOwner,
    repo: target.repo,
    branch: pidBranch,
    headSha,
    sourceBranch: forkDefault || target.branch,
    token: accessToken,
  });
  if (!provider.branchOK.has(refRes.status)) return ghError(refRes, "branch");

  // 5) Write the pointer file on the fork branch.
  const pointer =
    `${cleanUrl}\n\n` +
    `# dsh-flash-skin community share\n` +
    `# ${filePath}\n` +
    `# The zip lives at the sharer's own URL; the repo only keeps this pointer.\n`;
  const writeRes = await provider.writeFile(client, {
    forkOwner,
    repo: target.repo,
    branch: pidBranch,
    path: `${target.path}/${entryId}/${fileName}`,
    content: pointer,
    message: `share ${cleanedId}`,
    token: accessToken,
  });
  if (!provider.writeOK.has(writeRes.status)) return ghError(writeRes, "write");

  // 6) Open the PR against the target base branch.
  const body =
    `社区分享人物组《${cleanedId}》\n\n` +
    `压缩包地址：${cleanUrl}\n\n` +
    `> 该条目为人工审核制（默认），是否即时可见取决于仓库的合入策略。`;
  const prRes = await provider.openPr(client, {
    owner: target.owner,
    repo: target.repo,
    title: `分享：${cleanedId}`,
    head: `${forkOwner}:${pidBranch}`,
    base: target.branch,
    body,
    token: accessToken,
    forkPath: `${forkOwner}/${target.repo}`,
  });
  if (!provider.prOK.has(prRes.status)) return ghError(prRes, "pr");

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

/** File (inside the configured root) holding the aggregated like counts. */
export const COMMUNITY_LIKES_FILE = "likes.json";

/**
 * Anonymous read of the community aggregate like-count file
 * (`<path>/likes.json`). Returns { ok, counts, error } where `counts` is a
 * plain { [groupId]: number } map (any invalid entries silently dropped), or
 * `{ id }`-independent aggregation so multiple hosts can share one counter.
 * Never throws; `counts` is null when the file is absent/unreadable/malformed
 * so callers can fall back to their local ledger.
 */
export async function readCommunityLikes(client, target) {
  if (!target) return { ok: true, counts: null, error: { code: "not-configured" } };
  const segments = [enc(target.owner), enc(target.repo), enc(target.branch)];
  for (const seg of String(target.path).split("/")) {
    if (seg) segments.push(enc(seg));
  }
  segments.push(COMMUNITY_LIKES_FILE);
  let text = null;
  try {
    text = await client.rawText(segments.join("/"));
  } catch {
    text = null;
  }
  if (text === null) {
    return { ok: true, counts: null, error: { code: "unavailable", message: "No community like-count file yet." } };
  }
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: true, counts: null, error: { code: "bad-json", message: "Community like-count file is malformed." } };
  }
  const counts = {};
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    for (const [key, value] of Object.entries(parsed)) {
      // Group ids are slugs; reject any whitespace/control char in the key.
      if (typeof key !== "string" || key.length === 0 || key.length > 128 || /[\s\u007f]/.test(key)) continue;
      const n = Number(value);
      if (Number.isFinite(n) && n > 0) counts[key] = Math.floor(n);
    }
  }
  return { ok: true, counts, error: null };
}

/**
 * Persist the aggregated like-count snapshot through a GitHub PR. Reuses the
 * same fork → branch → PUT-pointer → open-PR flow as share submissions (see
 * `submitCommunityShare`), but writes `likes.json` rather than an entry
 * pointer, so it is a single counter the owner can review and merge. Never
 * throws; returns { ok:true, pr } or { ok:false, error }.
 */
export async function submitCommunityLikes(client, target, { token, counts }) {
  if (!target) {
    return { ok: false, error: { code: "not-configured", message: "Community directory is not configured." } };
  }
  if (typeof token !== "string" || token.trim().length === 0 || token.length > TOKEN_MAX) {
    return { ok: false, error: { code: "bad-token", message: "A GitHub token is required to sync likes." } };
  }
  const normalized = {};
  if (counts && typeof counts === "object" && !Array.isArray(counts)) {
    for (const [key, value] of Object.entries(counts)) {
      const n = Math.floor(Number(value));
      if (
        typeof key === "string" && key.length > 0 && key.length <= 128 &&
        !/[\s\u007f]/.test(key) && Number.isFinite(n) && n > 0
      ) {
        normalized[key] = n;
      }
    }
  }
  const accessToken = token.trim();
  const filePath = `${target.path}/${COMMUNITY_LIKES_FILE}`;
  const pidBranch = `flash-skin-likes-${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`;

  // 1) Fork the target repo.
  const provider = providerOf(client);
  const forkRes = await provider.fork(client, { owner: target.owner, repo: target.repo, token: accessToken });
  if (!provider.forkOK.has(forkRes.status)) return ghError(forkRes, "fork");
  const forkOwner = provider.forkOwner(forkRes?.json);
  if (!forkOwner) return ghError(forkRes, "fork");
  if (!(await waitForkReady(client, forkOwner, target.repo, accessToken))) {
    return { ok: false, error: { code: "fork-timeout", message: "The fork is not ready yet; please retry shortly." } };
  }

  // 2) Fork default branch head sha.
  const { defaultBranch: forkDefault, sha: headSha } = await provider.readForkHead(client, {
    forkOwner,
    repo: target.repo,
    branch: target.branch,
    token: accessToken,
  });
  if (!headSha) return ghError(forkRes, "fork-head");

  // 3) Create the working branch on the fork.
  const refRes = await provider.createBranch(client, {
    forkOwner,
    repo: target.repo,
    branch: pidBranch,
    headSha,
    sourceBranch: forkDefault || target.branch,
    token: accessToken,
  });
  if (!provider.branchOK.has(refRes.status)) return ghError(refRes, "branch");

  // 4) Write the aggregated likes file on the fork branch.
  const content = JSON.stringify(normalized, null, 2);
  const writeRes = await provider.writeFile(client, {
    forkOwner,
    repo: target.repo,
    branch: pidBranch,
    path: filePath,
    content,
    message: `sync like counts (${Object.keys(normalized).length} groups)`,
    token: accessToken,
  });
  if (!provider.writeOK.has(writeRes.status)) return ghError(writeRes, "write");

  // 5) Open the PR against the target base branch.
  const prBody =
    `社区点赞计数同步\n\n` +
    `聚合计数文件：${filePath}\n\n` +
    `> 由插件服务端定时聚合提交，是否即时可见取决于仓库的合入策略。`;
  const prRes = await provider.openPr(client, {
    owner: target.owner,
    repo: target.repo,
    title: `点赞同步`,
    head: `${forkOwner}:${pidBranch}`,
    base: target.branch,
    body: prBody,
    token: accessToken,
    forkPath: `${forkOwner}/${target.repo}`,
  });
  if (!provider.prOK.has(prRes.status)) return ghError(prRes, "pr");

  return {
    ok: true,
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
