import { describe, expect, it } from "vitest";
import {
  MAX_LEVEL,
  clampLevel,
  normalizeImportMeta,
  parseImportMetaText,
  parsePortraitYaml,
} from "../src/client/logic.ts";

describe("parsePortraitYaml (flat manifest subset)", () => {
  it("parses a typical portrait.yaml mapping", () => {
    const text = [
      "# Liang portrait archive manifest",
      "---",
      "id: liangsheng-demo",
      "# display names",
      "zh: 梁圣",
      "en: Liang the Saint",
      "name: Liang the Saint",
      "darkLevel: 4",
      "...",
    ].join("\n");
    expect(parsePortraitYaml(text)).toEqual({
      id: "liangsheng-demo",
      zh: "梁圣",
      en: "Liang the Saint",
      name: "Liang the Saint",
      darkLevel: 4,
    });
  });

  it("supports single-quoted values, inline # comments and escaped quotes", () => {
    const text = [
      "zh: '你好'",
      `en: "Say \\"hi\\""   # trailing comment`,
      "darkLevel: 2 # the boundary",
    ].join("\n");
    expect(parsePortraitYaml(text)).toEqual({
      zh: "你好",
      en: 'Say "hi"',
      darkLevel: 2,
    });
  });

  it("parses booleans and null", () => {
    const text = ["flag: true", "other: false", "nothing: null", "tide: ~"].join("\n");
    expect(parsePortraitYaml(text)).toEqual({
      flag: true,
      other: false,
      nothing: null,
      tide: null,
    });
  });

  it("ignores list bullets and nested/flow lines it cannot interpret", () => {
    const text = [
      "- a list item",
      "nested:",
      "  child: 1",
      "{flow: map}",
      "id: storm",
    ].join("\n");
    expect(parsePortraitYaml(text)).toEqual({ id: "storm" });
  });

  it("returns null for non-mapping input", () => {
    expect(parsePortraitYaml("")).toBeNull();
    expect(parsePortraitYaml("# only a comment\n---\n")).toBeNull();
    expect(parsePortraitYaml("just words with no colon")).toBeNull();
  });

  it("accepts kebab-case dark-level as well as camelCase", () => {
    expect(parsePortraitYaml("dark-level: 6")).toEqual({ "dark-level": 6 });
    expect(parsePortraitYaml("darkLevel: 3")).toEqual({ darkLevel: 3 });
  });

  it("parses an indented block list under a bare key", () => {
    const text = [
      "id: url-set",
      "images:",
      "  - https://example.com/a.png",
      "  - 'quoted item with spaces.png'",
      "  - 42",
      "...",
    ].join("\n");
    expect(parsePortraitYaml(text)).toEqual({
      id: "url-set",
      images: ["https://example.com/a.png", "quoted item with spaces.png", 42],
    });
  });

  it("parses an inline flow list", () => {
    const text = ["images: [a.png, \"b, x.png\", c.png]", "id: flow-set"].join("\n");
    expect(parsePortraitYaml(text)).toEqual({
      images: ["a.png", "b, x.png", "c.png"],
      id: "flow-set",
    });
  });

  it("keeps an indented list alive across comment lines", () => {
    const text = ["images:", "  # frame urls", "  - a.png", "  - b.png"].join("\n");
    expect(parsePortraitYaml(text)).toEqual({ images: ["a.png", "b.png"] });
  });

  it("contributes nothing for a bare key with no list items", () => {
    expect(parsePortraitYaml("nested:\n")).toBeNull();
    expect(parsePortraitYaml("images:\n# only a comment\n")).toBeNull();
  });
});

describe("normalizeImportMeta (sanitization contract like commitField)", () => {
  it("picks up id/name/zh/en strings and a finite darkLevel", () => {
    const meta = normalizeImportMeta({
      id: "  storm  ",
      name: "Storm",
      zh: " 风暴组 ",
      en: " Storm Set ",
      darkLevel: 2.6,
    });
    expect(meta).toEqual({ id: "storm", name: "Storm", zh: "风暴组", en: "Storm Set", darkLevel: 3 });
  });

  it("drops blank strings so the group keeps built-in fallbacks", () => {
    const meta = normalizeImportMeta({ id: "   ", zh: "", en: "  ", darkLevel: 9 });
    expect(meta).toEqual({ darkLevel: clampLevel(9) });
  });

  it("clamps darkLevel into 0..MAX_LEVEL and rounds", () => {
    expect(normalizeImportMeta({ darkLevel: 999 })?.darkLevel).toBe(MAX_LEVEL);
    expect(normalizeImportMeta({ darkLevel: -3 })?.darkLevel).toBe(0);
    expect(normalizeImportMeta({ darkLevel: 3.4 })?.darkLevel).toBe(3);
    expect(normalizeImportMeta({ darkLevel: Number.NaN })).toBeNull();
  });

  it("accepts the dark-level kebab alias and defaults undefined darkLevel", () => {
    expect(normalizeImportMeta({ "dark-level": 5 })).toEqual({ darkLevel: 5 });
    expect(normalizeImportMeta({ id: "liangsheng" })?.darkLevel).toBeUndefined();
  });

  it("rejects non-object / array / empty input", () => {
    expect(normalizeImportMeta(null)).toBeNull();
    expect(normalizeImportMeta(undefined)).toBeNull();
    expect(normalizeImportMeta("storm")).toBeNull();
    expect(normalizeImportMeta(42)).toBeNull();
    expect(normalizeImportMeta(["a"])).toBeNull();
    expect(normalizeImportMeta({})).toBeNull();
  });

  it("only accepts numbers for darkLevel (string digits are ignored)", () => {
    expect(normalizeImportMeta({ darkLevel: "4" })).toBeNull();
    expect(normalizeImportMeta({ "dark-level": "4" })).toBeNull();
  });

  it("sanitizes the image-URL list: trim, drop blanks, dedupe, cap at 64", () => {
    const urls = Array.from({ length: 70 }, (_, index) => `https://s/${index}.png`);
    const meta = normalizeImportMeta({
      images: [
        "  https://s/a.png  ",
        "",
        "https://s/a.png",
        "  ",
        ...urls,
      ],
    });
    expect(meta?.images?.length).toBe(64);
    expect(meta?.images?.[0]).toBe("https://s/a.png");
    expect(new Set(meta?.images).size).toBe(meta?.images?.length);
  });

  it("keeps non-string or empty image arrays out of the meta", () => {
    expect(normalizeImportMeta({ images: [] })?.images).toBeUndefined();
    expect(normalizeImportMeta({ images: [1, 2] })?.images).toBeUndefined();
    expect(normalizeImportMeta({ images: ["   "] })?.images).toBeUndefined();
  });

  it("counts a manifest supplied by images alone as usable", () => {
    expect(normalizeImportMeta({ images: ["a.png"] })).toEqual({ images: ["a.png"] });
  });
});

describe("parseImportMetaText (JSON then YAML)", () => {
  it("parses a JSON manifest directly", () => {
    const text = JSON.stringify({
      id: "meta-json",
      zh: "元数据组",
      en: "Metadata Set",
      darkLevel: 5,
    });
    expect(parseImportMetaText(text)).toEqual({
      id: "meta-json",
      zh: "元数据组",
      en: "Metadata Set",
      darkLevel: 5,
    });
  });

  it("carries an image-URL array through JSON manifests", () => {
    expect(parseImportMetaText(JSON.stringify({ images: ["https://x/a.png", "https://x/b.png"] }))).toEqual({
      images: ["https://x/a.png", "https://x/b.png"],
    });
  });

  it("parses a YAML manifest when JSON fails", () => {
    const text = "id: yaml-set\nzh: 亚姆组\ndark-level: 4\n";
    expect(parseImportMetaText(text)).toEqual({
      id: "yaml-set",
      zh: "亚姆组",
      darkLevel: 4,
    });
  });

  it("returns null for unparseable metadata", () => {
    expect(parseImportMetaText("{ not : valid ]")).toBeNull();
    expect(parseImportMetaText("[]")).toBeNull();
    expect(parseImportMetaText('"just a string"')).toBeNull();
    expect(parseImportMetaText("")).toBeNull();
  });

  it("ignores unknown fields and captures the portrait contract incl. images", () => {
    const meta = parseImportMetaText("id: a\nfolder: x\nimages:\n  - a.png\n  - b.png\nschema: 2\n");
    expect(meta).toEqual({ id: "a", images: ["a.png", "b.png"] });
  });
});
