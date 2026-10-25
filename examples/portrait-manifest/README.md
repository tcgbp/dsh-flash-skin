# Portrait-group import manifests

Example `portrait.yaml` manifests for dsh-flash-skin's archive import.
The manifest is **optional**: an archive with no manifest imports images with
the built-in defaults (auto id, fallback names, default threshold).

Three ready-made example archives live in `examples/portrait-archives/`, one
per built-in Liang set, plus a URL-only one:

| Archive | What it demonstrates |
| --- | --- |
| `liangsheng-demo.zip` | 梁圣 / Liang the Saint — embedded-image archive (8 webp) + `portrait.yaml` metadata |
| `liangshen-demo.zip` | 梁神 / Liang the God — embedded-image archive (8 webp) + `portrait.yaml` metadata |
| `liangzu-demo.zip` | 梁祖 / Liang the Ancestor — embedded-image archive (8 webp) + `portrait.yaml` metadata |
| `liangshen-url-demo.zip` | URL-only archive: **no embedded images**, frames come from the manifest's `images:` list |

## Accepted fields

```yaml
---
id: my-set            # set id (deduped with -2/-3 on collision)
name: 我的皮肤组        # display name
zh: 我的皮肤组          # Chinese name
en: My Skin Set       # English name
darkLevel: 5          # light/dark threshold slider stop (0..6), default 5
images:               # block list, or inline flow list [a, b]
  - https://example.com/frames/01.webp
  - "https://example.com/frames/02.webp,note.png"
...
```

## Rules

- **Naming**: the manifest may be `portrait.yaml`, `portrait.yml` or
  `portrait.json` (also matches `meta.*`); the basename match is
  case-insensitive. One manifest file per archive.
- **Images precedence**: frames embedded in the archive **always win**. The
  manifest `images:` list is only consulted when the archive contains no image
  bytes at all.
- **Lists**: an indented `- item` block under a bare `images:` key, or an
  inline `images: [a, b]` flow list. Items are trimmed; blanks and duplicates
  are dropped; the list is capped at 64.
- **Scalar rules**: single/double-quoted strings (escapes honored in double
  quotes), booleans, finite numbers, `null`/`~`, `#` comments, and `---` /
  `...` document markers. Anything richer (nested maps, flow maps, multi-line
  strings, anchors) is ignored rather than failing the import.
- **Layout**: the reader is a flat top-level `key: value` subset — keep keys
  unindented. Indented lines are only meaningful as `- item` lines of the
  current list block.
- **Editability**: imported fields (id, zh, en, darkLevel, images) are seeded
  defaults only; they remain fully editable in the config card afterwards.

The YAML files in this folder are the exact manifests shipped inside the
example archives above, kept here as readable source. The generator script
(`scripts/make-demo-zips.mjs`) was retired together with the built-in art; to
produce a variant, zip 8 webp frames plus one `portrait.yaml` manifest with
any zip tool.
