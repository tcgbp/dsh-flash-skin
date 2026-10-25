import { createReadStream, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import z from "@deepseek-ai/schemastery";
import { parseSingleRange } from "./range.js";

export { parseSingleRange } from "./range.js";

export const PACKAGE_ID = "dsh-flash-skin";
export const SETTINGS_NAMESPACE = "flash-skin";
export const ASSET_PREFIX = `/plugins/${PACKAGE_ID}/assets/`;

/**
 * The plugin's settings section (settings namespace `flash-skin`), surfaced
 * under the bundle's page while the Bundle Manager serves it. `portraitGroups`
 * is declared volatile on the WHOLE array so every sub-path stays writable by
 * editors that talk through the "flash-skin" ConfigForms entry. Each group is
 * a named, ordered list of image URLs; the client maps slots low → high
 * reasoning level, so order is the group's visual rank.
 */
export const Config = z.object({
  portraitGroups: z
    .array(z.object({
      id: z.string().min(1).required(),
      name: z.string().min(1).required(),
      images: z.array(z.string().min(1)).default([]),
      // Optional per-group slider level (0..MAX_LEVEL) at which the set flips
      // to the dark shell. Object fields are optional unless `.required()`, so
      // an absent value resolves to the default threshold (MAX_LEVEL - 1),
      // keeping older persisted configs working unchanged.
      darkLevel: z.number().min(0).max(6),
    }))
    .default([])
    .volatile(),
});

// Live mirror of the volatile section: the loader re-reads it whenever the
// profile's volatile values move, so host-side readers always observe the
// latest committed portrait groups without coupling to the settings section.
let portraitGroupsSnapshot = [];
export function getPortraitGroups() {
  return portraitGroupsSnapshot;
}

// Demo: three portrait sets (each a distinct "appearance"), served at levels
// 0..30. Each set maps to its own source asset directory under /assets and
// serves exactly the 8 distinct frames inside it. The file names are per-set
// asset keys; the client anchors them to evenly spaced reasoning levels.
export const PORTRAIT_SETS = [
  {
    id: "liangsheng",
    folder: "portrait-source-v2",
    files: [
      "stage-00.webp",
      "level-04.webp",
      "level-09.webp",
      "level-13.webp",
      "level-16.webp",
      "level-19.webp",
      "stage-24.webp",
      "level-28.webp",
    ],
  },
  {
    id: "liangshen",
    folder: "portrait-source-v3",
    files: [
      "level-01.webp",
      "stage-06.webp",
      "level-10.webp",
      "level-14.webp",
      "level-17.webp",
      "level-21.webp",
      "level-25.webp",
      "level-29.webp",
    ],
  },
  {
    id: "liangzu",
    folder: "portrait-source-v4",
    files: [
      "level-03.webp",
      "level-07.webp",
      "stage-12.webp",
      "bridge-15.webp",
      "stage-18.webp",
      "level-22.webp",
      "bridge-27.webp",
      "stage-30.webp",
    ],
  },
];

const ASSET_SPECS = [];
for (const { folder, files } of PORTRAIT_SETS) {
  for (const file of files) {
    ASSET_SPECS.push([`${folder}/${file}`, "image/webp"]);
  }
}

function send(res, status, headers = {}) {
  res.writeHead(status, {
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  res.end();
}

function buildAssets() {
  const assets = new Map();
  for (const [name, type] of ASSET_SPECS) {
    const path = fileURLToPath(new URL(`../assets/${name}`, import.meta.url));
    try {
      const info = statSync(path);
      if (!info.isFile()) continue;
      assets.set(`${ASSET_PREFIX}${name}`, {
        path,
        type,
        size: info.size,
        etag: `W/"${info.size.toString(16)}-${Math.trunc(info.mtimeMs).toString(16)}"`,
      });
    } catch {
      // A missing optional medium is handled by the browser fallback chain.
    }
  }
  return { assets };
}

function createAssetHandler(assets, activeStreams) {
  return (req, res) => {
    const method = req.method ?? "GET";
    if (method !== "GET" && method !== "HEAD") {
      send(res, 405, { Allow: "GET, HEAD" });
      return;
    }

    let pathname;
    try {
      pathname = new URL(req.url ?? "/", "http://dsh.local").pathname;
    } catch {
      send(res, 404);
      return;
    }
    const asset = assets.get(pathname);
    if (asset === undefined) {
      send(res, 404);
      return;
    }

    if (req.headers["if-none-match"] === asset.etag) {
      send(res, 304, { ETag: asset.etag });
      return;
    }

    const ifRange = req.headers["if-range"];
    const rangeHeader = ifRange !== undefined && ifRange !== asset.etag
      ? undefined
      : req.headers.range;
    const range = parseSingleRange(rangeHeader, asset.size);
    if (range === false) {
      send(res, 416, { "Content-Range": `bytes */${asset.size}` });
      return;
    }

    const start = range?.start ?? 0;
    const end = range?.end ?? asset.size - 1;
    const status = range === null ? 200 : 206;
    const headers = {
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=3600, must-revalidate",
      "Content-Length": String(end - start + 1),
      "Content-Type": asset.type,
      ETag: asset.etag,
      ...(range === null ? {} : { "Content-Range": `bytes ${start}-${end}/${asset.size}` }),
    };

    if (method === "HEAD") {
      send(res, status, headers);
      return;
    }

    res.writeHead(status, {
      "X-Content-Type-Options": "nosniff",
      ...headers,
    });
    const stream = createReadStream(asset.path, { start, end });
    activeStreams.add(stream);
    const release = () => activeStreams.delete(stream);
    stream.once("close", release);
    stream.once("end", release);
    stream.once("error", () => {
      release();
      if (!res.headersSent) send(res, 500);
      else res.destroy();
    });
    res.once("close", () => {
      if (!stream.destroyed) stream.destroy();
    });
    stream.pipe(res);
  };
}

export const inject = ["webServer"];

export function apply(ctx, config) {
  portraitGroupsSnapshot = config?.portraitGroups?.get() ?? [];
  ctx.effect(() => {
    const unregister = ctx.on("loader/volatile-update", () => {
      portraitGroupsSnapshot = config?.portraitGroups?.get() ?? [];
    });
    return () => unregister();
  }, "flash-skin: portrait groups mirror");

  const { assets } = buildAssets();
  const activeStreams = new Set();
  ctx.effect(() => {
    const handler = createAssetHandler(assets, activeStreams);
    const unregister = [...assets.keys()].map((path) => ctx.webServer.register({
      kind: "exact",
      path,
      handler,
    }));
    return () => {
      for (const dispose of unregister) dispose();
      for (const stream of activeStreams) stream.destroy();
      activeStreams.clear();
    };
  }, "flash-skin: static media route");
}
