import { MAX_LEVEL } from "./constants";
import { clampLevel } from "./effort";

// -----------------------------------------------------------------------------
// Composite (weighted multi-signal) level — drives the slider when the driver
// is "composite" instead of a manually dragged/effort-bound value.
// -----------------------------------------------------------------------------

/** Usage saturates at 100% once this many output tokens have been produced. */
export const USAGE_FULL = 300_000;
/** Context-pressure fallback (no window/pressure info) saturates at these many turns. */
export const TURNS_FULL = 20;
/** Decode speed saturates at this many tokens per second (default tuning). */
export const TPS_FULL = 100;

/**
 * Tunable timing for the live "speed" axis's staleness decay. Because the
 * projection never resets its decode totals when generation stops, a finished
 * fast run would otherwise pin the speed gauge at 100% forever.
 * - `graceMs`: how long after the last fresh decode the gauge holds its value.
 * - `fadeMs`:  how long it then takes to decay from full to 0.
 * Exposed as number inputs on the plugin's detail config card.
 */
export interface SpeedTuning {
  graceMs: number;
  fadeMs: number;
  /** Produced-token count at which the usage axis saturates (tokens). */
  usageFull: number;
  /** Decode tokens-per-second at which the speed axis saturates. */
  tpsFull: number;
}

export const DEFAULT_SPEED_TUNING: SpeedTuning = {
  graceMs: 600,
  fadeMs: 1500,
  usageFull: USAGE_FULL,
  tpsFull: TPS_FULL,
};

/** Back-compat aliases for code and tests that reference the old constants. */
export const IDLE_GRACE_MS = DEFAULT_SPEED_TUNING.graceMs;
export const IDLE_FADE_MS = DEFAULT_SPEED_TUNING.fadeMs;

/** Peak compaction factor (0..1) applied right after a 压缩 event fires. */
export const COMPACTION_PULSE_BASE = 0.9;
/** How long a compaction pulse holds at full strength before it starts fading. */
export const COMPACTION_GRACE_MS = 1500;
/** How long the pulse takes to fade from full strength to 0 ("持续几秒钟"). */
export const COMPACTION_FADE_MS = 3500;
/** A measured relative drop in projected context tokens at/above this value
 *  counts as a context-compaction event. */
export const COMPACTION_DROP_RATIO = 0.7;
/**
 * Direct fraction (0..1) added onto the weighted composite score while a fresh
 * 压缩 pulse is active — an extra bonus on top of the weighted dims, not a
 * configurable weight. The final score used to pick the level/frame is
 * `weightedBase + COMPACTION_SCORE_BONUS * compactionFactor`.
 */
export const COMPACTION_SCORE_BONUS = 0.25;
export interface CompositeWeights {
  /** share of produced tokens (sat at USAGE_FULL). */
  usage: number;
  /** share of context pressure (projected tokens / window, else turns fallback). */
  pressure: number;
  /** share of the committed reasoning effort (0..MAX_LEVEL). */
  effort: number;
  /** share of decode speed (sat at TPS_FULL). */
  speed: number;
}

export const DEFAULT_COMPOSITE_WEIGHTS: CompositeWeights = {
  usage: 0.3,
  pressure: 0.3,
  effort: 0.2,
  speed: 0.2,
};

export interface CompositeSignals {
  /** decodeTokens — produced-token volume (usage factor). */
  outputTokens?: number;
  /** committed reasoning level 0..MAX_LEVEL (effort factor); unknown → 0. */
  committedLevel?: number;
  /** projected prompt + heuristic tokens (context pressure numerator). */
  pressureTokens?: number;
  /** context window size; ≤ 0 → turns fallback. */
  contextWindow?: number;
  /** conversation turns — pressure fallback when projected tokens unknown. */
  turns?: number;
  /** tokens decoded for the current streamed run (speed numerator). */
  decodeTokens?: number;
  /** wall time spent decoding, ms (speed denominator). */
  decodeMs?: number;
  /** ms timestamp of the most recent context-compaction event (compaction factor). */
  compactionAtMs?: number;
  /** current wall-clock ms used to age the compaction pulse; 0/absent → 0. */
  nowMs?: number;
}

/** Missing/negative/NaN weights or a total of zero fall back to defaults. */
export function normalizeWeights(weights: Partial<CompositeWeights> | null | undefined): CompositeWeights {
  if (weights === null || typeof weights !== "object") return { ...DEFAULT_COMPOSITE_WEIGHTS };
  const fields: Record<keyof CompositeWeights, number | undefined> = {
    usage: weights.usage,
    pressure: weights.pressure,
    effort: weights.effort,
    speed: weights.speed,
  };
  // A missing key counts as zero; a present but non-number / non-finite /
  // negative value is treated as corruption and falls back to defaults.
  let anyInvalid = false;
  for (const key of Object.keys(fields) as (keyof CompositeWeights)[]) {
    const value = fields[key];
    if (value !== undefined && (typeof value !== "number" || !Number.isFinite(value) || value < 0)) {
      anyInvalid = true;
      break;
    }
  }
  const total = (fields.usage ?? 0) + (fields.pressure ?? 0)
    + (fields.effort ?? 0) + (fields.speed ?? 0);
  if (anyInvalid || total <= 0) return { ...DEFAULT_COMPOSITE_WEIGHTS };
  return {
    usage: (fields.usage ?? 0) / total,
    pressure: (fields.pressure ?? 0) / total,
    effort: (fields.effort ?? 0) / total,
    speed: (fields.speed ?? 0) / total,
  };
}

export function usageFactor(outputTokens: number, usageFull: number = USAGE_FULL): number {
  const full = Number.isFinite(usageFull) && usageFull > 0 ? usageFull : USAGE_FULL;
  const safe = Number.isFinite(outputTokens) && outputTokens > 0 ? outputTokens : 0;
  return Math.min(1, safe / full);
}

export function contextPressureFactor(
  pressureTokens?: number,
  contextWindow?: number,
  turns?: number,
): number {
  if (
    pressureTokens !== undefined && Number.isFinite(pressureTokens) && pressureTokens >= 0
    && contextWindow !== undefined && Number.isFinite(contextWindow) && contextWindow > 0
  ) {
    return Math.min(1, pressureTokens / contextWindow);
  }
  const safeTurns = typeof turns === "number" && Number.isFinite(turns)
    ? Math.max(0, turns)
    : 0;
  return Math.min(1, safeTurns / TURNS_FULL);
}

export function reasoningEffortFactor(committedLevel: number): number {
  const safe = Number.isFinite(committedLevel) ? committedLevel : 0;
  return Math.min(1, Math.max(0, safe / MAX_LEVEL));
}

export function tokenSpeedFactor(
  decodeTokens: number,
  decodeMs: number,
  tpsFull: number = TPS_FULL,
): number {
  if (!Number.isFinite(decodeTokens) || !Number.isFinite(decodeMs)) return 0;
  if (decodeTokens <= 0 || decodeMs <= 0) return 0;
  const full = Number.isFinite(tpsFull) && tpsFull > 0 ? tpsFull : TPS_FULL;
  return Math.min(1, decodeTokens / (decodeMs / 1000) / full);
}

/**
 * Staleness decay for the live "speed" axis. The projection only exposes the
 * latest step's decode totals and does not reset them to zero when generation
 * stops, so a finished fast run would otherwise pin the speed gauge at 100%
 * forever. This multiplier ramps the speed factor down to 0 once no fresh
 * decode data has arrived for `graceMs`, fading over `fadeMs` so "stopped"
 * visibly relaxes the composite level.
 */
export function freshnessDecay(
  elapsedMs: number,
  graceMs: number = IDLE_GRACE_MS,
  fadeMs: number = IDLE_FADE_MS,
): number {
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) return 1;
  if (elapsedMs <= graceMs) return 1;
  const over = elapsedMs - graceMs;
  if (over >= fadeMs) return 0;
  return 1 - over / fadeMs;
}

/**
 * Decaying "compaction" factor: right after a context-compaction (压缩) event
 * the gauge jumps to COMPACTION_PULSE_BASE and then relaxes to 0 over a few
 * seconds. `pulseAtMs` is the ms timestamp of the most recent event (null when
 * none ever fired — or when the clock is bogus, which then reads as 0). The
 * caller stamps the pulse inside the live `now` render clock, so no extra
 * timer is needed and the value naturally dissolves frame by frame.
 */
export function contextCompactionFactor(pulseAtMs: number | null, nowMs: number): number {
  if (pulseAtMs === null || !Number.isFinite(pulseAtMs) || !Number.isFinite(nowMs)) return 0;
  if (nowMs < pulseAtMs) return 0;
  return COMPACTION_PULSE_BASE * freshnessDecay(
    nowMs - pulseAtMs,
    COMPACTION_GRACE_MS,
    COMPACTION_FADE_MS,
  );
}

/** Clamp an individual 0..1 factor, guarding against bad projections. */
function clampFactor(factor: number | undefined): number {
  return Math.min(1, Math.max(0, Number.isFinite(factor) ? factor : 0));
}

/**
 * Core weighted combination over already-normalised factors. Factors are
 * clamped to 0..1 here so a caller may pre-tune the speed factor with
 * staleness decay before it enters the weighted sum.
 */
export function weightedLevel(
  weights: Partial<CompositeWeights> | null | undefined,
  factors: { usage?: number; pressure?: number; effort?: number; speed?: number } = {},
): number {
  const w = normalizeWeights(weights);
  const sum = (
    w.usage * clampFactor(factors.usage)
    + w.pressure * clampFactor(factors.pressure)
    + w.effort * clampFactor(factors.effort)
    + w.speed * clampFactor(factors.speed)
  );
  return clampLevel(sum * MAX_LEVEL);
}

/**
 * Weighted combination of the signals → slider level 0..MAX_LEVEL.
 * Every factor is 0..1 and weights sum to 1, so the weighted sum spans [0,1];
 * scaling by MAX_LEVEL (then rounding, then clamping) keeps all 0..MAX_LEVEL
 * stops reachable: all-zero signals land on 0, all-saturated land on MAX_LEVEL.
 */
export function compositeLevel(
  weights: Partial<CompositeWeights> | null | undefined,
  signals: CompositeSignals = {},
): number {
  const weighted = weightedLevel(weights, {
    usage: usageFactor(signals.outputTokens ?? 0),
    pressure: contextPressureFactor(signals.pressureTokens, signals.contextWindow, signals.turns),
    effort: reasoningEffortFactor(signals.committedLevel ?? 0),
    speed: tokenSpeedFactor(signals.decodeTokens ?? 0, signals.decodeMs ?? 0),
  });
  // The 压缩 bonus lands directly on top of the weighted score, and the two
  // together form the value the level is derived from; the summed value is
  // rounded (then clamped) to keep it an integer 0..MAX_LEVEL grip.
  const compaction = clampFactor(
    contextCompactionFactor(signals.compactionAtMs ?? null, signals.nowMs ?? 0),
  );
  return clampLevel(
    Math.round(weighted + COMPACTION_SCORE_BONUS * compaction * MAX_LEVEL),
  );
}
