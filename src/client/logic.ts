export const MAX_LEVEL = 6;

// Mirror of the client's per-import image cap (MAX_IMAGES_PER_IMPORT)
// so a manifest-URL list is trimmed to the same size as embedded images.
const PORTRAIT_IMPORT_MAX_IMAGES = 64;

export interface EffortLike {
  id: string;
  name: string;
  description?: string;
}

// Flash Skin: the colour scheme is fixed to the frozen dark palette (`stage`
// is only ever 1); the level slider drives the portrait frame alone.
export interface Palette {
  level: number;
  stage: number;
  strength: number;
  accent: string;
  accentHover: string;
  page: string;
  surface: string;
  ink: string;
  secondary: string;
  portraitOpacity: string;
}

export function clampLevel(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_LEVEL, Math.max(0, Math.round(value)));
}

/**
 * Clamp onto the 0..MAX_LEVEL slider without snapping to an integer stop.
 * Used by the fine-grained light/dark divider (see `dividerStepFor`) so a
 * multi-frame group can settle on every frame-to-frame gap, not just the
 * seven integer stops.
 */
export function clampLevelContinuous(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_LEVEL, Math.max(0, value));
}

/**
 * How far one arrow click moves the light/dark divider for a `count`-frame
 * group. The divider position is derived from darkLevel via
 * `boundaryForDarkLevel` = round(darkLevel / MAX_LEVEL * count), which maps
 * the 0..MAX_LEVEL stops onto the `count + 1` boundary slots. As long as N ≤
 * MAX_LEVEL + 1 every slot is reachable with a one-stop step, but with more
 * frames than stops some gaps can never be landed on (e.g. 9 frames leaves
 * gaps 1/4/7 unreachable). Once N exceeds the stops, step by a single image
 * gap (MAX_LEVEL / N in slider terms) so every boundary stays reachable.
 */
export function dividerStepFor(count: number): number {
  if (!Number.isFinite(count) || count <= 1) return 1;
  const total = Math.floor(count);
  return total - 1 > MAX_LEVEL ? MAX_LEVEL / total : 1;
}

export function levelForEffort(index: number, count: number): number {
  if (count <= 1 || !Number.isFinite(index)) return 0;
  const safe = Math.min(count - 1, Math.max(0, Math.round(index)));
  return Math.round((safe / (count - 1)) * MAX_LEVEL);
}

export function selectedEffortIndex(
  efforts: readonly EffortLike[],
  selectedId?: string,
  defaultId?: string,
): number {
  const id = selectedId ?? defaultId;
  return id === undefined ? -1 : efforts.findIndex((effort) => effort.id === id);
}

export function nearestEffortIndex(level: number, efforts: readonly EffortLike[]): number {
  if (efforts.length === 0) return -1;
  const safe = clampLevel(level);
  let best = 0;
  let distance = Math.abs(safe - levelForEffort(0, efforts.length));
  for (let index = 1; index < efforts.length; index += 1) {
    const next = Math.abs(safe - levelForEffort(index, efforts.length));
    if (next < distance) {
      best = index;
      distance = next;
    }
  }
  return best;
}

const LIGHT = {
  page: "#f5f6f8",
  surface: "#ffffff",
  ink: "#191b1e",
  secondary: "#5b6470",
  accent: "#4176e6",
};

const DARK = {
  page: "#101218",
  surface: "#1a1d24",
  ink: "#eef1f6",
  secondary: "#98a2b3",
  accent: "#c19a49",
};

// The skin's colour scheme is frozen to the dark palette — sliding the level
// only swaps the portrait frame, it no longer blends any colours.
export const FROZEN_PALETTE: Palette = paletteForLevel(MAX_LEVEL);

export function paletteForLevel(rawLevel: number, darkLevel?: number): Palette {
  const level = clampLevel(rawLevel);
  const darkAt = (() => {
    if (darkLevel === undefined) return MAX_LEVEL - 1;
    return Math.min(MAX_LEVEL, Math.max(0, Math.round(darkLevel)));
  })();
  const t = level / MAX_LEVEL;
  const mix = (from: string, to: string, amount: number) => {
    const pa = parseInt(from.slice(1), 16);
    const pb = parseInt(to.slice(1), 16);
    const ch = (shift: number) => {
      const ca = (pa >> shift) & 0xff;
      const cb = (pb >> shift) & 0xff;
      return Math.round(ca + (cb - ca) * amount);
    };
    const r = ch(16);
    const g = ch(8);
    const blue = ch(0);
    return `#${((1 << 24) | (r << 16) | (g << 8) | blue).toString(16).slice(1)}`;
  };
  // Mirror dsh-liang-skin's binary appearance: the lowest levels keep the
  // native light shell, and only levels at/above the (per-group, default
  // MAX_LEVEL - 1) dark threshold switch to the dark shell. The portrait frame
  // still advances continuously with the level.
  const dark = level >= darkAt;
  const base = dark ? DARK : LIGHT;
  const portraitScale = level / MAX_LEVEL;
  return {
    level,
    stage: dark ? 1 : 0,
    strength: t,
    page: base.page,
    surface: base.surface,
    ink: base.ink,
    secondary: base.secondary,
    accent: base.accent,
    accentHover: mix(base.accent, base.ink, 0.13),
    portraitOpacity: String(0.4 + portraitScale * 0.42),
  };
}

// -----------------------------------------------------------------------------
// Portrait frame staging — a pure function of the configured image count.
//
// These two helpers are the single source of truth that maps the 0..MAX_LEVEL
// slider onto a portrait group's `N` ordered images. Nothing hardcodes the
// number of "stops": whichever N the user configured, all frames are spread
// evenly and the first/last stay pinned to the endpoints.
// -----------------------------------------------------------------------------

/** Map `count` ordered images onto frame levels in 0..maxLevel (first pinned 0, last pinned maxLevel). */
export function stagedFrames(count: number, maxLevel = MAX_LEVEL): number[] {
  const safeMax = Number.isFinite(maxLevel) ? Math.max(0, Math.round(maxLevel)) : MAX_LEVEL;
  if (!Number.isFinite(count) || count <= 1) return [0];
  const total = Math.floor(count);
  // With more frames than integer stops (N > maxLevel + 1) an integer grid
  // would collide, so spread continuously instead; the loader nearest-selects
  // and every frame stays distinct and strictly ordered.
  if (total - 1 > safeMax) {
    return Array.from({ length: total }, (_, index) => (index / (total - 1)) * safeMax);
  }
  return Array.from({ length: total }, (_, index) =>
    Math.round((index / (total - 1)) * safeMax),
  );
}

/**
 * The index (0-based) into a `count`-frame portrait group for a slider level.
 * Guards: unknown/negative levels and degenerate counts fall back to 0.
 */
export function frameIndexForLevel(level: number, count: number, maxLevel = MAX_LEVEL): number {
  if (!Number.isFinite(level) || level < 0) return 0;
  if (!Number.isFinite(count) || count <= 1) return 0;
  const frames = stagedFrames(count, maxLevel);
  const safeMax = Number.isFinite(maxLevel) ? Math.max(0, Math.round(maxLevel)) : MAX_LEVEL;
  const target = Math.round(level) > safeMax ? safeMax : Math.round(level);
  let best = 0;
  let distance = Math.abs(target - frames[0]);
  for (let index = 1; index < frames.length; index += 1) {
    const next = Math.abs(target - frames[index]);
    // Ties pick the higher frame — must mirror the portrait loader
    // (`nearestIndex` in portrait-loader.ts) so the slider gauge and the
    // displayed portrait stay consistent.
    if (next < distance || (next === distance && frames[index] > frames[best])) {
      best = index;
      distance = next;
    }
  }
  return Math.max(0, Math.min(frames.length - 1, best));
}

/**
 * Direct frame index for a continuous composite score in 0..1, mapped straight
 * onto the group's `count` frames (no intermediate integer-level grid).
 *
 * This is what composite mode should use: the weighted score is continuous, so
 * every one of the group's N frames is reachable — not just the 0..MAX_LEVEL
 * integer stops. Semantics mirror `frameIndexForLevel`/the portrait loader's
 * `nearestIndex`: the frame whose proportional position is closest wins, and a
 * tie picks the higher frame so gauge and displayed portrait stay in sync.
 */
export function frameIndexForScore(score: number, count: number): number {
  if (!Number.isFinite(score) || score <= 0) return 0;
  if (!Number.isFinite(count) || count <= 1) return 0;
  const total = Math.floor(count);
  const t = Math.min(1, Math.max(0, score));
  const position = t * (total - 1);
  const lo = Math.floor(position);
  const hi = Math.min(total - 1, Math.ceil(position));
  const dLo = position - lo;
  const dHi = hi - position;
  return dLo < dHi ? lo : hi;
}

// -----------------------------------------------------------------------------
// Composite (weighted multi-signal) level — drives the slider when the driver
// is "composite" instead of a manually dragged/effort-bound value.
// -----------------------------------------------------------------------------

/** Usage saturates at 100% once this many output tokens have been produced. */
export const USAGE_FULL = 300_000;
/** Context-pressure fallback (no window/pressure info) saturates at these many turns. */
export const TURNS_FULL = 20;
/** Decode speed saturates at this many tokens per second. */
export const TPS_FULL = 80;

/**
 * Tunable timing for the live "speed" axis's staleness decay. Because the
 * projection never resets its decode totals when generation stops, a finished
 * fast run would otherwise pin the speed gauge at 100% forever.
 * - `graceMs`: how long after the last fresh decode the gauge holds its value.
 * - `fadeMs`:  how long it then takes to decay from full to 0.
 * Exposed as number inputs on the plugin's detail config card.
 */
export interface SpeedTuning {
  graceMs: number;
  fadeMs: number;
}

export const DEFAULT_SPEED_TUNING: SpeedTuning = {
  graceMs: 600,
  fadeMs: 1500,
};

/** Back-compat aliases for code and tests that reference the old constants. */
export const IDLE_GRACE_MS = DEFAULT_SPEED_TUNING.graceMs;
export const IDLE_FADE_MS = DEFAULT_SPEED_TUNING.fadeMs;
export interface CompositeWeights {
  /** share of produced tokens (sat at USAGE_FULL). */
  usage: number;
  /** share of context pressure (projected tokens / window, else turns fallback). */
  pressure: number;
  /** share of the committed reasoning effort (0..MAX_LEVEL). */
  effort: number;
  /** share of decode speed (sat at TPS_FULL). */
  speed: number;
}

export const DEFAULT_COMPOSITE_WEIGHTS: CompositeWeights = {
  usage: 0.3,
  pressure: 0.3,
  effort: 0.2,
  speed: 0.2,
};

export interface CompositeSignals {
  /** decodeTokens — produced-token volume (usage factor). */
  outputTokens?: number;
  /** committed reasoning level 0..MAX_LEVEL (effort factor); unknown → 0. */
  committedLevel?: number;
  /** projected prompt + heuristic tokens (context pressure numerator). */
  pressureTokens?: number;
  /** context window size; ≤ 0 → turns fallback. */
  contextWindow?: number;
  /** conversation turns — pressure fallback when projected tokens unknown. */
  turns?: number;
  /** tokens decoded for the current streamed run (speed numerator). */
  decodeTokens?: number;
  /** wall time spent decoding, ms (speed denominator). */
  decodeMs?: number;
}

/** Missing/negative/NaN weights or a total of zero fall back to defaults. */
export function normalizeWeights(weights: Partial<CompositeWeights> | null | undefined): CompositeWeights {
  if (weights === null || typeof weights !== "object") return { ...DEFAULT_COMPOSITE_WEIGHTS };
  const fields: Record<keyof CompositeWeights, number | undefined> = {
    usage: weights.usage,
    pressure: weights.pressure,
    effort: weights.effort,
    speed: weights.speed,
  };
  // A missing key counts as zero; a present but non-number / non-finite /
  // negative value is treated as corruption and falls back to defaults.
  let anyInvalid = false;
  for (const key of Object.keys(fields) as (keyof CompositeWeights)[]) {
    const value = fields[key];
    if (value !== undefined && (typeof value !== "number" || !Number.isFinite(value) || value < 0)) {
      anyInvalid = true;
      break;
    }
  }
  const total = (fields.usage ?? 0) + (fields.pressure ?? 0)
    + (fields.effort ?? 0) + (fields.speed ?? 0);
  if (anyInvalid || total <= 0) return { ...DEFAULT_COMPOSITE_WEIGHTS };
  return {
    usage: (fields.usage ?? 0) / total,
    pressure: (fields.pressure ?? 0) / total,
    effort: (fields.effort ?? 0) / total,
    speed: (fields.speed ?? 0) / total,
  };
}

export function usageFactor(outputTokens: number): number {
  const safe = Number.isFinite(outputTokens) && outputTokens > 0 ? outputTokens : 0;
  return Math.min(1, safe / USAGE_FULL);
}

export function contextPressureFactor(
  pressureTokens?: number,
  contextWindow?: number,
  turns?: number,
): number {
  if (
    pressureTokens !== undefined && Number.isFinite(pressureTokens) && pressureTokens >= 0
    && contextWindow !== undefined && Number.isFinite(contextWindow) && contextWindow > 0
  ) {
    return Math.min(1, pressureTokens / contextWindow);
  }
  const safeTurns = typeof turns === "number" && Number.isFinite(turns)
    ? Math.max(0, turns)
    : 0;
  return Math.min(1, safeTurns / TURNS_FULL);
}

export function reasoningEffortFactor(committedLevel: number): number {
  const safe = Number.isFinite(committedLevel) ? committedLevel : 0;
  return Math.min(1, Math.max(0, safe / MAX_LEVEL));
}

export function tokenSpeedFactor(decodeTokens: number, decodeMs: number): number {
  if (!Number.isFinite(decodeTokens) || !Number.isFinite(decodeMs)) return 0;
  if (decodeTokens <= 0 || decodeMs <= 0) return 0;
  return Math.min(1, decodeTokens / (decodeMs / 1000) / TPS_FULL);
}

/**
 * Staleness decay for the live "speed" axis. The projection only exposes the
 * latest step's decode totals and does not reset them to zero when generation
 * stops, so a finished fast run would otherwise pin the speed gauge at 100%
 * forever. This multiplier ramps the speed factor down to 0 once no fresh
 * decode data has arrived for `graceMs`, fading over `fadeMs` so "stopped"
 * visibly relaxes the composite level.
 */
export function freshnessDecay(
  elapsedMs: number,
  graceMs: number = IDLE_GRACE_MS,
  fadeMs: number = IDLE_FADE_MS,
): number {
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) return 1;
  if (elapsedMs <= graceMs) return 1;
  const over = elapsedMs - graceMs;
  if (over >= fadeMs) return 0;
  return 1 - over / fadeMs;
}

/** Clamp an individual 0..1 factor, guarding against bad projections. */
function clampFactor(factor: number | undefined): number {
  return Math.min(1, Math.max(0, Number.isFinite(factor) ? factor : 0));
}

/**
 * Core weighted combination over already-normalised factors. Factors are
 * clamped to 0..1 here so a caller may pre-tune the speed factor with
 * staleness decay before it enters the weighted sum.
 */
export function weightedLevel(
  weights: Partial<CompositeWeights> | null | undefined,
  factors: { usage?: number; pressure?: number; effort?: number; speed?: number } = {},
): number {
  const w = normalizeWeights(weights);
  const sum = (
    w.usage * clampFactor(factors.usage)
    + w.pressure * clampFactor(factors.pressure)
    + w.effort * clampFactor(factors.effort)
    + w.speed * clampFactor(factors.speed)
  );
  return clampLevel(sum * MAX_LEVEL);
}

/**
 * Weighted combination of the signals → slider level 0..MAX_LEVEL.
 * Every factor is 0..1 and weights sum to 1, so the weighted sum spans [0,1];
 * scaling by MAX_LEVEL (then rounding, then clamping) keeps all 0..MAX_LEVEL
 * stops reachable: all-zero signals land on 0, all-saturated land on MAX_LEVEL.
 */
export function compositeLevel(
  weights: Partial<CompositeWeights> | null | undefined,
  signals: CompositeSignals = {},
): number {
  return weightedLevel(weights, {
    usage: usageFactor(signals.outputTokens ?? 0),
    pressure: contextPressureFactor(signals.pressureTokens, signals.contextWindow, signals.turns),
    effort: reasoningEffortFactor(signals.committedLevel ?? 0),
    speed: tokenSpeedFactor(signals.decodeTokens ?? 0, signals.decodeMs ?? 0),
  });
}

// -----------------------------------------------------------------------------
// Archive manifest (portrait.yaml / meta.yaml / portrait.json / meta.json)
//
// An imported portrait archive may carry an optional sibling manifest that
// seeds the created group's own settings: set id, Chinese/English display
// names and the light/dark threshold (分割点位). The manifest uses the exact
// same sanitization rules as the config card (see `commitField`): ids must be
// non-empty, blank zh/en just omit the override, and the dark level is clamped
// into 0..MAX_LEVEL. Any manifest that fails to parse is ignored and the import
// falls back to the default identity — importing never throws.
// -----------------------------------------------------------------------------

/** Seeded identity/behaviour a portrait archive manifest may carry. */
export interface PortraitImportMeta {
  /** Set id for the new group; must be non-empty and unique to be applied. */
  id?: string;
  /** Chinese display-name override. */
  zh?: string;
  /** English display-name override. */
  en?: string;
  /** Slider level (0..MAX_LEVEL) at which this set flips to the dark shell. */
  darkLevel?: number;
  /** Image URLs (web/data URLs) the manifest wants to seed the group with, used
   *  only when the archive itself carries no embedded images. */
  images?: string[];
}

/**
 * Validate and normalize the manifest's portrait-group fields. The Chinese and
 * English display names are mandatory — a manifest missing either (blank or
 * absent) is rejected wholesale, so the import falls back to the default
 * identity. Optional extras: a string set id, a finite dark level, and an
 * image-URL list. Returns null when the value is not an object or lacks usable
 * fields (so the caller falls back to defaults).
 */
export function normalizeImportMeta(raw: unknown): PortraitImportMeta | null {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return null;
  const src = raw as Record<string, unknown>;
  const meta: PortraitImportMeta = {};
  if (typeof src.id === "string") {
    const id = src.id.trim();
    if (id) meta.id = id;
  }
  // Bilingual display names are mandatory: with the old `name` fallback gone,
  // an archive manifest that omits either the Chinese or the English name is
  // rejected wholesale, so the import falls back to the default identity.
  const zh = typeof src.zh === "string" ? src.zh.trim() : "";
  const en = typeof src.en === "string" ? src.en.trim() : "";
  if (!zh || !en) return null;
  meta.zh = zh;
  meta.en = en;
  // Accept both camelCase (`darkLevel`) and kebab-case (`dark-level`) keys.
  const levelField = typeof src["dark-level"] === "number" ? src["dark-level"] : src.darkLevel;
  if (typeof levelField === "number" && Number.isFinite(levelField)) {
    meta.darkLevel = clampLevel(levelField);
  }
  // Optional image-URL list. URLs are trimmed, blanks dropped, duplicates
  // collapsed and the list capped at PORTRAIT_IMPORT_MAX_IMAGES so an oversized
  // manifest can't balloon a group past what the skin supports.
  if (Array.isArray(src.images)) {
    const urls: string[] = [];
    const seen = new Set<string>();
    for (const raw of src.images) {
      if (typeof raw !== "string") continue;
      const trimmed = raw.trim();
      if (trimmed === "" || seen.has(trimmed)) continue;
      seen.add(trimmed);
      urls.push(trimmed);
      if (urls.length >= PORTRAIT_IMPORT_MAX_IMAGES) break;
    }
    if (urls.length > 0) meta.images = urls;
  }
  const usable = (["id", "zh", "en", "darkLevel", "images"] as const)
    .some((key) => meta[key] !== undefined);
  return usable ? meta : null;
}

/**
 * Minimal YAML-subset reader for the archive's optional `portrait.yaml`
 * metadata. It understands the flat `key: value` mapping a portrait-set
 * manifest needs — single/double-quoted strings, booleans, finite numbers,
 * `null`/`~`, `#` comments and `---`/`...` document markers — plus simple
 * lists under a bare key (a `images:` block with `- item` lines or an inline
 * `images: [a, b]` flow list). Anything richer (nested maps, flow maps,
 * multi-line strings, anchors) is ignored rather than rejected, so an
 * over-complex manifest degrades silently to the built-in defaults instead of
 * failing the import. Returns null when no usable mapping line could be read.
 */
export function parsePortraitYaml(text: string): Record<string, unknown> | null {
  const result: Record<string, unknown> = {};
  // `blockKey` tracks the bare `key:` that opened at most one level of
  // indented `- item` lines appended to it; any other indented line (a nested
  // map, for instance) ends the pending block.
  let blockKey: string | null = null;
  let found = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === "" || /^(?:---|\.\.\.)\s*$/.test(line)) continue;
    if (/^\s/.test(rawLine)) {
      // Indented comments keep the pending block alive; any other non-bullet
      // indented line (a nested map, for instance) ends it.
      if (line.startsWith("#")) continue;
      if (blockKey !== null && line.startsWith("- ")) {
        const item = parseYamlScalar(stripYamlComment(line.slice(2)));
        if (item !== undefined) {
          appendBlockItem(result, blockKey, item);
          found = true;
          continue;
        }
      }
      blockKey = null;
      continue;
    }
    const colon = line.indexOf(":");
    if (colon <= 0) continue; // list bullets / non-mapping lines.
    const key = line.slice(0, colon).trim();
    // Nested keys and flow maps (`{k: v}`) are out of scope.
    if (key === "" || key.includes(" ") || key.startsWith("{") || key.startsWith("[")) continue;
    const rest = stripYamlComment(line.slice(colon + 1));
    if (rest === "") {
      // Bare key: candidate block-list parent for following `- item` lines;
      // on its own it contributes nothing to the mapping.
      blockKey = key;
      continue;
    }
    blockKey = null;
    if (rest.startsWith("[") && rest.endsWith("]")) {
      const items = parseYamlFlowList(rest.slice(1, -1));
      if (items !== null) {
        result[key] = items;
        found = true;
        continue;
      }
    }
    const value = parseYamlScalar(rest);
    if (value === undefined) continue;
    result[key] = value;
    found = true;
  }
  return found ? result : null;
}

// Append one `- item` list element under a bare block key, keeping the value
// an array even if the key was already set as something else.
function appendBlockItem(result: Record<string, unknown>, key: string, item: unknown): void {
  const current = result[key];
  if (Array.isArray(current)) {
    current.push(item);
  } else {
    result[key] = [item];
  }
}

// Split a flow list body (`a, b, "c, x", 'd'`) on commas outside quotes and
// parse each item as a scalar. Returns null when splitting fails, so the
// caller falls back to treating the whole token as a plain string.
function parseYamlFlowList(body: string): unknown[] | null {
  const items: string[] = [];
  let current = "";
  let quote: "'" | '"' | null = null;
  for (let index = 0; index < body.length; index += 1) {
    const ch = body[index];
    if (quote !== null) {
      if (ch === "\\" && quote === '"') { current += ch + (body[index + 1] ?? ""); index += 1; continue; }
      if (ch === "'" && quote === "'" && body[index + 1] === "'") { current += "''"; index += 1; continue; }
      current += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') { quote = ch; current += ch; continue; }
    if (ch === ",") { items.push(current); current = ""; continue; }
    current += ch;
  }
  if (quote !== null) return null; // unterminated quoted segment.
  if (current.trim() !== "") items.push(current);
  const parsed: unknown[] = [];
  for (const raw of items) {
    const value = parseYamlScalar(stripYamlComment(raw));
    if (value === undefined) return null;
    parsed.push(value);
  }
  return parsed;
}

// Trim a trailing ` # comment`, honouring quoted values so a quoted `#` inside
// a string survives.
function stripYamlComment(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
    const quote = trimmed[0];
    let index = 1;
    for (; index < trimmed.length; index += 1) {
      const ch = trimmed[index];
      if (ch === "\\" && quote === '"') { index += 1; continue; }
      if (ch !== quote) continue;
      if (quote === "'" && trimmed[index + 1] === "'") { index += 1; continue; }
      break;
    }
    return trimmed.slice(0, index + 1).trim();
  }
  return trimmed.replace(/\s+#.*/, "").trim();
}

function parseYamlScalar(raw: string): unknown {
  const value = raw.trim();
  if (value.length >= 2 && value[0] === '"' && value[value.length - 1] === '"') {
    return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  if (value.length >= 2 && value[0] === "'" && value[value.length - 1] === "'") {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (value === "null" || value === "Null" || value === "NULL" || value === "~") return null;
  if (value === "true" || value === "True" || value === "TRUE") return true;
  if (value === "false" || value === "False" || value === "FALSE") return false;
  if (/^-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)) {
    const num = Number(value);
    if (Number.isFinite(num)) return num;
  }
  return value;
}

/** Decode a metadata file: JSON first, then the flat YAML subset. */
export function parseImportMetaText(text: string): PortraitImportMeta | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    raw = parsePortraitYaml(text);
  }
  return normalizeImportMeta(raw);
}
