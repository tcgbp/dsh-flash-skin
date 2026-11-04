// ── URL display formatting ────────────────────────────────────────────────────
// Community entries carry a full external archive URL. Showing the whole string
// is noisy, so listing surfaces render a compact "host + head of path" summary
// and let the interactive element expose the full URL via its title tooltip.

/** Compact display form of a URL: `host/head-of-path…`. Falls back to a hard
 *  ellipsis-truncated raw string when the input is not URL-shaped. Pure and
 *  node + browser safe (relies only on the global `URL`). */
export function summarizeUrl(url: string, maxLength = 44): string {
  if (typeof url !== "string" || url.length === 0) return url;

  let host = "";
  let tail = ""; // path + query, without a leading "/"
  try {
    const parsed = new URL(url);
    host = parsed.host;
    const raw = `${parsed.pathname}${parsed.search}`;
    tail = raw === "/" ? "" : raw.replace(/^\/+/, "");
  } catch {
    // Not URL-shaped — just truncate with an ellipsis below.
  }

  if (host) {
    const joined = tail ? `${host}/${tail}` : host;
    if (joined.length <= maxLength) return joined;
    // Keep the host intact and trim only the path tail so the source domain
    // always stays legible.
    const shown = tail.slice(0, Math.max(0, maxLength - host.length - 1));
    return shown ? `${host}/${shown}…` : `${host}…`;
  }

  return url.length <= maxLength ? url : `${url.slice(0, maxLength)}…`;
}
