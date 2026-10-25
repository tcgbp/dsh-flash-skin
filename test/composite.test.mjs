import { describe, expect, it } from "vitest";
import {
  MAX_LEVEL,
  DEFAULT_COMPOSITE_WEIGHTS,
  normalizeWeights,
  usageFactor,
  contextPressureFactor,
  reasoningEffortFactor,
  tokenSpeedFactor,
  compositeLevel,
  stagedFrames,
  frameIndexForLevel,
} from "../src/client/logic.ts";

describe("normalizeWeights", () => {
  it("falls back to defaults for null / undefined / non-object", () => {
    expect(normalizeWeights(null)).toEqual(DEFAULT_COMPOSITE_WEIGHTS);
    expect(normalizeWeights(undefined)).toEqual(DEFAULT_COMPOSITE_WEIGHTS);
    expect(normalizeWeights(42)).toEqual(DEFAULT_COMPOSITE_WEIGHTS);
    expect(normalizeWeights("nonsense")).toEqual(DEFAULT_COMPOSITE_WEIGHTS);
  });

  it("falls back to defaults when every supplied weight is zero", () => {
    expect(normalizeWeights({ usage: 0, pressure: 0, effort: 0, speed: 0 }))
      .toEqual(DEFAULT_COMPOSITE_WEIGHTS);
  });

  it("falls back to defaults when any weight is negative / NaN / infinite / missing non-finite", () => {
    expect(normalizeWeights({ usage: -0.1 })).toEqual(DEFAULT_COMPOSITE_WEIGHTS);
    expect(normalizeWeights({ usage: Number.NaN })).toEqual(DEFAULT_COMPOSITE_WEIGHTS);
    expect(normalizeWeights({ usage: Infinity })).toEqual(DEFAULT_COMPOSITE_WEIGHTS);
    expect(normalizeWeights({ usage: -Infinity })).toEqual(DEFAULT_COMPOSITE_WEIGHTS);
    expect(normalizeWeights({ usage: "0.3" })).toEqual(DEFAULT_COMPOSITE_WEIGHTS);
  });

  it("renormalizes a valid set so the weights sum to 1", () => {
    const w = normalizeWeights({ usage: 3, pressure: 1 });
    expect(w).toEqual({ usage: 0.75, pressure: 0.25, effort: 0, speed: 0 });
    const sum = w.usage + w.pressure + w.effort + w.speed;
    expect(Math.abs(sum - 1)).toBeLessThan(1e-9);
  });

  it("supports extreme weights pinned to a single axis", () => {
    expect(normalizeWeights({ usage: 1 })).toEqual({
      usage: 1, pressure: 0, effort: 0, speed: 0,
    });
    expect(normalizeWeights({ speed: 1 })).toEqual({
      usage: 0, pressure: 0, effort: 0, speed: 1,
    });
  });
});

describe("signal factor helpers", () => {
  it("usageFactor saturates at USAGE_FULL", () => {
    expect(usageFactor(0)).toBe(0);
    expect(usageFactor(150_000)).toBeCloseTo(0.5, 5);
    expect(usageFactor(300_000)).toBe(1);
    expect(usageFactor(400_000)).toBe(1);
    expect(usageFactor(-10)).toBe(0);
    expect(usageFactor(Number.NaN)).toBe(0);
  });

  it("reasoningEffortFactor maps 0..MAX_LEVEL onto 0..1", () => {
    expect(reasoningEffortFactor(0)).toBe(0);
    expect(reasoningEffortFactor(MAX_LEVEL / 2)).toBeCloseTo(0.5, 5);
    expect(reasoningEffortFactor(MAX_LEVEL)).toBe(1);
    expect(reasoningEffortFactor(MAX_LEVEL + 6)).toBe(1);
    expect(reasoningEffortFactor(-3)).toBe(0);
    expect(reasoningEffortFactor(Number.NaN)).toBe(0);
  });

  it("contextPressureFactor prefers projected tokens / window when both known", () => {
    expect(contextPressureFactor(5000, 10000, 3)).toBeCloseTo(0.5, 5);
    expect(contextPressureFactor(15000, 10000, 3)).toBe(1); // clamped
  });

  it("contextPressureFactor falls back to turns when wall data is missing or degenerate", () => {
    expect(contextPressureFactor(undefined, 10000, 10)).toBeCloseTo(0.5, 5);
    expect(contextPressureFactor(undefined, undefined, 40)).toBe(1);
    // negative pressureTokens → turns fallback (unknown) → 0
    expect(contextPressureFactor(-5, 10000, undefined)).toBe(0);
    // non-positive window → turns fallback
    expect(contextPressureFactor(5000, 0, 3)).toBeCloseTo(0.15, 5);
    expect(contextPressureFactor(5000, -1, 3)).toBeCloseTo(0.15, 5);
    // everything unknown → 0
    expect(contextPressureFactor(undefined, undefined, undefined)).toBe(0);
  });

  it("tokenSpeedFactor measures tokens per second, saturated at TPS_FULL", () => {
    expect(tokenSpeedFactor(80, 1000)).toBe(1);
    expect(tokenSpeedFactor(40, 1000)).toBeCloseTo(0.5, 5);
    expect(tokenSpeedFactor(200, 1000)).toBe(1); // clamped
    expect(tokenSpeedFactor(0, 1000)).toBe(0);
    expect(tokenSpeedFactor(100, 0)).toBe(0);
    expect(tokenSpeedFactor(100, -5)).toBe(0);
    expect(tokenSpeedFactor(Number.NaN, 1000)).toBe(0);
  });
});

describe("compositeLevel", () => {
  it("all-zero signals land on level 0", () => {
    expect(compositeLevel(null, {})).toBe(0);
    expect(compositeLevel(null, {
      outputTokens: 0,
      committedLevel: 0,
      decodeTokens: 0,
      decodeMs: 0,
      turns: 0,
    })).toBe(0);
  });

  it("all-saturated signals land on MAX_LEVEL", () => {
    expect(compositeLevel(null, {
      outputTokens: 300_000,
      pressureTokens: 10_000,
      contextWindow: 10_000,
      committedLevel: MAX_LEVEL,
      decodeTokens: 80,
      decodeMs: 1000,
    })).toBe(MAX_LEVEL);
    expect(compositeLevel(DEFAULT_COMPOSITE_WEIGHTS, {
      outputTokens: 300_000,
      pressureTokens: 10_000,
      contextWindow: 10_000,
      committedLevel: MAX_LEVEL,
      decodeTokens: 80,
      decodeMs: 1000,
    })).toBe(MAX_LEVEL);
  });

  it("reaches every integer stop 0..MAX_LEVEL on a single pinned axis", () => {
    for (let level = 0; level <= MAX_LEVEL; level += 1) {
      const outputTokens = (level / MAX_LEVEL) * 300_000;
      expect(compositeLevel({ usage: 1 }, { outputTokens })).toBe(level);
    }
  });

  it("is monotone nondecreasing in each signal under default weights", () => {
    let previous = -1;
    for (let outputTokens = 0; outputTokens <= 360_000; outputTokens += 60_000) {
      const current = compositeLevel(null, { outputTokens });
      expect(current).toBeGreaterThanOrEqual(previous);
      previous = current;
    }
    let prev = -1;
    for (let turns = 0; turns <= 24; turns += 4) {
      const current = compositeLevel(null, { turns });
      expect(current).toBeGreaterThanOrEqual(prev);
      prev = current;
    }
    let p = -1;
    for (let level = 0; level <= 8; level += 1) {
      const current = compositeLevel(null, { committedLevel: level });
      expect(current).toBeGreaterThanOrEqual(p);
      p = current;
    }
  });

  it("a single default-weight axis swings at most round(0.30 * MAX_LEVEL) = 2", () => {
    expect(compositeLevel(null, { outputTokens: 0 })).toBe(0);
    expect(compositeLevel(null, { outputTokens: 300_000 })).toBe(2);
    // sample: never exceeds the single-axis bound mid-sweep
    for (let outputTokens = 0; outputTokens <= 300_000; outputTokens += 15_000) {
      const level = compositeLevel(null, { outputTokens });
      expect(level).toBeGreaterThanOrEqual(0);
      expect(level).toBeLessThanOrEqual(2);
    }
  });

  it("unknown (undefined) signals are treated as zero for pinned axes", () => {
    expect(compositeLevel({ effort: 1 }, {})).toBe(0);
    expect(compositeLevel({ usage: 1 }, { outputTokens: undefined })).toBe(0);
    expect(compositeLevel({ speed: 1 }, {})).toBe(0);
    expect(compositeLevel({ pressure: 1 }, {})).toBe(0);
  });
});

describe("stagedFrames — group-size adaptation", () => {
  it("degenerate counts collapse to a single frame at level 0", () => {
    for (const count of [Number.NaN, -3, 0, 1]) {
      expect(stagedFrames(count)).toEqual([0]);
    }
  });

  it("small groups (N <= MAX_LEVEL + 1) keep every frame integer-reachable and distinct", () => {
    for (let n = 2; n <= 7; n += 1) {
      const frames = stagedFrames(n);
      expect(frames).toHaveLength(n);
      expect(frames[0]).toBe(0);
      expect(frames[n - 1]).toBe(MAX_LEVEL);
      for (let i = 1; i < n; i += 1) {
        expect(frames[i]).toBeGreaterThan(frames[i - 1]);
      }
    }
  });

  it("large groups (N > MAX_LEVEL + 1) spread continuously with pinned endpoints", () => {
    for (let n = 8; n <= 10; n += 1) {
      const frames = stagedFrames(n);
      expect(frames).toHaveLength(n);
      expect(frames[0]).toBe(0);
      expect(frames[n - 1]).toBe(MAX_LEVEL);
      for (let i = 1; i < n; i += 1) {
        expect(frames[i]).toBeGreaterThan(frames[i - 1]);
      }
    }
  });
});

describe("frameIndexForLevel", () => {
  it("guards NaN / infinities / negative levels to frame 0", () => {
    expect(frameIndexForLevel(Number.NaN, 5)).toBe(0);
    expect(frameIndexForLevel(Infinity, 5)).toBe(0);
    expect(frameIndexForLevel(-Infinity, 5)).toBe(0);
    expect(frameIndexForLevel(-1, 5)).toBe(0);
  });

  it("guards degenerate counts to frame 0", () => {
    for (const count of [Number.NaN, 0, -2, 1]) {
      expect(frameIndexForLevel(3, count)).toBe(0);
    }
  });

  it("claims every frame of a small group across the full 0..MAX_LEVEL sweep", () => {
    for (let n = 2; n <= 7; n += 1) {
      const seen = new Set();
      for (let level = 0; level <= MAX_LEVEL; level += 1) {
        seen.add(frameIndexForLevel(level, n));
      }
      expect(seen.size).toBe(n); // every configured image is reachable
    }
  });

  it("pins endpoints and is monotone nondecreasing in level", () => {
    for (let n = 2; n <= 7; n += 1) {
      expect(frameIndexForLevel(0, n)).toBe(0);
      expect(frameIndexForLevel(MAX_LEVEL, n)).toBe(n - 1);
      let previous = 0;
      for (let level = 1; level <= MAX_LEVEL; level += 1) {
        const index = frameIndexForLevel(level, n);
        expect(index).toBeGreaterThanOrEqual(previous);
        previous = index;
      }
    }
  });

  it("resolves mid-grid ties toward the higher frame", () => {
    // n=4 → frames [0, 2, 4, 6]; level 3 ties between 2 and 4 → picks frame 4 (index 2)
    expect(frameIndexForLevel(3, 4)).toBe(2);
    // level 5 → [4 vs 6] → picks index 3
    expect(frameIndexForLevel(5, 4)).toBe(3);
  });

  it("adapts the distribution when the group image count changes", () => {
    // n=4 → frames [0,2,4,6]; n=5 → frames [0,2,3,5,6]
    for (let level = 0; level <= MAX_LEVEL; level += 1) {
      const small = frameIndexForLevel(level, 4);
      const large = frameIndexForLevel(level, 5);
      expect(small).toBeGreaterThanOrEqual(0);
      expect(small).toBeLessThan(4);
      if (level === 4) {
        expect(small).not.toBe(large); // the sweep differs between the two sizes
      }
    }
  });
});
