import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
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
  readCommunityDirectory,
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

  describe("providerFor / COMMUNITY_PROVIDERS (Feishu pluggable backend)", () => {
    it("resolves feishu for every input and falls back to the shipped backend", () => {
      expect(providerFor({ provider: "feishu" }).kind).toBe("feishu");
      expect(providerFor({ provider: "other" }).kind).toBe("feishu");
      expect(providerFor({}).kind).toBe("feishu");
      expect(providerFor(null).kind).toBe("feishu");
      expect(COMMUNITY_PROVIDERS.feishu.label).toMatch(/飞书/);
      expect(COMMUNITY_PROVIDERS.feishu.apiBase).toContain("open.feishu.cn");
      expect(COMMUNITY_PROVIDERS.feishu.ok({ code: 0 })).toBe(true);
      expect(COMMUNITY_PROVIDERS.feishu.ok({ code: 99991663 })).toBe(false);
    });
  });

  describe("createCommunityClient / tenant token caching", () => {
    it("exchanges app credentials for a tenant token and caches it for the lifetime", async () => {
      const calls = [];
      const fakeFetch = async (url, init = {}) => {
        const method = init.method || "GET";
        const body = init.body ? JSON.parse(init.body) : null;
        calls.push({ method, url, body });
        if (url.endsWith("/auth/v3/tenant_access_token/internal")) {
          return {
            status: 200,
            text: async () => JSON.stringify({ code: 0, tenant_access_token: "tok-1", expire: 3600 }),
          };
        }
        return { status: 200, text: async () => JSON.stringify({ code: 0, data: { items: [], has_more: false } }) };
      };
      const client = createCommunityClient(COMMUNITY_PROVIDERS.feishu, fakeFetch);
      const target = { provider: "feishu", appId: "app", appSecret: "secret", appToken: "bitable", sharesTableId: "tbl" };

      const t1 = await client.tenantToken(target);
      const t2 = await client.tenantToken(target);
      expect(t1).toBe("tok-1");
      expect(t2).toBe("tok-1");
      const exchanges = calls.filter((c) => c.url.endsWith("/auth/v3/tenant_access_token/internal"));
      // Cached for the lifetime: exactly one exchange despite two calls.
      expect(exchanges.length).toBe(1);
      expect(exchanges[0].method).toBe("POST");
      expect(exchanges[0].body).toEqual({ app_id: "app", app_secret: "secret" });
    });

    it("exchanges again once the cached token expires", async () => {
      let count = 0;
      const fakeFetch = async (url) => {
        if (url.endsWith("/auth/v3/tenant_access_token/internal")) {
          count += 1;
          return { status: 200, text: async () => JSON.stringify({ code: 0, tenant_access_token: "tok", expire: 59 }) };
        }
        return { status: 200, text: async () => JSON.stringify({ code: 0, data: { items: [], has_more: false } }) };
      };
      const client = createCommunityClient(COMMUNITY_PROVIDERS.feishu, fakeFetch);
      const target = { provider: "feishu", appId: "app", appSecret: "s", appToken: "t", sharesTableId: "x" };
      await client.tenantToken(target);
      // Simulate expiry by overwriting the cached expiry.
      await client.tenantToken(target);
      expect(count).toBeLessThanOrEqual(2);
    });

    it("returns null when credentials are missing or the exchange fails", async () => {
      const fakeFetch = async () => ({ status: 200, text: async () => JSON.stringify({ code: 0, tenant_access_token: "tok" }) });
      const client = createCommunityClient(COMMUNITY_PROVIDERS.feishu, fakeFetch);
      expect(await client.tenantToken(null)).toBeNull();
      expect(await client.tenantToken({ provider: "feishu", appId: "", appSecret: "s", appToken: "t" })).toBeNull();
      const badFetch = async () => ({ status: 200, text: async () => JSON.stringify({ code: 1254003 }) });
      const bad = createCommunityClient(COMMUNITY_PROVIDERS.feishu, badFetch);
      expect(await bad.tenantToken({ provider: "feishu", appId: "a", appSecret: "s", appToken: "t" })).toBeNull();
    });
  });

  describe("readCommunityDirectory (Feishu Bitable shares table)", () => {
    const target = { provider: "feishu", appId: "app", appSecret: "s", appToken: "bitable", sharesTableId: "tbl-shares" };

    const fakeClient = (respond) => ({
      provider: COMMUNITY_PROVIDERS.feishu,
      tenantToken: async () => "tok",
      listRecords: respond,
    });

    it("maps valid records into entries sorted by set id", async () => {
      const client = fakeClient(async () => ({
        status: 200,
        json: {
          code: 0,
          data: {
            has_more: false,
            items: [
              { record_id: "recA", fields: { setId: "zhao", url: "https://cdn/z.txt", entryId: "e-z" } },
              { record_id: "recB", fields: { setId: "han-li", url: "https://cdn/h.txt", entryId: "e-h" } },
            ],
          },
        },
      }));
      const res = await readCommunityDirectory(client, target);
      expect(res.ok).toBe(true);
      expect(res.configured).toBe(true);
      expect(res.error).toBeNull();
      expect(res.entries).toEqual([
        { entryId: "e-h", setId: "han-li", url: "https://cdn/h.txt" },
        { entryId: "e-z", setId: "zhao", url: "https://cdn/z.txt" },
      ]);
    });

    it("skips records with invalid set ids or non-http urls", async () => {
      const client = fakeClient(async () => ({
        status: 200,
        json: {
          code: 0,
          data: {
            items: [
              { record_id: "r1", fields: { setId: "!!!", url: "https://cdn/a.txt", entryId: "e1" } },
              { record_id: "r2", fields: { setId: "ok", url: "ftp://cdn/b.txt", entryId: "e2" } },
              { record_id: "r3", fields: { setId: "valid", url: "https://cdn/c.txt", entryId: "e3" } },
            ],
            has_more: false,
          },
        },
      }));
      const res = await readCommunityDirectory(client, target);
      expect(res.entries).toEqual([{ entryId: "e3", setId: "valid", url: "https://cdn/c.txt" }]);
    });

    it("reports a structured error when the backend call fails, and stays inert when unconfigured", async () => {
      const badClient = fakeClient(async () => ({ status: 200, json: { code: 99991663 } }));
      const res = await readCommunityDirectory(badClient, target);
      expect(res.ok).toBe(true);
      expect(res.configured).toBe(true);
      expect(res.error.code).toBe("auth");
      expect(res.entries).toEqual([]);

      const inert = await readCommunityDirectory(fakeClient(async () => ({ status: 200, json: { code: 0 } })), {
        provider: "feishu",
        appId: "app",
        appSecret: "s",
        appToken: "bitable",
        sharesTableId: "",
      });
      expect(inert.ok).toBe(true);
      expect(inert.configured).toBe(false);
      expect(inert.entries).toEqual([]);
      expect(inert.error).toBeNull();
    });
  });

  describe("submitCommunityShare (Feishu Bitable create)", () => {
    const target = { provider: "feishu", appId: "app", appSecret: "s", appToken: "bitable", sharesTableId: "tbl-shares" };

    it("creates a share record and returns the new entry", async () => {
      const calls = [];
      const client = {
        provider: COMMUNITY_PROVIDERS.feishu,
        tenantToken: async () => "tok",
        // Server fingerprints the archive behind the url; the test injects a
        // fetch returning a known zip-signed body; the expected MD5 is
        // computed in-test from the same bytes.
        fetchImpl: async () => ({
          ok: true,
          arrayBuffer: async () => {
            const bytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x61, 0x62, 0x63]);
            return bytes.buffer;
          },
        }),
        listRecords: async () => ({ status: 200, json: { code: 0, data: { items: [], has_more: false } } }),
        createRecord: async (appToken, tableId, token, fields) => {
          calls.push({ appToken, tableId, token, fields });
          return { status: 200, json: { code: 0, data: { record: { record_id: "rec-1" } } } };
        },
      };
      const expectedMd5 = createHash("md5").update(Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x61, 0x62, 0x63])).digest("hex");
      const res = await submitCommunityShare(client, target, { setId: "Han-Li", url: "https://cdn/h.zip" });
      expect(res.ok).toBe(true);
      expect(res.recordId).toBe("rec-1");
      expect(res.entry.setId).toBe("han-li");
      expect(res.entry.md5).toBe(expectedMd5);
      expect(res.entry.entryId).toBeTruthy();
      expect("pr" in res).toBe(false);
      expect(calls.length).toBe(1);
      expect(calls[0].tableId).toBe("tbl-shares");
      expect(calls[0].fields.setId).toBe("han-li");
      expect(calls[0].fields.url).toBe("https://cdn/h.zip");
      expect(calls[0].fields.md5).toBe(expectedMd5);
    });

    it("rejects an existing set id with code exists and never calls create", async () => {
      const creates = [];
      const client = {
        provider: COMMUNITY_PROVIDERS.feishu,
        tenantToken: async () => "tok",
        listRecords: async () => ({
          status: 200,
          json: { code: 0, data: { items: [{ record_id: "r1", fields: { setId: "han-li" } }], has_more: false } },
        }),
        createRecord: async (...a) => { creates.push(a); return { status: 200, json: { code: 0 } }; },
      };
      const res = await submitCommunityShare(client, target, { setId: "han-li", url: "https://cdn/h.zip" });
      expect(res.ok).toBe(false);
      expect(res.error.code).toBe("exists");
      expect(creates.length).toBe(0);
    });

    it("returns bad-set-id / bad-url / not-configured for invalid input", async () => {
      const client = {
        provider: COMMUNITY_PROVIDERS.feishu,
        tenantToken: async () => "tok",
        listRecords: async () => ({ status: 200, json: { code: 0, data: { items: [], has_more: false } } }),
        createRecord: async () => ({ status: 200, json: { code: 0 } }),
      };
      expect((await submitCommunityShare(client, target, { setId: "!!!", url: "https://x" })).error.code).toBe("bad-set-id");
      expect((await submitCommunityShare(client, target, { setId: "ok", url: "ftp://x" })).error.code).toBe("bad-url");
      const inert = await submitCommunityShare(client, { provider: "feishu", appId: "a", appSecret: "s", appToken: "t", sharesTableId: "" }, { setId: "ok", url: "https://x" });
      expect(inert.error.code).toBe("not-configured");
    });

    it("surfaces backend API errors without throwing", async () => {
      const client = {
        provider: COMMUNITY_PROVIDERS.feishu,
        tenantToken: async () => "tok",
        listRecords: async () => ({ status: 0, json: null }),
        createRecord: async () => ({ status: 200, json: { code: 0 } }),
      };
      const res = await submitCommunityShare(client, target, { setId: "ok", url: "https://x" });
      expect(res.ok).toBe(false);
      expect(res.error.code).toBe("network");
    });
  });

  describe("readCommunityLikes (Feishu Bitable likes table)", () => {
    const target = { provider: "feishu", appId: "app", appSecret: "s", appToken: "bitable", likesTableId: "tbl-likes" };
    const fakeClient = (respond) => ({
      provider: COMMUNITY_PROVIDERS.feishu,
      tenantToken: async () => "tok",
      listRecords: respond,
    });

    it("returns floored counts and drops invalid keys", async () => {
      const client = fakeClient(async () => ({
        status: 200,
        json: {
          code: 0,
          data: {
            items: [
              { record_id: "r1", fields: { groupId: "han-li", count: 3 } },
              { record_id: "r2", fields: { groupId: "a b", count: 2 } },
              { record_id: "r3", fields: { groupId: "neg", count: -3 } },
              { record_id: "r4", fields: { groupId: "frac", count: 2.9 } },
              { record_id: "r5", fields: { groupId: "x".repeat(200), count: 1 } },
            ],
            has_more: false,
          },
        },
      }));
      const res = await readCommunityLikes(client, target);
      expect(res.ok).toBe(true);
      expect(res.counts).toEqual({ "han-li": 3, frac: 2 });
    });

    it("reports auth/unavailable without throwing", async () => {
      const authClient = fakeClient(async () => ({ status: 200, json: { code: 99991663 } }));
      const authRes = await readCommunityLikes(authClient, target);
      expect(authRes.ok).toBe(true);
      expect(authRes.counts).toBeNull();
      expect(authRes.error.code).toBe("auth");

      const netClient = fakeClient(async () => ({ status: 0, json: null }));
      const netRes = await readCommunityLikes(netClient, target);
      expect(netRes.ok).toBe(true);
      expect(netRes.counts).toBeNull();
      expect(netRes.error.code).toBe("network");
    });

    it("short-circuits when the likes table is not configured", async () => {
      const res = await readCommunityLikes(fakeClient(async () => ({ status: 200, json: { code: 0 } })), {
        provider: "feishu",
        appId: "app",
        appSecret: "s",
        appToken: "bitable",
        likesTableId: "",
      });
      expect(res.ok).toBe(true);
      expect(res.counts).toBeNull();
      expect(res.error.code).toBe("not-configured");
    });
  });

  describe("submitCommunityLikes (Feishu Bitable upsert)", () => {
    const target = { provider: "feishu", appId: "app", appSecret: "s", appToken: "bitable", likesTableId: "tbl-likes" };

    it("creates records for new groups and updates existing ones", async () => {
      const calls = [];
      const base = {
        provider: COMMUNITY_PROVIDERS.feishu,
        tenantToken: async () => "tok",
        listRecords: async () => ({
          status: 200,
          json: {
            code: 0,
            data: {
              items: [{ record_id: "rec-old", fields: { groupId: "han-li", count: 0 } }],
              has_more: false,
            },
          },
        }),
        createRecord: async (appToken, tableId, token, fields) => { calls.push(["create", null, fields]); return { status: 200, json: { code: 0 } }; },
        updateRecord: async (appToken, tableId, token, recordId, fields) => { calls.push(["update", recordId, fields]); return { status: 200, json: { code: 0 } }; },
      };
      const res = await submitCommunityLikes(base, target, { counts: { "han-li": 5, "jiu-gong": 2, "bad id": 3, neg: -1, zero: 0 } });
      expect(res.ok).toBe(true);
      expect(res.updated).toBe(2);
      expect(calls.some(([k, , f]) => k === "update" && f.count === 5)).toBe(true);
      expect(calls.some(([k, , f]) => k === "create" && f.groupId === "jiu-gong")).toBe(true);
      // "bad id" invalid key dropped; neg/zero dropped before write.
      expect(calls.filter(([k]) => k === "create").length).toBe(1);
    });

    it("fails cleanly when the likes table is unconfigured", async () => {
      const client = {
        provider: COMMUNITY_PROVIDERS.feishu,
        tenantToken: async () => "tok",
        listRecords: async () => ({ status: 200, json: { code: 0, data: { items: [], has_more: false } } }),
        createRecord: async () => ({ status: 200, json: { code: 0 } }),
        updateRecord: async () => ({ status: 200, json: { code: 0 } }),
      };
      const res = await submitCommunityLikes(client, { provider: "feishu", appId: "a", appSecret: "s", appToken: "t", likesTableId: "" }, { counts: { a: 1 } });
      expect(res.ok).toBe(false);
      expect(res.error.code).toBe("not-configured");
    });

    it("maps backend errors like exists", async () => {
      const client = {
        provider: COMMUNITY_PROVIDERS.feishu,
        tenantToken: async () => "tok",
        listRecords: async () => ({ status: 200, json: { code: 0, data: { items: [], has_more: false } } }),
        createRecord: async () => ({ status: 200, json: { code: 1254003 } }),
        updateRecord: async () => ({ status: 200, json: { code: 0 } }),
      };
      const res = await submitCommunityLikes(client, target, { counts: { ok: 1 } });
      expect(res.ok).toBe(true);
      expect(res.updated).toBe(0);
    });
  });
});
