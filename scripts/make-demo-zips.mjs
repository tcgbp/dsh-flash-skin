// Regenerate the example import archives at the repo root from the
// readable manifests in examples/portrait-manifest and the embedded-frame
// assets under assets/portrait-source-*.
//
//   node ./scripts/make-demo-zips.mjs
//
// Produces one embedded-image archive per built-in Liang set:
//   liangsheng-demo.zip   portrait-source-v2 frames + portrait.yaml metadata
//   liangshen-demo.zip    portrait-source-v3 frames + portrait.yaml metadata
//   liangzu-demo.zip      portrait-source-v4 frames + portrait.yaml metadata
// plus the URL-only archive:
//   liangshen-url-demo.zip  manifest images: list, no embedded frames
import { zipSync } from "../src/client/vendor/fflate.js";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bytes = (path) => new Uint8Array(readFileSync(path));
const strBytes = (path) => new TextEncoder().encode(readFileSync(path, "utf8"));

function writeZip(name, entries) {
  writeFileSync(join(root, name), Buffer.from(zipSync(entries)));
  console.log(`wrote ${name} (${Object.keys(entries).length} entries)`);
}

// Built-in portrait sets; each demo packs every frame in the set's asset
// folder plus the matching, commented manifest.
const groups = [
  { id: "liangsheng", folder: "portrait-source-v2" },
  { id: "liangshen", folder: "portrait-source-v3" },
  { id: "liangzu", folder: "portrait-source-v4" },
];
for (const { id, folder } of groups) {
  const assetDir = join(root, "assets", folder);
  const frames = readdirSync(assetDir)
    .filter((name) => name.endsWith(".webp"))
    .sort();
  writeZip(`${id}-demo.zip`, {
    "portrait.yaml": strBytes(join(root, "examples", "portrait-manifest", `portrait.${id}-demo.yaml`)),
    ...Object.fromEntries(frames.map((name) => [name, bytes(join(assetDir, name))])),
  });
}

// The URL-only example ships no frames at all; the group is seeded solely
// from the manifest's images: list.
writeZip("liangshen-url-demo.zip", {
  "portrait.yaml": strBytes(join(root, "examples", "portrait-manifest", "portrait.liangshen-url-demo.yaml")),
});
