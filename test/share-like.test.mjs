import { describe, expect, it } from "vitest";
import {
  buildShareText,
  parseShareText,
  mergeLikeCount,
  SHARE_MAX_BYTES,
} from "../src/client/logic.ts";
import {
  normalizeCommunitySetId,
  buildCommunityEntryName,
  parseCommunityEntryName,
  parseCommunityEntryText,
  parseCommunityTreePaths,
} from "../src/community.js";

describe("C1 share codec (logic.ts)", () => {
  const manifest = {
    id: "han-li",
    zh: "韩立",
    en: "Han Li",
    darkLevel: 30,
  };

  it("round-trips a zip + manifest through build/parse", () => {
    const zip = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 1, 2, 3, 0, 0xff]);
    const text = buildShareText(zip, manifest);
    expect(text.startsWith("dsh-flash-skin-share#1#")).toBe(true);
    const parsed = parseShareText(text);
    expect(parsed).not.toBeNull();
    expect(parsed.manifest).toEqual(manifest);
    expect([...parsed.zip]).toEqual([...zip]);
  });

  it("round-trips an empty archive", () => {
    const text = buildShareText(new Uint8Array(0), manifest);
    const parsed = parseShareText(text);
    expect(parsed).not.toBeNull();
    expect(parsed.zip.length).toBe(0);
    expect(parsed.manifest.id).toBe("han-li");
  });

  it("returns an empty string when the blob exceeds SHARE_MAX_BYTES", () => {
    const oversized = new Uint8Array(SHARE_MAX_BYTES + 1);
    expect(buildShareText(oversized, manifest)).toBe("");
  });

  it("rejects non-share prefixes", () => {
    expect(parseShareText("hello world")).toBeNull();
    expect(parseShareText("dsh-flash-skin-share#2#abc")).toBeNull();
    expect(parseShareText("dsh-flash-skin-share#1#")).toBeNull();
  });

  it("rejects malformed or oversize payloads", () => {
    // Base64 length ≡ 1 mod 4 is unrepresentable; the decoder bails.
    expect(parseShareText("dsh-flash-skin-share#1#A")).toBeNull();
    // Illegal base64 characters.
    expect(parseShareText("dsh-flash-skin-share#1#!!!!")).toBeNull();
    // Payload that decodes but has no header line (first byte is 0x0a meaning
    // an empty header).
    expect(parseShareText("dsh-flash-skin-share#1#AAAA")).toBeNull();
  });

  it("rejects headers with a missing/invalid manifest id or zlen", () => {
    // btoa only accepts Latin-1; keep these hand-built payloads ASCII.
    const asciiManifest = { id: "han-li", zh: "Han", en: "Han Li", darkLevel: 30 };
    const encode = (header, payload = "") =>
      `dsh-flash-skin-share#1#${btoa(header + "\n" + payload)}`;

    expect(parseShareText(encode(JSON.stringify({ v: 1, m: { zh: "x" }, z: 0 })))).toBeNull();

    // zlen claims more bytes than the payload holds.
    expect(parseShareText(encode(JSON.stringify({ v: 1, m: asciiManifest, z: 999 }), "012"))).toBeNull();

    // Wrong version number.
    expect(parseShareText(encode(JSON.stringify({ v: 42, m: asciiManifest, z: 0 })))).toBeNull();
  });

  it("mergeLikeCount never drops below the local liked flag", () => {
    expect(mergeLikeCount(false)).toBe(0);
    expect(mergeLikeCount(true)).toBe(1);
    expect(mergeLikeCount(true, undefined)).toBe(1);
    expect(mergeLikeCount(false, 5)).toBe(5);
    expect(mergeLikeCount(true, 5)).toBe(5);
    expect(mergeLikeCount(true, 0)).toBe(1);
    expect(mergeLikeCount(false, 0)).toBe(0);
  });

  it("mergeLikeCount sanitizes malformed community counts", () => {
    expect(mergeLikeCount(false, -3)).toBe(0);
    expect(mergeLikeCount(true, -3)).toBe(1);
    expect(mergeLikeCount(false, 2.9)).toBe(2);
    expect(mergeLikeCount(false, Number.NaN)).toBe(0);
    expect(mergeLikeCount(false, Number.POSITIVE_INFINITY)).toBe(0);
    expect(mergeLikeCount(false, "12")).toBe(0);
    expect(mergeLikeCount(false, null)).toBe(0);
  });

  it("preserves a fine-grained (non-integer) darkLevel across share round-trip", () => {
    // A ≥8-frame group places the light/dark divider at continuous slider
    // positions (e.g. 2.667) — never at an integer stop. The export must carry
    // that raw value so a share → import round-trip restores the exact divider
    // position instead of blurring it to the nearest integer slider stop.
    const manifest = {
      id: "jiu-gong",
      name: "九宫",
      zh: "九宫",
      en: "Nine Palaces",
      darkLevel: 2.667, // between integer slider stops on a 9-frame grid
    };
    const zip = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 1, 2, 3, 0, 0xff]);
    const text = buildShareText(zip, manifest);
    const parsed = parseShareText(text);
    expect(parsed).not.toBeNull();
    expect(parsed.manifest.darkLevel).toBe(2.667);
  });
});

describe("C2 community helper functions (community.js)", () => {
  describe("normalizeCommunitySetId", () => {
    it("slugs an arbitrary display string", () => {
      expect(normalizeCommunitySetId("  My  Great Set!! ")).toBe("my-great-set");
      expect(normalizeCommunitySetId("Han-Li")).toBe("han-li");
      expect(normalizeCommunitySetId("han-li")).toBe("han-li");
    });

    it("returns null for empty or all-punctuation input", () => {
      expect(normalizeCommunitySetId("")).toBeNull();
      expect(normalizeCommunitySetId("   ")).toBeNull();
      expect(normalizeCommunitySetId("!!!")).toBeNull();
      expect(normalizeCommunitySetId(null)).toBeNull();
      expect(normalizeCommunitySetId(undefined)).toBeNull();
      expect(normalizeCommunitySetId(42)).toBeNull();
    });

    it("caps the length", () => {
      expect(normalizeCommunitySetId("a".repeat(64))).toBe("a".repeat(64));
      expect(normalizeCommunitySetId("a".repeat(65))).toBeNull();
    });
  });

  describe("community entry names", () => {
    it("builds a pointer file name from a set id", () => {
      expect(buildCommunityEntryName("han-li")).toBe("han-li.txt");
    });

    it("parses a valid pointer name back to a set id", () => {
      expect(parseCommunityEntryName("han-li.txt")).toBe("han-li");
      expect(parseCommunityEntryName("a.txt")).toBe("a");
    });

    it("rejects malformed names", () => {
      expect(parseCommunityEntryName("han-li")).toBeNull();
      expect(parseCommunityEntryName(".txt")).toBeNull();
      expect(parseCommunityEntryName("..txt")).toBeNull();
      expect(parseCommunityEntryName("han li.txt")).toBeNull();
      expect(parseCommunityEntryName("Han-Li.txt")).toBeNull();
      expect(parseCommunityEntryName("a-b-？.txt")).toBeNull();
      expect(parseCommunityEntryName("a".repeat(65) + ".txt")).toBeNull();
      expect(parseCommunityEntryName(null)).toBeNull();
    });
  });

  describe("parseCommunityEntryText", () => {
    it("returns the first bare http(s) URL, trimmed", () => {
      expect(parseCommunityEntryText("  https://example.com/x.zip  \n")).toBe(
        "https://example.com/x.zip",
      );
    });

    it("skips blank lines and comments before the URL", () => {
      const text = "\r\n# pointer file\n \nhttps://cdn.example/a.zip\n";
      expect(parseCommunityEntryText(text)).toBe("https://cdn.example/a.zip");
    });

    it("rejects text without a URL or with a non-http scheme", () => {
      expect(parseCommunityEntryText("")).toBeNull();
      expect(parseCommunityEntryText("# only a comment\n")).toBeNull();
      expect(parseCommunityEntryText("ftp://example.com/a.zip")).toBeNull();
      expect(parseCommunityEntryText("https://example.com/a.zip https://x")).toBeNull();
      expect(parseCommunityEntryText("not a url")).toBeNull();
    });

    it("rejects over-long entries and URLs", () => {
      expect(parseCommunityEntryText("x".repeat(1024 * 65))).toBeNull();
      const longUrl = `https://example.com/${"a".repeat(2048)}`;
      expect(parseCommunityEntryText(longUrl)).toBeNull();
      expect(parseCommunityEntryText(null)).toBeNull();
    });
  });

  describe("parseCommunityTreePaths", () => {
    const paths = [
      "shares/e1/han-li.txt",
      "shares/e2/z1.txt",
      "shares/e3/dupe.txt",
      "shares/e4/dupe.txt",
      "shares/e5/not-a-pointer.md",
      "shares/odd/deep/a/b.txt",
      "other-root/e6/x.txt",
      "shares/e7/bad name.txt",
    ];

    it("extracts valid two-level entries under the root, deduped, first wins", () => {
      expect(parseCommunityTreePaths(paths)).toEqual([
        { entryId: "e1", setId: "han-li", path: "shares/e1/han-li.txt" },
        { entryId: "e2", setId: "z1", path: "shares/e2/z1.txt" },
        { entryId: "e3", setId: "dupe", path: "shares/e3/dupe.txt" },
      ]);
    });

    it("honors a custom root and treats non-arrays as empty", () => {
      expect(parseCommunityTreePaths(["dir/a/b.txt"], "dir")).toEqual([
        { entryId: "a", setId: "b", path: "dir/a/b.txt" },
      ]);
      expect(parseCommunityTreePaths(null)).toEqual([]);
      expect(parseCommunityTreePaths(undefined)).toEqual([]);
      expect(parseCommunityTreePaths([], "custom")).toEqual([]);
    });
  });
});
