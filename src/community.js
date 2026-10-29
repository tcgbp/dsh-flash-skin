// src/community.js
// C2 community-directory channel for the dsh-flash-skin share + like set.
//
// Model (pluggable backend — the shipped backend is Feishu Bitable):
//   - The community directory lives in a Feishu Bitable base that the *plugin
//     owner* designates through the `communityDirectory` config.
//       shares table: one record per shared set -> text fields { entryId, setId, url }
//       likes  table: one record per group    -> fields { groupId, count }
//   - Sharers keep custody of their archive URL: the table stores only the
//     text pointer (url), never archive bytes (hard user constraint).
//   - The plugin *server* holds the Feishu app credentials (app_id + app_secret)
//     and exchanges them for a short-lived tenant_access_token that it uses for
//     every Bitable call. No credential ever reaches the client bundle: the
//     browser reads/writes only through this plugin's own routes (/community,
//     /community/submit) which the server-side proxy handles.
//   - READING lists the shares table (directory) and the likes table (counts).
//   - WRITING creates a shares record for a submitted URL (409 when the same
//     set id already exists) and upserts likes records.
//
// "Pluggable backend": the provider seam (provider object + createCommunityClient)
// isolates every host/API divergence so a future backend can be swapped in by
// plugging a new provider that satisfies the same read/write surface consumed by
// the directory/like routes.
//
// Nothing here throws outward: every step resolves to { ok, ... } or
// { ok:false, error:{ code, status?, step?, message? } } so the client can render
// structured Chinese notices and fall back to empty/zero values.

import { readBody, sendJson } from "./likes.js";

/** Exact-match route for GET community-directory snapshots. */
export const COMMUNITY_PATH = "/plugins/dsh-flash-skin/community";
/** Exact-match route for POST share submissions. */
export const COMMUNITY_SUBMIT_PATH = "/plugins/dsh-flash-skin/community/submit";

const FEISHU_OPEN_API = "https://open.feishu.cn/open-apis";
const FEISHU_TOKEN_PATH = "/auth/v3/tenant_access_token/internal";
const FEISHU_PAGE_SIZE = 500;
/** Likes count is non-idempotent per tally; no token/client knob to expose. */
const DEFAULT_ROOT = "shares";
/** Max set-id length after normalization. */
export const COMMUNITY_SET_ID_MAX = 64;
/** Hard cap on directory entries served in one response. */
export const COMMUNITY_MAX_ENTRIES = 200;
/** Hard cap per pointer file / per URL line. */
export const COMMUNITY_ENTRY_MAX_BYTES = 64 * 1024;
export const COMMUNITY_URL_MAX = 2048;
/** Submit body budget: url + id metadata. */
export const MAX_SUBMIT_BODY_BYTES = 256 * 1024;
/** Field-name mapping for the Feishu Bitable shares/likes tables. */
export const SHARES_FIELDS = { entryId: "entryId", setId: "setId", url: "url" };
export const LIKES_FIELDS = { groupId: "groupId", count: "count" };

const SET_ID_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

const enc = (seg) => encodeURIComponent(String(seg));

/**
 * Feishu Bitable provider for the C2 community-directory channel. It captures
 * every backend-specific divergence so the read/write flow is written once and
 * reused: token-exchange endpoint, API base, record endpoints, and the success
 * predicate (Bitable returns HTTP 200 with a body-level `code`; 0 = success).
 *
 * Being the only shipped provider it also doubles as the reference shape any
 * future pluggable backend must satisfy: `{ kind, label, apiBase, ok, ...paths }`.
 */
const FEISHU_PROVIDER = {
  kind: "feishu",
  label: "飞书多维表格",
  apiBase: FEISHU_OPEN_API,
  tokenPath: FEISHU_TOKEN_PATH,
  /** Bitable APIs answer HTTP 200 and signal success via `code === 0`. */
  ok(json) {
    return !!json && typeof json.code === "number" && json.code === 0;
  },
  listRecordsPath(appToken, tableId, pageToken) {
    let p = `/bitable/v1/apps/${enc(appToken)}/tables/${enc(tableId)}/records?page_size=${FEISHU_PAGE_SIZE}`;
    if (pageToken) p += `&page_token=${enc(pageToken)}`;
    return p;
  },
  createRecordPath(appToken, tableId) {
    return `/bitable/v1/apps/${enc(appToken)}/tables/${enc(tableId)}/records`;
  },
  updateRecordPath(appToken, tableId, recordId) {
    return `/bitable/v1/apps/${enc(appToken)}/tables/${enc(tableId)}/records/${enc(recordId)}`;
  },
};

export const COMMUNITY_PROVIDERS = { feishu: FEISHU_PROVIDER };

/**
 * Resolve the provider (pluggable backend) for a community target. Unknown
 * kinds fall back to the shipped feishu provider.
 */
export function providerFor(target) {
  const kind = target && typeof target.provider === "string" && target.provider ? target.provider : "feishu";
  return COMMUNITY_PROVIDERS[kind] || COMMUNITY_PROVIDERS.feishu;
}

/** Slug a free-form set id down to a safe `[a-z0-9-]` token, or null if empty/too long. */
export function normalizeCommunitySetId(raw) {
  if (typeof raw !== "string") return null;
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!cleaned) return null;
  if (cleaned.length > COMMUNITY_SET_ID_MAX) return null;
  return cleaned;
}

/** pointer file name "<setId>.txt" (legacy tree shape, kept as a pure helper). */
export function buildCommunityEntryName(setId) {
  const id = normalizeCommunitySetId(setId);
  return id ? `${id}.txt` : "";
}

/** Parse "<setId>.txt" back into the normalized set id, or null when invalid/too long. */
export function parseCommunityEntryName(name) {
  if (typeof name !== "string") return null;
  if (!/^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?\.txt$/.test(name)) return null;
  const base = name.slice(0, -4);
  return base.length <= COMMUNITY_SET_ID_MAX ? base : null;
}

/**
 * Parse a pointer-file body: returns the first non-comment line that is a bare
 * http(s) URL, or null when the text is empty/oversized or the line is not a
 * single sane archive URL.
 */
export function parseCommunityEntryText(text) {
  if (typeof text !== "string") return null;
  const clean = text.replace(/\r/g, "").trim();
  if (clean.length === 0 || clean.length > COMMUNITY_ENTRY_MAX_BYTES) return null;
  for (const raw of clean.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#")) continue;
    if (!/^https?:\/\/\S+$/.test(line)) return null;
    if (line.length > COMMUNITY_URL_MAX) return null;
    return line;
  }
  return null;
}

/** Leave the legacy tree path parser in place as a pure helper. */
export function parseCommunityTreePaths(paths, root = DEFAULT_ROOT) {
  const output = [];
  const seen = new Set();
  if (!Array.isArray(paths)) return output;
  const prefix = `${root}/`;
  for (const path of paths) {
    if (typeof path !== "string" || !path.startsWith(prefix)) continue;
    const segs = path.slice(prefix.length).split("/");
    if (segs.length !== 2) continue;
    const [entryId, fileName] = segs;
    const setId = parseCommunityEntryName(fileName);
    if (!setId) continue;
    if (seen.has(setId)) continue;
    seen.add(setId);
    output.push({ entryId, setId, path });
  }
  return output;
}

const buildCommunityEntryId = () => {
  const rand = Math.random().toString(36).slice(2, 8);
  return `d${Date.now().toString(36)}${rand}`;
};

function controllerTimeout(timeout) {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeout) : null;
  return {
    controller,
    timer,
    clear() {
      if (timer) clearTimeout(timer);
    },
  };
}

function apiError(res, step, fallback = "feishu") {
  const status = res ? res.status : 0;
  const json = res && res.json;
  const code = json && typeof json.code === "number" ? json.code : null;
  if (status === 0) return { code: "network", status: 0, step, message: "飞书请求失败（网络错误）。" };
  const authCodes = new Set([99991663, 1254042, 1254040, 110001, 1130004, 11401]);
  const existsCodes = new Set([1254003, 1254004, 1254001]);
  const notFoundCodes = new Set([11407, 11406, 1254006]);
  if (authCodes.has(code)) return { code: "auth", status: code, step, message: "飞书应用凭据或令牌无效/无权限。" };
  if (existsCodes.has(code)) return { code: "exists", status: code, step, message: "该条目已存在。" };
  if (notFoundCodes.has(code)) return { code: "not-found", status: code, step, message: "飞书表格或记录不存在。" };
  return { code: fallback, status: code ?? status, step, message: "飞书 API 返回异常。" };
}

/**
 * Build the C2 backend client for a provider (pluggable backend). The client
 * is host/credential-aware while staying provider-agnostic: it caches the
 * short-lived tenant_access_token and exposes record read/write primitives
 * that the directory/like operations below drive for any provider.
 */
export function createCommunityClient(provider = FEISHU_PROVIDER, fetchImpl = globalThis.fetch) {
  const active = (provider && provider.kind && COMMUNITY_PROVIDERS[provider.kind]) || FEISHU_PROVIDER;
  const fetchFn = typeof fetchImpl === "function" ? fetchImpl : globalThis.fetch;

  async function request(path, { method = "GET", token = "", body, timeout = 15_000, maxBytes = 512 * 1024 } = {}) {
    const { controller, timer, clear } = controllerTimeout(timeout);
    const headers = { "User-Agent": "dsh-flash-skin", Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const hasBody = body !== undefined;
    if (hasBody) headers["Content-Type"] = "application/json";
    try {
      const response = await fetchFn(active.apiBase + path, {
        method,
        headers,
        body: hasBody ? JSON.stringify(body) : undefined,
        signal: controller ? controller.signal : undefined,
      });
      const text = await response.text();
      if (!text || text.length > maxBytes) return { status: response.status, json: null, error: { code: "too-large" } };
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
      return { status: response.status, json };
    } catch {
      return { status: 0, json: null, error: { code: "network" } };
    } finally {
      clear();
    }
  }

  // tenant_access_token lives ~2h server-side; cache it and prefetch/refresh lazily.
  let cachedToken = "";
  let cachedExpiresAt = 0;
  let tokenInflight = null;

  async function exchangeToken(target) {
    const res = await request(active.tokenPath, {
      method: "POST",
      body: { app_id: target.appId, app_secret: target.appSecret },
      timeout: 20_000,
      maxBytes: 64 * 1024,
    });
    const json = res && res.json;
    if (!active.ok(json)) return null;
    const t = typeof json.tenant_access_token === "string" ? json.tenant_access_token : "";
    if (!t) return null;
    const expire = Number(json.expire) > 0 ? Number(json.expire) : 7200;
    cachedToken = t;
    cachedExpiresAt = Date.now() + (expire - 60) * 1000;
    return t;
  }

  async function tenantToken(target) {
    if (!target || !target.appId || !target.appSecret) return null;
    if (cachedToken && Date.now() < cachedExpiresAt) return cachedToken;
    if (tokenInflight) return tokenInflight;
    tokenInflight = exchangeToken(target);
    try {
      return await tokenInflight;
    } finally {
      tokenInflight = null;
    }
  }

  async function listRecords(appToken, tableId, token, pageToken = "") {
    return request(active.listRecordsPath(appToken, tableId, pageToken), { method: "GET", token, timeout: 20_000 });
  }
  async function createRecord(appToken, tableId, token, fields) {
    return request(active.createRecordPath(appToken, tableId), { method: "POST", token, body: { fields }, timeout: 20_000 });
  }
  async function updateRecord(appToken, tableId, token, recordId, fields) {
    return request(active.updateRecordPath(appToken, tableId, recordId), { method: "PUT", token, body: { fields }, timeout: 20_000 });
  }

  return {
    fetchImpl: fetchFn,
    provider: active,
    tenantToken,
    listRecords,
    createRecord,
    updateRecord,
  };
}

const configuredShares = (target) => !!(target && target.sharesTableId);
const configuredLikes = (target) => !!(target && target.likesTableId);

/** List every record of a Bitable table (paginated, capped by guard loop). */
async function listAllRecords(client, target, tableId) {
  const token = await client.tenantToken(target);
  if (!token) return { ok: false, error: { code: "auth", step: "token" } };
  const out = [];
  let pageToken = "";
  for (let guard = 0; guard < 40; guard++) {
    const res = await client.listRecords(target.appToken, tableId, token, pageToken);
    const json = res && res.json;
    if (!client.provider.ok(json)) return { ok: false, error: apiError(res, "list") };
    const data = json.data;
    if (data && Array.isArray(data.items)) {
      for (const item of data.items) out.push({ recordId: item.record_id, fields: item.fields || {} });
      pageToken = data.has_more ? data.page_token : "";
    } else {
      pageToken = "";
    }
    if (!pageToken) break;
  }
  return { ok: true, records: out };
}

/** Read the community directory (shares table) into { ok, configured, entries, error }. */
export async function readCommunityDirectory(client, target) {
  if (!configuredShares(target)) {
    return { ok: true, configured: false, entries: [], error: null };
  }
  const listed = await listAllRecords(client, target, target.sharesTableId);
  if (!listed.ok) {
    const code = listed.error.code === "auth" || listed.error.code === "not-found" ? listed.error.code : "directory-unavailable";
    return { ok: true, configured: true, entries: [], error: { code } };
  }
  const entries = [];
  for (const rec of listed.records) {
    const f = rec.fields || {};
    const setId = typeof f[SHARES_FIELDS.setId] === "string" ? f[SHARES_FIELDS.setId].trim() : "";
    const url = typeof f[SHARES_FIELDS.url] === "string" ? f[SHARES_FIELDS.url].trim() : "";
    const entryIdRaw = typeof f[SHARES_FIELDS.entryId] === "string" ? f[SHARES_FIELDS.entryId].trim() : "";
    const entryId = entryIdRaw || rec.recordId;
    const cleanSetId = normalizeCommunitySetId(setId);
    const cleanUrl = parseCommunityEntryText(url);
    if (!cleanSetId || !cleanUrl || !entryId) continue;
    entries.push({ entryId, setId: cleanSetId, url: cleanUrl });
  }
  entries.sort((a, b) => (a.setId < b.setId ? -1 : a.setId > b.setId ? 1 : 0));
  return { ok: true, configured: true, entries: entries.slice(0, COMMUNITY_MAX_ENTRIES), error: null };
}

/**
 * Submit a new share pointer to the community directory (server-side write via
 * the Feishu tenant token). Answers 409 when the set id already exists.
 */
export async function submitCommunityShare(client, target, { setId, url } = {}) {
  if (!configuredShares(target)) {
    return { ok: false, error: { code: "not-configured", message: "Community directory is not configured." } };
  }
  const cleanedId = normalizeCommunitySetId(setId);
  if (!cleanedId) return { ok: false, error: { code: "bad-set-id", message: "Invalid set id." } };
  const cleanUrl = parseCommunityEntryText(url);
  if (!cleanUrl) return { ok: false, error: { code: "bad-url", message: "Invalid archive URL." } };

  const token = await client.tenantToken(target);
  if (!token) return { ok: false, error: { code: "auth", message: "Feishu app credentials invalid or missing." } };

  // Pre-write directory scan for duplicate set ids.
  const listed = await listAllRecords(client, target, target.sharesTableId);
  if (!listed.ok) return { ok: false, error: listed.error };
  for (const rec of listed.records) {
    const sf = rec.fields || {};
    if (typeof sf[SHARES_FIELDS.setId] === "string" && normalizeCommunitySetId(sf[SHARES_FIELDS.setId]) === cleanedId) {
      return { ok: false, error: { code: "exists", message: "This set id is already shared." } };
    }
  }

  const entryId = buildCommunityEntryId();
  const res = await client.createRecord(target.appToken, target.sharesTableId, token, {
    [SHARES_FIELDS.entryId]: entryId,
    [SHARES_FIELDS.setId]: cleanedId,
    [SHARES_FIELDS.url]: cleanUrl,
  });
  if (!client.provider.ok(res && res.json)) return { ok: false, error: apiError(res, "create") };
  const recordId = res.json && res.json.data && res.json.data.record ? res.json.data.record.record_id : null;
  return { ok: true, entry: { entryId, setId: cleanedId }, recordId };
}

/** Read remote like counts (likes table) into a floored group->count map. */
export async function readCommunityLikes(client, target) {
  if (!configuredLikes(target)) return { ok: true, counts: null, error: { code: "not-configured" } };
  const token = await client.tenantToken(target);
  if (!token) return { ok: true, counts: null, error: { code: "auth" } };
  const listed = await listAllRecords(client, target, target.likesTableId);
  if (!listed.ok) return { ok: true, counts: null, error: listed.error };
  const counts = {};
  for (const rec of listed.records) {
    const f = rec.fields || {};
    const groupId = typeof f[LIKES_FIELDS.groupId] === "string" ? f[LIKES_FIELDS.groupId].trim() : "";
    if (!groupId || groupId.length > 128 || /[\s\u007f]/.test(groupId)) continue;
    const n = Number(f[LIKES_FIELDS.count]);
    if (Number.isFinite(n) && n > 0) counts[groupId] = Math.floor(n);
  }
  return { ok: true, counts, error: null };
}

/** Upsert aggregated like counts into the likes table (server-side write). */
export async function submitCommunityLikes(client, target, { counts } = {}) {
  if (!configuredLikes(target)) {
    return { ok: false, error: { code: "not-configured", message: "Community likes table is not configured." } };
  }
  const token = await client.tenantToken(target);
  if (!token) return { ok: false, error: { code: "auth", message: "Feishu app credentials invalid or missing." } };

  const normalized = {};
  if (counts && typeof counts === "object" && !Array.isArray(counts)) {
    for (const [key, value] of Object.entries(counts)) {
      if (typeof key !== "string" || key.length === 0 || key.length > 128 || /[\s\u007f]/.test(key)) continue;
      const n = Number(value);
      if (Number.isFinite(n) && n > 0) normalized[key] = Math.floor(n);
    }
  }

  const listed = await listAllRecords(client, target, target.likesTableId);
  if (!listed.ok) return { ok: false, error: listed.error };
  const recordByGroup = new Map();
  for (const rec of listed.records) {
    const f = rec.fields || {};
    const g = typeof f[LIKES_FIELDS.groupId] === "string" ? f[LIKES_FIELDS.groupId].trim() : "";
    if (g) recordByGroup.set(g, rec.recordId);
  }

  let updated = 0;
  for (const [groupId, count] of Object.entries(normalized)) {
    const fields = { [LIKES_FIELDS.groupId]: groupId, [LIKES_FIELDS.count]: count };
    const recordId = recordByGroup.get(groupId);
    const res = recordId
      ? await client.updateRecord(target.appToken, target.likesTableId, token, recordId, fields)
      : await client.createRecord(target.appToken, target.likesTableId, token, fields);
    if (client.provider.ok(res && res.json)) updated++;
  }
  return { ok: true, updated };
}

/**
 * Register the community-directory routes. getTarget resolves the pluggable
 * backend target at request time; `client` is the C2 backend client (defaults
 * to the feishu provider client). Returns disposers grouped by route kind.
 */
export function installCommunityRoutes(ctx, opts = {}) {
  const getTarget = typeof opts.getTarget === "function" ? opts.getTarget : () => null;
  const client = opts.client || createCommunityClient(COMMUNITY_PROVIDERS.feishu, globalThis.fetch);

  const directory = async (req, res) => {
    try {
      if ((req.method ?? "GET") !== "GET") {
        sendJson(res, 405, { ok: false, error: { code: "method", message: "GET only." } });
        return;
      }
      const result = await readCommunityDirectory(client, getTarget());
      sendJson(res, 200, { ok: true, configured: result.configured, entries: result.entries, error: result.error });
    } catch {
      sendJson(res, 500, { ok: false, error: { code: "internal", message: "Unexpected error." } });
    }
  };

  const submit = async (req, res) => {
    try {
      if ((req.method ?? "GET") !== "POST") {
        sendJson(res, 405, { ok: false, error: { code: "method", message: "POST only." } });
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
      const setId = envelope && typeof envelope.setId === "string" ? envelope.setId : "";
      const url = envelope && typeof envelope.url === "string" ? envelope.url : "";
      const result = await submitCommunityShare(client, getTarget(), { setId, url });
      res.writeHead(result.ok ? 200 : 409, {
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(JSON.stringify(result));
    } catch {
      res.writeHead(500, {
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(JSON.stringify({ ok: false, error: { code: "internal", message: "Unexpected error." } }));
    }
  };

  return {
    client,
    directoryRoute: ctx.webServer.register({ kind: "exact", path: COMMUNITY_PATH, handler: directory }),
    submitRoute: ctx.webServer.register({ kind: "exact", path: COMMUNITY_SUBMIT_PATH, handler: submit }),
  };
}
