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
  /** Scrim overlay colours (rgba over the shell `page`), used by the
   *  `::after` stage mask the way dsh-liang-skin does. Strong/soft feed the
   *  left-to-right gradient, base tints the whole stage; each follows the
   *  active shell so the overlay reads differently in light vs dark. */
  maskBase: string;
  maskStrong: string;
  maskSoft: string;
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
  const rgba = (hex: string, alpha: number) => {
    const num = parseInt(hex.slice(1), 16);
    return `rgba(${(num >> 16) & 0xff}, ${(num >> 8) & 0xff}, ${num & 0xff}, ${alpha})`;
  };
  // Mirror dsh-liang-skin's binary appearance: the lowest levels keep the
  // native light shell, and only levels at/above the (per-group, default
  // maxLevel - 1) dark threshold switch to the dark shell. The portrait frame
  // still advances continuously with the level. Both level and darkLevel live
  // on the same 0..maxLevel axis (maxLevel = the active group's frame count),
  // so a group with more frames than MAX_LEVEL re-scales the whole shell.
  const dark = level >= darkAt;
  const base = dark ? DARK : LIGHT;
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
    // Match dsh-liang-skin's rendering: the portrait frame is drawn fully
    // opaque (liang keeps portraitOpacity = 1 at every level). A lower opacity
    // lets the shell page bleed through the image like a veil, which reads as
    // a "mask" and makes the same picture look dimmer/less clear than in
    // liang-skin. The level-driven fade is deliberately removed for parity.
    portraitOpacity: "1",
    // Scrim overlay mirrors dsh-liang-skin: base is denser on the dark shell
    // (0.42 vs 0.28 on light) so the portrait reads sharp on dark and airier
    // on light; strong/soft drive the horizontal fade.
    maskBase: rgba(base.page, dark ? 0.42 : 0.28),
    maskStrong: rgba(base.page, 0.46),
    maskSoft: rgba(base.page, 0.2),
  };
}
