// Standalone verification for the attachment-backed archive import routes.
// NOT committed -- proves module load, route registration (exact + prefix),
// upload -> saveImages -> content-addressed ref, serve (GET/HEAD/304/206/416),
// and graceful degradation when the host exposes no attachments store.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import http from "node:http";
import { once } from "node:events";

const target = await import("../src/index.js");

// ---- Minimal host-like router: exact table checked first, then longest prefix.
class Router {
  constructor() { this.exact = new Map(); this.prefixes = new Map(); }
  register(route) {
    if (route.kind === "exact") this.exact.set(route.path, route.handler);
    else this.prefixes.set(route.path, route.handler);
    return () => {
      if (route.kind === "exact") this.exact.delete(route.path);
      else this.prefixes.delete(route.path);
    };
  }
  match(pathname) {
    if (this.exact.has(pathname)) return this.exact.get(pathname);
    let best = null;
    for (const [prefix, handler] of this.prefixes) {
      if (pathname !== prefix && !pathname.startsWith(`${prefix}/`)) continue;
      if (best === null || prefix.length > best[0].length) best = [prefix, handler];
    }
    return best === null ? undefined : best[1];
  }
}

// ---- Stub attachments store mirroring LocalAttachmentStore semantics.
function makeAttachments(root) {
  const objects = join(root, "objects");
  return {
    async saveImages(inputs) {
      const refs = [];
      for (const input of inputs) {
        const data = Buffer.from(input.data);
        const sha256 = createHash("sha256").update(data).digest("hex");
        const dir = join(objects, sha256.slice(0, 2));
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, sha256), data);
        refs.push({
          attachmentId: `sha256:${sha256}`,
          mediaType: input.mediaType,
          width: 1, height: 1,
          bytes: data.byteLength,
          ...(input.name !== undefined ? { name: input.name } : {}),
        });
      }
      return refs;
    },
    imageHostPath(ref) {
      const sha256 = String(ref.attachmentId).replace(/^sha256:/, "");
      return join(objects, sha256.slice(0, 2), sha256);
    },
  };
}

function makeCtx(router, attachments) {
  return {
    get(name) { return name === "attachments" ? attachments : undefined; },
    on() { return () => {}; },
    effect(fn) { const dispose = fn(); return () => { if (typeof dispose === "function") dispose(); }; },
    webServer: router,
  };
}

function startServer(ctx) {
  const router = ctx.webServer;
  const server = http.createServer((req, res) => {
    const parsed = new URL(req.url ?? "/", "http://dsh.local");
    const handler = router.match(parsed.pathname);
    if (handler === undefined) { res.statusCode = 404; res.end("not found"); return; }
    handler(req, res);
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

const reqJson = async (base, path, options = {}) => {
  const response = await fetch(new URL(path, base), options);
  const text = await response.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not json */ }
  return { status: response.status, headers: response.headers, text, json };
};

// tiny PNG (1x1 transparent) + tiny JPEG-like bytes for multimime
const pngBytes = Uint8Array.from(Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
));

const root = mkdtempSync(join(tmpdir(), "flash-skin-attach-"));
const router = new Router();
const attachments = makeAttachments(root);
const ctx = makeCtx(router, attachments);

// apply() registers both effects (no throw, no dependency on dsh-flash)
assert.doesNotThrow(() => target.apply(ctx, undefined));

const server = await startServer(ctx);
const base = `http://127.0.0.1:${server.address().port}/`;

try {
  const pngB64 = Buffer.from(pngBytes).toString("base64");
  const envelope = {
    images: [
      { name: "frame-1.png", mediaType: "image/png", data: pngB64 },
      { name: "frame-2.png", mediaType: "image/png", data: pngB64 },
    ],
  };

  // 1. Method guard on upload exact route
  {
    const r = await reqJson(base, "plugins/dsh-flash-skin/attachment", { method: "GET" });
    assert.equal(r.status, 405, `POST-only route answered GET with ${r.status}`);
  }

  // 2. Upload returns content-addressed serve URLs in order
  {
    const r = await reqJson(base, "plugins/dsh-flash-skin/attachment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(envelope),
    });
    assert.equal(r.status, 200, `upload status ${r.status}: ${r.text}`);
    assert.ok(Array.isArray(r.json.images) && r.json.images.length === 2, "two refs");
    const [a, b] = r.json.images;
    assert.match(a.url, /^\/plugins\/dsh-flash-skin\/attachment\/png\/[0-9a-f]{64}$/, "png serve url");
    assert.equal(a.name, "frame-1.png");
    assert.equal(a.url, b.url, "identical bytes dedupe to one object");
    const servePath = a.url.replace(/^\//, "");

    // 3. Serve GET bytes equal input
    {
      const response = await fetch(new URL(servePath, base));
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), "image/png");
      const received = Buffer.from(new Uint8Array(await response.arrayBuffer()));
      assert.deepEqual(received, Buffer.from(pngBytes).slice(0, received.byteLength).subarray(0));
      assert.deepEqual(received, Buffer.from(pngBytes), "served bytes match upload");
      const etag = response.headers.get("etag");
      assert.ok(etag, "etag present");

      // 4. Conditional GET -> 304
      {
        const r304 = await fetch(new URL(servePath, base), { headers: { "If-None-Match": etag } });
        assert.equal(r304.status, 304, `etag revalidation ${r304.status}`);
      }

      // 5. Range request -> 206
      {
        const r206 = await fetch(new URL(servePath, base), { headers: { Range: "bytes=0-3" } });
        assert.equal(r206.status, 206, `range ${r206.status}`);
        assert.equal(r206.headers.get("content-range"), `bytes 0-3/${Buffer.from(pngBytes).length}`);
        const slice = Buffer.from(new Uint8Array(await r206.arrayBuffer()));
        assert.deepEqual(slice, Buffer.from(pngBytes).subarray(0, 4));
      }

      // 6. Invalid range -> 416
      {
        const r416 = await fetch(new URL(servePath, base), { headers: { Range: `bytes=999999-` } });
        assert.equal(r416.status, 416, `bad range ${r416.status}`);
        assert.equal(r416.headers.get("content-range"), `bytes */${Buffer.from(pngBytes).length}`);
      }

      // 7. HEAD
      {
        const rHead = await fetch(new URL(servePath, base), { method: "HEAD" });
        assert.equal(rHead.status, 200);
        assert.equal(rHead.headers.get("content-length"), String(Buffer.from(pngBytes).length));
        assert.equal((await rHead.arrayBuffer()).byteLength, 0, "HEAD has no body");
      }
    }
  }

  // 8. Unknown hex -> 404
  {
    const r = await reqJson(base, "plugins/dsh-flash-skin/attachment/png/" + "a".repeat(64));
    assert.equal(r.status, 404, `unknown object ${r.status}`);
  }

  // 9. Malformed slug/hex -> 404
  {
    const r = await reqJson(base, "plugins/dsh-flash-skin/attachment/bmp/" + "a".repeat(64));
    assert.equal(r.status, 404, `bad slug ${r.status}`);
    const r2 = await reqJson(base, "plugins/dsh-flash-skin/attachment/png/zzz");
    assert.equal(r2.status, 404, `bad hex ${r2.status}`);
  }

  // 10. Envelope exceeding the body budget -> server refuses to buffer it.
  {
    // A 52 MiB raw string serializes to >45 MiB of JSON body, comfortably over
    // the ~44.9 MiB server body budget. readRequestBody returns null at the cap
    // and the server replies 413 while the client is still uploading, so the
    // socket is reset either way -- both are correct refusal behaviour.
    let status = null;
    try {
      const r = await reqJson(base, "plugins/dsh-flash-skin/attachment", {
        method: "POST",
        body: JSON.stringify({ images: [{ mediaType: "image/png", data: "z".repeat(52 * 1024 * 1024) }] }),
      });
      status = r.status;
    } catch (error) {
      if (error?.cause?.code === "ECONNRESET" || error?.cause?.code === "UND_ERR_SOCKET") {
        status = 413; // server cut us off before completing the upload
      } else {
        throw error;
      }
    }
    assert.equal(status, 413, `over-budget batch refused (was ${status})`);
  }

  // 11. Graceful degradation: no attachments store
  {
    const router2 = new Router();
    const ctx2 = makeCtx(router2, undefined);
    assert.doesNotThrow(() => target.apply(ctx2, undefined)); // must not throw / nuke activation
    const s2 = await startServer(ctx2);
    const b2 = `http://127.0.0.1:${s2.address().port}/`;
    const up = await reqJson(b2, "plugins/dsh-flash-skin/attachment", { method: "POST", body: JSON.stringify({ images: [{ mediaType: "image/png", data: pngB64 }] }) });
    assert.equal(up.status, 503, `upload without attachments -> ${up.status}`);
    const sv = await reqJson(b2, "plugins/dsh-flash-skin/attachment/png/" + "a".repeat(64));
    assert.equal(sv.status, 404, `serve without attachments -> ${sv.status}`);
    s2.close();
  }

  // 12. Builtin asset routes still serve (no regression)
  {
    const r = await fetch(new URL("plugins/dsh-flash-skin/assets/portrait-source-v2/stage-00.webp", base));
    assert.equal(r.status, 200);
    assert.equal(r.headers.get("content-type"), "image/webp");
  }

  console.log("ALL ATTACHMENT ROUTE CHECKS PASSED");
} finally {
  server.close();
  await once(server, "close");
}
