import { describe, expect, it } from "vitest";
import { parseSingleRange } from "../src/range.js";

describe("parseSingleRange", () => {
  it("returns null when no Range header is present", () => {
    expect(parseSingleRange(undefined, 100)).toBeNull();
  });

  it("parses a closed byte range", () => {
    expect(parseSingleRange("bytes=0-99", 1000)).toEqual({ start: 0, end: 99 });
  });

  it("clamps the end to the resource size", () => {
    expect(parseSingleRange("bytes=0-9999", 1000)).toEqual({ start: 0, end: 999 });
  });

  it("parses an open-ended range from start to EOF", () => {
    expect(parseSingleRange("bytes=500-", 1000)).toEqual({ start: 500, end: 999 });
  });

  it("parses a suffix range", () => {
    expect(parseSingleRange("bytes=-500", 1000)).toEqual({ start: 500, end: 999 });
  });

  it("clamps a suffix larger than the resource", () => {
    expect(parseSingleRange("bytes=-5000", 1000)).toEqual({ start: 0, end: 999 });
  });

  it("rejects multiple ranges", () => {
    expect(parseSingleRange("bytes=0-1,2-3", 1000)).toBe(false);
  });

  it("rejects an empty range specifier", () => {
    expect(parseSingleRange("bytes=", 1000)).toBe(false);
  });

  it("rejects a malformed specifier", () => {
    expect(parseSingleRange("bytes=abc", 1000)).toBe(false);
  });

  it("rejects a start past the end of the resource", () => {
    expect(parseSingleRange("bytes=1000-", 1000)).toBe(false);
  });

  it("rejects an end before the start", () => {
    expect(parseSingleRange("bytes=100-50", 1000)).toBe(false);
  });

  it("rejects a zero valid suffix", () => {
    expect(parseSingleRange("bytes=-0", 1000)).toBe(false);
  });

  it("rejects a non-bytes unit", () => {
    expect(parseSingleRange("items=0-9", 1000)).toBe(false);
  });

  it("rejects a syntactically-valid but non-integer range", () => {
    expect(parseSingleRange("bytes=0-1.5", 1000)).toBe(false);
  });
});
