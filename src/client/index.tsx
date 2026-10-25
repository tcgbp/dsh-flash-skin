import { Fragment, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ChangeEvent as ReactChangeEvent } from "react";
import { Switch } from "@deepseek-ai/dsh-client-ui-primitives";
import type { Context as ClientContext } from "@deepseek-ai/cordis";
import type { SnapshotStore } from "@deepseek-ai/dsh-client-store";
import type {} from "@deepseek-ai/dsh-client-ui-conversation/client";
import type {} from "@deepseek-ai/dsh-client-ui-settings/client";
import type {} from "@deepseek-ai/dsh-client-ui-model-selection/client";
import type {} from "@deepseek-ai/dsh-client-ui-theme/client";
import styles from "./skin.css";
import { createPortraitLoader } from "./portrait-loader";
import type { PortraitImage, PortraitSource } from "./portrait-loader";
import {
  MAX_LEVEL,
  PORTRAIT_MAX_LEVEL,
  clampLevel,
  levelForEffort,
  nearestEffortIndex,
  paletteForLevel,
  selectedEffortIndex,
  type EffortLike,
  type Palette,
} from "./logic";

const PACKAGE_ID = "dsh-flash-skin";
const LOCALE_NAMESPACE = "flash.skin";
const CONFIG_NAMESPACE = "flash-skin";
const LEVEL_KEY = "dsh-flash-skin.level";
const SET_KEY = "dsh-flash-skin.set";
const BIND_EFFORT_KEY = "dsh-flash-skin.bind-effort";
const ASSET_PREFIX = `/plugins/${PACKAGE_ID}/assets`;

// Level→file anchors per portrait set. MAX_LEVEL is 6, so the slider exposes 7
// integer stops (0..6); their portraitLevel frames land on the evenly spread
// reasoning slots 0,4,9,13,17,21,26,30. Each set lists 8 frames ordered by the
// file-name number (lowest → slot 0, highest → slot 30), but only the first 7
// are active in display logic — the 8th (slot 30) is kept as a placeholder for
// tuning and is excluded in sourcesForSet. Swap folder contents to point at
// different character art.
// Portrait set ids follow the Chinese display names (梁圣 → liangsheng,
// 梁神 → liangshen, 梁祖 → liangzu). PORTRAIT_ANCHORS is keyed by the same ids.
const PORTRAIT_ANCHORS: Record<string, { level: number; file: string }[]> = {
  liangsheng: [
    { level: 0, file: "stage-00.webp" },
    { level: 4, file: "level-04.webp" },
    { level: 9, file: "level-09.webp" },
    { level: 13, file: "level-13.webp" },
    { level: 17, file: "level-16.webp" },
    { level: 21, file: "level-19.webp" },
    { level: 26, file: "stage-24.webp" },
    { level: 30, file: "level-28.webp" },
  ],
  liangshen: [
    { level: 0, file: "level-01.webp" },
    { level: 4, file: "stage-06.webp" },
    { level: 9, file: "level-10.webp" },
    { level: 13, file: "level-14.webp" },
    { level: 17, file: "level-17.webp" },
    { level: 21, file: "level-21.webp" },
    { level: 26, file: "level-25.webp" },
    { level: 30, file: "level-29.webp" },
  ],
  liangzu: [
    { level: 0, file: "level-03.webp" },
    { level: 4, file: "level-07.webp" },
    { level: 9, file: "stage-12.webp" },
    { level: 13, file: "bridge-15.webp" },
    { level: 17, file: "stage-18.webp" },
    { level: 21, file: "level-22.webp" },
    { level: 26, file: "bridge-27.webp" },
    { level: 30, file: "stage-30.webp" },
  ],
};

// The set ids were renamed from English (storm/blaze/frost) to the pinyin of
// the Chinese names. Old persisted values (localStorage SET_KEY and saved
// portraitGroups group ids) still carry the legacy ids, so keep a mapping and
// normalize them whenever a persisted value is read back.
const LEGACY_SET_IDS: Record<string, string> = {
  storm: "liangsheng",
  blaze: "liangshen",
  frost: "liangzu",
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
// fall back to the DEFAULT_PORTRAIT_SETS defaults when the persisted config
// predates zh/en (older configs only stored `name`), so the original default
// English names never disappear merely because a stale config lacks them.
function defaultSetIdentity(id: string | undefined): DefaultPortraitSet | undefined {
  if (!id) return undefined;
  return DEFAULT_PORTRAIT_SETS.find((item) => item.id === id);
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
// settings preview strip. Configured groups (including built-in-seeded ones)
// expose their whole image list; untouched built-in sets fall back to the
// on-disk anchors — mirroring sourcesForSet, which leaves the 8th anchor (a
// tuning placeholder) out of display logic. Returns [] when the set has
// nothing to show yet (e.g. a brand-new image-less group).
function setFrames(set: PortraitGroupConfig | DefaultPortraitSet): string[] {
  const configuredImages = (set as PortraitGroupConfig).images;
  if (Array.isArray(configuredImages) && configuredImages.length > 0) {
    return configuredImages.slice();
  }
  const anchors = PORTRAIT_ANCHORS[set.id] ?? [];
  const folder = (set as PortraitSet).folder;
  if (!folder || anchors.length === 0) return [];
  // Only the first 7 of the 8 anchors drive display; drop the placeholder.
  return anchors.slice(0, -1).map(({ file }) => `${ASSET_PREFIX}/${folder}/${file}`);
}

interface PortraitSet {
  id: string;
  /** Built-in anchor folder; undefined for fully custom (user-created) sets. */
  folder?: string;
}

// The set ids, the Chinese display names (梁圣/梁神/梁祖) and the English display
// names are all seeded into the user-editable `portraitGroups` config (see
// FlashSkinConfigCard / setDisplayName below), so the user can rename any of
// them from the plugin detail page. These code constants are only the fallback
// identity used while no config has been written yet.
interface DefaultPortraitSet extends PortraitSet {
  zh: string;
  en: string;
}

const DEFAULT_PORTRAIT_SETS: DefaultPortraitSet[] = [
  { id: "liangsheng", folder: "portrait-source-v2", zh: "梁圣", en: "Liang the Saint" },
  { id: "liangshen", folder: "portrait-source-v3", zh: "梁神", en: "Liang the God" },
  { id: "liangzu", folder: "portrait-source-v4", zh: "梁祖", en: "Liang the Ancestor" },
];

interface SkinSettings {
  enabled: boolean;
  set: string;
  bindEffort: boolean;
}

interface PreferenceStore {
  getSnapshot(): SkinSettings;
  subscribe(listener: () => void): () => void;
  set(enabled: boolean): Promise<void>;
  setSet(setId: string): Promise<void>;
  setBindEffort(enabled: boolean): Promise<void>;
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
  select: (selection: ModelSelection) => Promise<boolean>;
  presenter: SkinPresenter;
  scope: PreferenceStore;
  settings: { level: number };
}

interface EffortBindingRowProps {
  scope: PreferenceStore;
  t: (key: string) => string;
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
  private set: PortraitSet = DEFAULT_PORTRAIT_SETS[0];
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
    // Prefer the user-configured images for this set, spread evenly across the
    // slider (level 0..PORTRAIT_MAX_LEVEL) so added/removed frames stay on
    // meaningful stops. Falls back to the built-in on-disk anchors.
    const group = configs[set.id];
    if (group && group.images.length > 0) {
      const count = group.images.length;
      return group.images.map((url, index) => ({
        level: count <= 1 ? 0 : Math.round((index / (count - 1)) * PORTRAIT_MAX_LEVEL),
        url,
      }));
    }
    const anchors = PORTRAIT_ANCHORS[set.id] ?? [];
    if (!set.folder || anchors.length === 0) return [];
    // The slider exposes MAX_LEVEL + 1 = 7 stops, so only the first 7 anchors
    // drive the portrait sequence. The 8th anchor (highest frame) is kept in
    // PORTRAIT_ANCHORS as a placeholder for tuning and never enters display
    // logic: drop it here so the loader neither loads nor selects it.
    return anchors.slice(0, -1).map(({ level, file }) => ({
      level,
      url: `${ASSET_PREFIX}/${set.folder}/${file}`,
    }));
  }

  // Resolve a persisted/selected set id to a PortraitSet. Configured (custom)
  // ids must survive anyway: they have no built-in anchors, so they resolve to
  // `{ id }` with no folder and rely on the configured group images.
  private resolveSet(setId: string | undefined | null): PortraitSet {
    const found = DEFAULT_PORTRAIT_SETS.find((item) => item.id === setId);
    if (found) return { id: found.id, folder: found.folder };
    return { id: setId || DEFAULT_PORTRAIT_SETS[0].id };
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
      this.applyPalette();
      this.portraits.start();
    } else {
      this.root.remove();
      this.portraits.stop();
      this.root.replaceChildren();
      this.root.dataset.media = "color";
      document.body.removeAttribute("data-flash-skin");
      for (const name of cssVariables) document.body.style.removeProperty(name);
    }
  }

  setLevel(level: number) {
    if (this.disposed) return;
    this.level = clampLevel(level);
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
    const scale = clampLevel(this.level) / MAX_LEVEL;
    this.portraits.select(Math.round(scale * PORTRAIT_MAX_LEVEL));
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
    delete document.body.dataset.flashStage;
    for (const name of cssVariables) document.body.style.removeProperty(name);
  }
}

function FlashLevelControl({ directory, load, select, presenter, scope, settings }: RecorderProps) {
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
  const bindEffort = skin.bindEffort;
  const [level, setLevel] = useState(() => bindEffort ? committedLevel : clampLevel(settings.level));
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const dragging = useRef(false);
  const dragStartLevel = useRef(level);
  const enabled = skin.enabled;

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  useEffect(() => {
    if (!bindEffort || dragging.current || pending) return;
    setLevel(committedLevel);
    presenter.setLevel(committedLevel);
  }, [bindEffort, committedLevel, pending, presenter]);

  useEffect(() => {
    if (enabled) presenter.setLevel(level);
    try {
      localStorage.setItem(LEVEL_KEY, String(level));
    } catch {
      // storage may be unavailable
    }
  }, [level, enabled, presenter]);

  if (!enabled) return null;
  if (bindEffort && (reasoning === null || efforts.length < 2)) return null;

  const previewIndex = bindEffort ? nearestEffortIndex(level, efforts) : -1;
  const previewEffort = efforts[previewIndex];
  const progressRatio = level / MAX_LEVEL;
  const tooltipLabel = previewEffort?.name;

  const commit = async (rawLevel: number) => {
    if (!bindEffort) {
      dragging.current = false;
      const next = clampLevel(rawLevel);
      setLevel(next);
      presenter.setLevel(next);
      return;
    }
    const targetIndex = nearestEffortIndex(rawLevel, efforts);
    const target = efforts[targetIndex];
    if (target === undefined) return;
    const targetLevel = levelForEffort(targetIndex, efforts.length);
    dragging.current = false;
    setLevel(targetLevel);
    presenter.setLevel(targetLevel);
    if (targetIndex === committedIndex || pending) return;
    setPending(true);
    setFailed(false);
    const accepted = await select({
      provider: reasoning.selection.provider,
      model: reasoning.selection.model,
      reasoningEffort: target.id,
    });
    setPending(false);
    if (!accepted) {
      setFailed(true);
      setLevel(committedLevel);
      presenter.setLevel(committedLevel);
    }
  };

  return (
    <div
      className="flash-level-control"
      data-plugin={PACKAGE_ID}
      data-state={failed ? "error" : pending ? "pending" : "ready"}
      title={bindEffort ? previewEffort?.name : undefined}
    >
      {interacting && (
        <output
          className="flash-level-control__tooltip"
          style={{ "--flash-slider-ratio": progressRatio } as React.CSSProperties}
        >
          {tooltipLabel ?? `${Math.round(progressRatio * 100)}%`}
        </output>
      )}
      <div className="flash-level-control__ticks" aria-hidden="true">
        {efforts.map((effort, index) => (
          <i
            className="flash-level-control__tick"
            key={effort.id}
            style={{ left: `${(levelForEffort(index, efforts.length) / MAX_LEVEL) * 100}%` }}
          />
        ))}
      </div>
      <input
        className="flash-level-control__range"
        type="range"
        min={0}
        max={MAX_LEVEL}
        step={1}
        value={level}
        disabled={pending || state.status === "selecting"}
        aria-label={bindEffort ? "推理强度" : "皮肤强度"}
        aria-valuetext={bindEffort ? previewEffort?.name ?? "" : tooltipLabel ?? ""}
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
          if (event.key === "Escape" && !pending) {
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

function EffortBindingRow({ scope, t }: EffortBindingRowProps) {
  const snapshot = useSyncExternalStore(
    (listener) => scope.subscribe(listener),
    () => scope.getSnapshot(),
  );
  const [pending, setPending] = useState(false);
  if (!snapshot.enabled) return null;

  return (
    <div className="flash-appearance-binding" data-plugin={PACKAGE_ID}>
      <span>{t("effort.binding")}</span>
      <Switch
        checked={snapshot.bindEffort}
        disabled={pending}
        label={t("effort.binding")}
        onChange={(next) => {
          if (pending) return;
          setPending(true);
          void scope.setBindEffort(next).catch(() => undefined).finally(() => setPending(false));
        }}
      />
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
// 重渲染。未写入过配置时回落内建三组默认身份（DEFAULT_PORTRAIT_SETS）。
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
  const sets = (configured.length > 0 ? configured : DEFAULT_PORTRAIT_SETS).map((set) => ({
    id: set.id,
    label: setDisplayName(set, localeSnapshot.active),
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
                    <img
                      key={index}
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
                  ))}
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
    // before the rename are normalized to their pinyin equivalents on read.
    const id = normalizeSetId(localStorage.getItem(SET_KEY));
    if (id) return id;
  } catch {
    // storage may be unavailable
  }
  return DEFAULT_PORTRAIT_SETS[0].id;
}

function createPreferenceStore(initialSet: string): PreferenceStore {
  let snapshot: SkinSettings = {
    enabled: true,
    set: initialSet ? initialSet : DEFAULT_PORTRAIT_SETS[0].id,
    bindEffort: localStorage.getItem(BIND_EFFORT_KEY) !== "0",
  };
  const listeners = new Set<() => void>();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== SET_KEY && event.key !== BIND_EFFORT_KEY) return;
    const nextSetId = event.key === SET_KEY ? normalizeSetId(event.newValue) : undefined;
    const next = {
      enabled: snapshot.enabled,
      set: event.key === SET_KEY ? (nextSetId ?? snapshot.set) : snapshot.set,
      bindEffort: event.key === BIND_EFFORT_KEY ? event.newValue !== "0" : snapshot.bindEffort,
    };
    if (next.enabled === snapshot.enabled && next.set === snapshot.set && next.bindEffort === snapshot.bindEffort) return;
    snapshot = next;
    for (const listener of listeners) listener();
  };
  window.addEventListener("storage", onStorage);
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async set(enabled) {
      if (enabled === snapshot.enabled) return;
      snapshot = { ...snapshot, enabled };
      for (const listener of listeners) listener();
    },
    async setSet(setId) {
      if (!setId || setId === snapshot.set) return;
      try {
        localStorage.setItem(SET_KEY, setId);
      } catch {
        // storage may be unavailable
      }
      snapshot = { ...snapshot, set: setId };
      for (const listener of listeners) listener();
    },
    async setBindEffort(bindEffort) {
      if (bindEffort === snapshot.bindEffort) return;
      try {
        localStorage.setItem(BIND_EFFORT_KEY, bindEffort ? "1" : "0");
      } catch {
        // storage may be unavailable
      }
      snapshot = { ...snapshot, bindEffort };
      for (const listener of listeners) listener();
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
  /** 由插件管理页提供、已绑定到本插件语言命名空间的读取器。 */
  t?: (key: string) => string;
}

const CONFIG_TEXTS: Record<string, Record<string, string>> = {
  zh: {
    "loading": "正在加载…",
    "title": "肖像皮肤组",
    "hint": "每个组是一组有序图片，槽位从左到右对应推理等级由低到高，空槽位会回退到默认素材。",
    "readOnly": "当前文档不允许写入，请先开启连接或权限。",
    "openDetails": "Flash皮肤插件配置",
    "openDetailsHint": "在插件管理页打开本插件（dsh-flash-skin）的详情。",
    "empty": "还没有任何肖像皮肤组，可以先用内置素材初始化，再从零创建。",
    "loadDefaults": "使用内置素材初始化",
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
    "addImage": "添加图片",
    "pickLocalImage": "本地选图",
    "pickLocalImageHint": "从本机选择一张图片，自动转为内嵌 base64 填入。",
    "imageUrlPlaceholder": "图片 URL（http/https 或 /plugins/dsh-flash-skin/assets/…）",
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
    "dividerLeft": "深色切换点左移一档",
    "dividerRight": "深色切换点右移一档",
    "setId": "标识（Set ID）",
    "setIdPlaceholder": "标识，如 liangsheng",
    "zhName": "中文名称",
    "enName": "英文名称",
    "identityHint": "标识（Set ID）写入 localStorage 持久化当前选择：改名后需重新点击选中该组才生效；设置行名称按界面语言显示（中文界面中文名，英文界面英文名）。内置组的默认中/英文名会在未修改时一直作为缺省显示。",
  },
  en: {
    "loading": "Loading…",
    "title": "Portrait groups",
    "hint": "Each group is an ordered set of images; slots run from low to high reasoning level left to right. Empty slots fall back to the default art.",
    "readOnly": "The current document does not accept writes; connect or grant permission first.",
    "openDetails": "Flash Skin plugin settings",
    "openDetailsHint": "Open this plugin's (dsh-flash-skin) detail page in the plugin manager.",
    "empty": "No portrait groups yet — initialize from the built-in art, or create one from scratch.",
    "loadDefaults": "Initialize from built-in art",
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
    "addImage": "Add image",
    "pickLocalImage": "Pick local image",
    "pickLocalImageHint": "Choose an image from this device; it is embedded as base64 automatically.",
    "imageUrlPlaceholder": "Image URL (http/https or /plugins/dsh-flash-skin/assets/…)",
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
    "dividerLeft": "Move threshold left",
    "dividerRight": "Move threshold right",
    "setId": "Set ID (identifier)",
    "setIdPlaceholder": "Identifier, e.g. liangsheng",
    "zhName": "Chinese name",
    "enName": "English name",
    "identityHint": "The Set ID is persisted in localStorage for the current selection — after renaming, click the group again to take effect. The settings row shows the Chinese name in the Chinese UI and the English name in the English UI. Built-in sets keep their default Chinese/English names as fallbacks until overridden.",
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

// The light/dark boundary for a group: with `count` images there are
// `count + 1` boundaries, and darkLevel (0..MAX_LEVEL) is the slider stop at
// which the set goes dark, so the boundary position maps linearly onto the
// slider stops.
function boundaryForDarkLevel(count: number, level: number): number {
  if (count <= 0) return 0;
  return Math.min(count, Math.max(0, Math.round((level / MAX_LEVEL) * count)));
}

function FlashSkinConfigCard({ form, t: localeT }: FlashSkinConfigCardProps) {
  const snapshot = useSyncExternalStore(
    (listener) => form.subscribe(listener),
    () => form.getSnapshot(),
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
        <p className="flash-portrait-groups__notice">{t("loading")}</p>
      </section>
    );
  }

  const withGroup = (groupIndex: number, update: (group: PortraitGroupConfig) => PortraitGroupConfig) => {
    const next = groups.slice();
    next[groupIndex] = update(next[groupIndex]);
    return next;
  };

  // Click-driven threshold: move the light/dark boundary one slider stop at a
  // time with the left/right arrows that flank the divider. No mouse drag.
  const stepDivider = (groupIndex: number, delta: -1 | 1) => {
    if (!writable || busy) return;
    const group = groups[groupIndex];
    const current = group?.darkLevel ?? MAX_LEVEL - 1;
    const next = clampLevel(current + delta);
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

  const loadBuiltinGroups = () => {
    const next: PortraitGroupsConfig = DEFAULT_PORTRAIT_SETS.map((set) => ({
      id: set.id,
      name: set.zh,
      zh: set.zh,
      en: set.en,
      darkLevel: MAX_LEVEL - 1,
      images: (PORTRAIT_ANCHORS[set.id] ?? []).map((anchor) => `${ASSET_PREFIX}/${set.folder}/${anchor.file}`),
    }));
    void commit(next);
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
    <section className="flash-portrait-groups" data-plugin={PACKAGE_ID} data-state={writable ? "ready" : "readonly"}>
      <header className="flash-portrait-groups__head">
        <h2 className="flash-portrait-groups__title">{t("title")}</h2>
        {!writable && <p className="flash-portrait-groups__notice" role="status">{t("readOnly")}</p>}
      </header>
      <p className="flash-portrait-groups__hint">{t("hint")}</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        aria-hidden="true"
        tabIndex={-1}
        onChange={onFileInputChange}
      />
      {fileError && (
        <p className="flash-portrait-groups__notice flash-portrait-groups__notice--error" role="alert">
          {fileError}
        </p>
      )}

      {groups.length === 0 && (
        <div className="flash-portrait-groups__empty">
          <p>{t("empty")}</p>
          <button type="button" disabled={!writable || busy} onClick={loadBuiltinGroups}>
            {t("loadDefaults")}
          </button>
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
                    className="flash-portrait-group__danger"
                    disabled={!writable || busy}
                    onClick={() => deleteGroup(groupIndex)}
                  >
                    {t("deleteGroup")}
                  </button>
                </div>
              </header>

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
                            onError={(event) => {
                              event.currentTarget.style.opacity = "0.25";
                            }}
                          />
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

      <footer className="flash-portrait-groups__foot">
        <button type="button" disabled={!writable || busy} onClick={addGroup}>
          + {t("addGroup")}
        </button>
        {busy && <span className="flash-portrait-groups__notice" role="status">…</span>}
      </footer>
    </section>
  );
}

export function apply(ctx: ClientContext) {
  const style = document.createElement("style");
  style.dataset.plugin = PACKAGE_ID;
  style.textContent = styles;
  document.head.append(style);
  ctx.effect(() => () => style.remove(), "flash-skin: scoped styles");

  const theme = ctx.get("theme") as ThemeService;
  const scope = createPreferenceStore(restoreInitialSet());
  ctx.effect(() => () => scope.dispose(), "flash-skin: appearance preference");
  const presenter = new SkinPresenter(scope, theme);
  ctx.effect(() => () => presenter.dispose(), "flash-skin: backdrop presenter");

  // 宿主插件管理器把「打开某包详情页」暴露为反射服务 pluginNavigation.openBundle；
  // 从任何插件的 bundle 里都能拿到，点击即跳转插件管理 → 已安装 → 本包详情。
  // 该能力来自宿主内建插件管理器，与 dsh-flash 插件无关；缺失时静默降级。
  const openDetails = () => {
    try {
      const navigation = (ctx.reflect as unknown as { get?: (id: string) => unknown }).get?.("pluginNavigation");
      const open = (navigation as { openBundle?: (name: string) => void } | undefined)?.openBundle;
      if (typeof open === "function") open(PACKAGE_ID);
    } catch {
      // 反射服务不可用时静默降级，按钮只是不跳转。
    }
  };

  ctx.effect(
    () => ctx.locale.register(LOCALE_NAMESPACE, {
      zh: {
        ...CONFIG_TEXTS.zh,
        "appearance": "人物肖像",
        "portraitSet": "人物肖像组",
        "effort.binding": "滑块绑定推理强度",
      },
      en: {
        ...CONFIG_TEXTS.en,
        "appearance": "Portrait group",
        "portraitSet": "Portrait set",
        "effort.binding": "Bind slider to reasoning level",
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
    order: 20,
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
    const list = configured.length > 0 ? configured : DEFAULT_PORTRAIT_SETS;
    return list.map((set) => ({
      label: setDisplayName(set, active),
      value: normalizeSetId(set.id) ?? set.id,
    }));
  };

  const registerQuickSwitches = (registry: unknown) => {
    if (quickSwitchesRegistered) return;
    const reg = registry as typeof quickControl;
    if (!reg || typeof reg.registerSwitch !== "function") return;
    quickSwitchesRegistered = true;
    quickControl = reg;

    // Keep both rows in sync with the skin's own enabled state: the panel only
    // re-runs `visible()` after a registry version bump, so push one whenever
    // the enabled flag flips (choose/disable) so rows appear/disappear without
    // a panel reload.
    let lastEnabled = presenter.isEnabled();
    const offScope = scope.subscribe(() => {
      const enabled = presenter.isEnabled();
      if (enabled === lastEnabled) return;
      lastEnabled = enabled;
      quickControl?.notifyChange?.(OPEN_DETAILS_SWITCH_ID);
      quickControl?.notifyChange?.(PORTRAIT_SET_SWITCH_ID);
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
        label: () => setLabel("portraitSet"),
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
      const openDispose = reg.registerSwitch?.({
        id: OPEN_DETAILS_SWITCH_ID,
        label: () => setLabel("openDetails"),
        icon: "doc",
        type: "action",
        // Built-in Appearance group (just past the portrait-set row at 26),
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
        if (typeof openDispose === "function") openDispose();
        else reg.unregisterSwitch?.(OPEN_DETAILS_SWITCH_ID);
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
    inject: () => ({ form: configForm }),
  }, FlashSkinConfigCard));

  ctx.slots.inject("settings.general.item", () => ctx.slots.register({
    name: "settings.general.item",
    id: "flash-effort-binding",
    order: 10.5,
    locale: LOCALE_NAMESPACE,
    inject: () => ({ scope }),
  }, EffortBindingRow));

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
    inject: (sessionId: string) => {
      const available = ctx.sessions.subagentAddress(sessionId) === undefined;
      const directory = ctx.modelDirectories.directoryFor(sessionId) as ModelDirectory;
      return {
        directory: directory.store,
        presenter,
        scope,
        settings: { level: readLevel() },
        load: () => {
          if (available) void directory.load().catch(() => undefined);
        },
        select: (selection: ModelSelection) => available
          ? directory.select(selection).then((result) => result.ok, () => false)
          : Promise.resolve(false),
      };
    },
  }, FlashLevelControl));
}
