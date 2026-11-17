export type PortraitMediaKind = "image" | "video";

export interface PortraitSource {
  level: number;
  url: string;
  /** Resource kind for the asset. `video` sources render as a looping,
   *  muted, autoplaying <video>; `image` sources decode into an <img>. */
  kind: PortraitMediaKind;
}

/** Common surface the loader uses to drive a media element to a ready state,
 *  satisfied by both `HTMLImageElement` (load+decode) and `HTMLVideoElement`
 *  (loadeddata). Kept minimal so the loader never touches browser-only fields
 *  it doesn't need. */
export interface PortraitMedia {
  kind: PortraitMediaKind;
  /** The actual DOM node to attach into the backdrop (<img> or <video>). */
  node: HTMLImageElement | HTMLVideoElement;
  /** The resolved (possibly retried) URL the asset was loaded from. */
  src: string;
  /** Resolve when the media is ready to display; reject on hard error. */
  ready(): Promise<void>;
  /** Release the source so the element stops consuming the resource. */
  release(): void;
}

export interface PortraitState {
  index: number | null;
  url: string | null;
  status: "loading" | "ready" | "failed";
  media: PortraitMedia | null;
}

export interface PortraitLoaderOptions {
  sources: readonly PortraitSource[];
  onChange: (state: PortraitState) => void;
  createImage?: () => HTMLImageElement;
  createVideo?: () => HTMLVideoElement;
}

interface Asset {
  url: string;
  kind: PortraitMediaKind;
  status: "idle" | "loading" | "ready" | "failed";
  loadedUrl: string | null;
  retries: number;
  media: PortraitMedia | null;
  timer: ReturnType<typeof setTimeout> | null;
  detach: (() => void) | null;
}

const RETRY_DELAYS = [500, 1500, 3000] as const;

function retryUrl(source: string, retry: number) {
  if (retry === 0) return source;
  // Data URLs (embedded base64) carry no query/hash space and degenerate under
  // retry query injection; treat them as non-retryable.
  if (source.startsWith("data:")) return source;
  const hashIndex = source.indexOf("#");
  const hash = hashIndex < 0 ? "" : source.slice(hashIndex);
  const base = hashIndex < 0 ? source : source.slice(0, hashIndex);
  const queryIndex = base.indexOf("?");
  const path = queryIndex < 0 ? base : base.slice(0, queryIndex);
  const query = new URLSearchParams(queryIndex < 0 ? "" : base.slice(queryIndex + 1));
  query.set("retry", String(retry));
  return `${path}?${query}${hash}`;
}

/**
 * Decode frames independently and return the decoded image itself for display.
 * start() resumes after stop(); stop() silently releases every request/image.
 * dispose() is permanent. select() also accepts a target before start().
 */
export function createPortraitLoader(options: PortraitLoaderOptions) {
  const sources = options.sources.map((source) => ({ ...source }));
  const assets = new Map<string, Asset>();
  for (const { url, kind } of sources) {
    if (!assets.has(url)) {
      assets.set(url, {
        url, kind, status: "idle", loadedUrl: null, retries: 0,
        media: null, timer: null, detach: null,
      });
    }
  }
  const createImage = options.createImage ?? (() => new Image());
  const createVideo = options.createVideo ?? (() => document.createElement("video"));
  let onChange: PortraitLoaderOptions["onChange"] | null = options.onChange;
  let active = false;
  let disposed = false;
  let generation = 0;
  let targetLevel = sources[0]?.level ?? 0;
  let displayedIndex: number | null = null;
  let lastState: PortraitState | null = null;

  const isCurrent = (run: number) => active && !disposed && generation === run;
  const nearestIndex = (available: (index: number) => boolean) => {
    let nearest: number | null = null;
    for (let index = 0; index < sources.length; index += 1) {
      if (!available(index)) continue;
      const distance = Math.abs(sources[index].level - targetLevel);
      const previous = nearest === null ? Infinity : Math.abs(sources[nearest].level - targetLevel);
      if (nearest === null || distance < previous || (distance === previous && sources[index].level > sources[nearest].level)) {
        nearest = index;
      }
    }
    return nearest;
  };
  const isReady = (index: number) => assets.get(sources[index].url)?.status === "ready";
  const emit = (state: PortraitState) => {
    if (lastState?.index === state.index && lastState.url === state.url && lastState.status === state.status) return;
    lastState = state;
    onChange?.(state);
  };
  const reconcile = () => {
    if (!active || disposed) return;
    const target = nearestIndex(() => true);
    if (target !== null && isReady(target)) displayedIndex = target;
    else if (displayedIndex === null) displayedIndex = nearestIndex(isReady);
    if (displayedIndex !== null) {
      const asset = assets.get(sources[displayedIndex].url)!;
      emit({ index: displayedIndex, url: asset.loadedUrl, media: asset.media, status: "ready" });
    } else {
      const exhausted = [...assets.values()].every((asset) => asset.status === "failed");
      emit({ index: null, url: null, media: null, status: exhausted ? "failed" : "loading" });
    }
  };

  const request = (asset: Asset, run: number) => {
    if (!isCurrent(run)) return;
    asset.status = "loading";
    const url = retryUrl(asset.url, asset.retries);
    const node = asset.kind === "video" ? createVideo() : createImage();
    if (asset.kind === "image") {
      const img = node as HTMLImageElement;
      img.loading = "eager";
      img.decoding = "async";
    } else {
      const video = node as HTMLVideoElement;
      // Video frames play as an ambient looping backdrop: muted (autoplay
      // policy), looped, inline on mobile and preloaded so `canplay` resolves.
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
    }
    const media: PortraitMedia = asset.kind === "video"
      ? {
          kind: "video", node, src: url,
          // video resolves once it can actually render a frame.
          ready: () => new Promise<void>((resolve, reject) => {
            node.addEventListener("loadeddata", () => resolve());
            node.addEventListener("error", () => reject(new Error("video load error")), { once: true });
          }),
          release: () => {
            (node as HTMLVideoElement).pause();
            node.removeAttribute("src");
            (node as HTMLVideoElement).load();
          },
        }
      : {
          kind: "image", node, src: url,
          ready: () => (node as HTMLImageElement).decode(),
          release: () => node.removeAttribute("src"),
        };
    asset.media = media;
    let settled = false;
    let decoding = false;
    const current = () => !settled && isCurrent(run) && asset.media === media;
    const detach = () => {
      node.removeEventListener("load", handleLoad);
      node.removeEventListener("canplay", handleLoad);
      node.removeEventListener("error", handleError);
      asset.detach = null;
    };
    const handleError = () => {
      if (!current()) return;
      settled = true;
      detach();
      media.release();
      asset.media = null;
      if (asset.retries < RETRY_DELAYS.length) {
        const delay = RETRY_DELAYS[asset.retries];
        asset.retries += 1;
        asset.timer = setTimeout(() => {
          if (!isCurrent(run)) return;
          asset.timer = null;
          request(asset, run);
        }, delay);
      } else {
        asset.status = "failed";
        reconcile();
      }
    };
    const handleLoad = () => {
      if (!current() || decoding) return;
      decoding = true;
      void media.ready().then(() => {
        if (!current()) return;
        settled = true;
        detach();
        asset.loadedUrl = url;
        asset.status = "ready";
        reconcile();
      }, handleError);
    };
    asset.detach = detach;
    // `<video>` signals readiness via `canplay`; `<img>` via `load`.
    node.addEventListener(asset.kind === "video" ? "canplay" : "load", handleLoad);
    node.addEventListener("error", handleError);
    // Both <img> and <video> expose a string `src`; driving the property kicks
    // off the fetch after the listeners above are attached.
    node.src = url;
  };

  const stop = () => {
    active = false;
    generation += 1;
    for (const asset of assets.values()) {
      if (asset.timer !== null) clearTimeout(asset.timer);
      asset.timer = null;
      asset.detach?.();
      asset.media?.release();
      asset.media = null;
      asset.status = "idle";
      asset.loadedUrl = null;
      asset.retries = 0;
    }
    displayedIndex = null;
    lastState = null;
  };

  return {
    start() {
      if (disposed || active) return;
      active = true;
      const run = ++generation;
      reconcile();
      for (const asset of assets.values()) request(asset, run);
    },
    select(level: number) {
      if (disposed || !Number.isFinite(level)) return;
      targetLevel = level;
      reconcile();
    },
    stop,
    dispose() {
      stop();
      disposed = true;
      onChange = null;
    },
  };
}
