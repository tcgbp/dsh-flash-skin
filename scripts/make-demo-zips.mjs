// Regenerate the two example import archives at the repo root from the
// readable manifests in examples/portrait-manifest and the embedded-frame
// assets under assets/portrait-source-v3.
//
//   node ./scripts/make-demo-zips.mjs
//
// Produces:
//   liangshen-demo.zip      embedded-image archive + portrait.yaml metadata
//   liangshen-url-demo.zip  URL-only archive (manifest images: list, no frames)
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

// The example embedded-image archive packs every webp in the source-v3 set
// plus the matching, commented manifest.
const frames = readdirSync(join(root, "assets/portrait-source-v3"))
  .filter((name) => name.endsWith(".webp"))
  .sort();
writeZip("liangshen-demo.zip", {
  "portrait.yaml": strBytes(join(root, "examples/portrait-manifest/portrait.embedded.yaml")),
  ...Object.fromEntries(frames.map((name) => [name, bytes(join(root, "assets/portrait-source-v3", name))])),
});

// The URL-only example ships no frames at all; the group is seeded solely
// from the manifest's images: list.
writeZip("liangshen-url-demo.zip", {
  "portrait.yaml": strBytes(join(root, "examples/portrait-manifest/portrait.url-only.yaml")),
});
