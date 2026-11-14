import { describe, expect, it } from "vitest";
import { isDeepStrictEqual } from "node:util";
import { Config } from "../src/index.js";

// The vendored @deepseek-ai/schemastery fork exposes no `.optional()` helper,
// so optional shape is expressed by leaving object sub-fields un-required and
// letting the loader materialise an absent object as `{}`. These tests pin the
// activation-critical contract: every real profile shape must VALIDATE (never
// throw), covering the two regressions actually seen in the field:
//   1. `z.object(...).optional is not a function`
//   2. `$.communityDirectory.owner missing required value`
// `communityDirectory` has been REMOVED from the config schema. It was the
// root cause of the desktop-only write failure: its `provider` field carries a
// `.default("feishu")`, so the on-disk `ConfigEditor` reconcile (which
// re-resolves the whole merged section) would always inject
// `communityDirectory: { provider: "feishu" }` into `effective` while the
// client's form projection (`next`) omitted it — making the L138
// `isDeepStrictEqual(effective, next)` guard fail on EVERY desktop write. With
// the field gone, `resolve()` no longer injects it, so the deep-equal passes
// and desktop writes succeed (web never ran this reconcile codepath). Stray
// `communityDirectory` keys in a profile are now ignored with no throw.
describe("Config schema (plugin activation contract)", () => {
  it("validates a minimal profile with no communityDirectory", () => {
    expect(() => Config({})).not.toThrow();
  });

  it("validates a portrait-group-only profile", () => {
    const raw = { portraitGroups: [{ id: "a", name: "A" }] };
    expect(() => Config(raw)).not.toThrow();
  });

  it("no longer exposes communityDirectory (removed field) — fixes desktop write reconcile", () => {
    // The field is intentionally NOT declared in the schema anymore. On the
    // desktop runtime the on-disk `ConfigEditor` re-resolves the whole merged
    // section and then requires `effective === next` (L138 deep-equal). While
    // `communityDirectory: z.object({ provider: z.string().default("feishu") })`
    // existed, `resolve()` always injected `{ provider: "feishu" }` into the
    // recomposed section while the client's form projection (`next`) omitted it
    // — so the deep-equal failed on EVERY desktop write (web never runs this
    // reconcile). With the field gone, a fresh `{}` profile resolves to only
    // `{ portraitGroups: [] }` (no injected directory), and a stray key is
    // preserved verbatim WITHOUT the provider default being injected.
    const empty = Config({});
    expect(empty.communityDirectory).toBeUndefined();

    const portraitOnly = Config({ portraitGroups: [{ id: "a", name: "A" }] });
    expect(portraitOnly.communityDirectory).toBeUndefined();

    // Stray key is kept verbatim (no `provider` default injected) and must not
    // throw — proving the removed field is inert, not half-resolved.
    const stray = Config({
      communityDirectory: { appId: "cli_a", appSecret: "sec", appToken: "bitable", sharesTableId: "tbl-shares" },
    });
    expect(stray.communityDirectory).toMatchObject({
      appId: "cli_a",
    });
    expect(stray.communityDirectory.provider).toBeUndefined();
    expect(() => Config({ communityDirectory: { appId: "a" } })).not.toThrow();
    expect(() => Config({ communityDirectory: {} })).not.toThrow();
  });

  it("accepts non-negative integer darkLevel thresholds (no MAX_LEVEL cap) and rejects non-integer or negative ones", () => {
    // `darkLevel` is an integer slider stop on the group's dynamic frame axis
    // (0..frameCount) and must be a non-negative integer. There is no MAX_LEVEL
    // cap because a group with more frames than MAX_LEVEL stores a threshold up
    // to its own frame count; the client clamps against the real axis at
    // render/commit time. Non-integers, negatives and non-numbers still fail.
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 5 }] })).not.toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 0 }] })).not.toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 6 }] })).not.toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 7 }] })).not.toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 64 }] })).not.toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 2.667 }] })).toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: -1 }] })).toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: "3" }] })).toThrow();
  });
});

// Second desktop-only write root cause: present-undefined `zh`/`en` keys.
//
// The on-disk ConfigEditor writes `next` to the profile patch (YAML), then
// re-parses it and requires `effective === next` under `isDeepStrictEqual`
// (the same L138 guard that `communityDirectory` used to trip). A YAML
// serializer drops properties whose value is `undefined`, but `next` still
// carries them as own keys (e.g. `{ ..., zh: undefined, en: undefined }` from
// the client's `commitField` when a bilingual name is cleared). Because
// `isDeepStrictEqual` distinguishes a present-`undefined` key from an absent
// one, that asymmetry makes the desktop reconcile fail on every write, while
// fresh add/import groups (all-real values) pass it. The client `commit()` now
// strips `undefined`-valued keys (≡ absent, schema-neutral) before writing, so
// the round-trip deep-equal holds. These tests pin that mechanism and prove the
// sanitizer restores the invariant.
const stripUndefined = (group) => {
  const out = {};
  for (const [key, value] of Object.entries(group)) if (value !== undefined) out[key] = value;
  return out;
};

describe("portrait-group YAML round-trip invariant (desktop ConfigEditor L138 reconcile)", () => {
  it("a group with present-undefined zh/en would break the host deep-equal (the bug we fixed)", () => {
    const next = [
      { id: "g1", name: "默认分组", zh: "默认分组", en: "Default", images: [] },
      { id: "g2", name: "组2", zh: undefined, en: "Group2", images: [] }, // cleared zh override
    ];
    // Serializer drops `undefined`-valued keys, so effective omits `zh` while
    // `next` still owns it → strict deep-equal fails on desktop.
    const effective = next.map(stripUndefined);
    expect(isDeepStrictEqual(effective, next)).toBe(false);
  });

  it("after sanitization (the commit() fix) the round-trip deep-equal holds", () => {
    const next = [
      { id: "g1", name: "默认分组", zh: "默认分组", en: "Default", images: [] },
      { id: "g2", name: "组2", zh: undefined, en: "Group2", images: [] },
      { id: "g3", name: "组3", darkLevel: undefined, images: ["x.png"] },
    ];
    const sanitized = next.map(stripUndefined);
    // Round-tripping the sanitized array leaves it byte-identical under the
    // strict comparison (no present-undefined keys remain).
    expect(isDeepStrictEqual(sanitized.map(stripUndefined), sanitized)).toBe(true);
    // And the schema accepts the sanitized result.
    expect(() => Config({ portraitGroups: sanitized })).not.toThrow();
  });
});
