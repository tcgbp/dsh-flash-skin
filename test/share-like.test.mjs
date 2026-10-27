import { describe, expect, it } from "vitest";
import {
  buildShareText,
  parseShareText,
  mergeLikeCount,
  SHARE_MAX_BYTES,
} from "../src/client/logic.ts";
import {
  COMMUNITY_PROVIDERS,
  createCommunityClient,
  normalizeCommunitySetId,
  buildCommunityEntryName,
  parseCommunityEntryName,
  parseCommunityEntryText,
  parseCommunityTreePaths,
  providerFor,
  readCommunityLikes,
  submitCommunityLikes,
  submitCommunityShare,
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

  describe("readCommunityLikes (PR-backed aggregate count read)", () => {
    const target = { owner: "octo", repo: "cats", branch: "main", path: "shares" };

    it("returns counts parsed from the likes.json blob", async () => {
      const client = {
        rawText: async () => JSON.stringify({ "han-li": 3, "jiu-gong": 12 }),
      };
      const res = await readCommunityLikes(client, target);
      expect(res.ok).toBe(true);
      expect(res.counts).toEqual({ "han-li": 3, "jiu-gong": 12 });
    });

    it("drops invalid/dropped entries and floors fractional counts", async () => {
      const client = {
        rawText: async () =>
          JSON.stringify({ ok: 5, "a b": 2, neg: -3, frac: 2.9, zero: 0, long: "x".repeat(200) }),
      };
      const res = await readCommunityLikes(client, target);
      expect(res.ok).toBe(true);
      // "ok" is valid; "a b" has a space -> dropped; neg/zero dropped; frac floored; long key dropped.
      expect(res.counts).toEqual({ ok: 5, frac: 2 });
    });

    it("returns null counts when the file is absent/malformed, without throwing", async () => {
      const absent = { rawText: async () => null };
      const absentRes = await readCommunityLikes(absent, target);
      expect(absentRes.ok).toBe(true);
      expect(absentRes.counts).toBeNull();
      expect(absentRes.error.code).toBe("unavailable");

      const bad = { rawText: async () => "{ not json" };
      const badRes = await readCommunityLikes(bad, target);
      expect(badRes.ok).toBe(true);
      expect(badRes.counts).toBeNull();
      expect(badRes.error.code).toBe("bad-json");

      const panic = { rawText: async () => { throw new Error("boom"); } };
      const panicRes = await readCommunityLikes(panic, target);
      expect(panicRes.ok).toBe(true);
      expect(panicRes.counts).toBeNull();
    });

    it("short-circuits when the community target is not configured", async () => {
      const res = await readCommunityLikes({ rawText: async () => null }, null);
      expect(res.ok).toBe(true);
      expect(res.counts).toBeNull();
      expect(res.error.code).toBe("not-configured");
    });
  });

  describe("submitCommunityLikes (PR-backed aggregate count write)", () => {
    const target = { owner: "octo", repo: "cats", branch: "main", path: "shares" };
    const okFork = async () => ({
      status: 202,
      json: { owner: { login: "forky" }, full_name: "forky/cats" },
    });
    const dispatch = (overrides = {}) => ({
      ghJson: overrides.ghJson
        || (async (path, { method } = {}) => {
          if (path.endsWith("/forks")) return okFork();
          if (path.startsWith("/repos/forky/cats/branches/")) {
            return { status: 200, json: { commit: { sha: "abc123" } } };
          }
          if (path.endsWith("/git/refs")) return { status: 201, json: {} };
          if (/\/contents\//.test(path) && method === "PUT") return { status: 201, json: {} };
          if (/\/pulls$/.test(path) && method === "POST") {
            return { status: 201, json: { number: 7, html_url: "https://github.com/octo/cats/pull/7", state: "open" } };
          }
          return { status: 200, json: {} };
        }),
      rawText: overrides.rawText || (async () => "{}"),
    });

    it("walks the fork→branch→PUT→PR flow and reports the PR", async () => {
      const calls = [];
      const client = {
        ghJson: async (path, { method } = {}) => {
          calls.push(`${method} ${path}`);
          if (path.endsWith("/forks")) return okFork();
          if (path.startsWith("/repos/forky/cats/branches/")) {
            return { status: 200, json: { commit: { sha: "abc123" } } };
          }
          if (path.endsWith("/git/refs")) return { status: 201, json: {} };
          if (/\/contents\//.test(path)) {
            expect(method).toBe("PUT");
            // The body JSON carries base64 of a likes.json snapshot.
            return { status: 201, json: {} };
          }
          if (/\/pulls$/.test(path)) {
            expect(method).toBe("POST");
            return { status: 201, json: { number: 7, html_url: "https://github.com/octo/cats/pull/7", state: "open" } };
          }
          return { status: 200, json: {} };
        },
        rawText: async () => "{}",
      };
      const res = await submitCommunityLikes(client, target, {
        token: "tok",
        counts: { "han-li": 3, "jiu-gong": 12 },
      });
      expect(res.ok).toBe(true);
      expect(res.pr.number).toBe(7);
      expect(res.pr.htmlUrl).toBe("https://github.com/octo/cats/pull/7");
      // fork → repo(s) → branch → refs → contents PUT → pulls
      expect(calls.some((c) => c === "POST /repos/octo/cats/forks")).toBe(true);
      expect(calls.some((c) => c.endsWith("/contents/shares/likes.json"))).toBe(true);
      expect(calls.some((c) => c === "POST /repos/octo/cats/pulls")).toBe(true);
    });

    it("drops invalid group/count entries before writing", async () => {
      let putBody = null;
      const client = {
        ghJson: async (path, { method = "GET", body } = {}) => {
          if (/\/contents\//.test(path) && method === "PUT") { putBody = body; return { status: 201, json: {} }; }
          if (path.endsWith("/forks")) return okFork();
          if (path.startsWith("/repos/forky/cats/branches/")) return { status: 200, json: { commit: { sha: "s" } } };
          if (path.endsWith("/git/refs")) return { status: 201, json: {} };
          if (/\/pulls$/.test(path)) return { status: 201, json: { number: 1 } };
          return { status: 200, json: {} };
        },
        rawText: async () => "{}",
      };
      const res = await submitCommunityLikes(client, target, {
        token: "tok",
        counts: { ok: 5, "a b": 2, neg: -3, zero: 0, frac: 2.9 },
      });
      expect(res.ok).toBe(true);
      const decoded = JSON.parse(Buffer.from(putBody.content, "base64").toString("utf8"));
      expect(decoded).toEqual({ ok: 5, frac: 2 });
    });

    it("fails cleanly without a token and without a configure target", async () => {
      const noToken = await submitCommunityLikes(dispatch(), target, { token: "", counts: {} });
      expect(noToken.ok).toBe(false);
      expect(noToken.error.code).toBe("bad-token");

      const notConfigured = await submitCommunityLikes(dispatch(), null, { token: "tok", counts: {} });
      expect(notConfigured.ok).toBe(false);
      expect(notConfigured.error.code).toBe("not-configured");
    });

    it("surfaces fork/auth failures without throwing", async () => {
      const client = {
        ghJson: async (path, { method } = {}) => {
          if (path.endsWith("/forks")) return { status: 403, json: {} };
          if (path.endsWith("/git/refs") && method === "POST") return { status: 403, json: {} };
          return { status: 200, json: {} };
        },
        rawText: async () => "{}",
      };
      const res = await submitCommunityLikes(client, target, { token: "tok", counts: { a: 1 } });
      expect(res.ok).toBe(false);
      expect(res.error.code).toMatch(/(auth|rate-limited|branch|fork)/);
    });
  });

  describe("Gitee provider shim (community.js)", () => {
    const giteeTarget = { owner: "octo", repo: "cats", provider: "gitee", branch: "master", path: "shares" };

    it("resolves provider kind and falls back to github for unknown values", () => {
      expect(providerFor({ provider: "gitee" }).kind).toBe("gitee");
      expect(providerFor({ provider: "github" }).kind).toBe("github");
      expect(providerFor({ provider: "gitlab" }).kind).toBe("github");
      expect(providerFor({}).kind).toBe("github");
      expect(providerFor(null).kind).toBe("github");
      expect(COMMUNITY_PROVIDERS.gitee.label).toMatch(/gitee/i);
    });

    it("builds a Gitee raw URL with ref and access_token auth", async () => {
      const urls = [];
      const fakeFetch = async (url) => { urls.push(url); return { ok: true, text: async () => "https://cdn/x.zip" }; };
      const client = createCommunityClient(COMMUNITY_PROVIDERS.gitee, fakeFetch);
      expect(client.provider.kind).toBe("gitee");
      const text = await client.rawText(
        [encodeURIComponent("octo"), encodeURIComponent("cats"), encodeURIComponent("master"), encodeURIComponent("shares"), encodeURIComponent("d1")].join("/")
      );
      expect(text).toBe("https://cdn/x.zip");
      expect(urls[0]).toContain("https://gitee.com/api/v5/repos/octo/cats/raw/shares/d1?ref=master");
    });

    it("writes likes through the Gitee POST /contents + fork_path PR flow", async () => {
      const calls = [];
      const fakeFetch = async (url, init = {}) => {
        const method = init.method || "GET";
        calls.push({ method, url, body: init.body ? JSON.parse(init.body) : null });
        const api = url.split("?")[0];
        if (api.endsWith("/forks")) {
          return { status: 200, text: async () => JSON.stringify({ id: 1, full_name: "forky/cats", namespace: { path: "forky" } }) };
        }
        if (/\/branches\/master$/.test(api)) {
          return { status: 200, text: async () => JSON.stringify({ name: "master", commit: { sha: "abc123" } }) };
        }
        if (/\/branches$/.test(api) && method === "POST") {
          return { status: 201, text: async () => JSON.stringify({ name: "x" }) };
        }
        if (/\/contents\//.test(api) && method === "POST") {
          return { status: 201, text: async () => JSON.stringify({}) };
        }
        if (/\/pulls$/.test(api) && method === "POST") {
          return { status: 200, text: async () => JSON.stringify({ number: 11, html_url: "https://gitee.com/octo/cats/pulls/11", state: "open" }) };
        }
        return { status: 200, text: async () => "{}" };
      };
      const client = createCommunityClient(COMMUNITY_PROVIDERS.gitee, fakeFetch);
      const res = await submitCommunityLikes(client, giteeTarget, { token: "tok", counts: { "han-li": 3 } });

      expect(res.ok).toBe(true);
      expect(res.pr.number).toBe(11);
      expect(res.pr.htmlUrl).toBe("https://gitee.com/octo/cats/pulls/11");

      const fork = calls.find((c) => c.url.split("?")[0].endsWith("/forks") && c.method === "POST");
      expect(fork).toBeTruthy();
      // Gitee authenticates via query param, not a Bearer header.
      expect(fork.url).toContain("access_token=tok");

      expect(calls.some((c) => c.method === "POST" && /\/contents\/shares\/likes\.json/.test(c.url))).toBe(true);
      // Gitee creates branches at /branches (not /git/refs).
      const pathOf = (u) => u.split("?")[0];
      expect(calls.some((c) => c.method === "POST" && pathOf(c.url).endsWith("/branches") && !/contents/.test(pathOf(c.url)))).toBe(true);
      expect(calls.some((c) => c.method === "POST" && pathOf(c.url).endsWith("/git/refs"))).toBe(false);

      const pr = calls.find((c) => c.method === "POST" && /\/pulls/.test(c.url));
      expect(pr.url).toContain("access_token=tok");
      expect(pr.body.fork_path).toBe("forky/cats");
    });
  });
});
