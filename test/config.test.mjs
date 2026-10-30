import { describe, expect, it } from "vitest";
import { Config } from "../src/index.js";

// The vendored @deepseek-ai/schemastery fork exposes no `.optional()` helper,
// so optional shape is expressed by leaving object sub-fields un-required and
// letting the loader materialise an absent object as `{}`. These tests pin the
// activation-critical contract: every real profile shape must VALIDATE (never
// throw), covering the two regressions actually seen in the field:
//   1. `z.object(...).optional is not a function`
//   2. `$.communityDirectory.owner missing required value`
// The community directory always defaults to the shipped Feishu backend
// (`provider: "feishu"`), so an absent `communityDirectory` still yields an
// inert-but-valid target; explicit app credentials are always honoured.
// Activation is never blocked by a missing or partial directory.
describe("Config schema (plugin activation contract)", () => {
  it("validates a minimal profile with no communityDirectory", () => {
    expect(() => Config({})).not.toThrow();
  });

  it("validates a portrait-group-only profile", () => {
    const raw = { portraitGroups: [{ id: "a", name: "A" }] };
    expect(() => Config(raw)).not.toThrow();
  });

  it("validates a configured communityDirectory and fills the provider default", () => {
    const out = Config({
      communityDirectory: { appId: "cli_a", appSecret: "sec", appToken: "bitable", sharesTableId: "tbl-shares" },
    });
    expect(out.communityDirectory).toMatchObject({
      provider: "feishu",
      appId: "cli_a",
      appSecret: "sec",
      appToken: "bitable",
      sharesTableId: "tbl-shares",
    });
  });

  it("fills the feishu provider default when communityDirectory is absent or partial", () => {
    // Missing/partial app credentials must not fail activation; the provider
    // default points at the shipped feishu backend so the channel stays inert
    // but never blocks activation.
    expect(() => Config({ communityDirectory: { appId: "a" } })).not.toThrow();
    expect(() => Config({ communityDirectory: {} })).not.toThrow();
    const absent = Config({});
    expect(absent.communityDirectory).toMatchObject({
      provider: "feishu",
    });
  });

  it("honours an explicit provider and likes table override", () => {
    const out = Config({
      communityDirectory: {
        provider: "feishu",
        appId: "cli_a",
        appSecret: "sec",
        appToken: "bitable",
        sharesTableId: "sh",
        likesTableId: "li",
      },
    });
    expect(out.communityDirectory).toMatchObject({
      provider: "feishu",
      sharesTableId: "sh",
      likesTableId: "li",
    });
  });

  it("accepts integer darkLevel thresholds in range and rejects non-integer or out-of-range ones", () => {
    // `darkLevel` is a slider stop in 0..MAX_LEVEL (7 stops) and must be an
    // integer; values outside the range, non-numbers, or non-integers fail.
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 5 }] })).not.toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 0 }] })).not.toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 6 }] })).not.toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 2.667 }] })).toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: -1 }] })).toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 7 }] })).toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: "3" }] })).toThrow();
  });
});
