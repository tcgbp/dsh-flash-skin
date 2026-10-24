import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Switch } from "@deepseek-ai/dsh-client-ui-primitives";
import type { Context as ClientContext } from "@deepseek-ai/cordis";
import type { SnapshotStore } from "@deepseek-ai/dsh-client-store";
import type {} from "@deepseek-ai/dsh-client-ui-conversation/client";
import type {} from "@deepseek-ai/dsh-client-ui-settings/client";
import type {} from "@deepseek-ai/dsh-client-ui-model-selection/client";
import type {} from "@deepseek-ai/dsh-client-ui-theme/client";
import styles from "./skin.css";
import { installFlashAppearanceSets } from "./appearance";
import { createPortraitLoader } from "./portrait-loader";
import type { PortraitImage } from "./portrait-loader";
import {
  FROZEN_PALETTE,
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

// Level→file anchors per portrait set. Each set serves 8 distinct frames spread
// evenly across the reasoning scale (0..30); the file names are just per-set
// Level→file anchors per portrait set. MAX_LEVEL is 7, so the slider exposes 8
// integer stops whose portraitLevel frames land on the evenly spaced reasoning
// slots 0,4,9,13,17,21,26,30. Each set serves 8 distinct frames assigned one per
// slot, ordered by the file-name number (lowest → slot 0, highest → slot 30).
const PORTRAIT_ANCHORS: Record<string, { level: number; file: string }[]> = {
  storm: [
    { level: 0, file: "stage-00.webp" },
    { level: 4, file: "level-04.webp" },
    { level: 9, file: "level-09.webp" },
    { level: 13, file: "level-13.webp" },
    { level: 17, file: "level-16.webp" },
    { level: 21, file: "level-19.webp" },
    { level: 26, file: "stage-24.webp" },
    { level: 30, file: "level-28.webp" },
  ],
  blaze: [
    { level: 0, file: "level-01.webp" },
    { level: 4, file: "stage-06.webp" },
    { level: 9, file: "level-10.webp" },
    { level: 13, file: "level-14.webp" },
    { level: 17, file: "level-17.webp" },
    { level: 21, file: "level-21.webp" },
    { level: 26, file: "level-25.webp" },
    { level: 30, file: "level-29.webp" },
  ],
  frost: [
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

interface PortraitSet {
  id: string;
  folder: string;
}

// Each portrait set is its own skin-specific "appearance" and replaces one of
// the system's default appearance slots. Demo uses three sets; swap the
// folder contents to point at different character art.
const PORTRAIT_SETS: PortraitSet[] = [
  { id: "storm", folder: "portrait-source-v2" },
  { id: "blaze", folder: "portrait-source-v3" },
  { id: "frost", folder: "portrait-source-v4" },
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

interface FlashThemeDefinition {
  id: string;
  colorScheme: "light" | "dark";
  // Registered theme tokens are bare per-scheme values (each registered theme
  // already names its colorScheme; the { light, dark } pair shape only applies
  // to overrideTokens).
  tokens: Record<string, string>;
}

interface ThemeService {
  getTheme(): { preference: string; themes: readonly FlashThemeDefinition[] };
  setTheme(id: string): void;
  register(definition: FlashThemeDefinition): () => void;
}

// Each portrait set is registered with the DSH theme service as its own palette
// so the dsh-flash quick panel's 外观 (appearance) theme dropdown lists it (it
// treats any registered theme with non-empty tokens as a palette option). The
// quick panel reads `getTheme().themes` and labels each entry by its id, so the
// REGISTERED id doubles as the user-facing option label. That is why the theme
// ids below are the Chinese portrait-set names (梁圣/梁神/梁祖), not the internal
// set keys — the quick panel shows whatever string the palette id holds.
const FLASH_THEME_LABELS: Record<string, string> = {
  storm: "梁圣",
  blaze: "梁神",
  frost: "梁祖",
};
// A previously shipped build registered palettes under `flash-<setId>`; keep
// decoding that legacy form so a preference persisted before the rename still
// round-trips to the matching portrait set.
const FLASH_THEME_PREFIX = "flash-";

function flashThemeIdForSet(setId: string): string {
  return FLASH_THEME_LABELS[setId] ?? setId;
}

function setIdForFlashTheme(themeId: string): string | null {
  const direct = Object.keys(FLASH_THEME_LABELS).find(
    (setId) => FLASH_THEME_LABELS[setId] === themeId,
  );
  if (direct !== undefined) return direct;
  if (themeId.startsWith(FLASH_THEME_PREFIX)) {
    const setId = themeId.slice(FLASH_THEME_PREFIX.length);
    return FLASH_THEME_LABELS[setId] !== undefined ? setId : null;
  }
  return null;
}

function isFlashThemeId(id: string): boolean {
  return setIdForFlashTheme(id) !== null;
}

// Registered once per session and reused across apply/dispose cycles (the
// theme service refuses duplicate ids, so the disposers below are torn down
// together — see ThemeRuntime.register).
const flashThemeDisposers = new Map<string, () => void>();

function ensureFlashPalettes(theme: ThemeService): () => void {
  if (typeof theme.register !== "function") return () => undefined;
  const disposers: (() => void)[] = [];
  for (const set of PORTRAIT_SETS) {
    const id = flashThemeIdForSet(set.id);
    const existing = flashThemeDisposers.get(id);
    if (existing) {
      disposers.push(existing);
      continue;
    }
    let disposer: (() => void) | undefined;
    try {
      disposer = theme.register({
        id,
        colorScheme: "dark",
        tokens: flashPaletteTokens(),
      });
    } catch {
      disposer = undefined;
    }
    if (disposer) {
      flashThemeDisposers.set(id, disposer);
      disposers.push(disposer);
    }
  }
  return () => {
    for (const [id, disposer] of flashThemeDisposers) {
      try { disposer(); } catch { /* noop */ }
      flashThemeDisposers.delete(id);
    }
  };
}

// The palette values are frozen to the dark scheme and identical across the
// three portrait sets (the sets only differ by the character art). The
// registered tokens just need to be a non-empty map so the quick panel's
// appearance dropdown lists each set as its own palette entry.
function flashPaletteTokens(): Record<string, string> {
  return {
    "--flash-page": FROZEN_PALETTE.page,
    "--flash-surface": FROZEN_PALETTE.surface,
    "--flash-ink": FROZEN_PALETTE.ink,
    "--flash-secondary": FROZEN_PALETTE.secondary,
    "--flash-accent": FROZEN_PALETTE.accent,
    "--flash-accent-hover": FROZEN_PALETTE.accentHover,
    "--flash-portrait-opacity": FROZEN_PALETTE.portraitOpacity,
  };
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
  private set: PortraitSet = PORTRAIT_SETS[0];
  private disposed = false;
  private unsubscribe: () => void;

  private sourcesForSet(set: PortraitSet) {
    const anchors = PORTRAIT_ANCHORS[set.id] ?? [];
    return anchors.map(({ level, file }) => ({
      level,
      url: `${ASSET_PREFIX}/${set.folder}/${file}`,
    }));
  }

  constructor(scope: PreferenceStore, theme: ThemeService) {
    this.scope = scope;
    this.theme = theme;
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
    this.setPortraitSet(PORTRAIT_SETS.find((item) => item.id === snapshot.set) ?? PORTRAIT_SETS[0]);
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
    if (this.enabled) {
      this.portraits.start();
      this.updatePortrait();
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
  // (level 6 and 7) switch to the dark shell.
  private applyPalette() {
    if (this.disposed || !this.enabled) return;
    const palette = paletteForLevel(this.level);
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

  syncNativeTheme(theme: NativeThemeId = paletteForLevel(this.level).stage === 1 ? "dark" : "light") {
    if (!this.enabled) return;
    const preference = this.theme.getTheme().preference;
    if (preference === theme) return;
    // A flash palette chosen through the dsh-flash quick panel's appearance
    // dropdown sits in the same preference slot as the base colour schemes.
    // Never trample an active flash palette back to a base scheme here.
    if (isFlashThemeId(preference)) return;
    this.theme.setTheme(theme);
  }

  async choose(setId: string) {
    const set = PORTRAIT_SETS.find((item) => item.id === setId) ?? PORTRAIT_SETS[0];
    this.setEnabled(true);
    this.setPortraitSet(set);
    // Surface the choice in the dsh-flash quick panel appearance dropdown by
    // moving the theme preference onto the matching flash palette. `setTheme`
    // short-circuits when the preference is already there, so this is safe to
    // repeat (including via the theme/change bridge below).
    const themeId = flashThemeIdForSet(set.id);
    if (this.theme.getTheme().preference !== themeId) {
      try { this.theme.setTheme(themeId); } catch { /* palette may be unregistered */ }
    }
    try {
      await this.scope.set(true);
      await this.scope.setSet(set.id);
    } catch (error) {
      this.syncSettings();
      throw error;
    }
  }

  async disable() {
    // A flash palette active via the quick panel must not stay highlighted once
    // the skin is turned off, so fall back to following the system scheme.
    const preference = this.theme.getTheme().preference;
    this.setEnabled(false);
    if (isFlashThemeId(preference)) {
      try { this.theme.setTheme("system"); } catch { /* ignore */ }
    }
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

export const inject = [
  "slots",
  "sessions",
  "modelDirectories",
  "locale",
  "theme",
  "configForms",
];

function createPreferenceStore(): PreferenceStore {
  const readSet = () => {
    try {
      const id = localStorage.getItem(SET_KEY);
      return PORTRAIT_SETS.some((item) => item.id === id) ? id! : PORTRAIT_SETS[0].id;
    } catch {
      return PORTRAIT_SETS[0].id;
    }
  };
  let snapshot: SkinSettings = {
    enabled: true,
    set: readSet(),
    bindEffort: localStorage.getItem(BIND_EFFORT_KEY) !== "0",
  };
  const listeners = new Set<() => void>();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== SET_KEY && event.key !== BIND_EFFORT_KEY) return;
    const next = {
      enabled: snapshot.enabled,
      set: event.key === SET_KEY
        ? (PORTRAIT_SETS.some((item) => item.id === event.newValue) ? event.newValue! : snapshot.set)
        : snapshot.set,
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
      if (!PORTRAIT_SETS.some((item) => item.id === setId) || setId === snapshot.set) return;
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
  name: string;
  images: string[];
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
    "imageUrlPlaceholder": "图片 URL（http/https 或 /plugins/dsh-flash-skin/assets/…）",
    "confirm": "确定",
    "cancel": "取消",
    "urlEmpty": "请输入图片 URL",
    "defaultGroup": "新的皮肤组",
  },
  en: {
    "loading": "Loading…",
    "title": "Portrait groups",
    "hint": "Each group is an ordered set of images; slots run from low to high reasoning level left to right. Empty slots fall back to the default art.",
    "readOnly": "The current document does not accept writes; connect or grant permission first.",
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
    "imageUrlPlaceholder": "Image URL (http/https or /plugins/dsh-flash-skin/assets/…)",
    "confirm": "OK",
    "cancel": "Cancel",
    "urlEmpty": "Enter an image URL",
    "defaultGroup": "New group",
  },
};

function newGroupId(): string {
  const random = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `group-${random}`;
}

function FlashSkinConfigCard({ form, t: localeT }: FlashSkinConfigCardProps) {
  const snapshot = useSyncExternalStore(
    (listener) => form.subscribe(listener),
    () => form.getSnapshot(),
  );
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<{
    kind: "name" | "add" | "replace";
    groupIndex: number;
    imageIndex?: number;
    value: string;
  } | null>(null);

  const t = (key: string): string => {
    if (typeof localeT === "function") return localeT(key);
    return CONFIG_TEXTS.en[key] ?? key;
  };

  const groups = snapshot.value ?? [];
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

  const renameGroup = (groupIndex: number, name: string) => {
    const trimmed = name.trim();
    if (trimmed === "" || trimmed === groups[groupIndex]?.name) return;
    const next = withGroup(groupIndex, (group) => ({ ...group, name: trimmed }));
    void commit(next);
  };

  const deleteGroup = (groupIndex: number) => {
    void commit(groups.filter((_, index) => index !== groupIndex));
  };

  const addGroup = () => {
    const next = [...groups, { id: newGroupId(), name: t("defaultGroup"), images: [] }];
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

  const loadBuiltinGroups = () => {
    const next: PortraitGroupsConfig = PORTRAIT_SETS.map((set) => ({
      id: set.id,
      name: t(`set.${set.id}`),
      images: (PORTRAIT_ANCHORS[set.id] ?? []).map((anchor) => `${ASSET_PREFIX}/${set.folder}/${anchor.file}`),
    }));
    void commit(next);
  };

  return (
    <section className="flash-portrait-groups" data-plugin={PACKAGE_ID} data-state={writable ? "ready" : "readonly"}>
      <header className="flash-portrait-groups__head">
        <h2 className="flash-portrait-groups__title">{t("title")}</h2>
        {!writable && <p className="flash-portrait-groups__notice" role="status">{t("readOnly")}</p>}
      </header>
      <p className="flash-portrait-groups__hint">{t("hint")}</p>

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
          const editingName = editing?.kind === "name" && editing.groupIndex === groupIndex;
          const editingAdd = editing?.kind === "add" && editing.groupIndex === groupIndex;
          return (
            <li key={group.id} className="flash-portrait-group">
              <header className="flash-portrait-group__head">
                <input
                  className="flash-portrait-group__name"
                  aria-label={t("renameGroup")}
                  value={editingName ? editing.value : group.name}
                  disabled={!writable || busy}
                  onFocus={() => setEditing({ kind: "name", groupIndex, value: group.name })}
                  onChange={(event) =>
                    setEditing({ kind: "name", groupIndex, value: event.currentTarget.value })
                  }
                  onBlur={() => {
                    if (editingName) renameGroup(groupIndex, editing.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                    if (event.key === "Escape") setEditing(null);
                  }}
                />
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

              <ol className="flash-portrait-group__images">
                {group.images.map((src, imageIndex) => {
                  const editingReplace =
                    editing?.kind === "replace" &&
                    editing.groupIndex === groupIndex &&
                    editing.imageIndex === imageIndex;
                  return (
                    <li key={`${imageIndex}-${src}`} className="flash-portrait-group__image">
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
                  );
                })}
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

  const scope = createPreferenceStore();
  ctx.effect(() => () => scope.dispose(), "flash-skin: appearance preference");
  const theme = ctx.get("theme") as ThemeService;
  const presenter = new SkinPresenter(scope, theme);
  ctx.effect(() => () => presenter.dispose(), "flash-skin: backdrop presenter");

  // Register the three portrait sets as theme palettes so the dsh-flash quick
  // panel's 外观 (appearance) theme dropdown lists them (it exposes any
  // registered theme with its own tokens). No dsh-flash dependency: this only
  // talks to the native theme service.
  const disposeFlashThemes = ensureFlashPalettes(theme);
  ctx.effect(() => () => disposeFlashThemes(), "flash-skin: theme palettes");

  // Bridge selection from the quick panel's appearance dropdown back to the
  // presenter: when the preference lands on one of our flash palettes, enable
  // Flash Skin with the matching portrait set. Base schemes are intentionally
  // left alone — Flash Skin can be on while the native scheme stays light/dark
  // (the Settings path), and turning it off goes through `presenter.disable()`.
  ctx.effect(
    () => ctx.on("theme/change", (snapshot: { preference?: string }) => {
      const preference = snapshot?.preference;
      if (typeof preference !== "string") return;
      const setId = setIdForFlashTheme(preference);
      if (setId === null) return;
      if (!PORTRAIT_SETS.some((set) => set.id === setId)) return;
      void presenter.choose(setId).catch(() => undefined);
    }),
    "flash-skin: theme preference bridge",
  );
  ctx.effect(
    () => ctx.locale.register(LOCALE_NAMESPACE, {
      zh: {
        ...CONFIG_TEXTS.zh,
        "appearance": "Flash Skin",
        "effort.binding": "滑块绑定推理强度",
        "set.storm": "梁圣",
        "set.blaze": "梁神",
        "set.frost": "梁祖",
      },
      en: {
        ...CONFIG_TEXTS.en,
        "appearance": "Flash Skin",
        "effort.binding": "Bind slider to reasoning level",
        "set.storm": "梁圣",
        "set.blaze": "梁神",
        "set.frost": "梁祖",
      },
    }),
    "flash-skin: settings locale",
  );

  const setLabel = ctx.locale.bind(LOCALE_NAMESPACE);
  ctx.effect(
    () => installFlashAppearanceSets(
      scope,
      presenter,
      PACKAGE_ID,
      PORTRAIT_SETS.map((set) => ({ id: set.id, label: setLabel(`set.${set.id}`) })),
    ),
    "flash-skin: native appearance replacement",
  );

  // 自定义配置页：插件管理页在「已配置」的 bundle 上渲染 plugins.bundle.config
  // 槽位（视图为页面，key 取 bundle 包名）。表单直接对准 Host 的 volatile 设置
  // 命名空间 flash-skin，整数组原子覆写 + 修订号围栏由 FlashSkinConfigCard 内
  // 的 commit 处理。
  const configForm = ctx.configForms.get<PortraitGroupsConfig>(CONFIG_NAMESPACE);
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

  ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
    name: "conversation.input.right",
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
