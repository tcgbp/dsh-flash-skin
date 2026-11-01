import { MAX_LEVEL } from "./constants";
import { clampLevel } from "./effort";

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
export const FROZEN_PALETTE: Palette = paletteForLevel(MAX_LEVEL, MAX_LEVEL - 1, MAX_LEVEL);

export function paletteForLevel(rawLevel: number, darkLevel?: number, maxLevel: number = MAX_LEVEL): Palette {
  const level = clampLevel(rawLevel, maxLevel);
  const max = Number.isFinite(maxLevel) ? Math.max(0, Math.round(maxLevel)) : MAX_LEVEL;
  const darkAt = (() => {
    if (darkLevel === undefined) return Math.max(0, max - 1);
    return Math.min(max, Math.max(0, Math.round(darkLevel)));
  })();
  const t = max > 0 ? level / max : 0;
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
  // maxLevel - 1) dark threshold switch to the dark shell. The portrait frame
  // still advances continuously with the level. Both level and darkLevel live
  // on the same 0..maxLevel axis (maxLevel = the active group's frame count),
  // so a group with more frames than MAX_LEVEL re-scales the whole shell.
  const dark = level >= darkAt;
  const base = dark ? DARK : LIGHT;
  const portraitScale = max > 0 ? level / max : 0;
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
