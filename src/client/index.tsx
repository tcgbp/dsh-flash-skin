import { Fragment, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ChangeEvent as ReactChangeEvent } from "react";
import type { Context as ClientContext } from "@deepseek-ai/cordis";
import type { SnapshotStore } from "@deepseek-ai/dsh-client-store";
import type {} from "@deepseek-ai/dsh-client-ui-conversation/client";
import type {} from "@deepseek-ai/dsh-client-ui-settings/client";
import type {} from "@deepseek-ai/dsh-client-ui-model-selection/client";
import type {} from "@deepseek-ai/dsh-client-ui-theme/client";
import {
  IconChevronDownOutlineRegular,
  SegmentedControl,
} from "@deepseek-ai/dsh-client-ui-primitives";
import styles from "./skin.css";
import { createPortraitLoader } from "./portrait-loader";
import type { PortraitImage, PortraitSource } from "./portrait-loader";
import {
  COMPACTION_DROP_RATIO,
  COMPACTION_SCORE_BONUS,
  DEFAULT_COMPOSITE_WEIGHTS,
  DEFAULT_SPEED_TUNING,
  MAX_LEVEL,
  clampLevel,
  clampLevelContinuous,
  compositeLevel,
  contextCompactionFactor,
  contextPressureFactor,
  dividerStepFor,
  frameIndexForLevel,
  frameIndexForContinuousLevel,
  frameIndexForScore,
  freshnessDecay,
  levelForEffort,
  nextDividerLevel,
  normalizeWeights,
  paletteForLevel,
  PORTRAIT_IMPORT_MIN_IMAGES,
  reasoningEffortFactor,
  selectedEffortIndex,
  stagedFrames,
  tokenSpeedFactor,
  usageFactor,
  weightedLevel,
  type CompositeWeights,
  type EffortLike,
  type Palette,
  type PortraitImportMeta,
  type PortraitGroupManifestSource,
  type SpeedTuning,
  buildPortraitManifest,
  buildShareText,
  parseShareText,
  mergeLikeCount,
  type CommunityEntry,
  parseImportMetaText,
} from "./logic";
import { zipSync, strToU8, unzipSync, gunzipSync } from "./vendor/fflate";

const PACKAGE_ID = "dsh-flash-skin";
const LOCALE_NAMESPACE = "flash.skin";
const CONFIG_NAMESPACE = "flash-skin";
const LEVEL_KEY = "dsh-flash-skin.level";
const SET_KEY = "dsh-flash-skin.set";
const DRIVER_KEY = "dsh-flash-skin.driver";
const LAYOUT_KEY = "dsh-flash-skin.layout-left";
const WEIGHTS_KEY = "dsh-flash-skin.weights";

// Desktop-host detection. The desktop version is a real Electron app (its
// resources ship as app.asar + Electron PE/runtime DLLs), while the web GUI
// runs in a normal browser. Signals, most reliable first:
//   1) a host-owned desktop stamp on <body>/<html> if that build provides one
//      (data-dsh-desktop-mode = "compatibility" | "extended");
//   2) navigator.userAgent claiming Electron — universal, needs no host
//      internals and nothing from dsh-flash.
// Read at call time so late-stamped bodies (host sets it during startup) are
// still caught.
const desktopMode = () => {
  try {
    if (typeof document !== "undefined") {
      const stamp =
        document.body?.getAttribute("data-dsh-desktop-mode") ||
        document.documentElement?.getAttribute("data-dsh-desktop-mode") ||
        "";
      if (stamp) return stamp;
    }
    const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
    return /Electron/i.test(ua) ? "electron" : "";
  } catch {
    return "";
  }
};

// Host attachments route (exact path for POST upload, prefix for GET serve).
const ATTACHMENT_PATH = `/plugins/${PACKAGE_ID}/attachment`;
// Network-import routes: bundled example archives (served by the plugin over
// this prefix) and a server-side proxy for pasting any http(s) archive URL.
const EXAMPLES_PREFIX = `/plugins/${PACKAGE_ID}/examples/`;
const REMOTE_ARCHIVE_PATH = `/plugins/${PACKAGE_ID}/archive`;
// Social channels (C1 text share + C2 community directory/likes). These exact
// routes mirror src/likes.js and src/community.js path exports.
const LIKE_PATH = `/plugins/${PACKAGE_ID}/like`;
const LIKES_PATH = `/plugins/${PACKAGE_ID}/likes`;
const COMMUNITY_PATH = `/plugins/${PACKAGE_ID}/community`;
const COMMUNITY_SUBMIT_PATH = `/plugins/${PACKAGE_ID}/community/submit`;
// Per-device like bookkeeping, keyed by group id ({ [groupId]: boolean }). Not
// part of the persisted config document, so liking never dirties the patch.
const FLASH_SKIN_LIKED_KEY = "flash-skin:liked-by-id";
// Archives bundled into the package (whitelisted in package.json `files`) and
// offered as one-tap quick imports. Labels are shown in both languages so the
// picker is usable regardless of the current UI language.
const EXAMPLE_ARCHIVES = Object.freeze([
  { file: "liangsheng-demo.zip", zh: "梁圣", en: "Liang the Saint" },
  { file: "liangshen-demo.zip", zh: "梁神", en: "Liang the God" },
  { file: "liangzu-demo.zip", zh: "梁祖", en: "Liang the Ancestor" },
  { file: "liangshen-url-demo.zip", zh: "梁神在线（URL 示例）", en: "Liang the God (URL-only)" },
  { file: "hanli-demo.zip", zh: "韩立", en: "Han Li" },
]);
// Image extensions an archive URL/name may end with to be accepted as importable.
const ARCHIVE_EXT_RE = /\.(zip|tar|tgz|gz|gzip)$/i;
// How many extracted images the client sends per upload POST. Must stay within
// the host attachment store's per-message limit; the rest go in extra requests.
const MAX_UPLOAD_IMAGES_PER_BATCH = 16;
// Archive entries carry no decoded type, so the media type is derived from the
// file extension and must match the actual bytes (the host store verifies).
const MEDIA_TYPE_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

// Like bookkeeping: persisted per device under FLASH_SKIN_LIKED_KEY (group id →
// boolean). Pure/localStorage guarded so a missing or full store degrades to a
// session-only in-memory ledger instead of throwing.
function readLikedStore(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(FLASH_SKIN_LIKED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "boolean") out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

function writeLikedStore(next: Record<string, boolean>): Record<string, boolean> {
  try {
    localStorage.setItem(FLASH_SKIN_LIKED_KEY, JSON.stringify(next));
  } catch {
    // localStorage 不可用时仅本次会话生效。
  }
  return next;
}

// Clipboard copy with a legacy textarea fallback for browsers that gate
// navigator.clipboard behind a secure-context / permission requirement.
async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through to the textarea trick */
    }
  }
  return fallbackCopyText(text);
}

function fallbackCopyText(text: string): boolean {
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

// The three original built-in sets (storm/blaze/frost, later renamed to
// liangsheng/liangshen/liangzu) were archived out of the plugin: their art now
// ships as importable example zip archives, so there are no on-disk anchors.
// Old persisted values (localStorage SET_KEY and saved portraitGroups group
// ids) still carry those ids, so keep a mapping and fold them into the single
// default set whenever one is read back.
const LEGACY_SET_IDS: Record<string, string> = {
  storm: "default",
  blaze: "default",
  frost: "default",
  liangsheng: "default",
  liangshen: "default",
  liangzu: "default",
};

function normalizeSetId(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  const mapped = LEGACY_SET_IDS[id];
  return mapped !== undefined ? mapped : id;
}

// Resolve a portrait set's display name against the active locale at render
// time. The zh/en values are user-editable CONFIG values (group.zh / group.en,
// with `name` kept as the pre-bilingual fallback), NOT dynamic locale-registry
// keys: the host requires bilingual, balanced dictionaries at registration
// time, so editable names must be looked up here instead of through the locale
// binding. The settings-row selector shows the Chinese name in the Chinese UI
// and the English name in the English UI; any locale that is not English
// (including custom language packs) reads the Chinese name first. Built-in ids
// resolve to the single default-set identity when the persisted config predates
// the bilingual names (older configs only stored `name`), so a display name
// never disappears merely because a stale config lacks it.
function defaultSetIdentity(id: string | undefined): DefaultPortraitSet | undefined {
  return id === DEFAULT_PORTRAIT_SET.id ? DEFAULT_PORTRAIT_SET : undefined;
}

function setDisplayName(set: { id?: string; name?: string; zh?: string; en?: string }, active: string): string {
  const def = defaultSetIdentity(set.id);
  const english = active.slice(0, 2).toLowerCase() === "en";
  const zh = (set.zh ?? def?.zh ?? "").trim();
  const en = (set.en ?? def?.en ?? "").trim();
  if (english) return en || zh || set.name || "";
  return zh || en || set.name || "";
}

// Resolve the full ordered frame list for a portrait set, for the general
// settings preview strip. Configured groups expose their whole image list,
// mapped onto the 0..MAX_LEVEL slider by the count-driven stagedFrames()
// helper. Returns [] when the set has nothing to show yet (e.g. a brand-new
// image-less group, or the untouched default set).
function setFrames(set: PortraitGroupConfig | DefaultPortraitSet): string[] {
  const configuredImages = (set as PortraitGroupConfig).images;
  return Array.isArray(configuredImages) ? configuredImages.slice() : [];
}

interface PortraitSet {
  id: string;
}

// The previous three built-in portrait sets (梁圣/梁神/梁祖) were archived into
// the example import archives and their on-disk art removed. Only a single
// fallback identity remains, shown while no portraitGroups config has been
// written yet; it carries no images, so the untouched state shows the flat
// shell placeholder instead of built-in art.
interface DefaultPortraitSet extends PortraitSet {
  zh: string;
  en: string;
}

const DEFAULT_PORTRAIT_SET: DefaultPortraitSet = {
  id: "default",
  zh: "默认",
  en: "Default",
};

// How the level slider is driven:
// - "manual"  → user drags the slider; the value persists across sessions.
// - "composite" → a read-only weighted gauge computed from live conversation
//               signals (token usage, context pressure, reasoning effort,
//               decode speed); never persisted as the manual level.
type DriverMode = "manual" | "composite";

interface SkinSettings {
  enabled: boolean;
  set: string;
  driver: DriverMode;
}

interface PreferenceStore {
  getSnapshot(): SkinSettings;
  subscribe(listener: () => void): () => void;
  set(enabled: boolean): Promise<void>;
  setSet(setId: string): Promise<void>;
  setDriver(driver: DriverMode): Promise<void>;
  dispose(): void;
}

type NativeThemeId = "light" | "dark";

interface ThemeService {
  getTheme(): { preference: string };
  setTheme(id: string): void;
}

interface ModelSelection {
  provider: string;
  model: string;
  reasoningEffort?: string;
}

interface CatalogModel {
  id: string;
  reasoning?: {
    efforts: EffortLike[];
    defaultEffort?: string;
  };
}

interface ModelDirectoryState {
  current: ModelSelection | null;
  groups: readonly { id: string; models: CatalogModel[] }[];
  status: "idle" | "loading" | "ready" | "selecting" | "error";
  error: string | null;
}

interface ModelDirectory {
  store: SnapshotStore<ModelDirectoryState>;
  load(): Promise<unknown>;
  select(selection: ModelSelection): Promise<{ ok: boolean }>;
}

interface RecorderProps {
  directory: SnapshotStore<ModelDirectoryState>;
  load: () => void;
  presenter: SkinPresenter;
  scope: PreferenceStore;
  settings: { level: number };
  /** Persisted, user-editable composite weights (shared with the config card). */
  weights: WeightsStore;
  /**
   * Standard-injected conversation projection hook from the host's
   * `conversation.input.left` binding. Always present on supported hosts;
   * guarded so a host without it degrades to a frozen composite gauge instead
   * of crashing.
   */
  useProjection?: (key: string) => unknown;
  /** Host locale face — 渲染期读取活动语言以本地化公式短标与得分/帧文案。 */
  locale?: LocaleFaceLike | null;
  /** Bound translator for LOCALE_NAMESPACE; locale switch triggers re-render. */
  t?: (key: string) => string;
}

type ProjectionApi = (key: string) => unknown;

interface SessionStatsProjection {
  turns?: number;
  decodeMs?: number;
  decodeTokens?: number;
}

interface TokenUsageProjection {
  outputTokens?: number;
}

interface ContextPressureProjection {
  pressureTokens?: number;
  projectedTokens?: number;
  contextWindow?: number;
}

/**
 * Real-event compaction clock from the host's `sessionProjections` seam
 * (key `flash-skin-compaction`, registered by this skin's server side).
 * `seq`/`atWallMs` move once per completed `compaction/summary` event;
 * absent on hosts without the seam.
 */
interface FlashSkinCompactionProjection {
  seq?: number;
  atWallMs?: number;
  model?: string;
}

interface DriverRowProps {
  scope: PreferenceStore;
  t: (key: string) => string;
}

interface WeightsStore {
  getSnapshot(): CompositeWeights;
  getTuning(): SpeedTuning;
  subscribe(listener: () => void): () => void;
  /** Replace the composite weights (renormalized to sum 1 on write). */
  setWeights(weights: CompositeWeights): void;
  /** Replace the speed-decay timing parameters (clamped on write). */
  setTuning(tuning: Partial<SpeedTuning>): void;
  reset(): void;
  dispose(): void;
}

function modelReasoning(state: ModelDirectoryState) {
  const current = state.current;
  if (current === null) return null;
  const group = state.groups.find((item) => item.id === current.provider);
  const model = group?.models.find((item) => item.id === current.model);
  if (model?.reasoning === undefined) return null;
  return {
    selection: current,
    efforts: model.reasoning.efforts,
    defaultEffort: model.reasoning.defaultEffort,
  };
}

const cssVariables = [
  "--flash-page",
  "--flash-surface",
  "--flash-ink",
  "--flash-secondary",
  "--flash-accent",
  "--flash-accent-hover",
  "--flash-portrait-opacity",
] as const;

class SkinPresenter {
  private readonly scope: PreferenceStore;
  private readonly theme: ThemeService;
  private readonly root: HTMLDivElement;
  private readonly onChange: (state: { image: PortraitImage | null }) => void;
  private portraits: ReturnType<typeof createPortraitLoader>;
  private enabled = true;
  private level = 0;
  private set: PortraitSet = DEFAULT_PORTRAIT_SET;
  // Left-aligned layout gate (persisted). Drives `data-flash-layout` on
  // <body>; the skin.css left-align rules activate only while this is ON.
  private layout = restoreLayout();
  // Per-group config mirrored from the persisted config card. images drive the
  // portrait sequence; darkLevel (absent → MAX_LEVEL - 1) drives the flip to
  // the dark shell.
  private groupConfigs: Record<string, { images: string[]; darkLevel?: number }> = {};
  private portraitsSources: readonly PortraitSource[] = [];
  private disposed = false;
  private unsubscribe: () => void;

  private darkLevelForCurrentSet(): number {
    const value = this.groupConfigs[this.set.id]?.darkLevel;
    if (value === undefined) return MAX_LEVEL - 1;
    return Math.min(MAX_LEVEL, Math.max(0, Math.round(value)));
  }

  // Push an updated persisted config into the presenter: swap the current set's
  // portrait sources and re-derive its dark threshold. Image edits rebuild the
  // sequence loader; dark-level-only edits just re-apply the palette.
  setPortraitGroups(groups: PortraitGroupConfig[]) {
    if (this.disposed) return;
    const configs: Record<string, { images: string[]; darkLevel?: number }> = {};
    for (const group of groups) {
      configs[normalizeSetId(group.id)] = { images: group.images ?? [], darkLevel: group.darkLevel };
    }
    const nextSources = this.sourcesForSet(this.set, configs);
    const sourcesChanged = nextSources.length !== this.portraitsSources.length
      || nextSources.some((source, index) => source.url !== this.portraitsSources[index]?.url);
    this.groupConfigs = configs;
    this.portraitsSources = nextSources;
    if (this.enabled) {
      if (sourcesChanged) {
        this.portraits.dispose();
        this.portraits = createPortraitLoader({ sources: nextSources, onChange: this.onChange });
        this.portraits.start();
        this.updatePortrait();
      }
      this.applyPalette();
    }
  }

  private sourcesForSet(set: PortraitSet, configs = this.groupConfigs): readonly PortraitSource[] {
    // Prefer the user-configured images for this set, staged by the pure
    // count-driven stagedFrames() helper so added/removed frames re-spread
    // automatically across the 0..MAX_LEVEL slider (no fixed number of stops).
    const group = configs[set.id];
    if (group && group.images.length > 0) {
      const frames = stagedFrames(group.images.length);
      return group.images.map((url, index) => ({
        level: frames[index] ?? 0,
        url,
      }));
    }
    return [];
  }

  // Resolve a persisted/selected set id to a PortraitSet. Configured (custom)
  // ids must survive anyway: they carry their own configured group images, so
  // any unknown id resolves to `{ id }` and simply has nothing to show until a
  // group with that id exists. Only the default set is pre-registered.
  private resolveSet(setId: string | undefined | null): PortraitSet {
    return { id: setId || DEFAULT_PORTRAIT_SET.id };
  }

  constructor(scope: PreferenceStore, theme: ThemeService) {
    this.scope = scope;
    this.theme = theme;
    const initialSetId = scope.getSnapshot().set;
    this.set = this.resolveSet(initialSetId);
    this.root = document.createElement("div");
    this.root.className = "flash-skin-backdrop";
    this.root.dataset.plugin = PACKAGE_ID;
    this.root.dataset.media = "color";
    this.root.setAttribute("aria-hidden", "true");
    this.onChange = ({ image }) => {
      if (this.disposed || !this.enabled) return;
      if (image === null) {
        this.root.dataset.media = "color";
        this.root.replaceChildren();
        return;
      }
      // Reuse the decoded node so a frame swap cannot start a second fetch.
      const portrait = image as HTMLImageElement;
      portrait.className = "flash-skin-sequence-frame";
      portrait.alt = "";
      portrait.draggable = false;
      if (this.root.firstChild !== portrait) this.root.replaceChildren(portrait);
      this.root.dataset.media = "sequence";
    };
    this.portraits = this.buildPortraits(this.set);
    this.portraitsSources = this.sourcesForSet(this.set);
    this.unsubscribe = scope.subscribe(() => this.syncSettings());
    this.syncSettings();
  }

  private buildPortraits(set: PortraitSet) {
    return createPortraitLoader({
      sources: this.sourcesForSet(set),
      onChange: this.onChange,
    });
  }

  private syncSettings() {
    const snapshot = this.scope.getSnapshot();
    this.setEnabled(snapshot.enabled);
    this.setPortraitSet(this.resolveSet(snapshot.set));
  }

  isEnabled() {
    return this.enabled;
  }

  getLevel() {
    return this.level;
  }

  getSet() {
    return this.set;
  }

  getLayout() {
    return this.layout;
  }

  setLayout(left: boolean) {
    if (this.disposed) return;
    this.layout = left;
    try {
      if (left) localStorage.setItem(LAYOUT_KEY, "1");
      else localStorage.setItem(LAYOUT_KEY, "0");
    } catch {
      // storage may be unavailable
    }
    this.applyLayout();
  }

  // Mirror the skin on/off body-attribute pattern: `data-flash-layout="left"`
  // activates the gated left-align rules; removing it returns to native.
  // Desktop (Electron) doesn't support left-align, so never stamp the gate there.
  private applyLayout() {
    if (this.disposed) return;
    if (this.enabled && this.layout && !desktopMode())
      document.body.dataset.flashLayout = "left";
    else document.body.removeAttribute("data-flash-layout");
  }

  setPortraitSet(set: PortraitSet) {
    if (this.disposed || set.id === this.set.id) return;
    this.set = set;
    this.portraits.dispose();
    this.portraits = this.buildPortraits(set);
    this.portraitsSources = this.sourcesForSet(set);
    if (this.enabled) {
      this.portraits.start();
      this.updatePortrait();
      // The dark threshold is per set; re-apply the palette so the shell
      // reflects the newly selected set's configuration.
      this.applyPalette();
    }
  }

  setEnabled(enabled: boolean) {
    if (this.disposed) return;
    this.enabled = enabled;
    if (enabled) {
      if (!this.root.isConnected) document.body.prepend(this.root);
      document.body.dataset.flashSkin = "on";
      this.applyLayout();
      this.applyPalette();
      this.portraits.start();
    } else {
      this.root.remove();
      this.portraits.stop();
      this.root.replaceChildren();
      this.root.dataset.media = "color";
      document.body.removeAttribute("data-flash-skin");
      this.applyLayout();
      for (const name of cssVariables) document.body.style.removeProperty(name);
    }
  }

  setLevel(level: number) {
    if (this.disposed) return;
    // Accept continuous values so a fine-grained slider can land on every
    // staged frame; the palette clamps internally and existing integer callers
    // (composer rail, effort binding) are unchanged.
    this.level = clampLevelContinuous(level);
    if (this.enabled) this.applyPalette();
  }

  // The colour scheme follows the reasoning level the way dsh-liang-skin does:
  // low levels keep the native light shell, and only the highest two stops
  // (level 5 and 6) switch to the dark shell.
  private applyPalette() {
    if (this.disposed || !this.enabled) return;
    const palette = paletteForLevel(this.level, this.darkLevelForCurrentSet());
    const body = document.body;
    this.syncNativeTheme(palette.stage === 1 ? "dark" : "light");
    body.dataset.flashStage = String(palette.stage);
    body.style.setProperty("--flash-page", palette.page);
    body.style.setProperty("--flash-surface", palette.surface);
    body.style.setProperty("--flash-ink", palette.ink);
    body.style.setProperty("--flash-secondary", palette.secondary);
    body.style.setProperty("--flash-accent", palette.accent);
    body.style.setProperty("--flash-accent-hover", palette.accentHover);
    body.style.setProperty("--flash-portrait-opacity", palette.portraitOpacity);
    this.updatePortrait();
  }

  private updatePortrait() {
    // The loader nearest-selects continuous staged frame levels, so a
    // fine-grained slider level can settle on every frame of the group; the
    // composer's integer 0..MAX_LEVEL grip keeps snapping there, unchanged.
    this.portraits.select(clampLevelContinuous(this.level));
  }

  /**
   * Composite mode: drive the portrait frame by a continuous normalized score
   * (0..1) mapped directly onto the group's N frames. The palette level stays
   * the integer 0..MAX_LEVEL grip; only the portrait advances freely so all N
   * frames are reachable, not just the seven integer stops.
   */
  setPortraitScore(score: number) {
    if (this.disposed) return;
    if (!Number.isFinite(score)) return;
    const t = Math.min(1, Math.max(0, score));
    this.portraits.select(t * MAX_LEVEL);
  }

  /** Number of portrait frames currently staged for the active set (0 when none). */
  getPortraitCount(): number {
    return this.portraitsSources.length;
  }

  syncNativeTheme(theme: NativeThemeId = paletteForLevel(this.level, this.darkLevelForCurrentSet()).stage === 1 ? "dark" : "light") {
    if (!this.enabled) return;
    const preference = this.theme.getTheme().preference;
    if (preference === theme) return;
    // Flash no longer registers palettes into the host theme service, so the
    // preference slot only ever holds a base scheme (light/dark/system).
    // Pushing the matching base scheme keeps brightness in sync without ever
    // writing anything flash-specific into the host's durable settings.
    this.theme.setTheme(theme);
  }

  async choose(setId: string) {
    const set = this.resolveSet(setId);
    this.setEnabled(true);
    this.setPortraitSet(set);
    // Decoupled from the host theme preference: we never write our palette ids
    // back into the host (see apply → theme preference bridge). The host only
    // publishes a preference change; acting on it is the bridge's job, and we
    // stay out of the durable settings scope so no write/adopt loop can form.
    try {
      await this.scope.set(true);
      await this.scope.setSet(set.id);
    } catch (error) {
      this.syncSettings();
      throw error;
    }
  }

  async disable() {
    this.setEnabled(false);
    try {
      await this.scope.set(false);
    } catch (error) {
      this.syncSettings();
      throw error;
    }
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.unsubscribe();
    this.portraits.dispose();
    this.root.remove();
    document.body.removeAttribute("data-flash-skin");
    document.body.removeAttribute("data-flash-layout");
    delete document.body.dataset.flashStage;
    for (const name of cssVariables) document.body.style.removeProperty(name);
  }
}

function FlashLevelControl({
  directory,
  load,
  presenter,
  scope,
  settings,
  weights,
  useProjection,
  locale,
  t,
}: RecorderProps) {
  const state = useSyncExternalStore(
    (listener) => directory.subscribe(listener),
    () => directory.getSnapshot(),
  );
  const skin = useSyncExternalStore(
    (listener) => scope.subscribe(listener),
    () => scope.getSnapshot(),
  );
  const reasoning = useMemo(() => modelReasoning(state), [state]);
  const efforts = reasoning?.efforts ?? [];
  const committedIndex = selectedEffortIndex(
    efforts,
    reasoning?.selection.reasoningEffort,
    reasoning?.defaultEffort,
  );
  // An unknown committed effort defaults to the max level so a fresh
  // conversation paints the strongest flash immediately instead of waiting
  // for the directory load to resolve the real effort.
  const committedLevel = committedIndex < 0
    ? MAX_LEVEL
    : levelForEffort(committedIndex, efforts.length);
  const driver = skin.driver;
  const [level, setLevel] = useState(() => {
    if (driver === "composite") return 0;
    return clampLevel(settings.level);
  });
  const [interacting, setInteracting] = useState(false);
  const dragging = useRef(false);
  const dragStartLevel = useRef(level);
  const enabled = skin.enabled;

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  useEffect(() => {
    if (enabled) presenter.setLevel(level);
    // The composite gauge is transient: it follows live signals and must never
    // overwrite the level the user picked manually.
    if (driver === "composite") return;
    try {
      localStorage.setItem(LEVEL_KEY, String(level));
    } catch {
      // storage may be unavailable
    }
  }, [level, enabled, presenter, driver]);

  if (!enabled) return null;

  const progressRatio = Math.min(1, level / MAX_LEVEL);
  const readOnly = driver === "composite";
  // The grip spans the active group's staged frame count plus one (N+1 stops)
  // so every frame stays reachable; a set with no frames keeps the fixed
  // 0..MAX_LEVEL baseline instead of collapsing the slider.
  const sliderMax = Math.max(MAX_LEVEL, presenter.getPortraitCount());

  // Composite driver: hand the render off to a dedicated component that owns
  // the projection hooks — a separate component means the useProjection calls
  // there are unconditional. A host without the standard hook renders a frozen
  // zero gauge instead of crashing.
  if (readOnly && typeof useProjection === "function") {
    return (
      <CompositeLevelControl
        useProjection={useProjection}
        weights={weights}
        committedLevel={committedLevel}
        presenter={presenter}
        load={load}
        enabled={enabled}
        locale={locale}
        t={t}
      />
    );
  }
  if (readOnly) {
    return (
      <div className="flash-level-control flash-level-control--composite" data-plugin={PACKAGE_ID} data-state="ready">
        <input
          className="flash-level-control__range"
          type="range"
          min={0}
          max={sliderMax}
          step={1}
          value={0}
          disabled
          tabIndex={-1}
          aria-label={t ? t("driver.composite") : "综合加权"}
        />
      </div>
    );
  }

  const commit = (rawLevel: number) => {
    dragging.current = false;
    const next = clampLevel(rawLevel);
    setLevel(next);
    presenter.setLevel(next);
  };

  return (
    <div
      className="flash-level-control"
      data-plugin={PACKAGE_ID}
      data-state="ready"
    >
      {interacting && (
        <output
          className="flash-level-control__tooltip"
          style={{ "--flash-slider-ratio": progressRatio } as React.CSSProperties}
        >
          {`${Math.round(progressRatio * 100)}%`}
        </output>
      )}
      <input
        className="flash-level-control__range"
        type="range"
        min={0}
        max={sliderMax}
        step={1}
        value={level}
        disabled={state.status === "selecting"}
        aria-label="皮肤强度"
        aria-valuetext={`${Math.round(progressRatio * 100)}%`}
        onPointerDown={() => {
          dragging.current = true;
          dragStartLevel.current = level;
          setInteracting(true);
        }}
        onInput={(event) => {
          dragging.current = true;
          const next = Number(event.currentTarget.value);
          setLevel(next);
          presenter.setLevel(next);
        }}
        onPointerUp={(event) => {
          setInteracting(false);
          void commit(Number(event.currentTarget.value));
        }}
        onPointerCancel={() => {
          setInteracting(false);
          dragging.current = false;
          setLevel(dragStartLevel.current);
          presenter.setLevel(dragStartLevel.current);
        }}
        onKeyUp={(event) => {
          setInteracting(false);
          if (event.key !== "Escape") void commit(Number(event.currentTarget.value));
        }}
        onBlur={(event) => {
          setInteracting(false);
          if (dragging.current) void commit(Number(event.currentTarget.value));
        }}
        onKeyDown={(event) => {
          setInteracting(true);
          if (event.key === "Escape") {
            setInteracting(false);
            dragging.current = false;
            setLevel(dragStartLevel.current);
            presenter.setLevel(dragStartLevel.current);
          }
        }}
      />
    </div>
  );
}

function DriverRow({ scope, t }: DriverRowProps) {
  const snapshot = useSyncExternalStore(
    (listener) => scope.subscribe(listener),
    () => scope.getSnapshot(),
  );
  const [pending, setPending] = useState(false);
  if (!snapshot.enabled) return null;

  const options: { value: DriverMode; label: string }[] = [
    { value: "manual", label: t("driver.manual") },
    { value: "composite", label: t("driver.composite") },
  ];

  return (
    <div className="flash-appearance-binding flash-appearance-binding--driver" data-plugin={PACKAGE_ID}>
      <span className="flash-appearance-binding__label">{t("driver.title")}</span>
      {/* Host-native segmented control (dsh-client-ui-primitives
          `SegmentedControl`, a tablist with a sliding indicator): the
          appearance panel renders it with the host's own tokens/CSS, so it
          matches the rest of the settings surface instead of a hand-drawn
          button group. */}
      <SegmentedControl
        id="flash-skin-driver"
        value={snapshot.driver}
        label={t("driver.title")}
        disabled={pending}
        options={options.map(({ value, label }) => ({ value, label }))}
        onChange={(value) => {
          const driver: DriverMode =
            value === "composite" ? "composite" : "manual";
          if (pending || snapshot.driver === driver) return;
          setPending(true);
          void scope.setDriver(driver).catch(() => undefined).finally(() => setPending(false));
        }}
      />
    </div>
  );
}

// Composite driver view: a read-only slider acting as a live gauge. The shown
// level is recomputed from the weighted projection signals whenever a signal or
// the user weights change, and applied through the presenter — never persisted.
// Because this is a separate component, the useProjection calls below are
// unconditional and safe even though the driver itself is chosen at runtime.
function CompositeLevelControl({
  useProjection,
  weights,
  committedLevel,
  presenter,
  load,
  enabled,
  locale,
  t,
}: {
  useProjection: ProjectionApi;
  weights: WeightsStore;
  committedLevel: number;
  presenter: SkinPresenter;
  load: () => void;
  enabled: boolean;
  locale?: LocaleFaceLike | null;
  t?: (key: string) => string;
}) {
  const weightsSnapshot = useSyncExternalStore(
    (listener) => weights.subscribe(listener),
    () => weights.getSnapshot(),
  );
  // 订阅活动语言:切换语言时重渲染,让公式短标与得分/帧文案随之中英切换。
  useSyncExternalStore(
    (listener) => (locale?.subscribe ? locale.subscribe(listener) : () => undefined),
    () => (locale?.getSnapshot ? locale.getSnapshot() : { active: "" }),
  );
  const sessionStats = useProjection("sessionStats") as SessionStatsProjection | null | undefined;
  const tokenUsage = useProjection("tokenUsage") as TokenUsageProjection | null | undefined;
  const contextPressure = useProjection("contextPressure") as ContextPressureProjection | null | undefined;
  const compactionProj = useProjection("flash-skin-compaction") as FlashSkinCompactionProjection | null | undefined;

  const outputTokens = tokenUsage?.outputTokens;
  const pressureTokens = contextPressure?.projectedTokens ?? contextPressure?.pressureTokens;
  const contextWindow = contextPressure?.contextWindow;
  const turns = sessionStats?.turns;
  const decodeTokens = sessionStats?.decodeTokens;
  const decodeMs = sessionStats?.decodeMs;

  const normalized = normalizeWeights(weightsSnapshot);
  const tuning = weights.getTuning();
  const usageF = usageFactor(outputTokens ?? 0, tuning.usageFull);
  const pressureF = contextPressureFactor(pressureTokens, contextWindow, turns);
  const effortF = reasoningEffortFactor(committedLevel);
  const speedBase = tokenSpeedFactor(decodeTokens ?? 0, decodeMs ?? 0, tuning.tpsFull);
  const decodingActive = decodeTokens != null && Number.isFinite(decodeTokens) && decodeTokens > 0
    && decodeMs != null && Number.isFinite(decodeMs) && decodeMs > 0;

  // Staleness clock: the projection never resets its decode totals when
  // generation stops, so we track the last time decode data changed and tick
  // `now` while the composite gauge is mounted. Once no fresh decode has
  // arrived for the configured grace window, the speed factor decays toward 0
  // over the configured fade window and the composite level relaxes back down
  // instead of pinning at the last run's saturated speed.
  const [now, setNow] = useState(() => Date.now());
  const lastDecodeAt = useRef<number | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [enabled]);
  useEffect(() => {
    if (decodingActive) lastDecodeAt.current = Date.now();
  }, [decodingActive, decodeTokens, decodeMs]);
  const speedF = speedBase > 0 && lastDecodeAt.current != null
    ? speedBase * freshnessDecay(now - lastDecodeAt.current, tuning.graceMs, tuning.fadeMs)
    : 0;

  // Compaction (压缩) pulse: a compaction briefly lifts the composite level.
  // Two sources feed the same pulse stamp, never both at once:
  //   1. Real event clock (`compactionProj`, key `flash-skin-compaction`): the
  //      plugin's server side folds every completed `compaction/summary` event
  //      into the host projection, which re-renders us with a fresh `seq` and
  //      `atWallMs`. A new finite `seq` with a positive finite `atWallMs` is the
  //      authoritative, host-verified signal — each completed compaction stamps
  //      exactly one pulse.
  //   2. Heuristic fallback (projected pressure drop): used only when the host
  //      has no `sessionProjections` seam (`!compactionProj`), so the plugin
  //      still shows the pulse on standalone hosts — never both, never a crash.
  // The stamp is a wall-clock ms on the same render clock (`now`) — no extra
  // timer — and decays over a few seconds, adding a fixed COMPACTION_SCORE_BONUS
  // directly onto the weighted score (a separate 加分项).
  const lastPressureRef = useRef<number | null>(null);
  const compactionPulseAtRef = useRef<number | null>(null);
  const lastCompactionSeqRef = useRef<number | null>(null);
  useEffect(() => {
    if (!enabled) {
      lastPressureRef.current = null;
      compactionPulseAtRef.current = null;
      lastCompactionSeqRef.current = null;
      return;
    }
    // Real-event clock takes priority whenever the projection reads as present.
    const hasProjection =
      compactionProj !== null && compactionProj !== undefined
      && typeof compactionProj === "object";
    if (hasProjection) {
      const seq = compactionProj.seq;
      const atWallMs = compactionProj.atWallMs;
      const fresh =
        seq !== null && seq !== undefined && Number.isInteger(seq) && seq >= 0
        && atWallMs !== null && atWallMs !== undefined
        && Number.isFinite(atWallMs) && atWallMs > 0
        && lastCompactionSeqRef.current !== seq;
      if (fresh) {
        lastCompactionSeqRef.current = seq;
        compactionPulseAtRef.current = Math.min(atWallMs, Date.now());
      }
      return;
    }
    // Heuristic fallback (no seam): a sharp relative drop in projected context
    // tokens marks a compaction. Stale/unmounted reads are ignored (finite
    // guards). This path is skipped entirely when the real clock is present.
    if (pressureTokens === undefined || pressureTokens === null || !Number.isFinite(pressureTokens)) {
      lastPressureRef.current = null;
      return;
    }
    const prev = lastPressureRef.current;
    lastPressureRef.current = pressureTokens;
    if (
      prev !== null && Number.isFinite(prev) && prev > 0
      && pressureTokens < prev * (1 - COMPACTION_DROP_RATIO)
    ) {
      compactionPulseAtRef.current = Date.now();
    }
  }, [enabled, pressureTokens, compactionProj]);
  const compactionF = contextCompactionFactor(compactionPulseAtRef.current, now);
  // Compaction bonus: 压缩 is NOT a configurable weight. It lands as a separate
  // direct add-on on top of the weighted score, and only while a fresh pulse is
  // live (compactionF > 0): contribution = COMPACTION_SCORE_BONUS × pulse.
  // The value that actually picks the level/frame is combined = weighted + bonus.
  const wBase =
    normalized.usage * usageF
    + normalized.pressure * pressureF
    + normalized.effort * effortF
    + normalized.speed * speedF;
  const compBonus = COMPACTION_SCORE_BONUS * compactionF;
  const combined = wBase + compBonus;
  const compActive = compactionF > 0;

  const lastLevelRef = useRef(-1);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  useEffect(() => {
    const next = Math.max(
      0,
      Math.min(MAX_LEVEL, Math.round(
        weightedLevel(weightsSnapshot, {
          usage: usageF,
          pressure: pressureF,
          effort: effortF,
          speed: speedF,
        }) + compBonus * MAX_LEVEL,
      )),
    );
    // Palette rides the rounded 0..MAX_LEVEL grip (light/dark shell decision);
    // only ever push it when the integer stop actually changes.
    if (lastLevelRef.current !== next) {
      lastLevelRef.current = next;
      presenter.setLevel(next);
    }
    if (presenter.isEnabled()) {
      // Portrait rides the summed weighted + 压缩-bonus score, mapped straight
      // onto the group's N frames — so all N are reachable, not just the 7 stops.
      presenter.setPortraitScore(combined);
    }
  }, [
    presenter,
    weightsSnapshot,
    usageF,
    pressureF,
    effortF,
    speedF,
    compactionF,
    compBonus,
    combined,
  ]);

  const count = presenter.getPortraitCount();
  const w = normalized;
  // 综合加权拿去取帧的是「加权得分 + 压缩加分项」的合计(combined):0..1 连续
  // 得分线性落到组内 N 帧,没有 6 挡这一层。
  const frame = count > 0 ? frameIndexForScore(combined, count) : 0;
  // 数值格式:去掉小数末尾的多余 0(0.30 → 0.3、0.00 → 0),省空间又直观。
  const fmt = (n: number) => Number(n.toFixed(2)).toString();
  // 落帧刻度:直接取「帧数」——0..1 得分 × count 映射到组内帧,与 frameIndexForScore
  // 同一个量纲(见 logic.ts);没有肖像组(count≤1)时退回 MAX_LEVEL 作为兜底刻度。
  const displayScale = count > 1 ? count : MAX_LEVEL;
  // 每路「权重 × 因子」即该维度的加权贡献,四路求和得到 0..1 的加权得分 base,
  // 这正是取帧与推滑杆所依据的真实算式(见 weightedLevel/compositeLevel):
  //   base   = Σ 权重·因子(0..1)
  //   score  = base + 压缩加分(0..1)
  //   frame  = frameIndexForScore(score, count) → 组内第几帧
  // 因子已归一化到 0..1,贡献相加不回缩放,公式可直接与上面的得分/帧核对。
  // 每路只展示计算后的贡献值 权重×因子(0..1);「权重·因子=」的展开放在该路
  // tooltip 里,悬停可核对,正文保持精简。
  const part = (weight: number, factor: number) => fmt(weight * factor);
  // 公式行里给每路加名称短标,方便直接读懂每项是哪个维度。短标随活动语言
  // 中英切换(用量/压力/推理/速度 ↔ Usage/Pressure/Reasoning/Speed)。
  const terms: Array<[string, string, number, number]> = [
    [t ? t("weights.usageShort") : "用量", "usage", w.usage, usageF],
    [t ? t("weights.pressureShort") : "压力", "pressure", w.pressure, pressureF],
    [t ? t("weights.effortShort") : "推理", "effort", w.effort, effortF],
    [t ? t("weights.speedShort") : "速度", "speed", w.speed, speedF],
  ];

  const label = (key: string, fallback: string) => (t ? t(key) : fallback);

  return (
    <div
      className="flash-level-control flash-level-control--composite"
      data-plugin={PACKAGE_ID}
      data-state="ready"
      title={label("driver.composite", "综合加权")}
    >
      <output className="flash-level-control__gauge" aria-hidden="true">
        <span className="flash-level-control__formula" title={`真实算式:得分 = Σ(权重×因子) + 压缩加分,再映射到组内 ${count > 0 ? `${count} 帧` : "帧"}`}>
          {terms.map(([label, id, weight, factor], index) => (
            <Fragment key={id}>
              <span className="flash-level-control__term" title={`${label}:权重 ${fmt(weight)} × 因子 ${fmt(factor)} = 贡献 ${fmt(weight * factor)}`}>
                <b>{label}</b>
                <span className="flash-level-control__part">{part(weight, factor)}</span>
              </span>
              {index < terms.length - 1 && <i className="flash-level-control__plus" title="各维度贡献相加">+</i>}
            </Fragment>
          ))}
          <i className="flash-level-control__eq">=</i>
          <span className="flash-level-control__sum" title={`加权得分 = ${fmt(wBase)} (0..1)`}>{fmt(wBase)}</span>
          {compActive && (
            <Fragment>
              <i className="flash-level-control__plus">+</i>
              <span className="flash-level-control__term flash-level-control__term--bonus" title={`压缩加分 = 加分系数 ${fmt(COMPACTION_SCORE_BONUS)} × 压缩脉冲 ${fmt(compactionF)} = ${fmt(compBonus)}`}>
                <b>{t ? t("weights.compactionShort") : "压缩"}</b>
                <i className="flash-level-control__eq">=</i>
                <span className="flash-level-control__bonus">{fmt(compBonus)}</span>
              </span>
              <i className="flash-level-control__eq">=</i>
              <span className="flash-level-control__sum" title={`最终得分 = 加权 ${fmt(wBase)} + 压缩 ${fmt(compBonus)} = ${fmt(combined)} (0..1)`}>{fmt(combined)}</span>
            </Fragment>
          )}
          {/* 落帧映射的最终结果:只显示当前帧位,不再展示「加权得分 × 帧数」的中间算式。 */}
          <i className="flash-level-control__arrow">→</i>
          <span className="flash-level-control__score" title={`得分 ${fmt(combined * displayScale)} · 帧 ${count > 0 ? `${frame + 1}/${count}` : "—"} (由 ${fmt(combined)} × ${displayScale} 帧映射)`}>
            {label("weights.score", "得分")} {fmt(combined * displayScale)}· {label("weights.frame", "帧")} {count > 0 ? `${frame + 1}/${count}` : "—"}
          </span>
        </span>
      </output>
    </div>
  );
}

interface LocaleFaceLike {
  subscribe(listener: () => void): () => void;
  getSnapshot(): { active: string };
}

interface PortraitSetRowProps {
  scope: PreferenceStore;
  presenter: SkinPresenter;
  /** flash-skin volatile 配置表单（可缺失/未就绪）。 */
  form?: FlashSkinConfigForm<PortraitGroupsConfig> | null;
  /** Host locale service — 渲染期读取活动语言以解析中英文名称。 */
  locale?: LocaleFaceLike | null;
  t: (key: string) => string;
}

// 人物肖像选择行：组的身份（set id + 中英文名称）完全来自可配置的
// portraitGroups，订阅配置表单以实时反映详情页的改名；名称按活动语言在渲染
// 期解析（中文界面中文名、英文界面英文名），语言切换通过 locale face 触发
// 重渲染。未写入过配置时回落单一默认身份（DEFAULT_PORTRAIT_SET）。
function PortraitSetRow({ scope, presenter, form, locale, t }: PortraitSetRowProps) {
  const snapshot = useSyncExternalStore(
    (listener) => scope.subscribe(listener),
    () => scope.getSnapshot(),
  );
  const groupsSnapshot = useSyncExternalStore(
    (listener) => (form?.subscribe ? form.subscribe(listener) : () => undefined),
    () => (form?.getSnapshot ? form.getSnapshot() : undefined),
  );
  const localeSnapshot = useSyncExternalStore(
    (listener) => (locale?.subscribe ? locale.subscribe(listener) : () => undefined),
    () => (locale?.getSnapshot ? locale.getSnapshot() : { active: "" }),
  );
  const [pending, setPending] = useState(false);
  if (!snapshot.enabled) return null;

  const configured =
    groupsSnapshot?.status === "ready"
      ? ((groupsSnapshot.value as { portraitGroups?: readonly PortraitGroupConfig[] } | undefined)?.portraitGroups ?? [])
      : [];
  const sets = (configured.length > 0 ? configured : [DEFAULT_PORTRAIT_SET]).map((set) => ({
    id: set.id,
    label: setDisplayName(set, localeSnapshot.active),
    darkLevel: (set as PortraitGroupConfig).darkLevel,
    frames: setFrames(set),
  }));

  return (
    <section className="flash-portrait-set" data-plugin={PACKAGE_ID}>
      <div className="flash-portrait-set__label">{t("appearance")}</div>
      <div className="flash-appearance-sets" role="radiogroup" aria-label={t("appearance")}>
        {sets.map((set) => {
          const selected = snapshot.set === set.id;
          const frames = set.frames;
          return (
            <button
              type="button"
              key={set.id}
              role="radio"
              aria-checked={selected}
              className={
                selected
                  ? "flash-appearance-choice flash-appearance-choice--on"
                  : "flash-appearance-choice"
              }
              disabled={pending}
              onClick={() => {
                if (pending) return;
                setPending(true);
                void presenter.choose(set.id).catch(() => undefined).finally(() => setPending(false));
              }}
            >
              <span className="flash-appearance-choice__identity">
                <span className="flash-appearance-choice__icon" aria-hidden="true">◈</span>
                <span className="flash-appearance-choice__label">{set.label}</span>
              </span>
              {frames.length > 0 && (
                <span className="flash-appearance-choice__filmstrip" aria-hidden="true">
                  {frames.map((url, index) => (
                    <Fragment key={index}>
                      {index === boundaryForDarkLevel(frames.length, set.darkLevel ?? MAX_LEVEL - 1) && (
                        <span className="flash-appearance-choice__divider" title={t("dividerHint")} />
                      )}
                      <img
                        className="flash-appearance-choice__frame"
                        src={url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        onError={(event) => {
                          // Drop a broken frame from the strip.
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </Fragment>
                  ))}
                  {boundaryForDarkLevel(frames.length, set.darkLevel ?? MAX_LEVEL - 1) >= frames.length && (
                    <span className="flash-appearance-choice__divider" title={t("dividerHint")} />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export const inject = [
  "slots",
  "sessions",
  "modelDirectories",
  "locale",
  "theme",
  "configForms",
];

// The active portrait set must survive both a full client (re)boot and any
// store re-creation. The portrait set is scope-only (never written into the
// host theme preference), so localStorage SET_KEY is the persisted source of
// truth; fall back to the first set when it is absent or stale. Legacy ids
// (storm/blaze/frost) from before the rename are normalized on read.
function restoreInitialSet(): string {
  try {
    // Any persisted set id is honored — configured sets may carry arbitrary ids
    // (the detail page can rename them). Legacy ids (storm/blaze/frost) from
    // before the archive-out are normalized to the default set on read.
    const id = normalizeSetId(localStorage.getItem(SET_KEY));
    if (id) return id;
  } catch {
    // storage may be unavailable
  }
  return DEFAULT_PORTRAIT_SET.id;
}

// Restore the driver mode. A leftover "effort" (the removed 跟随推理 mode)
// falls back to the default composite gauge. New installs default to the full
// composite mode.
function restoreDriver(): DriverMode {
  try {
    const raw = localStorage.getItem(DRIVER_KEY);
    if (raw === "manual" || raw === "composite") return raw;
  } catch {
    // storage may be unavailable
  }
  return "composite";
}

// Restore the left-aligned layout gate. Default ON so existing installs keep
// the requested left-aligned layout unchanged; only an explicit persisted "0"
// returns to the native centered layout.
function restoreLayout(): boolean {
  try {
    return localStorage.getItem(LAYOUT_KEY) !== "0";
  } catch {
    // storage may be unavailable
  }
  return true;
}

function readWeightsState(): { weights: CompositeWeights; tuning: SpeedTuning } {
  const fallback: { weights: CompositeWeights; tuning: SpeedTuning } = {
    weights: { ...DEFAULT_COMPOSITE_WEIGHTS },
    tuning: { ...DEFAULT_SPEED_TUNING },
  };
  try {
    const raw = localStorage.getItem(WEIGHTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CompositeWeights> & Partial<SpeedTuning>;
      const tuning = normalizeTuning(parsed);
      return {
        weights: normalizeWeights(parsed),
        tuning,
      };
    }
  } catch {
    // storage may be unavailable or the JSON may be corrupt
  }
  return fallback;
}

/**
 * Clamp the speed-decay timing parameters to a sane range. A present but
 * non-number / non-finite value falls back to that channel's default.
 */
function normalizeTuning(tuning: Partial<SpeedTuning> | null | undefined): SpeedTuning {
  const clamp = (value: number | undefined, fallback: number): number => (
    Number.isFinite(value) && (value as number) > 0
      ? Math.min(60_000, Math.max(0, value as number))
      : fallback
  );
  // Usage saturation is a token count, speed saturation a rate — different units
  // and ranges than the millisecond grace/fade windows, so clamp them separately.
  const clampPositive = (value: number | undefined, fallback: number, min: number, max: number): number => (
    Number.isFinite(value) && (value as number) > 0
      ? Math.min(max, Math.max(min, value as number))
      : fallback
  );
  return {
    graceMs: clamp(tuning?.graceMs, DEFAULT_SPEED_TUNING.graceMs),
    fadeMs: clamp(tuning?.fadeMs, DEFAULT_SPEED_TUNING.fadeMs),
    usageFull: clampPositive(tuning?.usageFull, DEFAULT_SPEED_TUNING.usageFull, 1, 10_000_000),
    tpsFull: clampPositive(tuning?.tpsFull, DEFAULT_SPEED_TUNING.tpsFull, 100, 1000),
  };
}

function createPreferenceStore(initialSet: string): PreferenceStore {
  let snapshot: SkinSettings = {
    enabled: true,
    set: initialSet ? initialSet : DEFAULT_PORTRAIT_SET.id,
    driver: restoreDriver(),
  };
  const listeners = new Set<() => void>();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== SET_KEY && event.key !== DRIVER_KEY) return;
    const nextSetId = event.key === SET_KEY ? normalizeSetId(event.newValue) : undefined;
    const next = {
      enabled: snapshot.enabled,
      set: event.key === SET_KEY ? (nextSetId ?? snapshot.set) : snapshot.set,
      driver: event.key === DRIVER_KEY && (event.newValue === "manual" || event.newValue === "composite")
        ? event.newValue
        : snapshot.driver,
    };
    if (next.enabled === snapshot.enabled && next.set === snapshot.set && next.driver === snapshot.driver) return;
    snapshot = next;
    for (const listener of listeners) listener();
  };
  window.addEventListener("storage", onStorage);
  const notify = () => {
    for (const listener of listeners) listener();
  };
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async set(enabled) {
      if (enabled === snapshot.enabled) return;
      snapshot = { ...snapshot, enabled };
      notify();
    },
    async setSet(setId) {
      if (!setId || setId === snapshot.set) return;
      try {
        localStorage.setItem(SET_KEY, setId);
      } catch {
        // storage may be unavailable
      }
      snapshot = { ...snapshot, set: setId };
      notify();
    },
    async setDriver(driver) {
      if (driver === snapshot.driver) return;
      try {
        localStorage.setItem(DRIVER_KEY, driver);
      } catch {
        // storage may be unavailable
      }
      snapshot = { ...snapshot, driver };
      notify();
    },
    dispose() {
      window.removeEventListener("storage", onStorage);
      listeners.clear();
    },
  };
}

// LocalStorage-backed store for the four composite weights plus the
// speed-decay timing. Mirrors createPreferenceStore: getSnapshot returns a
// stable reference between changes, and cross-tab edits are honoured via the
// storage event. Writes renormalize weights to sum 1 and clamp the timing
// (invalid input falls back to the defaults).
function createWeightsStore(): WeightsStore {
  let state = readWeightsState();
  const listeners = new Set<() => void>();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== WEIGHTS_KEY) return;
    state = readWeightsState();
    for (const listener of listeners) listener();
  };
  window.addEventListener("storage", onStorage);
  const notify = () => {
    for (const listener of listeners) listener();
  };
  const persist = () => {
    try {
      localStorage.setItem(WEIGHTS_KEY, JSON.stringify({
        ...state.weights,
        ...state.tuning,
      }));
    } catch {
      // storage may be unavailable
    }
  };
  return {
    getSnapshot: () => state.weights,
    getTuning: () => state.tuning,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setWeights(weights) {
      const next = normalizeWeights(weights);
      const same = next.usage === state.weights.usage
        && next.pressure === state.weights.pressure
        && next.effort === state.weights.effort
        && next.speed === state.weights.speed;
      if (same) return;
      state = { ...state, weights: next };
      persist();
      notify();
    },
    setTuning(tuning) {
      const next = normalizeTuning({ ...state.tuning, ...tuning });
      const same = next.graceMs === state.tuning.graceMs
        && next.fadeMs === state.tuning.fadeMs
        && next.usageFull === state.tuning.usageFull
        && next.tpsFull === state.tuning.tpsFull;
      if (same) return;
      state = { ...state, tuning: next };
      persist();
      notify();
    },
    reset() {
      const next = {
        weights: { ...DEFAULT_COMPOSITE_WEIGHTS },
        tuning: { ...DEFAULT_SPEED_TUNING },
      };
      const same = next.weights.usage === state.weights.usage
        && next.weights.pressure === state.weights.pressure
        && next.weights.effort === state.weights.effort
        && next.weights.speed === state.weights.speed
        && next.tuning.graceMs === state.tuning.graceMs
        && next.tuning.fadeMs === state.tuning.fadeMs;
      if (same) return;
      state = next;
      persist();
      notify();
    },
    dispose() {
      window.removeEventListener("storage", onStorage);
      listeners.clear();
    },
  };
}

// -----------------------------------------------------------------------------
// 自定义配置页：肖像皮肤组管理器
//
// 渲染在插件管理页的 plugins.bundle.config 槽位（视图为页面），读写 Host 的
// volatile 设置（entryId: flash-skin）。每次改动都是把整个 portraitGroups
// 数组原子覆写，并带上最近一次快照的修订号作为乐观围栏：若 Host 已推进修订号，
// mutate 会拒绝过期写入，订阅随之把镜像同步回来。
// -----------------------------------------------------------------------------

interface PortraitGroupConfig {
  id: string;
  /** 双语前的兜底显示名（默认在中英文栏留空时回退到这里）。 */
  name: string;
  /** 中文显示名（界面为中文时优先）。 */
  zh?: string;
  /** 英文显示名（界面为英文时优先）。 */
  en?: string;
  images: string[];
  // Per-group slider level (0..MAX_LEVEL) at which this set flips to the dark
  // shell. Absent means the default threshold (MAX_LEVEL - 1).
  darkLevel?: number;
}

type PortraitGroupsConfig = PortraitGroupConfig[];

interface FlashSkinConfigFormSnapshot<T> {
  status: "loading" | "ready" | "unavailable";
  value: T | undefined;
  revision: number | undefined;
  writable: boolean;
}

interface FlashSkinConfigForm<T> {
  getSnapshot(): FlashSkinConfigFormSnapshot<T>;
  subscribe(listener: () => void): () => void;
  mutate(
    ops: readonly { op: "set"; path: readonly string[]; value: unknown }[],
    expectedRevision?: number,
  ): Promise<boolean>;
}

interface FlashSkinConfigCardProps {
  /** 由插件管理页传入的槽位视图。 */
  view?: string;
  /** Host 支持的 "flash-skin" 命名空间配置表单。 */
  form: FlashSkinConfigForm<PortraitGroupsConfig>;
  /** 综合加权模式的四路权重存储。 */
  weights: WeightsStore;
  /** 由插件管理页提供、已绑定到本插件语言命名空间的读取器。 */
  t?: (key: string) => string;
}

const CONFIG_TEXTS: Record<string, Record<string, string>> = {
  zh: {
    "loading": "正在加载…",
    "cardTitle": "Flash 皮肤",
    "cardDesc": "为对话界面应用随推理等级切换的角色肖像皮肤：管理肖像组、等级绑定与综合权重，支持压缩包导入与分享。",
    "readOnly": "当前文档不允许写入，请先开启连接或权限。",
    "openDetails": "Flash皮肤插件配置",
    "openDetailsHint": "在插件管理页打开本插件（dsh-flash-skin）的详情。",
    "empty": "还没有任何肖像皮肤组，从压缩包导入、或手动添加图片来创建一个。",
    "addGroup": "新建皮肤组",
    "renameGroup": "重命名皮肤组",
    "namePlaceholder": "皮肤组名称",
    "deleteGroup": "删除组",
    "moveGroupUp": "上移",
    "moveGroupDown": "下移",
    "moveImageLeft": "左移",
    "moveImageRight": "右移",
    "replaceImage": "替换",
    "removeImage": "移除",
    "viewOriginal": "点击查看原图",
    "closePreview": "关闭预览",
    "addImage": "添加图片",
    "pickLocalImage": "本地选图",
    "pickLocalImageHint": "从本机选择一张图片，自动转为内嵌 base64 填入。",
    "imageUrlPlaceholder": "图片 URL（http/https）",
    "confirm": "确定",
    "cancel": "取消",
    "urlEmpty": "请输入图片 URL",
    "fileNotImage": "请选择图片文件",
    "fileTooLarge": "图片不能超过 2MB",
    "readFailed": "读取图片失败，请重试",
    "defaultGroup": "新的皮肤组",
    "darkLevel": "深浅切换点",
    "darkLevelHint": "用左右箭头逐档移动深浅切换点：箭头左侧为浅色外壳，右侧为深色外壳。",
    "dividerHint": "点击分割线两侧的左右箭头，把深色外壳的起始档位逐档调低或调高。",
    "tooFewImagesHint": "该组仅 {n} 张图片，不足所需的 {min} 张；请继续添加图片，满 {min} 张后即可分享与导出（新建的空组不受此限制）。",
    "dividerLeft": "深色切换点左移一档",
    "dividerRight": "深色切换点右移一档",
    "setId": "标识（Set ID）",
    "setIdPlaceholder": "标识，如 liangsheng",
    "zhName": "中文名称",
    "enName": "英文名称",
    "identityHint": "标识（Set ID）写入 localStorage 持久化当前选择：改名后需重新点击选中该组才生效；设置行名称按界面语言显示（中文界面中文名，英文界面英文名）。内置组的默认中/英文名会在未修改时一直作为缺省显示。",
    "exportGroup": "导出压缩包",
    "exportGroupTitle": "把本组全部图片连同其元数据（标识、中英文名称、深浅切换点）打包下载为一个 .zip 压缩包，可直接再次导入",
    "exportNoImages": "该组没有图片，无可导出",
    "exportTooFew": "该组图片不足 {min} 张（当前 {n} 张），至少满 {min} 张才能导出",
    "exportDownloadFailed": "导出失败：本组有 {n} 张图片，部分图片无法下载，未生成压缩包",
    "exportDone": "已导出压缩包",
    "importGroup": "从压缩包导入新组",
    "importGroupTitle": "选择 .zip / .tar / .tar.gz，把其中所有图片批量导入为一个新组；若压缩包内含 portrait.yaml（或 meta.yaml / 同名 .json）元数据，会一并导入标识、中英文名称与深浅切换点",
    "fileNotZip": "请选择 .zip / .tar / .tar.gz / .gz 压缩包",
    "zipNoImages": "压缩包里没有可用的图片",
    "zipParseFailed": "无法解析压缩包，请确认它是有效的 .zip / .tar / .tar.gz 文件",
    "zipTooManyImages": "单次导入最多 64 张，已截取前 64 张",
    "zipSkippedOversize": "已跳过 {n} 张超过 2MB 的图片",
    "zipTooFewImages": "图片不足：一个皮肤组至少需要 {min} 张图片（当前 {n} 张）",
    "zipImported": "已导入 {n} 张图片，创建了新的皮肤组",
    "zipImportedMeta": "，并按压缩包内元数据设置了标识、中英文名称与深浅切换点",
    "metaImported": "已按清单创建新组（{n} 张在线图片）",
    "importIdConflict": "标识（Set ID）「{id}」已被占用，请换一个唯一标识再导入",
    "importConfirm": "导入",
    "importCancel": "取消",
    "importExamplesTitle": "内置示例包",
    "importExamplesHint": "点击即可把内置示例包导入为一个新组：",
    "importNetTitle": "或从网络导入任意压缩包",
    "netUrlPlaceholder": "粘贴压缩包 URL，或朋友发来的本插件分享文本",
    "importNet": "从网络导入",
    "netEmpty": "请输入要导入的压缩包 URL 或分享文本",
    "zipBadLink": "无法导入：请输入指向 .zip / .tar / .tar.gz 的 http/https 链接",
    "like": "点赞",
    "likeTitle": "为这组肖像点赞",
    "likeCount": "本组获赞 {n} 次",
    "likeSyncFailed": "点赞未同步到社区，已在本机记录",
    "shareGroup": "分享",
    "shareGroupTitle": "把本组图片连同标识、名称、深浅切换点打包成一段自包含文本，可粘贴给任何人直接导入",
    "shareNoImages": "该组没有图片，无可分享",
    "shareTooFew": "该组图片不足 {min} 张（当前 {n} 张），至少满 {min} 张才能分享",
    "sharePacking": "正在打包…",
    "sharePanelTitle": "分享「{name}」",
    "sharePanelHint": "下面这段文本已包含本组的全部图片与元数据，复制后发送给朋友，对方粘贴到导入框即可重建整组。文本较大，请完整复制。",
    "shareCopy": "复制",
    "shareCopied": "已复制，可粘贴给朋友",
    "shareClose": "关闭",
    "shareTooBig": "本组打包后过大，无法生成分享文本",
    "shareFailed": "分享失败：部分图片无法下载",
    "communityTitle": "社区分享",
    "communityBrowse": "社区目录",
    "communityBrowseTitle": "浏览社区分享的肖像组并直接导入（压缩包由分享者自行托管）",
    "communityRefresh": "刷新",
    "communityLoading": "正在获取社区目录…",
    "communityEmpty": "社区还没有分享。点「分享到社区」成为第一个分享者。",
    "communityError": "社区目录暂不可用",
    "communityNotConfigured": "社区目录尚未配置（插件设置中的 communityDirectory），浏览暂不可用；仍可直接把「分享」文本发给朋友。",
    "communityImport": "导入",
    "communityImportTitle": "从该链接导入为一个新组",
    "communityJoin": "分享到社区",
    "communitySubmitTitle": "把本组的文本指针提交进社区目录，供所有人浏览导入",
    "communityFormUrlLabel": "压缩包 URL",
    "communityFormUrlHint": "该压缩包由你自己托管（任意公开 URL）；社区只存这一行文本指针。",
    "communitySubmit": "提交分享",
    "communitySubmitting": "正在提交…",
    "communitySubmitDone": "已提交「{set}」到社区目录",
    "communitySubmitFailed": "提交失败：{message}",
    "communityUrlMissing": "请输入压缩包 URL",
    "communityTampered": "导入已拒绝：该链接指向的压缩包内容与分享时不一致，可能已被改动。",
  },
  en: {
    "loading": "Loading…",
    "cardTitle": "Flash Skin",
    "cardDesc": "Portrait skin for the conversation UI that switches with the reasoning level: manage portrait groups, level bindings and composite weights; import archives and share.",
    "readOnly": "The current document does not accept writes; connect or grant permission first.",
    "openDetails": "Flash Skin plugin settings",
    "openDetailsHint": "Open this plugin's (dsh-flash-skin) detail page in the plugin manager.",
    "empty": "No portrait groups yet — import an archive, or create one from scratch.",
    "addGroup": "New group",
    "renameGroup": "Rename group",
    "namePlaceholder": "Group name",
    "deleteGroup": "Delete group",
    "moveGroupUp": "Move up",
    "moveGroupDown": "Move down",
    "moveImageLeft": "Move left",
    "moveImageRight": "Move right",
    "replaceImage": "Replace",
    "removeImage": "Remove",
    "viewOriginal": "Click to view original",
    "closePreview": "Close preview",
    "addImage": "Add image",
    "pickLocalImage": "Pick local image",
    "pickLocalImageHint": "Choose an image from this device; it is embedded as base64 automatically.",
    "imageUrlPlaceholder": "Image URL (http/https)",
    "confirm": "OK",
    "cancel": "Cancel",
    "urlEmpty": "Enter an image URL",
    "fileNotImage": "Please choose an image file",
    "fileTooLarge": "Image must be 2MB or smaller",
    "readFailed": "Failed to read the image, please retry",
    "defaultGroup": "New group",
    "darkLevel": "Light/dark threshold",
    "darkLevelHint": "Use the arrows to move the light/dark threshold one level at a time: images to their left keep the light shell, images to their right switch to dark.",
    "dividerHint": "Click the arrows beside the divider to raise or lower the slider level at which the dark shell begins.",
    "tooFewImagesHint": "This group has only {n} of the {min} images needed — keep adding frames to enable share/export (a brand-new empty group is exempt).",
    "dividerLeft": "Move threshold left",
    "dividerRight": "Move threshold right",
    "setId": "Set ID (identifier)",
    "setIdPlaceholder": "Identifier, e.g. liangsheng",
    "zhName": "Chinese name",
    "enName": "English name",
    "identityHint": "The Set ID is persisted in localStorage for the current selection — after renaming, click the group again to take effect. The settings row shows the Chinese name in the Chinese UI and the English name in the English UI. Built-in sets keep their default Chinese/English names as fallbacks until overridden.",
    "importGroup": "Import group from archive",
    "importGroupTitle": "Choose a .zip / .tar / .tar.gz; all images inside are batch-imported as a new group. A portrait.yaml (or meta.yaml / matching .json) inside the archive also seeds the group's id, Chinese/English names and light/dark threshold",
    "fileNotZip": "Please choose a .zip / .tar / .tar.gz / .gz archive",
    "zipNoImages": "The archive contains no usable images",
    "zipParseFailed": "Could not parse the archive — make sure it is a valid .zip / .tar / .tar.gz file",
    "zipTooManyImages": "At most 64 images per import; kept the first 64",
    "zipSkippedOversize": "Skipped {n} images over 2MB",
    "zipTooFewImages": "Too few images to import — a portrait group needs at least {min} (currently {n})",
    "zipImported": "Imported {n} images and created a new group",
    "zipImportedMeta": ", and set the id, Chinese/English names and light/dark threshold from the archive metadata",
    "metaImported": "Created a new group from the manifest metadata with {n} image URLs",
    "importIdConflict": "Set ID \"{id}\" is already in use — pick a unique one before importing",
    "importConfirm": "Import",
    "importCancel": "Cancel",
    "importExamplesTitle": "Bundled examples",
    "importExamplesHint": "Click to import a bundled example as a new group:",
    "importNetTitle": "Or import any archive from the network",
    "netUrlPlaceholder": "Paste an archive URL, or a share text a friend sent you",
    "importNet": "Import from network",
    "netEmpty": "Enter the archive URL or share text to import",
    "zipBadLink": "Could not import: please paste an http(s) link to a .zip / .tar / .tar.gz archive",
    "like": "Like",
    "likeTitle": "Like this portrait group",
    "likeCount": "This group has {n} likes",
    "likeSyncFailed": "Like not synced to the community; recorded on this device",
    "shareGroup": "Share",
    "shareGroupTitle": "Package this group's images plus id, names and dark level into a self-contained text anyone can import",
    "shareNoImages": "This group has no images to share",
    "shareTooFew": "This group needs at least {min} images to share (currently {n})",
    "sharePacking": "Packing…",
    "sharePanelTitle": "Share “{name}”",
    "sharePanelHint": "This text already contains every image and all metadata of the group. Copy it and send it to a friend — they paste it into the import field to rebuild the whole group. The text is large, so copy it completely.",
    "shareCopy": "Copy",
    "shareCopied": "Copied — paste it to a friend",
    "shareClose": "Close",
    "shareTooBig": "This group is too large to share as text",
    "shareFailed": "Share failed: some images could not be downloaded",
    "communityTitle": "Community shares",
    "communityBrowse": "Community directory",
    "communityBrowseTitle": "Browse portrait groups shared by the community and import directly (archives are hosted by the sharers themselves)",
    "communityRefresh": "Refresh",
    "communityLoading": "Loading community directory…",
    "communityEmpty": "No community shares yet — press “Share to community” to be the first.",
    "communityError": "Community directory is unavailable",
    "communityNotConfigured": "No community directory is configured (communityDirectory in the plugin settings); browsing is unavailable, but you can still share text to friends directly.",
    "communityImport": "Import",
    "communityImportTitle": "Import from this link as a new group",
    "communityJoin": "Share to community",
    "communitySubmitTitle": "Submit this group's text pointer into the community directory for everyone to browse and import",
    "communityFormUrlLabel": "Archive URL",
    "communityFormUrlHint": "Host this zip yourself (any public URL); the community only stores this one-line text pointer.",
    "communitySubmit": "Submit share",
    "communitySubmitting": "Submitting…",
    "communitySubmitDone": "Submitted “{set}” to the community directory",
    "communitySubmitFailed": "Submit failed: {message}",
    "communityUrlMissing": "Please enter an archive URL",
    "communityTampered": "Import refused: the archive behind this link differs from what was shared and may have been altered.",
    "exportGroup": "Export archive",
    "exportGroupTitle": "Pack all frames plus this group's metadata (id, Chinese/English names, light/dark threshold) into a downloadable .zip that imports straight back",
    "exportNoImages": "This group has no images — nothing to export",
    "exportTooFew": "This group needs at least {min} images to export (currently {n})",
    "exportDownloadFailed": "Export failed: the group has {n} images and some could not be downloaded, so no archive was written",
    "exportDone": "Archive exported",
  },
};

function newGroupId(): string {
  const random = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `group-${random}`;
}

// Local image picker: cap file size so the embedded base64 never blows up the
// persisted config (localStorage-backed settings).
const MAX_LOCAL_IMAGE_BYTES = 2 * 1024 * 1024;

function readLocalFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ── ZIP batch import ────────────────────────────────────────────────────────
// A single ordinal image entry extracted from a ZIP, preserving archive order.
interface ZipImageEntry {
  /** Base filename with its original extension, deduped with a numeric suffix. */
  name: string;
  bytes: Uint8Array;
}

// Guard the embedded base64 so an oversized archive never blows up the
// persisted config (localStorage-backed settings).
const MAX_IMAGES_PER_IMPORT = 64;
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

// Detect the actual image format from magic bytes. The host attachment store
// refuses a declared media type that does not match the bytes, so prefer the
// sniffed format and only fall back to the filename extension map.
function mediaTypeForEntry(name: string, bytes: Uint8Array): string {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50
    && bytes[2] === 0x4e && bytes[3] === 0x47
    && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) {
    return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (bytes.length >= 12
    && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 // RIFF
    && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return "image/webp"; // WEBP
  }
  if (bytes.length >= 6 && (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46
    && (bytes[3] === 0x38 && bytes[4] === 0x37 || bytes[3] === 0x38 && bytes[4] === 0x39) && bytes[5] === 0x61)) {
    return "image/gif"; // GIF87a / GIF89a
  }
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  return MEDIA_TYPE_BY_EXT[ext] ?? "image/png";
}

function readLocalFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

// ── ZIP batch export ────────────────────────────────────────────────────────
// The symmetric inverse of the import: the client re-packs a group's images
// (their attachment-served URLs, network URLs or embedded data URLs) plus a
// portrait.yaml manifest into a .zip that imports straight back into the app.

// File extension a frame gets inside the exported archive. Attachment-served
// URLs carry no extension (only a media-type slug), so sniff the actual bytes
// and fall back to .png.
const EXT_BY_MEDIA_TYPE: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function extensionForImageUrl(url: string, bytes: Uint8Array): string {
  try {
    const path = new URL(url, "http://dsh.local").pathname;
    const dot = path.lastIndexOf(".");
    const ext = dot >= 0 ? path.slice(dot).toLowerCase() : "";
    if (IMAGE_EXTENSIONS.has(ext)) return ext;
  } catch {
    // Not a parseable URL; fall through to sniffing the bytes.
  }
  const type = mediaTypeForEntry(url, bytes);
  return EXT_BY_MEDIA_TYPE[type] ?? ".png";
}

// Decode a `data:` image URL into its raw bytes. Images picked from local disk
// are stored as base64 data URLs in the config, so export must handle them.
function dataUrlToBytes(dataUrl: string): Uint8Array | null {
  const comma = dataUrl.indexOf(",");
  if (comma === -1) return null;
  const meta = dataUrl.slice(0, comma);
  if (!/^data:image\/[a-z0-9.+-]+(?:;[^,]*)?$/i.test(meta)) return null;
  try {
    // atob tolerates whitespace; non-base64 data URLs are not expected here.
    const raw = atob(dataUrl.slice(comma + 1).replace(/\s+/g, ""));
    const bytes = new Uint8Array(raw.length);
    for (let index = 0; index < raw.length; index += 1) bytes[index] = raw.charCodeAt(index);
    return bytes;
  } catch {
    return null;
  }
}

// Fetch one frame's raw bytes for packing. Relative/same-origin URLs (the
// attachment serve route lives on this origin, so it is CORS-free) are fetched
// directly; absolute http(s) URLs go through the server-side network proxy
// route so a remote host's CORS policy can never block the export.
async function fetchExportImageBytes(source: string): Promise<Uint8Array> {
  if (source.startsWith("data:")) {
    const bytes = dataUrlToBytes(source);
    if (bytes && bytes.length > 0) return bytes;
    throw new Error("invalid data URL");
  }
  const isHttp = source.startsWith("http://") || source.startsWith("https://");
  const banner = isHttp ? source : new URL(source, location.href).href;
  const effective = isHttp ? `${REMOTE_ARCHIVE_PATH}?url=${encodeURIComponent(banner)}` : banner;
  const response = await fetch(effective, { headers: { Accept: "image/*" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return new Uint8Array(await response.arrayBuffer());
}

// Normalize a group id / file base into a safe download filename.
function sanitizeExportBase(raw: string): string {
  const base = raw.trim().replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "");
  return (base || "portrait-group").slice(0, 80);
}

// Trigger a browser download for the built archive bytes.
function downloadBytes(bytes: Uint8Array, fileName: string, mediaType: string): void {
  const blob = new Blob([bytes as BlobPart], { type: mediaType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

// Parse a ZIP into its ordered list of file entries (any member type).
// `unzipSync` returns an object whose insertion order mirrors the archive's
// entry order, so the resulting list preserves the user's intended left-to-
// right frame sequence; directory entries and empty members are dropped.
// Image selection/size gating happens afterwards in `collectImages`, and the
// optional metadata manifest is read from this same raw list.
function entriesFromZip(buffer: ArrayBuffer): ZipImageEntry[] {
  const files = unzipSync(new Uint8Array(buffer));
  const entries: ZipImageEntry[] = [];
  for (const raw of Object.keys(files)) {
    const bytes = files[raw];
    if (!bytes || bytes.length === 0) continue;
    entries.push({ name: raw, bytes });
  }
  return entries;
}

// An archive may carry an optional portrait-set manifest. These basenames are
// recognised (case-insensitively); the first entry in archive order that parses
// to usable fields wins.
const PORTRAIT_META_FILES = new Set([
  "portrait.yaml",
  "portrait.yml",
  "portrait.json",
  "meta.yaml",
  "meta.yml",
  "meta.json",
]);

// Scan the raw archive entries for a metadata manifest and normalize its
// portrait-group fields. Returns null when none was found or none could be
// parsed — the import then falls back to the default identity.
function findImportMeta(rawEntries: ZipImageEntry[]): PortraitImportMeta | null {
  for (const raw of rawEntries) {
    const base = raw.name.split("/").pop() ?? raw.name;
    if (!PORTRAIT_META_FILES.has(base.toLowerCase())) continue;
    let text: string;
    try {
      text = new TextDecoder().decode(raw.bytes);
    } catch {
      continue;
    }
    const meta = parseImportMetaText(text);
    if (meta) return meta;
  }
  return null;
}

// Minimal POSIX `tar` reader — fflate does not ship tar, so we parse the simple
// 512-byte-header format ourself. Each entry is `name(100) mode(8) uid(8) gid(8)
// size(12, octal) mtime(12) checksum(8) typeflag(1) ...`, followed by the file
// payload padded to a 512-byte multiple. We only care about regular files
// (`typeflag` "0" or NUL); the rest are skipped.
function parseTar(archive: Uint8Array): ZipImageEntry[] {
  const entries: ZipImageEntry[] = [];
  let offset = 0;
  while (offset + 512 <= archive.length) {
    const header = archive.subarray(offset, offset + 512);
    // Two empty blocks mark the archive end.
    if (isAllZeroes(header)) break;
    const name = decodeTarString(header, 0, 100);
    const typeflag = String.fromCharCode(header[156] ?? 0);
    const sizeOct = decodeTarString(header, 124, 12).trim().split("\0")[0] || "0";
    const size = parseInt(sizeOct, 8) || 0;
    offset += 512;
    if (!name || name === "." || name === "..") {
      offset += Math.ceil(size / 512) * 512;
      continue;
    }
    if (typeflag === "0" || typeflag === "\0" || typeflag === "") {
      const payload = archive.subarray(offset, offset + size);
      if (payload.length === size) entries.push({ name, bytes: new Uint8Array(payload) });
    }
    offset += Math.ceil(size / 512) * 512;
  }
  return entries;
}

// `tar` pads the name field with NUL bytes; decode up to the first NUL, trimmed.
function decodeTarString(bytes: Uint8Array, start: number, length: number): string {
  let end = start;
  while (end < start + length && bytes[end] !== 0) end += 1;
  return new TextDecoder().decode(bytes.subarray(start, end)).trim();
}

function isAllZeroes(bytes: Uint8Array): boolean {
  for (let index = 0; index < bytes.length; index += 1) {
    if (bytes[index] !== 0) return false;
  }
  return true;
}

// Decompress a possibly-gzipped byte buffer. `.gz`/`.tar.gz` payloads are the
// SEC6 gzip format; anything else is passed through untouched.
function maybeGunzip(bytes: Uint8Array): Uint8Array {
  if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
    return gunzipSync(bytes);
  }
  return bytes;
}

// Normalize an archive back into an ordered list of image candidates (shared by
// zip and tar) with a per-file size guard against oversized embedded images.
function collectImages(rawEntries: ZipImageEntry[]): { entries: ZipImageEntry[]; skippedOversize: number } {
  const entries: ZipImageEntry[] = [];
  const nameCounts = new Map<string, number>();
  let skippedOversize = 0;
  for (const rawEntry of rawEntries) {
    if (entries.length >= MAX_IMAGES_PER_IMPORT) break;
    const base = rawEntry.name.split("/").pop() ?? rawEntry.name;
    if (!base || /^\./.test(base)) continue;
    const dot = base.lastIndexOf(".");
    if (dot < 0) continue;
    const ext = base.slice(dot).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;
    if (rawEntry.bytes.length > MAX_LOCAL_IMAGE_BYTES) {
      skippedOversize += 1;
      continue;
    }
    const stem = base.slice(0, dot);
    const used = nameCounts.get(base) ?? 0;
    nameCounts.set(base, used + 1);
    entries.push({ name: used === 0 ? base : `${stem}-${used + 1}${ext}`, bytes: rawEntry.bytes });
  }
  return { entries, skippedOversize };
}

// Dispatch an imported archive file by extension to the right decompressor.
// Returns the ordered valid-image list (plus how many images were skipped for
// being too large — the only parts the caller turns into UI messages) together
// with any portrait-set metadata the archive carries.
function extractArchive(fileName: string, buffer: ArrayBuffer): {
  entries: ZipImageEntry[];
  skippedOversize: number;
  meta: PortraitImportMeta | null;
} {
  const lower = fileName.toLowerCase();
  let rawEntries: ZipImageEntry[];
  if (lower.endsWith(".zip")) {
    rawEntries = entriesFromZip(buffer);
  } else if (lower.endsWith(".tar.gz") || lower.endsWith(".tgz")) {
    const bytes = maybeGunzip(new Uint8Array(buffer));
    rawEntries = parseTar(bytes);
  } else if (lower.endsWith(".tar")) {
    rawEntries = parseTar(new Uint8Array(buffer));
  } else if (lower.endsWith(".gz") || lower.endsWith(".gzip")) {
    const bytes = maybeGunzip(new Uint8Array(buffer));
    rawEntries = [{ name: fileName.replace(/\.(gz|gzip)$/i, ""), bytes }];
  } else {
    rawEntries = [];
  }
  const collected = collectImages(rawEntries);
  return {
    entries: collected.entries,
    skippedOversize: collected.skippedOversize,
    meta: findImportMeta(rawEntries),
  };
}


// Chunked bytes→base64. A single String.fromCharCode(...bytes) spreads into the
// call stack and overflows for multi-megabyte frames, so encode in 0x8000-byte
// pieces like Uint8Array.prototype.toBase64 implementations do.
function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

// Push one ≤16-image batch to the host attachments store and return the
// content-addressed serve URLs. Throws on any transport/HTTP failure so the
// caller can fall back to the import-failed notice (the host may expose no
// attachments store at all: the upload route answers 503).
async function postImageBatch(
  batch: ZipImageEntry[],
): Promise<string[]> {
  const images = batch.map((entry) => ({
    name: entry.name,
    mediaType: mediaTypeForEntry(entry.name, entry.bytes),
    data: bytesToBase64(entry.bytes),
  }));
  const response = await fetch(ATTACHMENT_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images }),
  });
  if (!response.ok) throw new Error(`attachment upload ${response.status}`);
  const payload = (await response.json()) as { images?: { name?: string; url: string }[] };
  const urls = Array.isArray(payload.images)
    ? payload.images.map((entry) => entry.url).filter((url) => typeof url === "string" && url.length > 0)
    : [];
  if (urls.length !== images.length) throw new Error("attachment upload truncated");
  return urls;
}

// Upload all archive-extracted images in ordered batches, preserving entry
// order in the returned URL list (which becomes `portraitGroups.images[]`).
async function uploadArchiveImages(entries: ZipImageEntry[]): Promise<string[]> {
  const urls: string[] = [];
  for (let start = 0; start < entries.length; start += MAX_UPLOAD_IMAGES_PER_BATCH) {
    const urlsForBatch = await postImageBatch(entries.slice(start, start + MAX_UPLOAD_IMAGES_PER_BATCH));
    urls.push(...urlsForBatch);
  }
  return urls;
}

// The light/dark boundary for a group: with `count` images there are
// `count + 1` boundaries, and darkLevel (0..MAX_LEVEL) is the slider stop at
// which the set goes dark, so the boundary position maps linearly onto the
// slider stops.
function boundaryForDarkLevel(count: number, level: number): number {
  if (count <= 0) return 0;
  return Math.min(count, Math.max(0, Math.round((level / MAX_LEVEL) * count)));
}

// When「Flash皮肤插件配置」opens the plugin-manager detail page, the host cannot
// pass a "jump to config" hint through pluginNavigation.openBundle (its only API).
// So the button sets this module-level flag right before navigating; the config
// card consults it on mount (the page builds the config section fresh on each
// entry) and auto-expands + scrolls into view exactly once, then clears it.
let expandConfigOnNextMount = false;

function FlashSkinConfigCard({ form, weights, t: localeT }: FlashSkinConfigCardProps) {
  const snapshot = useSyncExternalStore(
    (listener) => form.subscribe(listener),
    () => form.getSnapshot(),
  );
  const weightSnapshot = useSyncExternalStore(
    (listener) => weights.subscribe(listener),
    () => weights.getSnapshot(),
  );
  const tuningSnapshot = useSyncExternalStore(
    (listener) => weights.subscribe(listener),
    () => weights.getTuning(),
  );
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<{
    kind: "id" | "zh" | "en" | "add" | "replace";
    groupIndex: number;
    imageIndex?: number;
    value: string;
  } | null>(null);
  // Hidden <input type=file> backing the "本地选图" buttons; pendingPick records
  // which slot the picked image should land in (add → append, replace → swap).
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingPick = useRef<{ kind: "add" | "replace"; groupIndex: number; imageIndex?: number } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  // Whether the config card body is collapsed. Defaults to collapsed so the
  // plugin detail page shows only a compact header until the user expands it
  // (collapsing the whole card, not just the weights grid). Not persisted:
  // each entry into the page starts collapsed — unless「Flash皮肤插件配置」was
  // the entry (openDetails sets expandConfigOnNextMount), in which case it
  // starts expanded and is scrolled into view, once.
  const [collapsed, setCollapsed] = useState(() => {
    const expand = expandConfigOnNextMount;
    expandConfigOnNextMount = false;
    return !expand;
  });
  const cardRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!collapsed) cardRef.current?.scrollIntoView({ block: "nearest" });
  }, [collapsed, cardRef]);
  // An imported archive whose manifest id collides with an existing group
  // pauses in `pendingImport` so the user can confirm a unique id before it
  // takes effect, instead of silently appending a `-2`/`-3` suffix.
  const [pendingImport, setPendingImport] = useState<{
    images: string[];
    meta: PortraitImportMeta;
    originalId: string;
    draftId: string;
    notice: string;
  } | null>(null);
  // URL of the image currently shown full-size in the preview lightbox (null
  // when the lightbox is closed). Clicking a portrait thumbnail opens it.
  const [preview, setPreview] = useState<string | null>(null);
  // Has the user seen the lightbox before? Drives a one-time "点击查看原图" hint
  // on the thumbnails (harmless, dismissible, not persisted).
  const [hintSeen, setHintSeen] = useState(() =>
    typeof localStorage !== "undefined" ? localStorage.getItem("flash-skin:preview-hint-seen") === "1" : false,
  );
  const markHintSeen = () => {
    if (hintSeen) return;
    setHintSeen(true);
    try {
      localStorage.setItem("flash-skin:preview-hint-seen", "1");
    } catch {
      // localStorage 不可用时仅本次会话不再重复提示。
    }
  };

  // ── Likes ─────────────────────────────────────────────────────────────────
  // Per-device like bookkeeping reconciled with the server's community totals
  // as max(local, community) — a group we liked shows ≥1 even while offline or
  // before the like round-trips. This route is read-only w.r.t. the config
  // document, so liking is allowed even when it is not writable.
  const [likedById, setLikedById] = useState<Record<string, boolean>>(() => readLikedStore());
  const [communityLikes, setCommunityLikes] = useState<Record<string, number>>({});
  const [likesError, setLikesError] = useState<string | null>(null);
  const isLikedById = (groupId: string) => !!likedById[groupId];
  const likeCountFor = (groupId: string) => mergeLikeCount(isLikedById(groupId), communityLikes[groupId]);

  // One-shot best-effort fetch of community like totals on mount.
  useEffect(() => {
    let cancelled = false;
    fetch(LIKES_PATH)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: unknown) => {
        if (cancelled || !payload || typeof payload !== "object") return;
        const counts = (payload as { counts?: unknown }).counts;
        if (counts && typeof counts === "object") {
          const normalized: Record<string, number> = {};
          for (const [key, value] of Object.entries(counts)) {
            if (typeof value === "number" && Number.isFinite(value) && value > 0) normalized[key] = value;
          }
          setCommunityLikes(normalized);
        }
      })
      .catch(() => {
        // Offline / first run: local bookkeeping stays authoritative, never throw.
      });
    return () => { cancelled = true; };
  }, []);

  const toggleLike = async (groupIndex: number) => {
    const group = groups[groupIndex];
    if (!group || busy) return;
    const next = !likedById[group.id];
    setLikedById((prev) => writeLikedStore({ ...prev, [group.id]: next }));
    setLikesError(null);
    try {
      const response = await fetch(LIKE_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: group.id }),
      });
      const payload = (await response.json().catch(() => null)) as { count?: unknown } | null;
      if (payload && typeof payload === "object" && typeof payload.count === "number") {
        setCommunityLikes((prev) => ({ ...prev, [group.id]: payload.count as number }));
      }
    } catch {
      setLikesError(t("likeSyncFailed"));
    }
  };

  // ── C1 share panel ────────────────────────────────────────────────────────
  // Packs one group (images + identity manifest) into a self-contained text the
  // user copies out; read-only, so it works even when the document is not
  // writable. The same packing also feeds the C2 community submit below.
  const [shareFor, setShareFor] = useState<{ index: number; name: string } | null>(null);
  const [shareText, setShareText] = useState("");
  const [sharePhase, setSharePhase] = useState<"idle" | "packing" | "ready">("idle");
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const shareGroup = async (groupIndex: number) => {
    const group = groups[groupIndex];
    if (!group) return;
    if (group.images.length === 0) {
      setShareFor({ index: groupIndex, name: group.name || group.id });
      setSharePhase("ready");
      setShareText("");
      setShareNotice(t("shareNoImages"));
      setShareCopied(false);
      return;
    }
    if (group.images.length < PORTRAIT_IMPORT_MIN_IMAGES) {
      setShareFor({ index: groupIndex, name: group.name || group.id });
      setSharePhase("ready");
      setShareText("");
      setShareNotice(
        t("shareTooFew")
          .replace("{min}", String(PORTRAIT_IMPORT_MIN_IMAGES))
          .replace("{n}", String(group.images.length)),
      );
      setShareCopied(false);
      return;
    }
    setShareFor({ index: groupIndex, name: group.name || group.id });
    setSharePhase("packing");
    setShareText("");
    setShareNotice(null);
    setShareCopied(false);
    try {
      const frames: { bytes: Uint8Array; ext: string }[] = [];
      for (const source of group.images) {
        try {
          const bytes = await fetchExportImageBytes(source);
          frames.push({ bytes, ext: extensionForImageUrl(source, bytes) });
        } catch {
          setSharePhase("ready");
          setShareNotice(t("shareFailed"));
          return;
        }
      }
      const entries: Record<string, Uint8Array | [Uint8Array, { level: number }]> = {
        "portrait.yaml": [strToU8(buildPortraitManifest(group)), { level: 6 }],
      };
      frames.forEach((frame, index) => {
        entries[`${index}${frame.ext}`] = frame.bytes;
      });
      const text = buildShareText(zipSync(entries, { level: 6 }), group);
      if (!text) {
        setSharePhase("ready");
        setShareNotice(t("shareTooBig"));
        return;
      }
      setShareText(text);
      setSharePhase("ready");
    } catch {
      setSharePhase("ready");
      setShareNotice(t("shareFailed"));
    }
  };

  const copyShare = async () => {
    if (!shareText) return;
    if (await copyTextToClipboard(shareText)) setShareCopied(true);
  };

  // ── C2 community directory + submit ───────────────────────────────────────
  const [communityOpen, setCommunityOpen] = useState(false);
  const [communityPhase, setCommunityPhase] = useState<"idle" | "loading" | "ready">("idle");
  const [communityEntries, setCommunityEntries] = useState<CommunityEntry[]>([]);
  const [communityError, setCommunityError] = useState<string | null>(null);
  const [communityNotConfigured, setCommunityNotConfigured] = useState(false);
  const [submitUrl, setSubmitUrl] = useState("");
  const [submitPhase, setSubmitPhase] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const fetchCommunity = async () => {
    setCommunityPhase("loading");
    setCommunityError(null);
    setCommunityNotConfigured(false);
    try {
      const response = await fetch(COMMUNITY_PATH);
      const payload = (await response.json().catch(() => null)) as
        | { configured?: unknown; entries?: unknown; error?: { code?: string } | null }
        | null;
      if (!payload || typeof payload !== "object") {
        setCommunityError(t("communityError"));
        return;
      }
      setCommunityNotConfigured(payload.configured !== true && !payload.error);
      setCommunityEntries(
        Array.isArray(payload.entries)
          ? (payload.entries.filter(
              (entry): entry is CommunityEntry =>
                typeof entry === "object" && entry !== null &&
                typeof (entry as CommunityEntry).setId === "string" &&
                typeof (entry as CommunityEntry).url === "string" &&
                typeof (entry as CommunityEntry).entryId === "string",
            ))
          : [],
      );
      if (payload.error) setCommunityError(t("communityError"));
    } catch {
      setCommunityError(t("communityError"));
    } finally {
      setCommunityPhase("ready");
    }
  };

  useEffect(() => {
    if (communityOpen && communityPhase === "idle") void fetchCommunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityOpen, communityPhase]);

  const importCommunityEntry = (entry: CommunityEntry) => {
    void importFromUrl(entry.url, (entry.md5 ?? "").trim() || undefined);
  };

  const submitCommunityShare = async (groupIndex: number) => {
    const group = groups[groupIndex];
    const url = submitUrl.trim();
    if (!group) return;
    if (!url) {
      setSubmitPhase("error");
      setSubmitMessage(t("communityUrlMissing"));
      return;
    }
    setSubmitPhase("submitting");
    setSubmitMessage(null);
    try {
      const response = await fetch(COMMUNITY_SUBMIT_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setId: group.id, url }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: unknown; entry?: { setId?: unknown }; error?: { code?: string; message?: string } }
        | null;
      if (payload && payload.ok) {
        const setId = payload.entry && typeof payload.entry.setId === "string" ? payload.entry.setId : group.id;
        setSubmitPhase("done");
        setSubmitMessage(t("communitySubmitDone").replace("{set}", setId));
      } else {
        const code = payload?.error?.code;
        const message = payload?.error?.message;
        setSubmitPhase("error");
        // Prefer a server-provided detail message, else fall back to the code.
        setSubmitMessage(t("communitySubmitFailed").replace("{message}", message || (code && code !== "internal" ? code : t("communityError"))));
      }
    } catch {
      setSubmitPhase("error");
      setSubmitMessage(t("communitySubmitFailed").replace("{message}", t("communityError")));
    }
  };

  const t = (key: string): string => {
    if (typeof localeT === "function") return localeT(key);
    return CONFIG_TEXTS.en[key] ?? key;
  };

  const groups = snapshot.value?.portraitGroups ?? [];
  const ready = snapshot.status === "ready";
  const writable = snapshot.writable;

  const commit = async (next: PortraitGroupsConfig, expectedRevision?: number) => {
    if (busy) return;
    setBusy(true);
    try {
      await form.mutate(
        [{ op: "set", path: ["portraitGroups"], value: next }],
        expectedRevision ?? snapshot.revision,
      );
    } catch {
      // 传输失败：订阅会把 Host 镜像重新同步回来
    } finally {
      setBusy(false);
      setEditing(null);
    }
  };

  if (!ready) {
    return (
      <section className="flash-portrait-groups" data-plugin={PACKAGE_ID} data-state="loading">
        <p className="flash-portrait-groups__notice flash-portrait-groups__notice--root">{t("loading")}</p>
      </section>
    );
  }

  const withGroup = (groupIndex: number, update: (group: PortraitGroupConfig) => PortraitGroupConfig) => {
    const next = groups.slice();
    next[groupIndex] = update(next[groupIndex]);
    return next;
  };

  // Click-driven threshold: move the light/dark boundary with the left/right
  // arrows that flank the divider. No mouse drag. darkLevel advances by the
  // group's per-image gap (`dividerStepFor`), so on >7-frame groups the divider
  // moves exactly one cell at a time instead of snapping over intermediate
  // cells; small groups keep the historical one-integer-stop step. The value is
  // continuous in 0..MAX_LEVEL (persisted as-is) and its boundary is clamped.
  const stepDivider = (groupIndex: number, delta: -1 | 1) => {
    if (!writable || busy) return;
    const group = groups[groupIndex];
    const current = group?.darkLevel ?? MAX_LEVEL - 1;
    const next = nextDividerLevel(current, delta, group?.images.length ?? 0);
    if (next !== current) {
      void commit(withGroup(groupIndex, (g) => ({ ...g, darkLevel: next })));
    }
  };

  // The light/dark divider for one group: two arrow buttons flanking the
  // handle, plus the handle itself. Render it wherever the threshold lands —
  // between images, after the last image at the far-right edge, or as a
  // still-usable placeholder on a brand-new (image-less) group so the
  // threshold control is always present and adjustable.
  const renderDivider = (dividerKey: string | number, groupIndex: number, effectiveDark: number) => (
    <li
      key={dividerKey}
      className="flash-portrait-group__divider"
      aria-label={t("darkLevel")}
      title={t("darkLevelHint")}
    >
      <button
        type="button"
        className="flash-portrait-group__divider-arrow"
        aria-label={t("dividerLeft")}
        disabled={!writable || busy || effectiveDark <= 0}
        onClick={() => stepDivider(groupIndex, -1)}
      >
        ◀
      </button>
      <span className="flash-portrait-group__divider-handle" aria-hidden="true" />
      <button
        type="button"
        className="flash-portrait-group__divider-arrow"
        aria-label={t("dividerRight")}
        disabled={!writable || busy || effectiveDark >= MAX_LEVEL}
        onClick={() => stepDivider(groupIndex, +1)}
      >
        ▶
      </button>
    </li>
  );

  const commitField = (groupIndex: number, kind: "id" | "zh" | "en", raw: string) => {
    const trimmed = raw.trim();
    const group = groups[groupIndex];
    if (!group) return;
    // The set id must stay non-empty: it drives persistence and the portrait
    // source lookup. Empty zh/en values just remove the override (fall back to
    // the built-in default names, then `name`).
    if (kind === "id" && trimmed === "") return;
    const def = defaultSetIdentity(group.id);
    if (
      (kind === "id" && trimmed === group.id) ||
      (kind === "zh" && trimmed === (group.zh?.trim() ?? def?.zh ?? group.name)) ||
      (kind === "en" && trimmed === (group.en?.trim() ?? def?.en ?? group.name))
    ) return;
    const next = withGroup(groupIndex, (g) => {
      if (kind === "id") return { ...g, id: trimmed };
      if (kind === "zh") return { ...g, zh: trimmed || undefined };
      return { ...g, en: trimmed || undefined };
    });
    void commit(next);
  };

  const deleteGroup = (groupIndex: number) => {
    void commit(groups.filter((_, index) => index !== groupIndex));
  };

  // Pack a group's images plus its identity/threshold manifest into a .zip and
  // download it. Read-only (no config mutation), so it works even when the
  // document is not writable. Fails as a whole rather than emitting a partial
  // archive that would silently drop frames on re-import.
  const exportGroup = async (groupIndex: number) => {
    const group = groups[groupIndex];
    if (!group) return;
    if (group.images.length === 0) {
      setFileError(t("exportNoImages"));
      return;
    }
    if (group.images.length < PORTRAIT_IMPORT_MIN_IMAGES) {
      setFileError(
        t("exportTooFew")
          .replace("{min}", String(PORTRAIT_IMPORT_MIN_IMAGES))
          .replace("{n}", String(group.images.length)),
      );
      return;
    }
    setBusy(true);
    try {
      const frames: { bytes: Uint8Array; ext: string }[] = [];
      for (const source of group.images) {
        try {
          const bytes = await fetchExportImageBytes(source);
          frames.push({ bytes, ext: extensionForImageUrl(source, bytes) });
        } catch {
          setFileError(t("exportDownloadFailed").replace("{n}", String(group.images.length)));
          return;
        }
      }
      const entries: Record<string, Uint8Array | [Uint8Array, { level: number }]> = {
        "portrait.yaml": [strToU8(buildPortraitManifest(group)), { level: 6 }],
      };
      frames.forEach((frame, index) => {
        entries[`${index}${frame.ext}`] = frame.bytes;
      });
      // Synchronous zip build; with ≤64 sub-2MB frames this is comfortably fast.
      const zipped = zipSync(entries, { level: 6 });
      downloadBytes(zipped, `${sanitizeExportBase(group.id)}.zip`, "application/zip");
      // Shown on the card's single status line, just like import success.
      setFileError(t("exportDone"));
    } finally {
      setBusy(false);
    }
  };

  const addGroup = () => {
    // 新建组的默认中英文名各自取固定文案，而不是界面当前语言的 t() 单值：
    // 否则英文界面新建时 zh 也会被记为 "New group"，切回中文界面后设置行就显示英文名。
    const next = [...groups, {
      id: newGroupId(),
      name: CONFIG_TEXTS.zh.defaultGroup,
      zh: CONFIG_TEXTS.zh.defaultGroup,
      en: CONFIG_TEXTS.en.defaultGroup,
      images: [],
    }];
    void commit(next);
  };

  const moveGroup = (groupIndex: number, delta: -1 | 1) => {
    const targetIndex = groupIndex + delta;
    const target = groups[targetIndex];
    if (target === undefined) return;
    const next = groups.slice();
    next[groupIndex] = target;
    next[targetIndex] = groups[groupIndex];
    void commit(next);
  };

  const addImage = (groupIndex: number, url: string) => {
    const trimmed = url.trim();
    if (trimmed === "") return;
    const next = withGroup(groupIndex, (group) => ({ ...group, images: [...group.images, trimmed] }));
    void commit(next);
  };

  const removeImage = (groupIndex: number, imageIndex: number) => {
    const next = withGroup(groupIndex, (group) => ({
      ...group,
      images: group.images.filter((_, index) => index !== imageIndex),
    }));
    void commit(next);
  };

  const moveImage = (groupIndex: number, imageIndex: number, delta: -1 | 1) => {
    const targetIndex = imageIndex + delta;
    const images = groups[groupIndex]?.images;
    const target = images?.[targetIndex];
    if (target === undefined) return;
    const next = withGroup(groupIndex, (group) => {
      const nextImages = group.images.slice();
      nextImages[imageIndex] = target;
      nextImages[targetIndex] = group.images[imageIndex];
      return { ...group, images: nextImages };
    });
    void commit(next);
  };

  const replaceImage = (groupIndex: number, imageIndex: number, url: string) => {
    const trimmed = url.trim();
    if (trimmed === "") return;
    const next = withGroup(groupIndex, (group) => ({
      ...group,
      images: group.images.map((src, index) => (index === imageIndex ? trimmed : src)),
    }));
    void commit(next);
  };

  const openLocalPicker = (kind: "add" | "replace", groupIndex: number, imageIndex?: number) => {
    if (!writable || busy) return;
    pendingPick.current = { kind, groupIndex, imageIndex };
    fileInputRef.current?.click();
  };

  const onFileInputChange = async (event: ReactChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    // Reset so picking the same file again re-triggers change.
    input.value = "";
    if (file === undefined) return;
    const pick = pendingPick.current;
    pendingPick.current = null;
    if (!pick) return;
    if (!file.type.startsWith("image/")) {
      setFileError(t("fileNotImage"));
      return;
    }
    if (file.size > MAX_LOCAL_IMAGE_BYTES) {
      setFileError(t("fileTooLarge"));
      return;
    }
    try {
      const dataUrl = await readLocalFile(file);
      setFileError(null);
      if (pick.kind === "replace" && pick.imageIndex !== undefined) {
        replaceImage(pick.groupIndex, pick.imageIndex, dataUrl);
      } else {
        addImage(pick.groupIndex, dataUrl);
      }
    } catch {
      setFileError(t("readFailed"));
    }
  };

  // ── Archive batch import ──────────────────────────────────────────────────
  // A second hidden <input type=file> accepts `.zip`, `.tar`, `.tar.gz` (and
  // bare `.gz`) archives. The archive is inflated client-side (vendored fflate
  // for zip/gzip, plus a tiny built-in tar reader); every valid image inside is
  // uploaded to the host attachments store, which persists the file and returns
  // a content-addressed serve URL. The config keeps only those URL refs, never
  // the raw bytes, so `portraitGroups.images[]` stays URL-only like the
  // built-in sets. Batch order mirrors the archive entry order.
  const archiveInputRef = useRef<HTMLInputElement | null>(null);

  const importArchive = () => {
    if (!writable || busy) return;
    archiveInputRef.current?.click();
  };

  // Seed a new group from an imported archive. The (optional) archive manifest
  // provides the set id, Chinese/English names and light/dark threshold; any
  // absent field falls back to the built-in defaults, and the id always stays
  // non-empty and unique among the existing groups. Import-time id conflicts
  // are surfaced for the user to resolve first (see onArchiveInputChange) —
  // this loop is a belt-and-braces dedupe for any id passed straight through,
  // and archives without a manifest id get an auto-generated one. Imported
  // values are just seeded defaults — the group remains fully editable
  // afterwards like any other.
  const insertImportedGroup = (images: string[], meta?: PortraitImportMeta) => {
    const defaultZh = CONFIG_TEXTS.zh.defaultGroup;
    const defaultEn = CONFIG_TEXTS.en.defaultGroup;
    const baseId = meta?.id && meta.id.length > 0 ? meta.id : newGroupId();
    const existingIds = new Set(groups.map((group) => group.id));
    let id = baseId;
    for (let suffix = 2; existingIds.has(id); suffix += 1) {
      id = `${baseId}-${suffix}`;
    }
    const zh = meta?.zh || defaultZh;
    const en = meta?.en || defaultEn;
    const next: PortraitGroupsConfig = [...groups, {
      id,
      name: zh,
      zh,
      en,
      darkLevel: meta?.darkLevel ?? MAX_LEVEL - 1,
      images,
    }];
    void commit(next);
  };

  const onArchiveInputChange = async (event: ReactChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    // Reset so picking the same archive again re-triggers change.
    input.value = "";
    if (file === undefined) return;
    if (!ARCHIVE_EXT_RE.test(file.name)) {
      setFileError(t("fileNotZip"));
      return;
    }
    let buffer: ArrayBuffer;
    try {
      buffer = await readLocalFileAsArrayBuffer(file);
    } catch {
      setFileError(t("zipParseFailed"));
      return;
    }
    await runArchiveImport(file.name, buffer);
  };

  // Shared engine for every archive-import source in the card: local picker,
  // bundled examples and pasted network URLs all funnel into this so they
  // behave identically (same parse, same upload, same conflict handling).
  // Handles the parse → upload → insert pipeline and any error/conflict notice.
  const runArchiveImport = async (
    name: string,
    buffer: ArrayBuffer,
    shareMeta?: PortraitGroupManifestSource,
  ) => {
    if (!writable || busy) return;
    setBusy(true);
    try {
      let entries: ZipImageEntry[];
      let skippedOversize: number;
      let meta: PortraitImportMeta | null = null;
      try {
        const parsed = extractArchive(name, buffer);
        entries = parsed.entries;
        skippedOversize = parsed.skippedOversize;
        meta = parsed.meta;
      } catch {
        setFileError(t("zipParseFailed"));
        return;
      }
      // A pasted C1 share line carries the original group's settings verbatim in
      // its header manifest — including the raw (possibly non-integer, fine-grained)
      // light/dark threshold that the archive's rounded portrait.yaml would blur to
      // the nearest slider stop. Prefer the header so a share → import round-trip
      // restores the divider exactly where it was on the exporting device. Any
      // archive-side metadata (e.g. a URL-only `images:` seed list) still merges in.
      if (shareMeta) {
        meta = { ...shareMeta, ...(meta ?? {}) };
      }
      // The manifest may carry `images:` URLs to seed the group when the archive
      // itself ships no embedded frames (a tiny, URL-only manifest archive).
      // When the archive does carry frames those always win — the manifest list
      // is only a fallback for archives that contain no bytes at all.
      const manifestImages = meta?.images ?? [];
      if (entries.length === 0 && manifestImages.length === 0) {
        setFileError(
          skippedOversize > 0
            ? t("zipSkippedOversize").replace("{n}", String(skippedOversize))
            : t("zipNoImages"),
        );
        return;
      }
      try {
        let images: string[];
        let notice: string;
        if (entries.length > 0) {
          // Upload the extracted frames to the host attachments store; the server
          // persists each file and replies with content-addressed serve URLs that
          // we store as plain image refs (config never carries the raw bytes).
          images = await uploadArchiveImages(entries);
          notice = t("zipImported").replace("{n}", String(images.length));
        } else {
          // No embedded frames — seed the group straight from the manifest's
          // URL list (kept URL-only like every other group's images).
          images = manifestImages;
          notice = t("metaImported").replace("{n}", String(images.length));
        }
        if (meta) {
          notice += " " + t("zipImportedMeta");
        }
        if (skippedOversize > 0) {
          notice += " " + t("zipSkippedOversize").replace("{n}", String(skippedOversize));
        }
        // Reject external imports that carry fewer frames than a meaningful
        // portrait group needs (>= PORTRAIT_IMPORT_MIN_IMAGES). The brand-new
        // empty placeholder group is exempt: it is grown locally frame by frame.
        if (images.length < PORTRAIT_IMPORT_MIN_IMAGES) {
          setFileError(
            t("zipTooFewImages")
              .replace("{min}", String(PORTRAIT_IMPORT_MIN_IMAGES))
              .replace("{n}", String(images.length)),
          );
          return;
        }
        if (meta?.id && groups.some((group) => group.id === meta.id)) {
          // The manifest's set id collides with an existing group: surface the
          // conflict and let the user confirm a unique id, rather than silently
          // renaming it. The uploaded images are kept until then.
          setPendingImport({
            images,
            meta,
            originalId: meta.id,
            draftId: suggestUniqueId(meta.id),
            notice,
          });
          return;
        }
        insertImportedGroup(images, meta ?? undefined);
        setFileError(notice);
      } catch {
        setFileError(t("zipParseFailed"));
      } finally {
        setBusy(false);
      }
    } finally {
      setBusy(false);
    }
  };

  // Fetch and import an archive from a pasted http(s) URL, or decode a pasted
  // C1 share text. The URL fetch goes through the server-side proxy route so a
  // hosting site's CORS policy never blocks the request; both paths sink into
  // the same engine as a local pick. Read-only, so imports work even when the
  // document is not writable — the group is staged for a later save.
  const importFromUrl = async (rawUrl: string, expectedMd5?: string) => {
    if (!writable || busy) return;
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      setFileError(t("netEmpty"));
      return;
    }
    // A C1 share line carries the whole archive inline; rebuild from its bytes
    // instead of fetching anything. Guarded here (not in the UI) so both the
    // network input and the community panel accept a share paste.
    const share = parseShareText(trimmed);
    if (share) {
      const slug = (share.manifest.id || "").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
      const name = `${slug || "share"}.zip`;
      setFileError(null);
      setBusy(true);
      try {
        const zipBytes = share.zip;
        const buffer = new ArrayBuffer(zipBytes.byteLength);
        new Uint8Array(buffer).set(zipBytes);
        await runArchiveImport(name, buffer, share.manifest);
      } catch {
        setFileError(t("zipParseFailed"));
      } finally {
        setBusy(false);
      }
      return;
    }
    let name: string;
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setFileError(t("zipBadLink"));
        return;
      }
      name = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() ?? "");
    } catch {
      setFileError(t("zipBadLink"));
      return;
    }
    if (!ARCHIVE_EXT_RE.test(name)) {
      setFileError(t("zipBadLink"));
      return;
    }
    setFileError(null);
    setBusy(true);
    try {
      const response = await fetch(`${REMOTE_ARCHIVE_PATH}?url=${encodeURIComponent(trimmed)}`);
      if (!response.ok) throw new Error(`archive fetch ${response.status}`);
      // Integrity check (community-panel import only): the server fingerprints
      // the downloaded bytes; a mismatch means the url now points at different
      // content than when it was shared — refuse to import rather than ingest a
      // possibly-tampered archive. Raw pasted links (no expected fingerprint)
      // skip this guard.
      if (expectedMd5) {
        const actual = response.headers.get("X-Archive-Md5") ?? "";
        if (actual !== expectedMd5) {
          setFileError(t("communityTampered"));
          return;
        }
      }
      const buffer = await response.arrayBuffer();
      await runArchiveImport(name, buffer);
    } catch {
      setFileError(t("zipParseFailed"));
    } finally {
      setBusy(false);
    }
  };

  // One-tap import of a bundled example archive served by this plugin over the
  // same-origin examples route; bytes then flow through the shared engine.
  const importExample = async (file: string) => {
    if (!writable || busy) return;
    setFileError(null);
    setBusy(true);
    try {
      const response = await fetch(EXAMPLES_PREFIX + file);
      if (!response.ok) throw new Error(`example fetch ${response.status}`);
      const buffer = await response.arrayBuffer();
      await runArchiveImport(file, buffer);
    } catch {
      setFileError(t("zipParseFailed"));
    } finally {
      setBusy(false);
    }
  };

  const [netUrl, setNetUrl] = useState("");

  // Smallest unique variant of `baseId` against the current groups: the id itself
  // when free, else `-2`, `-3`, …
  const suggestUniqueId = (baseId: string): string => {
    if (!groups.some((group) => group.id === baseId)) return baseId;
    for (let suffix = 2; ; suffix += 1) {
      const candidate = `${baseId}-${suffix}`;
      if (!groups.some((group) => group.id === candidate)) return candidate;
    }
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    // Second gate: never import a group whose resolved frame list is below the
    // minimum, even when the pending import was seeded some other way.
    if (pendingImport.images.length < PORTRAIT_IMPORT_MIN_IMAGES) {
      setFileError(
        t("zipTooFewImages")
          .replace("{min}", String(PORTRAIT_IMPORT_MIN_IMAGES))
          .replace("{n}", String(pendingImport.images.length)),
      );
      setPendingImport(null);
      return;
    }
    const draftId = pendingImport.draftId.trim();
    if (!draftId) return;
    if (groups.some((group) => group.id === draftId)) {
      // Still colliding — nudge back to a free variant and let the user retry.
      setPendingImport({ ...pendingImport, draftId: suggestUniqueId(draftId) });
      return;
    }
    const meta: PortraitImportMeta = { ...pendingImport.meta, id: draftId };
    insertImportedGroup(pendingImport.images, meta);
    setFileError(pendingImport.notice);
    setPendingImport(null);
  };

  const cancelImport = () => {
    setPendingImport(null);
    setFileError(null);
  };

  // One inline input per identity field (set id / Chinese name / English name),
  // each wrapped in a <label> so the field shows a visible caption (Set ID /
  // 中文名称 / 英文名称) and clicking the caption focuses the input.
  // IME-friendly: edits buffer in `editing` and commit to the config on blur or
  // Enter; renaming the id only affects persistence once that group is selected
  // again, as the identityHint explains. Clearing zh/en removes the override
  // and re-falls back to the built-in default name (when the id is a built-in
  // one) or `name`.
  const identityInput = (groupIndex: number, kind: "id" | "zh" | "en") => {
    const group = groups[groupIndex];
    if (!group) return null;
    const editingField = editing?.kind === kind && editing.groupIndex === groupIndex;
    const def = defaultSetIdentity(group.id);
    const current =
      kind === "id" ? group.id
        : kind === "zh" ? (group.zh?.trim() ?? def?.zh ?? group.name)
        : (group.en?.trim() ?? def?.en ?? group.name);
    const caption = kind === "id" ? t("setId") : kind === "zh" ? t("zhName") : t("enName");
    return (
      <label key={kind} className={kind === "id"
        ? "flash-portrait-group__field flash-portrait-group__field--id"
        : "flash-portrait-group__field"}>
        <span className="flash-portrait-group__field-caption">{caption}</span>
        <input
          className={
            kind === "id"
              ? "flash-portrait-group__name flash-portrait-group__name--id"
              : "flash-portrait-group__name flash-portrait-group__name--lang"
          }
          placeholder={kind === "id" ? t("setIdPlaceholder") : undefined}
          value={editingField ? editing.value : current}
          disabled={!writable || busy}
          onFocus={() => setEditing({ kind, groupIndex, value: current })}
          onChange={(event) => setEditing({ kind, groupIndex, value: event.currentTarget.value })}
          onBlur={() => {
            if (editingField) commitField(groupIndex, kind, editing.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
            if (event.key === "Escape") setEditing(null);
          }}
        />
      </label>
    );
  };

  return (
    <section
      ref={cardRef}
      className={`flash-portrait-groups${collapsed ? "" : " flash-portrait-groups--open"}`}
      data-plugin={PACKAGE_ID}
      data-state={writable ? "ready" : "readonly"}
    >
      <button
        type="button"
        className="flash-portrait-groups__head"
        aria-expanded={!collapsed}
        aria-controls="flash-portrait-groups__body"
        onClick={() => setCollapsed((v) => !v)}
      >
        <span className="flash-portrait-groups__head-text">
          <span className="flash-portrait-groups__title">{t("cardTitle")}</span>
          <span className="flash-portrait-groups__desc">{t("cardDesc")}</span>
        </span>
        <IconChevronDownOutlineRegular
          className={`flash-portrait-groups__chevron${collapsed ? "" : " flash-portrait-groups__chevron--open"}`}
          aria-hidden="true"
        />
      </button>
      <div className="flash-portrait-groups__body" id="flash-portrait-groups__body">
        {!writable && <p className="flash-portrait-groups__notice" role="status">{t("readOnly")}</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        aria-hidden="true"
        tabIndex={-1}
        onChange={onFileInputChange}
      />
      <input
        ref={archiveInputRef}
        type="file"
        accept=".zip,.tar,.tar.gz,.tgz,.gz,application/zip,application/x-zip-compressed,application/x-tar,application/gzip,application/x-gzip"
        hidden
        aria-hidden="true"
        tabIndex={-1}
        onChange={onArchiveInputChange}
      />
      {fileError && (
        <p className="flash-portrait-groups__notice flash-portrait-groups__notice--error" role="alert">
          {fileError}
        </p>
      )}

      {pendingImport && (
        <div
          className="flash-portrait-groups__conflict"
          role="dialog"
          aria-label={t("importIdConflict").replace("{id}", pendingImport.originalId)}
        >
          <p className="flash-portrait-groups__notice flash-portrait-groups__notice--error" role="alert">
            {t("importIdConflict").replace("{id}", pendingImport.originalId)}
          </p>
          <div className="flash-portrait-groups__conflict-actions">
            <label className="flash-portrait-group__field">
              <span className="flash-portrait-group__field-caption">{t("setId")}</span>
              <input
                className="flash-portrait-group__name flash-portrait-group__name--id"
                value={pendingImport.draftId}
                onChange={(event) => setPendingImport({ ...pendingImport, draftId: event.currentTarget.value })}
                onBlur={() => {
                  const trimmed = pendingImport.draftId.trim();
                  if (!trimmed) return;
                  setPendingImport({
                    ...pendingImport,
                    draftId: groups.some((group) => group.id === trimmed) ? suggestUniqueId(trimmed) : trimmed,
                  });
                }}
              />
            </label>
            <div className="flash-portrait-group__actions">
              <button
                type="button"
                disabled={
                  !pendingImport.draftId.trim()
                  || groups.some((group) => group.id === pendingImport.draftId.trim())
                }
                onClick={confirmImport}
              >
                {t("importConfirm")}
              </button>
              <button type="button" className="flash-portrait-group__danger" onClick={cancelImport}>
                {t("importCancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {groups.length === 0 && (
        <div className="flash-portrait-groups__empty">
          <p>{t("empty")}</p>
        </div>
      )}

      <ol className="flash-portrait-groups__groups">
        {groups.map((group, groupIndex) => {
          const editingAdd = editing?.kind === "add" && editing.groupIndex === groupIndex;
          return (
            <li key={group.id} className="flash-portrait-group">
              <header className="flash-portrait-group__head">
                <div className="flash-portrait-group__identity">
                  {identityInput(groupIndex, "id")}
                  {identityInput(groupIndex, "zh")}
                  {identityInput(groupIndex, "en")}
                </div>
                <div className="flash-portrait-group__actions">
                  <button
                    type="button"
                    title={t("moveGroupUp")}
                    disabled={!writable || busy || groupIndex === 0}
                    onClick={() => moveGroup(groupIndex, -1)}
                  >
                    {t("moveGroupUp")}
                  </button>
                  <button
                    type="button"
                    title={t("moveGroupDown")}
                    disabled={!writable || busy || groupIndex === groups.length - 1}
                    onClick={() => moveGroup(groupIndex, +1)}
                  >
                    {t("moveGroupDown")}
                  </button>
                  <button
                    type="button"
                    className={isLikedById(group.id) ? "flash-portrait-group__like flash-portrait-group__like--on" : "flash-portrait-group__like"}
                    title={t("likeTitle")}
                    aria-pressed={isLikedById(group.id)}
                    // Liking is route-based bookkeeping, read-only w.r.t. the
                    // config document, so it works even when it is not writable.
                    disabled={busy}
                    onClick={() => void toggleLike(groupIndex)}
                  >
                    {isLikedById(group.id) ? "♥" : "♡"} {likeCountFor(group.id)}
                  </button>
                  <button
                    type="button"
                    className="flash-portrait-group__share"
                    title={t("shareGroupTitle")}
                    disabled={busy || group.images.length < PORTRAIT_IMPORT_MIN_IMAGES}
                    onClick={() => void shareGroup(groupIndex)}
                  >
                    {t("shareGroup")}
                  </button>
                  <button
                    type="button"
                    className="flash-portrait-group__export"
                    title={t("exportGroupTitle")}
                    // Export is read-only (never mutates the config), so it also
                    // works when the document is not writable.
                    disabled={busy || group.images.length < PORTRAIT_IMPORT_MIN_IMAGES}
                    onClick={() => void exportGroup(groupIndex)}
                  >
                    {t("exportGroup")}
                  </button>
                  <button
                    type="button"
                    className="flash-portrait-group__danger"
                    disabled={!writable || busy}
                    onClick={() => deleteGroup(groupIndex)}
                  >
                    {t("deleteGroup")}
                  </button>
                </div>
              </header>

              {group.images.length < PORTRAIT_IMPORT_MIN_IMAGES && (
                <p className="flash-portrait-groups__hint flash-portrait-group__too-few">
                  {t("tooFewImagesHint")
                    .replace("{min}", String(PORTRAIT_IMPORT_MIN_IMAGES))
                    .replace("{n}", String(group.images.length))}
                </p>
              )}

              <p className="flash-portrait-groups__hint flash-portrait-group__divider-hint">
                {t("dividerHint")}
              </p>
              <ol
                className="flash-portrait-group__images"
              >
                {group.images.map((src, imageIndex) => {
                  const editingReplace =
                    editing?.kind === "replace" &&
                    editing.groupIndex === groupIndex &&
                    editing.imageIndex === imageIndex;
                  const count = group.images.length;
                  const effectiveDark = group.darkLevel ?? MAX_LEVEL - 1;
                  const boundary = boundaryForDarkLevel(count, effectiveDark);
                  return (
                    <Fragment key={imageIndex}>
                      {imageIndex === boundary && count > 0 && (
                        renderDivider(imageIndex, groupIndex, effectiveDark)
                      )}
                      <li className="flash-portrait-group__image">
                      {editingReplace ? (
                        <>
                          <input
                            className="flash-portrait-group__url"
                            autoFocus
                            placeholder={t("imageUrlPlaceholder")}
                            value={editing.value}
                            onChange={(event) =>
                              setEditing({
                                kind: "replace",
                                groupIndex,
                                imageIndex,
                                value: event.currentTarget.value,
                              })
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") replaceImage(groupIndex, imageIndex, editing.value);
                              if (event.key === "Escape") setEditing(null);
                            }}
                          />
                          <button
                            type="button"
                            disabled={!writable || busy || editing.value.trim() === ""}
                            onClick={() => replaceImage(groupIndex, imageIndex, editing.value)}
                          >
                            {t("confirm")}
                          </button>
                          <button
                            type="button"
                            title={t("pickLocalImageHint")}
                            disabled={!writable || busy}
                            onClick={() => openLocalPicker("replace", groupIndex, imageIndex)}
                          >
                            {t("pickLocalImage")}
                          </button>
                          <button type="button" disabled={busy} onClick={() => setEditing(null)}>
                            {t("cancel")}
                          </button>
                        </>
                      ) : (
                        <>
                          <img
                            src={src}
                            loading="lazy"
                            alt=""
                            draggable={false}
                            className={
                              "flash-portrait-group__img" + (hintSeen ? " flash-portrait-group__img--hinted" : "")
                            }
                            onClick={() => {
                              setPreview(src);
                              markHintSeen();
                            }}
                            onError={(event) => {
                              event.currentTarget.style.opacity = "0.25";
                            }}
                          />
                          {!hintSeen && (
                            <span className="flash-portrait-group__preview-hint" role="status">
                              {t("viewOriginal")}
                            </span>
                          )}
                          <span className="flash-portrait-group__image-index">{imageIndex + 1}</span>
                          <div className="flash-portrait-group__image-actions">
                            <button
                              type="button"
                              title={t("moveImageLeft")}
                              disabled={!writable || busy || imageIndex === 0}
                              onClick={() => moveImage(groupIndex, imageIndex, -1)}
                            >
                              {t("moveImageLeft")}
                            </button>
                            <button
                              type="button"
                              title={t("moveImageRight")}
                              disabled={!writable || busy || imageIndex === group.images.length - 1}
                              onClick={() => moveImage(groupIndex, imageIndex, +1)}
                            >
                              {t("moveImageRight")}
                            </button>
                            <button
                              type="button"
                              disabled={!writable || busy}
                              onClick={() =>
                                setEditing({ kind: "replace", groupIndex, imageIndex, value: group.images[imageIndex] })
                              }
                            >
                              {t("replaceImage")}
                            </button>
                            <button
                              type="button"
                              className="flash-portrait-group__danger"
                              disabled={!writable || busy}
                              onClick={() => removeImage(groupIndex, imageIndex)}
                            >
                              {t("removeImage")}
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                    </Fragment>
                  );
                })}
                {(() => {
                  const count = group.images.length;
                  const effectiveDark = group.darkLevel ?? MAX_LEVEL - 1;
                  // A threshold that would land on/after the trailing edge (few
                  // images in the group, or the dark shell tuned to the highest
                  // slider level) and an image-less brand-new group both render
                  // the divider at the head of the add-slot, so the light/dark
                  // threshold control stays visible and adjustable for every group.
                  return boundaryForDarkLevel(count, effectiveDark) >= count
                    ? renderDivider(count, groupIndex, effectiveDark)
                    : null;
                })()}
                {editingAdd ? (
                  <li className="flash-portrait-group__image flash-portrait-group__add">
                    <input
                      className="flash-portrait-group__url"
                      autoFocus
                      placeholder={t("imageUrlPlaceholder")}
                      value={editing.value}
                      onChange={(event) =>
                        setEditing({ kind: "add", groupIndex, value: event.currentTarget.value })
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") addImage(groupIndex, editing.value);
                        if (event.key === "Escape") setEditing(null);
                      }}
                    />
                    <button
                      type="button"
                      disabled={!writable || busy || editing.value.trim() === ""}
                      onClick={() => addImage(groupIndex, editing.value)}
                    >
                      {t("confirm")}
                    </button>
                    <button
                      type="button"
                      title={t("pickLocalImageHint")}
                      disabled={!writable || busy}
                      onClick={() => openLocalPicker("add", groupIndex)}
                    >
                      {t("pickLocalImage")}
                    </button>
                    <button type="button" disabled={busy} onClick={() => setEditing(null)}>
                      {t("cancel")}
                    </button>
                  </li>
                ) : (
                  <li className="flash-portrait-group__image flash-portrait-group__add">
                    <button
                      type="button"
                      disabled={!writable || busy}
                      onClick={() => setEditing({ kind: "add", groupIndex, value: "" })}
                    >
                      + {t("addImage")}
                    </button>
                    <button
                      type="button"
                      className="flash-portrait-group__add-pick"
                      title={t("pickLocalImageHint")}
                      disabled={!writable || busy}
                      onClick={() => openLocalPicker("add", groupIndex)}
                    >
                      {t("pickLocalImage")}
                    </button>
                  </li>
                )}
              </ol>
            </li>
          );
        })}
      </ol>

      {communityOpen && (
        <section className="flash-community" data-plugin={PACKAGE_ID}>
          <header className="flash-community__head">
            <h3 className="flash-community__title">{t("communityTitle")}</h3>
            <button
              type="button"
              className="flash-community__refresh"
              disabled={communityPhase === "loading"}
              onClick={() => void fetchCommunity()}
              title={t("communityRefresh")}
            >
              {t("communityRefresh")}
            </button>
          </header>
          {communityPhase === "loading" && (
            <p className="flash-portrait-groups__notice" role="status">{t("communityLoading")}</p>
          )}
          {communityPhase === "ready" && communityError && (
            <p className="flash-portrait-groups__notice flash-portrait-groups__notice--error" role="alert">
              {communityError}
            </p>
          )}
          {communityPhase === "ready" && !communityError && communityNotConfigured && (
            <p className="flash-portrait-groups__hint">{t("communityNotConfigured")}</p>
          )}
          {communityPhase === "ready" && !communityError && !communityNotConfigured && communityEntries.length === 0 && (
            <p className="flash-portrait-groups__hint">{t("communityEmpty")}</p>
          )}
          {communityPhase === "ready" && !communityError && !communityNotConfigured && communityEntries.length > 0 && (
            <ul className="flash-community__list">
              {communityEntries.map((entry) => (
                <li key={entry.entryId || entry.setId} className="flash-community__item">
                  <span className="flash-community__set">{entry.setId}</span>
                  <a className="flash-community__url" href={entry.url} target="_blank" rel="noreferrer" title={entry.url}>
                    {entry.url}
                  </a>
                  <button
                    type="button"
                    className="flash-community__import"
                    disabled={!writable || busy}
                    onClick={() => void importCommunityEntry(entry)}
                    title={t("communityImportTitle")}
                  >
                    {t("communityImport")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <footer className="flash-portrait-groups__foot">
        <button type="button" disabled={!writable || busy} onClick={addGroup}>
          + {t("addGroup")}
        </button>
        <button
          type="button"
          disabled={!writable || busy}
          onClick={importArchive}
          title={t("importGroupTitle")}
          aria-label={t("importGroupTitle")}
        >
          {t("importGroup")}
        </button>
        <button
          type="button"
          className="flash-community__toggle"
          disabled={busy}
          aria-pressed={communityOpen}
          onClick={() => setCommunityOpen((value) => !value)}
          title={t("communityBrowseTitle")}
        >
          {t("communityBrowse")}
        </button>
        {busy && <span className="flash-portrait-groups__notice" role="status">…</span>}
      </footer>

      <div className="flash-import-net">
        <div className="flash-import-net__examples">
          <span className="flash-import-net__label">{t("importExamplesTitle")}</span>
          <div className="flash-import-net__row">
            {EXAMPLE_ARCHIVES.map((example) => (
              <button
                key={example.file}
                type="button"
                className="flash-import-net__example"
                disabled={!writable || busy}
                onClick={() => void importExample(example.file)}
                title={`${example.file} — ${example.zh} · ${example.en}`}
              >
                {example.zh} <em>{example.en}</em>
              </button>
            ))}
          </div>
        </div>
        <form
          className="flash-import-net__url"
          onSubmit={(event) => {
            event.preventDefault();
            void importFromUrl(netUrl);
          }}
        >
          <span className="flash-import-net__label">{t("importNetTitle")}</span>
          <input
            type="text"
            className="flash-weights__input"
            placeholder={t("netUrlPlaceholder")}
            value={netUrl}
            disabled={!writable || busy}
            onChange={(event) => setNetUrl(event.currentTarget.value)}
          />
          <button type="submit" disabled={!writable || busy || netUrl.trim() === ""}>
            {t("importNet")}
          </button>
        </form>
      </div>

      <section className="flash-weights" data-plugin={PACKAGE_ID}>
        <header className="flash-weights__head">
          <h3 className="flash-weights__title">{t("weights.title")}</h3>
        </header>
        <p className="flash-portrait-groups__hint">{t("weights.hint")}</p>
        <div className="flash-weights__grid">
          {([
            ["usage", "usage", "usageDesc", weightSnapshot.usage],
            ["pressure", "pressure", "pressureDesc", weightSnapshot.pressure],
            ["effort", "effort", "effortDesc", weightSnapshot.effort],
            ["speed", "speed", "speedDesc", weightSnapshot.speed],
          ] as const).map(([key, labelKey, descKey, value]) => (
            <label key={key} className="flash-weights__field">
              <span className="flash-weights__caption">{t(`weights.${labelKey}`)}</span>
              <input
                type="number"
                className="flash-weights__input"
                min={0}
                max={1}
                step={0.05}
                value={value.toFixed(2) ?? ""}
                disabled={!writable || busy}
                onChange={(event) => {
                  const parsed = Number(event.currentTarget.value);
                  const clamped = Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0;
                  weights.setWeights({ ...weightSnapshot, [key]: clamped });
                }}
              />
              <span className="flash-weights__desc">{t(`weights.${descKey}`)}</span>
            </label>
          ))}
        </div>

        <p className="flash-weights__subtitle">{t("weights.saturation")} · {t("weights.speedTiming")}</p>
        <div className="flash-weights__grid">
          {([
            ["usageFull", "weights.usageFull", tuningSnapshot.usageFull, 1, 10_000_000, 1000],
            ["tpsFull", "weights.tpsFull", tuningSnapshot.tpsFull, 100, 1000, 1],
            ["graceMs", "weights.graceMs", tuningSnapshot.graceMs, 0, 60_000, 100],
            ["fadeMs", "weights.fadeMs", tuningSnapshot.fadeMs, 0, 60_000, 100],
          ] as const).map(([key, labelKey, value, min, max, step]) => (
            <label key={key} className="flash-weights__field">
              <span className="flash-weights__caption">{t(labelKey)}</span>
              <input
                type="number"
                className="flash-weights__input"
                min={min}
                max={max}
                step={step}
                value={Math.round(value)}
                disabled={!writable || busy}
                onChange={(event) => {
                  const parsed = Number(event.currentTarget.value);
                  const clamped = Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : 0;
                  weights.setTuning({ [key]: clamped });
                }}
              />
              <span className="flash-weights__desc">{t(`weights.${key}Desc`)}</span>
            </label>
          ))}
        </div>

        <button
          type="button"
          className="flash-weights__reset"
          disabled={!writable || busy}
          onClick={() => weights.reset()}
        >
          {t("weights.reset")}
        </button>
      </section>
      </div>

      {preview && (
        <div
          className="flash-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t("viewOriginal")}
          onClick={() => setPreview(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setPreview(null);
          }}
        >
          <button
            type="button"
            className="flash-lightbox__close"
            onClick={() => setPreview(null)}
            title={t("closePreview")}
            aria-label={t("closePreview")}
          >
            ✕
          </button>
          <img
            className="flash-lightbox__img"
            src={preview}
            alt=""
            draggable={false}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      {shareFor && (
        <div
          className="flash-share"
          role="dialog"
          aria-modal="true"
          aria-label={t("sharePanelTitle").replace("{name}", shareFor.name)}
          onClick={() => setShareFor(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setShareFor(null);
          }}
        >
          <div className="flash-share__box" onClick={(event) => event.stopPropagation()}>
            <header className="flash-share__head">
              <h3 className="flash-share__title">{t("sharePanelTitle").replace("{name}", shareFor.name)}</h3>
              <button
                type="button"
                className="flash-lightbox__close"
                onClick={() => setShareFor(null)}
                title={t("shareClose")}
                aria-label={t("shareClose")}
              >
                ✕
              </button>
            </header>

            <p className="flash-portrait-groups__hint">{t("sharePanelHint")}</p>

            {sharePhase === "packing" && (
              <p className="flash-portrait-groups__notice" role="status">{t("sharePacking")}</p>
            )}

            {sharePhase === "ready" && shareText && (
              <>
                <textarea
                  className="flash-share__text"
                  readOnly
                  spellCheck={false}
                  value={shareText}
                  onClick={(event) => event.currentTarget.select()}
                />
                <div className="flash-share__actions">
                  <button
                    type="button"
                    className="flash-share__copy"
                    onClick={() => void copyShare()}
                    title={t("shareCopy")}
                  >
                    {t("shareCopy")}
                  </button>
                  {shareCopied && <span className="flash-portrait-groups__notice" role="status">{t("shareCopied")}</span>}
                  <button type="button" onClick={() => setShareFor(null)}>{t("shareClose")}</button>
                </div>
              </>
            )}

            {sharePhase === "ready" && !shareText && shareNotice && (
              <p className="flash-portrait-groups__notice flash-portrait-groups__notice--error" role="alert">
                {shareNotice}
              </p>
            )}

            <section className="flash-share__community">
              <h4 className="flash-share__community-title">{t("communityJoin")}</h4>
              <p className="flash-portrait-groups__hint">{t("communitySubmitTitle")}</p>
              <label className="flash-community__field">
                <span className="flash-community__field-label">{t("communityFormUrlLabel")}</span>
                <input
                  type="text"
                  className="flash-weights__input"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={submitUrl}
                  onChange={(event) => setSubmitUrl(event.currentTarget.value)}
                  placeholder="https://…/group.zip"
                />
                <em className="flash-community__field-hint">{t("communityFormUrlHint")}</em>
              </label>
              <div className="flash-share__actions">
                <button
                  type="button"
                  className="flash-community__submit"
                  disabled={submitPhase === "submitting" || submitUrl.trim() === ""}
                  onClick={() => void submitCommunityShare(shareFor.index)}
                >
                  {submitPhase === "submitting" ? t("communitySubmitting") : t("communitySubmit")}
                </button>
              </div>
              {submitPhase === "done" && submitMessage && (
                <p className="flash-portrait-groups__notice" role="status">{submitMessage}</p>
              )}
              {submitPhase === "error" && submitMessage && (
                <p className="flash-portrait-groups__notice flash-portrait-groups__notice--error" role="alert">
                  {submitMessage}
                </p>
              )}
            </section>
          </div>
        </div>
      )}
    </section>
  );
}

export function apply(ctx: ClientContext) {
  const style = document.createElement("style");
  style.dataset.plugin = PACKAGE_ID;
  style.textContent = styles;
  document.head.append(style);
  ctx.effect(() => () => style.remove(), "flash-skin: scoped styles");

  // 环境检测：桌面版是真正的 Electron 应用（app.asar + Electron 运行时），web 版
  // 跑在普通浏览器里。可靠信号：宿主自带 data-dsh-desktop-mode 属性（若该构建提供）
  // 或 navigator.userAgent 声称 Electron。---都不依赖 dsh-flash。启动打一条诊断，
  // 便于确认运行形态与后续桌面专用分支的依据。
  const desktopStamp = desktopMode();
  const uaProbe = (typeof navigator !== "undefined" && navigator.userAgent) || "";
  console.info(
    `[flash-skin] desktop detection: stamp=${JSON.stringify(desktopStamp)} ua=${uaProbe}`
  );


  const theme = ctx.get("theme") as ThemeService;
  const scope = createPreferenceStore(restoreInitialSet());
  ctx.effect(() => () => scope.dispose(), "flash-skin: appearance preference");
  const weights = createWeightsStore();
  ctx.effect(() => () => weights.dispose(), "flash-skin: composite weights");
  const presenter = new SkinPresenter(scope, theme);
  ctx.effect(() => () => presenter.dispose(), "flash-skin: backdrop presenter");

  // 宿主插件管理器把「打开某包详情页」暴露为反射服务 pluginNavigation.openBundle；
  // 从任何插件的 bundle 里都能拿到，点击即跳转插件管理 → 已安装 → 本包详情。
  // 该能力来自宿主内建插件管理器，与 dsh-flash 插件无关；缺失时静默降级。
  const openDetails = () => {
    try {
      const navigation = (ctx.reflect as unknown as { get?: (id: string) => unknown }).get?.("pluginNavigation");
      const open = (navigation as { openBundle?: (name: string) => void } | undefined)?.openBundle;
      if (typeof open === "function") {
        // The host API can't carry a "jump to the config section" hint, so flag
        // it here; the config card consumes it on mount (auto-expand + scroll).
        expandConfigOnNextMount = true;
        open(PACKAGE_ID);
      }
    } catch {
      // 反射服务不可用时静默降级，按钮只是不跳转。
    }
  };

  ctx.effect(
    () => ctx.locale.register(LOCALE_NAMESPACE, {
      zh: {
        ...CONFIG_TEXTS.zh,
        "appearance": "人物肖像",
        "flashSkin": "Flash 皮肤",
        "portraitSet": "人物肖像组",
        "portraitSwitch": "人物强度",
        "layout.title": "内容居左对齐",
        "driver.title": "强度驱动",
        "driver.manual": "手动",
        "driver.composite": "综合加权",
        "weights.title": "综合加权（手动可调）",
        "weights.hint": "按权重加权实时信号合成 0–1 连续得分，直接匹配当前肖像组实际张数取帧实时驱动人物肖像；全为 0 时回退默认权重。",
        "weights.usage": "用量",
        "weights.pressure": "压力",
        "weights.effort": "推理",
        "weights.speed": "速度",
        "weights.compaction": "压缩",
        "weights.usageShort": "用量",
        "weights.pressureShort": "压力",
        "weights.effortShort": "推理",
        "weights.speedShort": "速度",
        "weights.compactionShort": "压缩",
        "weights.usageDesc": "本次已生成 token,饱和 30 万",
        "weights.pressureDesc": "上下文占用/窗口,无窗口按轮次",
        "weights.effortDesc": "当前推理档位,未设置按 0",
        "weights.speedDesc": "解码速度,饱和 100 t/s",
        "weights.reset": "恢复默认",
        "weights.score": "得分",
        "weights.frame": "帧",
        "weights.saturation": "饱和阈值",
        "weights.usageFull": "用量饱和",
        "weights.usageFullDesc": "生成多少 token 后用量记满",
        "weights.tpsFull": "速度饱和",
        "weights.tpsFullDesc": "多少 t/s 后解码速度记满",
        "weights.speedTiming": "速度衰减计时（毫秒）",
        "weights.graceMs": "停留",
        "weights.graceMsDesc": "速度记满后保持全速的宽限时长",
        "weights.fadeMs": "衰减",
        "weights.fadeMsDesc": "宽限期后速度衰减到 0 所需时长",
        "expandDetails": "展开配置",
        "collapseDetails": "收起配置",
      },
      en: {
        ...CONFIG_TEXTS.en,
        "appearance": "Portrait group",
        "flashSkin": "Flash Skin",
        "portraitSet": "Portrait set",
        "portraitSwitch": "Person level",
        "layout.title": "Left-aligned layout",
        "driver.title": "Level driver",
        "driver.manual": "Manual",
        "driver.composite": "Composite",
        "weights.title": "Composite weights (editable)",
        "weights.hint": "A continuous 0–1 score from these weighted live signals maps straight onto the portrait group's actual frame count; all-zero falls back to defaults.",
        "weights.usage": "Usage",
        "weights.pressure": "Pressure",
        "weights.effort": "Reasoning",
        "weights.speed": "Speed",
        "weights.compaction": "Compaction",
        "weights.usageShort": "Usage",
        "weights.pressureShort": "Pressure",
        "weights.effortShort": "Reasoning",
        "weights.speedShort": "Speed",
        "weights.compactionShort": "Compaction",
        "weights.usageDesc": "Tokens generated this turn, saturates at 300k",
        "weights.pressureDesc": "Context used / window; falls back to turns",
        "weights.effortDesc": "Current reasoning level, unknown counts as 0",
        "weights.speedDesc": "Decode speed, saturates at 100 t/s",
        "weights.reset": "Restore defaults",
        "weights.score": "Score",
        "weights.frame": "Frame",
        "weights.saturation": "Saturation thresholds",
        "weights.usageFull": "Usage saturates at",
        "weights.usageFullDesc": "Tokens per turn that saturate usage",
        "weights.tpsFull": "Speed saturates at",
        "weights.tpsFullDesc": "Tokens/second that saturate decode speed",
        "weights.speedTiming": "Speed decay timing (ms)",
        "weights.graceMs": "Hold",
        "weights.graceMsDesc": "How long full speed holds after saturation before decay",
        "weights.fadeMs": "Fade",
        "weights.fadeMsDesc": "How long speed takes to decay to 0 after the hold",
        "expandDetails": "Expand settings",
        "collapseDetails": "Collapse settings",
      },
    }),
    "flash-skin: settings locale",
  );

  const setLabel = ctx.locale.bind(LOCALE_NAMESPACE);
  // 自定义配置页用到的 Host volatile 配置表单（命名空间 flash-skin）。设置行
  // 选择器直接订阅它，让用户修改过的 set id 与中英文名称实时反映到通用设置行。
  const configForm = ctx.configForms.get<PortraitGroupsConfig>(CONFIG_NAMESPACE);
  // 独立选择项：不抢占宿主的外观(theme)行，而是在通用设置里单独列出人物肖像组。
  // 每组的身份来自可配置的 portraitGroups（set id + 中英文名称），渲染时按活动
  // 语言解析；未配置时回落内建三组默认身份。选择通过 presenter.choose 落库，
  // 持久化只走 localStorage（SET_KEY），与宿主主题服务完全解耦。
  ctx.slots.inject("settings.general.item", () => ctx.slots.register({
    name: "settings.general.item",
    id: "flash-portrait-set",
    // Rendered directly under the host「外观」appearance row (order 10) and
    // above「强度驱动」(driver at 10.6); higher order = lower on screen.
    order: 10.5,
    locale: LOCALE_NAMESPACE,
    inject: () => ({ scope, presenter, form: configForm, locale: ctx.locale, t: setLabel }),
  }, PortraitSetRow));

  // ── Optional dsh-flash integration: quick-control switch ─────────────────
  // Action switch in dsh-flash's ⚡ panel that opens this plugin's detail page.
  // It lands in the built-in Workbench tab's Appearance group — rendered directly
  // under the「皮肤主题」skin-theme cluster (order 26, past the cluster at 25) — by
  // virtue of dsh-flash shipping `dsh-flash-skin:` in its `_COMPANIONS` whitelist
  // (the same mechanism dsh-flash-ctx-mon / -mem-mon / -net-mon / -proxy use to be
  // treated as built-in). Without that whitelist entry the same switch would fall
  // back to the Extensions tab. Rule G §4: fully feature-detected — no import, no
  // inject declaration, only the `quickControl` runtime service probed defensively.
  // If dsh-flash (hence `quickControl` and the `dock-flash:ready` event) never
  // appears, this whole block stays inert and the plugin keeps working standalone.
  // The row is shown only while this skin is enabled (`presenter.isEnabled()`).
  const OPEN_DETAILS_SWITCH_ID = `${PACKAGE_ID}:open-details`;
  const PORTRAIT_SET_SWITCH_ID = `${PACKAGE_ID}:portrait-set`;
  const PORTRAIT_SLIDER_SWITCH_ID = `${PACKAGE_ID}:portrait-slider`;
  const DRIVER_SWITCH_ID = `${PACKAGE_ID}:driver`;
  const LAYOUT_SWITCH_ID = `${PACKAGE_ID}:layout-left`;
  // 这五个皮肤开关共享同一个簇字符串，宿主会把它们折叠成一张以
  // 「Flash 皮肤」为标题的卡片（首行控件常开、其余收进折叠体）。
  const FLASH_SKIN_CLUSTER = "flash-skin";
  let quickControl: {
    registerSwitch?: (def: unknown) => (() => void) | void;
    unregisterSwitch?: (id: string) => void;
    notifyChange?: (id: string) => void;
  } | undefined;
  let quickSwitchesRegistered = false;

  // Portrait sets for the panel dropdown, derived exactly like the settings
  // row: the user-editable `portraitGroups` config (renamable from the detail
  // page) when present, else the built-in three defaults. The display name is
  // resolved against the host locale at call time; the panel re-runs
  // options() on each render, so detail-page renames surface on the next
  // open/re-render.
  const portraitSetOptions = () => {
    let configured: readonly PortraitGroupConfig[] = [];
    try {
      const groupsSnapshot = configForm?.getSnapshot ? configForm.getSnapshot() : undefined;
      if (groupsSnapshot?.status === "ready") {
        const value = (groupsSnapshot.value as { portraitGroups?: readonly PortraitGroupConfig[] } | undefined)?.portraitGroups;
        configured = value ?? [];
      }
    } catch {
      // volatile form unavailable — fall back to the built-in defaults
    }
    let active = "";
    try {
      const localeSnapshot = (ctx.locale as LocaleFaceLike | undefined)?.getSnapshot?.();
      active = localeSnapshot?.active ?? "";
    } catch {
      // host locale missing — defaults are shown
    }
    const list = configured.length > 0 ? configured : [DEFAULT_PORTRAIT_SET];
    return list.map((set) => ({
      label: setDisplayName(set, active),
      value: normalizeSetId(set.id) ?? set.id,
    }));
  };

  // Slot picked up by the portrait-groups settings mirror below (registered in
  // the enclosing scope): re-registering the panel slider keeps its bounds in
  // step with the active group's live frame count (see registerQuickSwitches).
  let refreshPortraitSlider: (() => void) | undefined;

  const buildPortraitSliderSwitch = () => {
    const count = presenter.getPortraitCount();
    const max = Math.max(0, count - 1);
    return {
      id: PORTRAIT_SLIDER_SWITCH_ID,
      label: () => setLabel("portraitSwitch"),
      cluster: FLASH_SKIN_CLUSTER,
      icon: "scroll",
      type: "slider",
      group: "appearance",
      order: 26.5,
      min: 0,
      max,
      step: 1,
      getValue: () => frameIndexForContinuousLevel(presenter.getLevel(), presenter.getPortraitCount()),
      setValue: (value) => {
        const c = presenter.getPortraitCount();
        if (c < 2) return;
        const index = Math.min(c - 1, Math.max(0, Math.round(Number(value) || 0)));
        const next = stagedFrames(c)[index] ?? 0;
        presenter.setLevel(next);
        try {
          localStorage.setItem(LEVEL_KEY, String(next));
        } catch {
          // storage may be unavailable
        }
        quickControl?.notifyChange?.(PORTRAIT_SLIDER_SWITCH_ID);
      },
      // Right-hand value label shows the currently displayed frame (1-based
      // over the group's image count) so "every image is slide-reachable"
      // reads directly off the control.
      formatLabel: (value) => {
        const c = presenter.getPortraitCount();
        if (c < 2) return "";
        const index = Math.min(c - 1, Math.max(0, Math.round(Number(value) || 0)));
        return `${index + 1}/${c}`;
      },
      visible: () => presenter.isEnabled() && presenter.getPortraitCount() >= 2,
    };
  };

  const registerQuickSwitches = (registry: unknown) => {
    if (quickSwitchesRegistered) return;
    const reg = registry as typeof quickControl;
    if (!reg || typeof reg.registerSwitch !== "function") return;
    quickSwitchesRegistered = true;
    quickControl = reg;

    // The panel snapshots the slider's min/max/step as PLAIN values at
    // register time (registerSwitch copies the definition), while the active
    // group's frame count is not settled at first enable: the persisted
    // portrait groups hydrate asynchronously (the presenter starts from an
    // empty map) and later image edits or set switches change the count
    // again. Registering the same id REPLACES the stored definition (and
    // re-renders the panel), so re-register whenever the live count changes —
    // `max` then always spans the current group's frames, while the effect
    // teardown below still unregisters by id.
    let sliderCount = -1;
    let sliderDisposeFn: (() => void) | undefined;
    refreshPortraitSlider = () => {
      const count = presenter.getPortraitCount();
      if (count === sliderCount) return sliderDisposeFn;
      sliderCount = count;
      const dispose = quickControl?.registerSwitch?.(buildPortraitSliderSwitch());
      quickControl?.notifyChange?.(PORTRAIT_SLIDER_SWITCH_ID);
      sliderDisposeFn = typeof dispose === "function" ? dispose : undefined;
      return sliderDisposeFn;
    };

    // Keep the rows in sync with the skin's own store: the panel only re-runs
    // `visible()` after a registry version bump, so push a change whenever the
    // enabled flag flips (choose/disable) or the driver mode changes elsewhere
    // (e.g. the settings-row selector) — otherwise the ⚡ rows would go stale
    // until the panel happens to re-render.
    let lastEnabled = presenter.isEnabled();
    let lastDriver = scope.getSnapshot().driver;
    const offScope = scope.subscribe(() => {
      // A scope change may have switched the active set, changing the number
      // of frames its group stages — re-sync the slider bounds opportunistically.
      refreshPortraitSlider?.();
      const enabled = presenter.isEnabled();
      if (enabled !== lastEnabled) {
        lastEnabled = enabled;
        quickControl?.notifyChange?.(OPEN_DETAILS_SWITCH_ID);
        quickControl?.notifyChange?.(PORTRAIT_SET_SWITCH_ID);
        quickControl?.notifyChange?.(PORTRAIT_SLIDER_SWITCH_ID);
      }
      const driver = scope.getSnapshot().driver;
      if (driver !== lastDriver) {
        lastDriver = driver;
        quickControl?.notifyChange?.(DRIVER_SWITCH_ID);
      }
    });

    ctx.effect(() => {
      // Portrait-set dropdown directly under the「皮肤主题」cluster (order 26):
      // a `select` whose options mirror the settings row, read/write via the
      // presenter (`presenter.choose` persists through localStorage SET_KEY).
      // It must stay a standalone built-in row — it cannot join the inline
      // skin-theme row, whose members ALL need `clusterInline` + type
      // `select`, and that cluster is already closed with its two members.
      const setDispose = reg.registerSwitch?.({
        id: PORTRAIT_SET_SWITCH_ID,
        // This row is the CLUSTER HEAD (lowest `order` of the five skin rows);
        // the host renders its label as the fold card's title「Flash 皮肤」.
        label: () => setLabel("flashSkin"),
        clusterLabel: () => setLabel("flashSkin"),
        cluster: FLASH_SKIN_CLUSTER,
        icon: "palette",
        type: "select",
        group: "appearance",
        order: 26,
        options: () => portraitSetOptions(),
        getValue: () => presenter.getSet().id,
        setValue: (value) => {
          void presenter.choose(String(value)).catch(() => undefined)
            .finally(() => quickControl?.notifyChange?.(PORTRAIT_SET_SWITCH_ID));
        },
        visible: () => presenter.isEnabled(),
      });
      // 「强度驱动」dropdown directly UNDER the portrait-set dropdown
      // (26.25, between the select at 26 and the level slider at 26.5): the
      // same two-option driver selector as the settings row (manual /
      // composite), bound to the same store so both surfaces stay in step.
      // A `buttongroup` (segmented control) so the two driver options sit as
      // one-tap buttons side by side, matching the settings-row toggle style.
      // `getValue`/`visible` read live at render time; the scope subscription
      // above bumps the registry when the driver changes from the other row.
      const driverDispose = reg.registerSwitch?.({
        id: DRIVER_SWITCH_ID,
        label: () => setLabel("driver.title"),
        cluster: FLASH_SKIN_CLUSTER,
        icon: "signal",
        type: "buttongroup",
        group: "appearance",
        order: 26.25,
        options: () => [
          { value: "manual", label: setLabel("driver.manual") },
          { value: "composite", label: setLabel("driver.composite") },
        ],
        getValue: () => scope.getSnapshot().driver,
        setValue: (value) => {
          const driver =
            value === "manual" || value === "composite"
              ? value
              : "manual";
          void scope.setDriver(driver).catch(() => undefined)
            .finally(() => quickControl?.notifyChange?.(DRIVER_SWITCH_ID));
        },
        visible: () => presenter.isEnabled(),
      });
      // Content left-alignment gate (26.7, just under the level slider at
      // 26.5): a boolean on/off that toggles the whole left-align CSS rule set
      // in skin.css via `data-flash-layout` on <body>. This bundles every prior
      // left-shift layout override (timeline gutter, width handles, composer
      // card, hero workspace, todo/queue docks) behind a single switch. It
      // only ever touches this skin's own CSS gate — no host coupling.
      const layoutDispose = reg.registerSwitch?.({
        id: LAYOUT_SWITCH_ID,
        label: () => setLabel("layout.title"),
        cluster: FLASH_SKIN_CLUSTER,
        icon: "rail",
        type: "toggle",
        group: "appearance",
        order: 26.7,
        getValue: () => presenter.getLayout(),
        setValue: (value) => {
          presenter.setLayout(Boolean(value));
          quickControl?.notifyChange?.(LAYOUT_SWITCH_ID);
        },
        // 桌面版不提供居左对齐（宿主自带兼容/扩展两种桌面形态，layout 覆盖在
        // Electron 外壳下不适用），直接在皮肤里隐藏该项。
        visible: () => presenter.isEnabled() && !desktopMode(),
      });
      // the select at 26 and the open-details action at 27): it switches the
      // ACTIVE person's level and gives one stop per frame of that group, so
      // sliding walks through every image of the current person. For a group
      // with more frames than integer stops (N > MAX_LEVEL + 1) a plain
      // 0..MAX_LEVEL grip could not reach every image — e.g. a 9-frame group
      // leaves two frames unreachable — so the slider targets the same
      // continuous staged levels the portrait loader nearest-selects on, which
      // makes every frame its own reachable stop. The panel snapshots the
      // bounds at register time, so the row is registered through
      // `refreshPortraitSlider()`, which re-registers with a fresh `max`
      // whenever the live frame count changes (hydration, image edits, set
      // switches) — a stale max of 0 would otherwise pin the thumb and make
      // the slider undraggable. Hidden for groups with fewer than two frames
      // (nothing to slide through) or when disabled.
      const sliderDispose = refreshPortraitSlider?.();
      const openDispose = reg.registerSwitch?.({
        id: OPEN_DETAILS_SWITCH_ID,
        label: () => setLabel("openDetails"),
        cluster: FLASH_SKIN_CLUSTER,
        icon: "doc",
        type: "action",
        // Built-in Appearance group (just past the person-switch row at 26.5),
        // via the `dsh-flash-skin:` entry in dsh-flash's `_COMPANIONS` whitelist.
        group: "appearance",
        order: 27,
        hideLabel: true,
        actionLabel: () => setLabel("openDetails"),
        visible: () => presenter.isEnabled(),
        run: () => openDetails(),
      });
      return () => {
        if (typeof setDispose === "function") setDispose();
        else reg.unregisterSwitch?.(PORTRAIT_SET_SWITCH_ID);
        if (typeof driverDispose === "function") driverDispose();
        else reg.unregisterSwitch?.(DRIVER_SWITCH_ID);
        if (typeof sliderDispose === "function") sliderDispose();
        else reg.unregisterSwitch?.(PORTRAIT_SLIDER_SWITCH_ID);
        if (typeof openDispose === "function") openDispose();
        else reg.unregisterSwitch?.(OPEN_DETAILS_SWITCH_ID);
        if (typeof layoutDispose === "function") layoutDispose();
        else reg.unregisterSwitch?.(LAYOUT_SWITCH_ID);
        offScope();
      };
    }, "flash-skin: quick switches");
  };

  const cts = ctx as unknown as {
    on?: (name: string, listener: (payload: unknown) => void) => (() => void) | undefined;
    get?: (name: string) => unknown;
  };

  // Passive discovery: dsh-flash emits `dock-flash:ready` once it has provided
  // `quickControl` (covers dsh-flash loading after this bundle).
  if (typeof cts.on === "function") {
    try {
      const offReady = cts.on("dock-flash:ready", (payload: unknown) => {
        const p = payload as { quickControl?: unknown } | null | undefined;
        if (p?.quickControl) registerQuickSwitches(p.quickControl);
      });
      ctx.effect(() => () => {
        if (typeof offReady === "function") offReady();
      }, "flash-skin: dock-ready off");
    } catch {
      // no event bus on this context — the active probe below still applies
    }
  }

  // Active discovery: dsh-flash may already be loaded (covers dsh-flash
  // loading before this bundle); probe the service directly.
  try {
    const registry = cts.get?.("quickControl");
    if (registry) registerQuickSwitches(registry);
  } catch {
    // `quickControl` unavailable — this plugin keeps working standalone
  }

  // 自定义配置页：插件管理页在「已配置」的 bundle 上渲染 plugins.bundle.config
  // 槽位（视图为页面，key 取 bundle 包名）。表单直接对准 Host 的 volatile 设置
  // 命名空间 flash-skin，整数组原子覆写 + 修订号围栏由 FlashSkinConfigCard 内
  // 的 commit 处理。
  // Push the persisted per-set config (images + dark threshold) into the
  // presenter so each portrait set shows the frames and flips to the dark shell
  // configured for it.
  ctx.effect(() => {
    if (!configForm || typeof configForm.subscribe !== "function") return undefined;
    const read = () => {
      const snapshot = configForm.getSnapshot?.();
      const value = snapshot?.value as { portraitGroups?: PortraitGroupConfig[] } | undefined;
      presenter.setPortraitGroups(value?.portraitGroups ?? []);
      // Image edits change the active group's frame count; keep the panel
      // slider's registration bounds in step (no-op if the count is unchanged).
      refreshPortraitSlider?.();
    };
    read();
    const unsubscribe = configForm.subscribe(read);
    return () => unsubscribe();
  }, "flash-skin: portrait-groups mirror");
  ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
    name: "plugins.bundle.config",
    key: PACKAGE_ID,
    order: 10,
    locale: LOCALE_NAMESPACE,
    inject: () => ({ form: configForm, weights, t: setLabel }),
  }, FlashSkinConfigCard));

  ctx.slots.inject("settings.general.item", () => ctx.slots.register({
    name: "settings.general.item",
    id: "flash-driver",
    // Rendered directly under「人物肖像」(portrait set at 10.5), just past the
    // host「外观」cluster; higher order = lower on screen.
    order: 10.6,
    locale: LOCALE_NAMESPACE,
    inject: () => ({ scope, t: setLabel }),
  }, DriverRow));

  const readLevel = () => {
    try {
      return Number(localStorage.getItem(LEVEL_KEY) ?? "0") || 0;
    } catch {
      return 0;
    }
  };

  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({
    name: "conversation.input.left",
    id: "flash-level-control",
    order: 10,
    // The host's `conversation.input.left` binding auto-injects `useProjection`
    // as a standard prop (see dsh-client-ui-conversation slot contract — the
    // QueueDock/TodoDock occupants receive it the same way); we only return our
    // own session props here and let the renderer mix the projection hook in.
    // 该控件随驱动模式切换:手动=滑杆,综合加权=复合公式仪表(CompositeLevelControl),
    // 都显示在输入卡原生的左侧工具行(conversation.input.left)。
    inject: (sessionId: string) => {
      const available = ctx.sessions.subagentAddress(sessionId) === undefined;
      const directory = ctx.modelDirectories.directoryFor(sessionId) as ModelDirectory;
      return {
        directory: directory.store,
        presenter,
        scope,
        weights,
        settings: { level: readLevel() },
        locale: ctx.locale,
        t: setLabel,
        load: () => {
          if (available) void directory.load().catch(() => undefined);
        },
      };
    },
  }, FlashLevelControl));
}
