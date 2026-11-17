import { describe, expect, it } from "vitest";
import { createPortraitLoader } from "../src/client/portrait-loader.ts";

// Minimal stand-in for HTMLImageElement / HTMLVideoElement driven by the loader.
// The `src` setter reproduces the real browser ordering: a video fires
// `loadeddata` strictly BEFORE `canplay`; an image fires `load`.
// readyState >= 2 (HAVE_CURRENT_DATA) is marked once loadeddata has fired.
function makeNode(kind) {
  const listeners = new Map();
  const node = {
    kind,
    readyState: 0,
    autoplay: false,
    muted: false,
    loop: false,
    playsInline: false,
    preload: "",
    loading: "eager",
    decoding: "async",
    className: "",
    width: 0,
    height: 0,
    _src: "",
    play() {
      return Promise.resolve();
    },
    pause() {},
    load() {},
    removeAttribute(k) {
      if (k === "src") this._src = "";
    },
    setAttribute() {},
    addEventListener(type, cb) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(cb);
    },
    removeEventListener(type, cb) {
      const set = listeners.get(type);
      if (set) set.delete(cb);
    },
    _emit(type) {
      const set = listeners.get(type);
      if (set) for (const cb of [...set]) cb({ type });
    },
    decode() {
      return Promise.resolve();
    },
    get src() {
      return this._src;
    },
    set src(v) {
      this._src = v;
      if (kind === "video") {
        // loadeddata always fires before canplay for a playable source.
        node.readyState = 2;
        node._emit("loadeddata");
        node._emit("canplay");
      } else {
        node._emit("load");
      }
    },
  };
  return node;
}

describe("createPortraitLoader", () => {
  it("mounts a video frame whose data arrived before the canplay handler registered (loadeddata precedes canplay)", async () => {
    const emitted = [];
    const loader = createPortraitLoader({
      sources: [
        { level: 0, url: "https://cdn.test/frame.png", kind: "image" },
        { level: 1, url: "https://cdn.test/clip.mp4", kind: "video" },
      ],
      createImage: () => makeNode("image"),
      createVideo: () => makeNode("video"),
      onChange: (state) => emitted.push(state),
    });
    loader.start();
    loader.select(1);
    // Let the post-canplay microtasks (asset.status -> ready -> reconcile) settle.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(emitted.some((s) => s.status === "ready" && s.media && s.media.kind === "video")).toBe(true);
  });
});
