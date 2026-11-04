import { describe, expect, it } from "vitest";
import { summarizeUrl } from "../src/client/logic.ts";

describe("summarizeUrl", () => {
  it("keeps short URLs intact", () => {
    expect(summarizeUrl("https://example.com/a.zip")).toBe("example.com/a.zip");
  });

  it("shows host plus head of a long path with an ellipsis", () => {
    const url = "https://example.com/share/portrait/liangsheng/demo-pack.zip";
    const out = summarizeUrl(url);
    expect(out.startsWith("example.com/")).toBe(true);
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(45);
  });

  it("drops a bare trailing slash", () => {
    expect(summarizeUrl("https://example.com/")).toBe("example.com");
  });

  it("keeps query params in the visible tail", () => {
    const out = summarizeUrl("https://example.com/pack.zip?token=abc&x=1");
    expect(out.startsWith("example.com/pack.zip?token=abc&x=1")).toBe(true);
  });

  it("falls back to raw truncation for non-URL text", () => {
    expect(summarizeUrl("not a url at all, just some long text that is long", 20)).toBe(
      "not a url at all, ju…"
    );
  });

  it("handles empty input", () => {
    expect(summarizeUrl("")).toBe("");
  });
});
