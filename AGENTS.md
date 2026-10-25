# AGENTS.md

Guidance for AI coding agents working in this repository (`dsh-flash-skin`).

## ⛔ Highest-Priority Rule — no hard dependency on `dsh-flash`

This plugin **must work standalone, without the `dsh-flash` plugin present**.

1. **No runtime dependency:** `dsh-flash-skin` must not require the `dsh-flash`
   plugin to be installed or enabled. All features (backdrop/portrait, level &
   effort binding, palette/shell flipping, portrait-group config card) must
   function correctly in an environment where `dsh-flash` is absent.
2. **No import / service / inject coupling:** do not import from, inject, or
   call services/tokens exposed by `dsh-flash`; do not assume any
   `dsh-flash`-owned DOM hooks, theme registrations, palettes, or plugin
   navigation exist.
3. **No duplicate theme registration:** do not register this skin's palettes
   into the host theme service under a `dsh-flash`-owned identity, and do not
   rely on `dsh-flash` having registered palettes that this skin consumes.
4. **Graceful degradation:** any optional integration with `dsh-flash` (if ever
   added) must be feature-detected and degrade to zero behavior when absent —
   never crash, never throw, never block this plugin's own features.
5. **Guard when adding cross-plugin behavior:** before adding any code that
   references another plugin by name, confirm it does not create the coupling
   this rule forbids. Prefer self-contained implementations.

This rule takes priority over any other instruction in this file.

## Project overview

`dsh-flash-skin` is a DeepSeek Harness (DSH) client bundle that skins the
conversation UI:

- **Portrait-driven appearance.** A fixed background layer
  (`.flash-skin-backdrop`) shows character portraits that swap as the level
  slider moves; low slider levels keep the native light shell, and only the
  **highest two levels (slider 5 and 6 of the 0..6 slider)** switch to the dark
  shell. The slider exposes **7 stops** (`MAX_LEVEL = 6`); each set keeps 8
  anchors in `PORTRAIT_ANCHORS` but only the **first 7 are active** in display
  logic (`sourcesForSet` uses `slice(0, -1)`), the 8th being a placeholder for
  tuning.
- **Persisted settings.** Inputs (level, active set, bind-effort, portrait
  groups) persist through `ctx.settings`/localStorage; the config card is keyed
  by the bundle npm name `dsh-flash-skin` under namespace `flash-skin`.
- **Layout overrides.** The content column is left-aligned with a 50px
  timeline gutter on the left; only the right width handle is shown; composer
  and todo dock are left-aligned to match.

## Commands

```bash
npm test            # vitest run  — currently 14/14 (test/range.test.mjs)
node ./scripts/build-client.mjs   # esbuild bundle -> lib/client.js (+ .js.map)
npm run build       # same as above
```

**After every change to `src/client/*` you must rebuild** so `lib/client.js`
reflects the change, then re-run `npm test`.

## Build / artifact model (important)

- The bundle is built from `src/client/index.tsx` via esbuild
  (`scripts/build-client.mjs`) into `lib/client.js` (CJS, sourcemap inline
  emitted to `lib/client.js.map`).
- `lib/client.js` **and `lib/client.js.map` are committed** and are part of the
  published package (`package.json` → `files`). The host computes the client
  bundle's artifact revision from the **live filesystem metadata** of
  `lib/client.js` (mtime/ctime/size) — there is no rev file to bump. A change
  only takes effect in the host/GUI after the bundle is rebuilt **and** the
  resulting `lib/client.js` has new filesystem metadata (refresh/reload the
  host).
- `node_modules/` is ignored; the committed file list is the installable
  surface.

## Source map

- `src/index.js` — plugin entry. Registers `PACKAGE_ID`, mirrors portrait
  groups via `ctx.settings` (`"flash-skin: portrait groups mirror"`).
- `src/client/index.tsx` — main bundle. `SkinPresenter` owns the backdrop,
  theme switching (`syncNativeTheme`), palette application (`applyPalette`),
  and config-form / settings slots.
- `src/client/logic.ts` — pure level/palette math: `MAX_LEVEL = 6`,
  `PORTRAIT_MAX_LEVEL = 30`, `LIGHT`/`DARK` palettes, `paletteForLevel`
  (binary: `dark = level >= MAX_LEVEL - 1`), `FROZEN_PALETTE` (registration
  source only), `levelForEffort`, `selectedEffortIndex`, `nearestEffortIndex`.
- `src/client/skin.css` — all skin CSS. Inject via CSS-module import; do not
  add inline `<style>` duplicates.
- `src/client/appearance.ts` — native appearance-extension wiring.
- `src/client/portrait-loader.ts` — portrait sequence loader/selector.
- `src/range.js` — range parsing, covered by `test/range.test.mjs`.

## Testing

- `test/range.test.mjs` is the only suite and currently passes **14/14**.
  Keep it green.

## CSS / layout constraints — do not regress

These were explicit user requirements. Keep them intact and gated:

- Left-align the content column with a **left timeline gutter (50px)**; hide
  only the left width handle; keep the right handle; left-align the composer
  card and the todo dock to the same gutter.
- The backdrop portrait needs both transparency rules in `skin.css` to show
  through the app's opaque background:
  - `body[data-flash-skin="on"] { --dsw-alias-bg-base: transparent !important; background: var(--flash-page) !important; }`
  - `body[data-flash-skin="on"] > #root { background: transparent !important; }`
  These must **not** be removed, or the portrait disappears.
- Most `--dsw-alias-*` token overrides (theme/brand/button/accent tinting)
  were intentionally removed per user request — do not reintroduce them.
- Layout rules are gated behind `body[data-flash-skin="on"]` and use
  `!important`.

## Theme / palette model

- `paletteForLevel` switches the **binary UI scheme**:
  - slider levels 0–4 → **light** (native Harness light shell)
  - slider levels 5–6 → **dark**
- `applyPalette(level)` sets the 7 `--flash-*` CSS vars on `<body>`, sets
  `body.dataset.flashStage` (0/1), and calls
  `syncNativeTheme("light" | "dark")`.
- `syncNativeTheme` guards against trampling an active flash palette (via
  `isFlashThemeId`/`flashThemeIdForSet`) — never switch the native theme while
  a registered flash appearance is active.
- The portrait frame always advances with the level
  (`this.portraits.select(Math.round(scale * PORTRAIT_MAX_LEVEL))`).

## Conventions

- User-facing UI copy is Chinese; code, comments, and file content are English.
- Config-card identity is the bundle npm name `dsh-flash-skin`; namespace is
  `flash-skin`; portrait-group images are URL-only; 24 webp assets on disk.
- Do not modify the DeepSeek Harness implementation checkout outside this repo.
