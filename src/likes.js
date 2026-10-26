// src/likes.js
// Server-side "like" ledger and routes for the dsh-flash-skin share + like set.
//
// Tiered so the like routes can never throw:
//   T1  process-local authoritative ledger (always available).
//   T2  per-device liked-state lives in the client's localStorage and is merged
//       at render time (mergeLikeCount in logic.ts); the server only needs the
//       distinct-peer count, never the identities.
//   T3  optional best-effort durable mirror through the host's storage-domain
//       facility (ctx.storageDomain / ctx.storage.domain, probed lazily as an
//       optional runtime property — deliberately NOT in the `inject` list so a
//       profile without a storage backend never disables the plugin). Any
//       probe/open/read/write failure disables the mirror for the process
//       lifetime and the routes fall back to T1, keeping the plugin standalone.
//
// "Peer" is an opaque anonymous id the client persists per profile/session
// (localStorage) and sends in a header; a missing/invalid header falls back to
// a stable per-remote hash so de-duplication still holds for legacy clients.

/** POST body budget for a single like toggle (a tiny { groupId } JSON). */
export const MAX_LIKE_BODY_BYTES = 32 * 1024;
/** Exact-match route for POST like toggles. */
export const LIKE_PATH = "/plugins/dsh-flash-skin/like";
/** Exact-match route for GET full like-count snapshots. */
export const LIKES_PATH = "/plugins/dsh-flash-skin/likes";
/** Peer id header. */
export const PEER_HEADER = "x-flash-skin-peer";

const PEER_RE = /^[A-Za-z0-9_-]{8,64}$/;
const GROUP_ID_MAX = 128;
/** Hard cap so a hostile burst of distinct peers can never grow the ledger
 * without bound. Each distinct peer counts once per group. */
const MAX_PEERS_PER_GROUP = 100_000;

function isValidGroupId(id) {
  return (
    typeof id === "string" &&
    id.length > 0 &&
    id.length <= GROUP_ID_MAX &&
    !/[\u0000-\u001f\u007f]/.test(id)
  );
}

function normalizePeer(raw) {
  if (typeof raw !== "string") return null;
  const peer = raw.trim();
  if (peer.length > 128) return null;
  return PEER_RE.test(peer) ? peer : null;
}

/** Stable de-dup id derived from the request's remote address (never shown). */
export function peerFromRemote(remote, salt = "flash-skin-v1") {
  try {
    let h = 2166136261;
    const input = `${salt}|${remote ?? ""}`;
    for (let i = 0; i < input.length; i += 1) {
      h = Math.imul(h ^ input.charCodeAt(i), 16777619);
    }
    return `anon${(h >>> 0).toString(36).padStart(7, "0")}`;
  } catch {
    return "anon0000000";
  }
}

export function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(payload));
}

export async function readBody(req, maxBytes) {
  const chunks = [];
  let total = 0;
  try {
    for await (const chunk of req) {
      total += chunk.length;
      if (total > maxBytes) return null;
      chunks.push(chunk);
    }
  } catch {
    return null;
  }
  if (chunks.length === 0) return Buffer.alloc(0);
  return Buffer.concat(chunks, total);
}

/** The always-available T1 authoritative ledger. Never throws outward. */
export function createLikeLedger({ log = () => {} } = {}) {
  /** @type {Map<string, { count: number, peers: Set<string> }>} */
  const entries = new Map();

  const ledger = {
    /** Toggle the peer's like on one group. */
    toggle(rawGroupId, rawPeer, fallbackPeer = null) {
      let groupId = "";
      try {
        groupId = typeof rawGroupId === "string" ? rawGroupId.trim() : "";
      } catch {
        groupId = "";
      }
      if (!isValidGroupId(groupId)) {
        return { ok: false, error: { code: "bad-group", message: "Invalid group id." } };
      }
      let peer = normalizePeer(rawPeer);
      if (!peer && fallbackPeer) peer = normalizePeer(fallbackPeer);
      if (!peer) {
        return { ok: false, error: { code: "bad-peer", message: "Missing or invalid peer id." } };
      }
      let entry = entries.get(groupId);
      if (!entry) {
        entry = { count: 0, peers: new Set() };
        entries.set(groupId, entry);
      }
      if (entry.peers.has(peer)) {
        entry.peers.delete(peer);
        entry.count = entry.peers.size;
        const deleted = entry.count === 0;
        if (deleted) entries.delete(groupId);
        return { ok: true, groupId, liked: false, count: entry.count, peerId: peer, peers: [], deleted };
      }
      if (entry.count >= MAX_PEERS_PER_GROUP) {
        return { ok: false, error: { code: "ledger-full", message: "Like ledger is full." } };
      }
      entry.peers.add(peer);
      entry.count = entry.peers.size;
      return { ok: true, groupId, liked: true, count: entry.count, peerId: peer, peers: Array.from(entry.peers), deleted: false };
    },

    /** Map of every group the process has seen → distinct-peer count. */
    counts() {
      const out = {};
      for (const [groupId, entry] of entries) out[groupId] = entry.count;
      return out;
    },

    /** Warm a group from a durable store; only fills gaps, never overrides. */
    seed(groupId, count, peers) {
      if (!isValidGroupId(groupId) || entries.has(groupId)) return;
      if (!(Number(count) > 0)) return;
      const set = new Set();
      if (Array.isArray(peers)) {
        for (const raw of peers) {
          const peer = normalizePeer(raw);
          if (peer) set.add(peer);
        }
      }
      if (set.size === 0) return;
      entries.set(groupId, { count: Math.min(set.size, MAX_PEERS_PER_GROUP), peers: set });
      log(`dsh-flash-skin: seeded like count for ${groupId}`);
    },
  };
  return ledger;
}

/**
 * Optional durable mirror over the host's storage-domain facility.
 * The provider callback resolves the facility on demand so this module never
 * reaches into host internals unconditionally. T3 only engages when the
 * facility is present and accepts the open; any failure disables it for the
 * process lifetime. Writes are serialized behind a single promise chain; a
 * no-op open or a disabled mirror never stalls the like route (fire-and-forget).
 */
export function createLikeMirror(provider) {
  let unit = null;
  let state = "idle"; // idle | opening | ready | disabled
  let opening = null;
  let queue = Promise.resolve();

  const disable = () => {
    state = "disabled";
    unit = null;
    opening = null;
  };

  /** Resolve a usable record unit, or null (cached per state). */
  function ensure() {
    if (unit) return unit;
    if (state === "disabled") return null;
    if (opening) return opening;
    let facility = null;
    try {
      facility = provider();
    } catch {
      facility = null;
    }
    if (!facility || typeof facility.open !== "function") {
      disable();
      return null;
    }
    state = "opening";
    opening = (async () => {
      const opened = await Promise.race([
        Promise.resolve(facility.open({
          name: "dsh-flash-skin",
          version: 1,
          global: null,
          tables: {
            likes: {
              schema: {
                groupId: { type: "string" },
                count: { type: "number" },
                peers: { type: "string" },
              },
              key: "groupId",
              kind: "kv",
            },
          },
        })),
        new Promise((resolve) => setTimeout(() => resolve(null), 10_000)),
      ]).catch(() => null);
      if (!opened || typeof opened.loadAll !== "function" || typeof opened.putRecord !== "function") {
        disable();
        return null;
      }
      unit = opened;
      state = "ready";
      opening = null;
      return unit;
    })();
    return opening;
  }

  /** Serialized write-through; never rejects outward, never stalls the route. */
  function write(groupId, count, peers) {
    queue = queue
      .then(async () => {
        const u = await ensure();
        if (!u) return;
        await u.putRecord(groupId, { groupId, count, peers }).catch(() => disable());
      })
      .catch(() => {});
    return queue;
  }

  /** Serialized delete of a group that dropped to zero likes. */
  function remove(groupId) {
    queue = queue
      .then(async () => {
        const u = await ensure();
        if (!u) return;
        if (typeof u.deleteRecord === "function") {
          await u.deleteRecord(groupId).catch(() => disable());
        } else {
          await write(groupId, 0, []).catch(() => {});
        }
      })
      .catch(() => {});
    return queue;
  }

  /** Warm T1 from whatever the durable store already holds. */
  async function warm(seed) {
    const u = await ensure();
    if (!u) return;
    let records = null;
    try {
      records = await u.loadAll();
    } catch {
      records = null;
    }
    if (!records || typeof records.forEach !== "function") return;
    records.forEach((raw, groupId) => {
      const value =
        raw && typeof raw === "object" && !Array.isArray(raw)
          ? { count: Number(raw.count) || 0, peers: Array.isArray(raw.peers) ? raw.peers : [] }
          : null;
      if (value && value.count > 0) seed(groupId, value.count, value.peers);
    });
  }

  return { write, remove, warm, enabled: () => state === "ready" || state === "opening" };
}

function defaultFacilityAccessor(ctx) {
  return () => {
    try {
      return ctx.storageDomain || (ctx.storage && ctx.storage.domain) || null;
    } catch {
      return null;
    }
  };
}

/**
 * Register the like routes against the host webServer. Folds the optional T3
 * mirror in and warms T1 from durable state. Returns the two disposers (the
 * caller folds them into its route effect's teardown).
 */
export function installLikeRoutes(ctx, opts = {}) {
  const ledger = opts.ledger || createLikeLedger({ log: ctx?.logger ? (m) => ctx.logger.debug(m) : () => {} });
  const salt = opts.peerSalt || "flash-skin-v1";
  const mirror = createLikeMirror(opts.facility || defaultFacilityAccessor(ctx));
  // Warm T1 from durable state without ever blocking the routes.
  try {
    void mirror.warm((groupId, count, peers) => {
      try {
        ledger.seed(groupId, count, peers);
      } catch {
        /* seed never throws */
      }
    }).catch(() => {});
  } catch {
    /* swallow for standalone behavior */
  }

  // ── Optional PR-backed community sync (aggregated like counts) ─────────────
  // When `opts.community` is present and a token is configured, the like route
  // batches incremental local likes into a snapshot and eventually persists it
  // through the `<path>/likes.json` PR channel. When disabled/absent the like
  // channels stay purely local (T1 + optional T3 mirror) — standalone-safe.
  //
  // Design:
  //   - Community token/target are *config-supplied* (server deployment admin),
  //     never per-visitor: likes are triggered by anonymous visitors and carry
  //     no user credential.
  //   - On install we opportunistically read the remote likes.json and seed the
  //     ledger, so local tallies already include other hosts' known counts.
  //   - Toggles schedule a debounced, coalesced flush (one PR per window) rather
  //     than one PR per like. Any failure just disables the PR channel and the
  //     ledger stays authoritative.
  const community = opts.community || null;
  let communityTimer = null;
  let communityPending = false;
  let communityInFlight = false;
  let communityFailed = false;

  const communityEnabled = () =>
    !!community &&
    typeof community.getClient === "function" &&
    typeof community.getTarget === "function" &&
    typeof community.getLikesToken === "function" &&
    typeof community.readCommunityLikes === "function" &&
    typeof community.submitCommunityLikes === "function";

  const communityToken = () => {
    try {
      return community ? community.getLikesToken() || null : null;
    } catch {
      return null;
    }
  };

  /** Read the remote aggregate once and seed the local ledger from it. */
  const seedFromCommunity = async () => {
    if (!communityEnabled()) return;
    const target = community.getTarget();
    if (!target) return;
    const token = communityToken();
    if (!token) return;
    const client = community.getClient();
    if (!client) return;
    try {
      const remote = await community.readCommunityLikes(client, target);
      const counts = remote && remote.counts ? remote.counts : null;
      if (!counts) return;
      for (const [groupId, count] of Object.entries(counts)) {
        try {
          ledger.seed(groupId, count, []);
        } catch {
          /* best-effort */
        }
      }
    } catch {
      /* offline/rate-limited: keep local */
    }
  };

  /** Flush the merged counts through the PR channel (single in-flight). */
  const flushCommunityLikes = async () => {
    if (!communityEnabled() || communityFailed || communityInFlight) return;
    const target = community.getTarget();
    if (!target) return;
    const token = communityToken();
    if (!token) return;
    const client = community.getClient();
    if (!client) return;
    communityInFlight = true;
    try {
      const merged = { ...ledger.counts() };
      const res = await community.submitCommunityLikes(client, target, { token, counts: merged });
      if (res && res.ok === false) {
        // Never retry into an unconfigurable state this process lifetime.
        if (res.error && res.error.code === "not-configured") communityFailed = true;
      }
    } catch {
      /* swallow: local ledger stays authoritative */
    } finally {
      communityInFlight = false;
    }
  };

  const scheduleCommunityFlush = () => {
    if (!communityEnabled() || communityFailed || communityPending) return;
    communityPending = true;
    const debounce = community && typeof community.debounceMs === "number" ? community.debounceMs : 30_000;
    communityTimer = setTimeout(() => {
      communityPending = false;
      communityTimer = null;
      void flushCommunityLikes().catch(() => {});
    }, debounce);
  };

  const communityDispose = () => {
    if (communityTimer) {
      clearTimeout(communityTimer);
      communityTimer = null;
    }
    communityPending = false;
  };

  // Opportunistic global seed; never blocks the routes and never throws.
  try {
    void seedFromCommunity().catch(() => {});
  } catch {
    /* swallow for standalone behavior */
  }

  const like = async (req, res) => {
    try {
      if ((req.method ?? "GET") !== "POST") {
        sendJson(res, 405, { ok: false, error: { code: "method", message: "POST only." } });
        return;
      }
      const body = await readBody(req, MAX_LIKE_BODY_BYTES);
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
      const groupId = envelope && typeof envelope.groupId === "string" ? envelope.groupId : "";
      const remote = req.socket && typeof req.socket.remoteAddress === "string" ? req.socket.remoteAddress : "";
      const result = ledger.toggle(groupId, String(req.headers[PEER_HEADER] ?? ""), peerFromRemote(remote, salt));
      if (!result.ok) {
        sendJson(res, 400, { ok: false, error: result.error });
        return;
      }
      // Durable mirror is fire-and-forget; never delays or fails the response.
      if (result.deleted) void mirror.remove(result.groupId).catch(() => {});
      else void mirror.write(result.groupId, result.count, result.peers).catch(() => {});
      // Schedule a debounced community PR flush (aggregated likes).
      scheduleCommunityFlush();
      sendJson(res, 200, {
        ok: true,
        groupId: result.groupId,
        liked: result.liked,
        count: result.count,
        peerId: result.peerId,
      });
    } catch {
      sendJson(res, 500, { ok: false, error: { code: "internal", message: "Unexpected error." } });
    }
  };

  const likes = async (req, res) => {
    try {
      if ((req.method ?? "GET") !== "GET") {
        sendJson(res, 405, { ok: false, error: { code: "method", message: "GET only." } });
        return;
      }
      sendJson(res, 200, { ok: true, counts: ledger.counts() });
    } catch {
      sendJson(res, 500, { ok: false, error: { code: "internal", message: "Unexpected error." } });
    }
  };

  return {
    likes: ledger,
    mirror,
    likeRoute: ctx.webServer.register({ kind: "exact", path: LIKE_PATH, handler: like }),
    likesRoute: ctx.webServer.register({ kind: "exact", path: LIKES_PATH, handler: likes }),
    // Exposed for deterministic tests / manual flush; a no-op when disabled.
    flushCommunityLikes,
    communityDispose,
  };
}
