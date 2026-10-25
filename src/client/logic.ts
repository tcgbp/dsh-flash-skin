export const MAX_LEVEL = 6;
export const PORTRAIT_MAX_LEVEL = 30;

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
  portraitLevel: number;
  portraitOpacity: string;
}

export function clampLevel(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_LEVEL, Math.max(0, Math.round(value)));
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
    portraitLevel: Math.round(portraitScale * PORTRAIT_MAX_LEVEL),
    portraitOpacity: String(0.4 + portraitScale * 0.42),
  };
}
