import { describe, expect, it } from "vitest";
import { remapSideLevel } from "../src/client/logic/frames";

describe("remapSideLevel", () => {
  it("keeps the endpoints aligned across two sides of different frame counts", () => {
    // Master axis 0..6 (default scale), side axis 0..8.
    expect(remapSideLevel(0, 6, 8)).toBe(0);
    expect(remapSideLevel(6, 6, 8)).toBe(8);
  });

  it("maps proportionally between the endpoints", () => {
    // 3 is halfway on the 0..6 master → 4 is halfway on the 0..8 side.
    expect(remapSideLevel(3, 6, 8)).toBe(4);
    // 1/6 of the master → 1/6 of the side.
    expect(remapSideLevel(1, 6, 12)).toBe(2);
  });

  it("clamps a level past the master maximum to the side maximum", () => {
    expect(remapSideLevel(99, 6, 8)).toBe(8);
  });

  it("clamps a negative level to 0", () => {
    expect(remapSideLevel(-5, 6, 8)).toBe(0);
  });

  it("handles a side with a single frame (no visible axis)", () => {
    // dividerAxisMax(1) === MAX_LEVEL floor (6), same as an image-less set.
    expect(remapSideLevel(0, 6, 1)).toBe(0);
    expect(remapSideLevel(6, 6, 1)).toBe(6);
  });

  it("maps a >MAX_LEVEL master onto a default-scale side", () => {
    // Master widened to 0..10, side stays 0..6.
    expect(remapSideLevel(10, 10, 6)).toBe(6);
    // Halfway on the wider master → halfway on 0..6.
    expect(remapSideLevel(5, 10, 6)).toBe(3);
  });

  it("returns 0 for unknown / non-finite levels and degenerate masters", () => {
    expect(remapSideLevel(NaN, 6, 8)).toBe(0);
    expect(remapSideLevel(undefined, 6, 8)).toBe(0);
    expect(remapSideLevel(3, 0, 8)).toBe(0);
    expect(remapSideLevel(3, -1, 8)).toBe(0);
  });
});
