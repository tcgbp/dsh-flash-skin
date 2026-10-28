# Community directory (`shares/`)

This directory is the seed content of the plugin's **C2 community directory**
channel. It lives in the target repo (`tcgbp/dsh-flash-skin`, branch `master`)
and is served anonymously to every client that has `communityDirectory` enabled
(or, since the defaults were added, an install that has not configured one at
all) — see `README.md` in the repo root, section "C2".

## Layout

Pointer files follow `<root>/<entryId>/<setId>.txt`. Each is a plain text file
whose **first non-blank, non-`#` line is a bare `http(s)://` URL** pointing at
the sharer's own, self-hosted zip archive. The zip is **never** stored in this
repo — the owner is responsible for hosting it.

```
shares/
  README.md            <- this file (ignored: not `*.txt` and not 2 segments)
  <entryId>/           <- a short folder slug for one portrait
    <setId>.txt        <- pointer file; content = one public zip URL
  likes.json           <- aggregated like counts, updated via PR by an admin
```

Parse rules enforced by `src/community.js`:

- `entryId`: non-empty slug, at most 64 chars.
- `setId`: lowercase ASCII slug (`[a-z0-9-]`, normalized), at most
  `COMMUNITY_SET_ID_MAX` chars; must end in `.txt`.
- Pointer content: first meaningful line is a bare `https?://` URL, no
  whitespace/control chars, bounded by `COMMUNITY_ENTRY_MAX_BYTES` /
  `COMMUNITY_URL_MAX`.
- Only entries with exactly two path segments under the configured root are
  indexed; duplicate `setId`s are deduped (first wins).

## Adding an entry

1. Host your portrait zip at a public URL you control.
2. Create `shares/<entryId>/<setId>.txt` whose first line is that URL.
3. Open a PR against `master`. If the repo owner has installed
   `.github/workflows/auto-merge.yml`, merging is gated on a diff check that
   only allows `shares/**` changes matching the rules above.
