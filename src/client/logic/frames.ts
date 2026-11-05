import { MAX_LEVEL } from "./constants";
import { dividerAxisMax } from "./effort";

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
 * Frame index for a continuous slider level in 0..maxLevel, snapped only onto
 * the nearest STAGED frame — never onto an intermediate integer-level grid.
 * This is the two-way counterpart a fine-grained panel slider needs: it is
 * exactly what the portrait loader's `nearestIndex` lands on, so the slider
 * thumb and the displayed portrait agree at every position, and every frame of
 * a group with more images than integer stops (N > maxLevel + 1) stays
 * reachable. Ties pick the higher frame, mirroring `frameIndexForLevel` and
 * the portrait loader.
 */
export function frameIndexForContinuousLevel(level: number, count: number, maxLevel = MAX_LEVEL): number {
  if (!Number.isFinite(level)) return 0;
  if (!Number.isFinite(count) || count <= 1) return 0;
  const frames = stagedFrames(count, maxLevel);
  const safeMax = Number.isFinite(maxLevel) ? Math.max(0, Math.round(maxLevel)) : MAX_LEVEL;
  const target = Math.min(safeMax, Math.max(0, level));
  let best = 0;
  let distance = Math.abs(target - frames[0]);
  for (let index = 1; index < frames.length; index += 1) {
    const next = Math.abs(target - frames[index]);
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

/**
 * Map a level expressed on a master (primary portrait set's) dynamic axis onto
 * a secondary side's own dynamic axis, keeping the two sides aligned at the
 * endpoints (0 → 0 and masterMax → sideMax) and tracking proportionally in
 * between. This is what lets a left and a right portrait group of different
 * frame counts advance in step along the ONE shared slider axis: the primary
 * set defines the master axis (dividerAxisMax(primaryCount)); every other side
 * slices its own frames over that same normalized level.
 *
 * Guards: unknown/NaN level and degenerate masters fall back to 0.
 */
export function remapSideLevel(level: number, masterCount: number, sideCount: number): number {
  // Guards: unknown/NaN level, or a non-positive / non-finite side or master
  // image count, all mean "no usable axis" (an absent/empty side renders nothing)
  // and fall back to level 0. dividerAxisMax itself never yields <= 0 for any
  // finite count (it floors at MAX_LEVEL), so the degeneracy must be tested on
  // the count arguments rather than on the computed axis maxima.
  if (!Number.isFinite(level)
    || !Number.isFinite(masterCount) || masterCount <= 0
    || !Number.isFinite(sideCount) || sideCount <= 0) {
    return 0;
  }
  const masterMax = dividerAxisMax(masterCount);
  const sideMax = dividerAxisMax(sideCount);
  // Normalize against the MASTER axis first (clamping wayward inputs into the
  // master's own 0..masterMax range), then scale by the side axis. Mapping the
  // normalized fraction onto the side keeps both axes aligned at the endpoints
  // (0 → 0, masterMax → sideMax) no matter which axis is wider.
  const t = Math.min(1, Math.max(0, level / masterMax));
  return t * sideMax;
}
