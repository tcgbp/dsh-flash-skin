import { MAX_LEVEL, PORTRAIT_IMPORT_MAX_IMAGES } from "./constants";
import { clampLevelContinuous } from "./effort";

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
    // Clamp into 0..MAX_LEVEL without rounding: the fine-grained light/dark
    // divider stores continuous positions on >7-frame groups (`nextDividerLevel`
    // steps by one image gap), so preserving the exact value keeps an
    // export → import round-trip from nudging the divider to the nearest stop.
    meta.darkLevel = clampLevelContinuous(levelField);
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

// A subset of a portrait group's config fields — only what the export manifest
// needs. Kept structural (rather than importing the component's group config)
// so this pure module stays free of the React bundle.
export interface PortraitGroupManifestSource {
  id: string;
  name: string;
  zh?: string;
  en?: string;
  darkLevel?: number;
}

// Single-quote a plain string into a YAML scalar. The import-side subset parser
// reads single-quoted strings and doubles embedded quotes (`''`), so this is a
// faithful round-trip for values containing `: `, `#`, quotes or leading/
// trailing whitespace.
function quoteYaml(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

/**
 * Serialize a portrait group into the same flat manifest format the archive
 * importer reads (`portrait.yaml`/`meta.yaml`: `---`…`...` markers with
 * `id`/`name`/`zh`/`en`/`darkLevel` fields). An exported archive re-imports to
 * the group's identity and light/dark threshold. No `images:` list is emitted —
 * an archive ships its frames as embedded files, which always win over the list
 * on import, so the list would be dead weight and could drift out of sync.
 */
export function buildPortraitManifest(group: PortraitGroupManifestSource): string {
  const id = group.id.trim();
  const fallback = group.name || id || "group";
  const zh = (group.zh ?? "").trim() || fallback;
  const en = (group.en ?? "").trim() || fallback;
  const darkLevel = clampLevelContinuous(group.darkLevel ?? MAX_LEVEL - 1);
  return [
    "# Portrait archive exported by dsh-flash-skin",
    "# Re-importing this archive recreates the portrait group below.",
    "---",
    `id: ${quoteYaml(id)}`,
    `name: ${quoteYaml(fallback)}`,
    `zh: ${quoteYaml(zh)}`,
    `en: ${quoteYaml(en)}`,
    `darkLevel: ${darkLevel}`,
    "...",
    "",
  ].join("\n");
}
