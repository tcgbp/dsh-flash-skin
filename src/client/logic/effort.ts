import { MAX_LEVEL } from "./constants";

export interface EffortLike {
  id: string;
  name: string;
  description?: string;
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

/**
 * Level the light/dark divider moves to after one arrow press. Steps from the
 * current (possibly continuous) `darkLevel` by the group's per-image gap when
 * the frame count exceeds the slider stops (see `dividerStepFor`), and clamps
 * onto the 0..MAX_LEVEL slider. Because the divider position is
 * round(level / MAX_LEVEL * count), a one-image-gap step guarantees the
 * boundary advances exactly one cell on >7-frame groups — never two — while
 * small groups (N ≤ MAX_LEVEL + 1) keep the historical one-stop step.
 */
export function nextDividerLevel(current: number, delta: -1 | 1, count: number): number {
  const next = clampLevelContinuous(current + delta * dividerStepFor(count));
  // Avoid a redundant no-op write when the divider is already at a slider end.
  return next === current ? current : next;
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
