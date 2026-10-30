import { describe, expect, it } from "vitest";
import {
  MAX_LEVEL,
  buildPortraitManifest,
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

describe("normalizeImportMeta (zh/en required, sanitization like commitField)", () => {
  it("picks up id/zh/en strings, ignores a legacy name, and rounds darkLevel", () => {
    const meta = normalizeImportMeta({
      id: "  storm  ",
      name: "Storm",
      zh: " 风暴组 ",
      en: " Storm Set ",
      darkLevel: 2.6,
    });
    expect(meta).toEqual({ id: "storm", zh: "风暴组", en: "Storm Set", darkLevel: 3 });
  });

  it("rejects a manifest whose zh or en is blank or missing", () => {
    expect(normalizeImportMeta({ id: "   ", zh: "", en: "  ", darkLevel: 9 })).toBeNull();
    expect(normalizeImportMeta({ zh: "只有中文" })).toBeNull();
    expect(normalizeImportMeta({ en: "English Only" })).toBeNull();
    expect(normalizeImportMeta({})).toBeNull();
  });

  it("clamps darkLevel into 0..MAX_LEVEL and rounds", () => {
    expect(normalizeImportMeta({ zh: "组", en: "Set", darkLevel: 999 })?.darkLevel).toBe(MAX_LEVEL);
    expect(normalizeImportMeta({ zh: "组", en: "Set", darkLevel: -3 })?.darkLevel).toBe(0);
    expect(normalizeImportMeta({ zh: "组", en: "Set", darkLevel: 3.4 })?.darkLevel).toBe(3);
    expect(normalizeImportMeta({ zh: "组", en: "Set", darkLevel: Number.NaN })).toEqual({ zh: "组", en: "Set" });
  });

  it("accepts the dark-level kebab alias and defaults a missing darkLevel", () => {
    expect(normalizeImportMeta({ zh: "组", en: "Set", "dark-level": 5 })).toEqual({ zh: "组", en: "Set", darkLevel: 5 });
    expect(normalizeImportMeta({ id: "liangsheng", zh: "梁圣", en: "Liang the Saint" })).toEqual({
      id: "liangsheng",
      zh: "梁圣",
      en: "Liang the Saint",
    });
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
    expect(normalizeImportMeta({ zh: "组", en: "Set", darkLevel: "4" })).toEqual({ zh: "组", en: "Set" });
    expect(normalizeImportMeta({ zh: "组", en: "Set", "dark-level": "4" })).toEqual({ zh: "组", en: "Set" });
  });

  it("sanitizes the image-URL list: trim, drop blanks, dedupe, cap at 64", () => {
    const urls = Array.from({ length: 70 }, (_, index) => `https://s/${index}.png`);
    const meta = normalizeImportMeta({
      zh: "组",
      en: "Set",
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
    expect(normalizeImportMeta({ zh: "组", en: "Set", images: [] })?.images).toBeUndefined();
    expect(normalizeImportMeta({ zh: "组", en: "Set", images: [1, 2] })?.images).toBeUndefined();
    expect(normalizeImportMeta({ zh: "组", en: "Set", images: ["   "] })?.images).toBeUndefined();
  });

  it("requires zh/en — images alone (or a legacy name alone) are not usable", () => {
    expect(normalizeImportMeta({ images: ["a.png"] })).toBeNull();
    expect(normalizeImportMeta({ name: "Legacy" })).toBeNull();
    expect(normalizeImportMeta({ zh: "组", en: "Set", images: ["a.png"] })).toEqual({
      zh: "组",
      en: "Set",
      images: ["a.png"],
    });
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
    const text = JSON.stringify({ zh: "组", en: "Set", images: ["https://x/a.png", "https://x/b.png"] });
    expect(parseImportMetaText(text)).toEqual({
      zh: "组",
      en: "Set",
      images: ["https://x/a.png", "https://x/b.png"],
    });
  });

  it("parses a YAML manifest when JSON fails", () => {
    const text = "id: yaml-set\nzh: 亚姆组\nen: Yaml Set\ndark-level: 4\n";
    expect(parseImportMetaText(text)).toEqual({
      id: "yaml-set",
      zh: "亚姆组",
      en: "Yaml Set",
      darkLevel: 4,
    });
  });

  it("returns null for unparseable metadata", () => {
    expect(parseImportMetaText("{ not : valid ]")).toBeNull();
    expect(parseImportMetaText("[]")).toBeNull();
    expect(parseImportMetaText('"just a string"')).toBeNull();
    expect(parseImportMetaText("")).toBeNull();
  });

  it("rejects a manifest that ships only a legacy name or one language", () => {
    expect(parseImportMetaText("id: a\nname: Legacy\n")).toBeNull();
    expect(parseImportMetaText("id: a\nzh: 中文\n")).toBeNull();
  });

  it("ignores unknown fields (and the legacy name) and keeps zh/en + images", () => {
    const text = "id: a\nname: Legacy\nfolder: x\nzh: 甲\nen: A\nimages:\n  - a.png\n  - b.png\nschema: 2\n";
    expect(parseImportMetaText(text)).toEqual({ id: "a", zh: "甲", en: "A", images: ["a.png", "b.png"] });
  });
});

describe("buildPortraitManifest (export side of the round-trip)", () => {
  it("serializes id/name/zh/en/darkLevel with ---/... markers and comments", () => {
    const text = buildPortraitManifest({
      id: " hanli- demo ",
      name: "Han Li",
      zh: "韩立",
      en: "Han Li",
      darkLevel: 5,
    });
    expect(parsePortraitYaml(text)).toEqual({
      id: "hanli- demo",
      name: "Han Li",
      zh: "韩立",
      en: "Han Li",
      darkLevel: 5,
    });
  });

  it("falls zh/en back to name then id, and clamps darkLevel", () => {
    const withName = buildPortraitManifest({ id: "liangsheng", name: "Liang the Saint", darkLevel: 99 });
    expect(parseImportMetaText(withName)).toEqual({
      id: "liangsheng",
      zh: "Liang the Saint",
      en: "Liang the Saint",
      darkLevel: 6,
    });

    const withId = buildPortraitManifest({ id: "liangsheng", name: "" });
    expect(parseImportMetaText(withId)).toEqual({
      id: "liangsheng",
      zh: "liangsheng",
      en: "liangsheng",
      darkLevel: 5,
    });
  });

  it("single-quotes values so embedded quotes and colons round-trip", () => {
    const text = buildPortraitManifest({
      id: "a",
      name: "x",
      zh: "它: 自带'引号' 与 # 井号",
      en: "it's: parsed back",
    });
    expect(parseImportMetaText(text)).toEqual({
      id: "a",
      zh: "它: 自带'引号' 与 # 井号",
      en: "it's: parsed back",
      darkLevel: 5,
    });
  });

  it("never emits an images: list (embedded frames win on import)", () => {
    const text = buildPortraitManifest({ id: "a", name: "n" });
    expect(text).not.toMatch(/images\s*:/);
  });
});
