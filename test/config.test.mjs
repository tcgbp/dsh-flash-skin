import { describe, expect, it } from "vitest";
import { Config } from "../src/index.js";

// The vendored @deepseek-ai/schemastery fork exposes no `.optional()` helper,
// so optional shape is expressed by leaving object sub-fields un-required and
// letting the loader materialise an absent object as `{}`. These tests pin the
// activation-critical contract: every real profile shape must VALIDATE (never
// throw), covering the two regressions actually seen in the field:
//   1. `z.object(...).optional is not a function`
//   2. `$.communityDirectory.owner missing required value`
// Both `owner`/`repo` and the structural fields carry defaults (tcgbp /
// dsh-flash-skin / master / shares), so an absent `communityDirectory` still
// yields a browsable target; explicit values are always honoured. Activation is
// never blocked by a missing or partial directory.
describe("Config schema (plugin activation contract)", () => {
  it("validates a minimal profile with no communityDirectory", () => {
    expect(() => Config({})).not.toThrow();
  });

  it("validates a portrait-group-only profile", () => {
    const raw = { portraitGroups: [{ id: "a", name: "A" }] };
    expect(() => Config(raw)).not.toThrow();
  });

  it("validates a configured communityDirectory with owner/repo as given and branch/path defaults filled", () => {
    const out = Config({ communityDirectory: { owner: "octo", repo: "cats" } });
    expect(out.communityDirectory).toMatchObject({
      owner: "octo",
      repo: "cats",
      branch: "master",
      path: "shares",
    });
  });

  it("fills owner/repo defaults when communityDirectory is absent or partial", () => {
    // Missing/partial owner+repo must not fail activation; defaults point at
    // the plugin-owner shared directory so the channel stays browsable.
    expect(() => Config({ communityDirectory: { repo: "cats" } })).not.toThrow();
    expect(() => Config({ communityDirectory: {} })).not.toThrow();
    const absent = Config({});
    expect(absent.communityDirectory).toMatchObject({
      owner: "tcgbp",
      repo: "dsh-flash-skin",
      branch: "master",
      path: "shares",
    });
  });

  it("honours explicit branch/path overrides", () => {
    const out = Config({
      communityDirectory: { owner: "o", repo: "r", branch: "dev", path: "lib/shares" },
    });
    expect(out.communityDirectory).toMatchObject({
      owner: "o",
      repo: "r",
      branch: "dev",
      path: "lib/shares",
    });
  });

  it("accepts integer darkLevel thresholds in range and rejects fractional ones", () => {
    // `darkLevel` is an integer slider stop 0..MAX_LEVEL; fractional values
    // must fail validation so a persisted float can never slip through.
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 5 }] })).not.toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 0 }] })).not.toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 2.5 }] })).toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: -1 }] })).toThrow();
    expect(() => Config({ portraitGroups: [{ id: "a", name: "A", darkLevel: 7 }] })).toThrow();
  });
});
