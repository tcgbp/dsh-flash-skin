import { MAX_LEVEL } from "./constants";

export interface EffortLike {
  id: string;
  name: string;
  description?: string;
}

export function clampLevel(value: number, maxLevel: number = MAX_LEVEL): number {
  if (!Number.isFinite(value)) return 0;
  const max = Number.isFinite(maxLevel) ? Math.max(0, Math.round(maxLevel)) : MAX_LEVEL;
  return Math.min(max, Math.max(0, Math.round(value)));
}

/**
 * Clamp onto the 0..maxLevel slider without snapping to an integer stop.
 * Used by the fine-grained light/dark divider (see `dividerStepFor`) so a
 * multi-frame group can settle on every frame-to-frame gap, not just the
 * integer stops. The clamp rides the group's dynamic axis max (default
 * MAX_LEVEL) so a >MAX_LEVEL group holds values up to its own frame count.
 */
export function clampLevelContinuous(value: number, maxLevel: number = MAX_LEVEL): number {
  if (!Number.isFinite(value)) return 0;
  const max = Number.isFinite(maxLevel) ? Math.max(0, Math.round(maxLevel)) : MAX_LEVEL;
  return Math.min(max, Math.max(0, value));
}

/**
 * The effective width of the slider/portrait/dark-divider axis for a
 * `count`-frame group: the group's own frame count when it exceeds the fixed
 * MAX_LEVEL stops, else the classic 0..MAX_LEVEL baseline. This is the shared
 * datum — slider value, palette light/dark switch and portrait frame all
 * normalize against it, so a group with more frames than MAX_LEVEL keeps every
 * frame reachable instead of collapsing to the baseline.
 */
export function dividerAxisMax(count: number): number {
  const safe = Number.isFinite(count) && count > 1 ? Math.floor(count) : 0;
  return Math.max(MAX_LEVEL, safe);
}

/**
 * How far one arrow click moves the light/dark divider for a `count`-frame
 * group. `darkLevel` is an integer slider stop on the dynamic frame axis, so
 * every press advances exactly one integer stop regardless of the frame count.
 */
export function dividerStepFor(_count: number): number {
  return 1;
}

/**
 * Level the light/dark divider moves to after one arrow press. Steps the
 * current integer `darkLevel` by one slider stop in the chosen direction and
 * clamps onto the group's dynamic axis (0..max(MAX_LEVEL, count)), rounding to
 * the nearest integer stop so the persisted threshold is always an integer.
 */
export function nextDividerLevel(current: number, delta: -1 | 1, count: number): number {
  const next = clampLevel(current + delta, dividerAxisMax(count));
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
