---
id: "a8e024c0-0034-413f-9f25-e584136cf7b6"
title: "dsh-flash-skin: fix repeated Feishu tenant_access_token exchanges"
description: "Root cause and fix (commit e7368c2) for recurring Feishu /open-apis/auth/v3/tenant_access_token/internal calls in the community (directory/like/dislike) backend."
status: "active"
created_at: "2026-11-18T08:19:00.148Z"
updated_at: "2026-11-18T08:19:00.148Z"
content_hash: "d240ed31d39ef02a57580f418c088918fdb7b4de4c27838fb922c1130430b94b"
source_paths:
  - "src/community.js"
  - "src/index.js"
  - "test/share-like.test.mjs"
session_ids:
  - "mnemon-review-v1-56ecfa21-4678-4def-a983-bb68b313064b"
memory_body_ids:
  []
---

# dsh-flash-skin: fix repeated Feishu tenant_access_token exchanges

## Symptom
The plugin kept hitting `POST /open-apis/auth/v3/tenant_access_token/internal`
(the Feishu endpoint used to exchange app credentials for a tenant token)
repeatedly — once per operation — instead of once per token lifetime (~2h server-side,
refreshed 60s early).

## Root cause
- `createCommunityClient()` caches `tenant_access_token` in a **per-client-instance
  closure** (`cachedToken`/`cachedExpiresAt`, `tokenInflight` for concurrency dedupe)
  in `src/community.js` (around L334-366).
- The caller `communityRoutesClient` in `src/index.js` creates a **fresh client per
  method** via `clientForConfig()`. Every new client starts its cache empty, so each
  `tenantToken(target)` call (driven by `listAllRecords` / `readCommunityDirectory` /
  `submitCommunityShare`, all of which call `client.tenantToken(target)` then pass the
  token into `listRecords`) re-exchanged a token. The cache design never hit.
- Reproduced in tests: `test/share-like.test.mjs` only checks "same client instance
  caches for lifetime" (L245-288), which actually confirms the intended contract —
  the cache should survive across operations.

## Fix (commit e7368c2)
Promoted the token cache from client-instance-private to **module-level, keyed by
`(provider kind, appId, appSecret)`** in `src/community.js`:
```js
const tokenCacheByCredential = new Map();    // `${kind}\0${appId}\0${appSecret}` -> { token, expiresAt }
const tokenInflightByCredential = new Map(); // same key -> Promise
```
- `exchangeToken` writes the cache on success and never writes on auth failure.
- `tenantToken` returns the cached token while unexpired; otherwise reuses an
  in-flight exchange for the same key and dedupes after settle.
- Cache key includes provider kind + appId + appSecret so credential/config changes
  automatically switch to an independent slot. (community.js `tenantToken` does not
  validate the passed target against the cached credentials, so per-credential keying
  is required for correctness.)

## Verification
- `npm test` → 160/160 green, including the 46 token-cache cases in
  `test/share-like.test.mjs`.
- Only `src/community.js` changed (server-side plugin source, imported by
  `src/index.js`, run directly — not a bundle artifact). No `src/client/*` change, so
  **no rebuild of `lib/client.js` required**.
- Committed as `e7368c2` ("fix(community): share tenant_access_token cache across client
  instances").

## Deployment note
Behavioral change to server-side plugin source; requires restart/reload of the plugin
process to take effect in a running host.

## References
- `src/community.js` — `createCommunityClient`, `exchangeToken`, `tenantToken`, shared caches.
- `src/index.js` — `communityRoutesClient`/`clientForConfig` call sites.
- `test/share-like.test.mjs` — tenant-token caching tests (L244-299).
- Workspace rule of thumb (AGENTS.md): only `src/client/*` edits require rebuilding the client bundle.
