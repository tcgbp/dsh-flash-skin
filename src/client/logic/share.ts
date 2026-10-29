import type { PortraitGroupManifestSource } from "./manifest";

// ── C1 share text codec ──────────────────────────────────────────────────────
// A share is a single self-contained text line:
//   dsh-flash-skin-share#1#<base64url( manifestHeaderLine "\n" + zipBytes )>
// The manifest header (JSON) carries the group identity + dark level and the
// zipped byte length, so the receiver re-imports identity => frame pipeline
// without any server round-trip. Pure, dependency-free, node + browser safe.
export const SHARE_PREFIX = "dsh-flash-skin-share";
export const SHARE_VERSION = 1;
/** Decoded-blob budget (manifest header + zip). */
export const SHARE_MAX_BYTES = 8 * 1024 * 1024;

const B64_DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function b64ValueOf(char: string): number {
  // Fast indexOf lookup is plenty for the caps we enforce; tables are unnecessary.
  const index = B64_DIGITS.indexOf(char);
  return index === -1 ? NaN : index;
}

/** Standard base64 over arbitrary bytes (no btoa/atob dependency). */
export function bytesToBase64Text(bytes: Uint8Array): string {
  let out = "";
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const a = bytes[i];
    const b = i + 1 < len ? bytes[i + 1] : 0;
    const c = i + 2 < len ? bytes[i + 2] : 0;
    out += B64_DIGITS[a >> 2];
    out += B64_DIGITS[((a & 3) << 4) | (b >> 4)];
    out += i + 1 < len ? B64_DIGITS[((b & 15) << 2) | (c >> 6)] : "=";
    out += i + 2 < len ? B64_DIGITS[c & 63] : "=";
  }
  return out;
}

/** Decode standard base64; null on malformed input or impossible lengths. */
export function base64TextToBytes(text: string): Uint8Array | null {
  if (typeof text !== "string") return null;
  let t = text.replace(/\s+/g, "").replace(/=+$/, "");
  if (t.length === 0) return new Uint8Array(0);
  if (t.length % 4 === 1) return null;
  if (!/^[A-Za-z0-9+/]+$/.test(t)) return null;
  const outLen = Math.floor((t.length * 3) / 4);
  const out = new Uint8Array(outLen);
  let o = 0;
  for (let i = 0; i < t.length; i += 4) {
    const a = b64ValueOf(t[i]);
    const b = i + 1 < t.length ? b64ValueOf(t[i + 1]) : 0;
    const c = i + 2 < t.length ? b64ValueOf(t[i + 2]) : 0;
    const d = i + 3 < t.length ? b64ValueOf(t[i + 3]) : 0;
    if (![a, b, c, d].every((v) => Number.isFinite(v))) return null;
    const quad = (a << 18) | (b << 12) | (c << 6) | d;
    if (o < outLen) out[o++] = (quad >> 16) & 0xff;
    if (o < outLen) out[o++] = (quad >> 8) & 0xff;
    if (o < outLen) out[o++] = quad & 0xff;
  }
  return out;
}

/** URL-safe base64 (RFC 4648 §5) for the share payload. */
export function uint8ToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64Text(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Decode URL-safe base64; null on malformed input. */
export function base64UrlToBytes(b64url: string): Uint8Array | null {
  if (typeof b64url !== "string") return null;
  return base64TextToBytes(b64url.replace(/-/g, "+").replace(/_/g, "/"));
}

const textEncoder = () => new TextEncoder();
const textDecoder = () => new TextDecoder();

/**
 * Pack a portrait group archive into the C1 share text. `zip` is the fully
 * built archive bytes (client packs it with fflate). Returns "" when the blob
 * exceeds SHARE_MAX_BYTES so the caller can surface a friendly notice.
 */
export function buildShareText(zip: Uint8Array, manifest: PortraitGroupManifestSource): string {
  const header = textEncoder().encode(JSON.stringify({ v: SHARE_VERSION, m: manifest, z: zip.length }) + "\n");
  const blob = new Uint8Array(header.length + zip.length);
  blob.set(header, 0);
  blob.set(zip, header.length);
  if (blob.length > SHARE_MAX_BYTES) return "";
  return `${SHARE_PREFIX}#${SHARE_VERSION}#${uint8ToBase64Url(blob)}`;
}

/** Community-directory entry mirroring the server route's shape. */
export interface CommunityEntry {
  entryId: string;
  setId: string;
  url: string;
  /** MD5 fingerprint of the archive the url pointed at at share time ("" for legacy entries). */
  md5?: string;
}

/** Inverse of buildShareText; null when the text is not a valid share. */
export function parseShareText(text: string): { zip: Uint8Array; manifest: PortraitGroupManifestSource } | null {
  if (typeof text !== "string") return null;
  const marker = `${SHARE_PREFIX}#${SHARE_VERSION}#`;
  if (!text.startsWith(marker)) return null;
  const b64 = text.slice(marker.length);
  if (b64.length === 0 || b64.length > Math.ceil((SHARE_MAX_BYTES * 4) / 3) + 4) return null;
  const bytes = base64UrlToBytes(b64);
  if (bytes === null || bytes.length > SHARE_MAX_BYTES) return null;
  const nl = bytes.indexOf(0x0a);
  if (nl <= 0) return null;
  let header: unknown = null;
  try {
    header = JSON.parse(textDecoder().decode(bytes.subarray(0, nl)));
  } catch {
    header = null;
  }
  if (typeof header !== "object" || header === null) return null;
  const h = header as { v?: unknown; m?: unknown; z?: unknown };
  if (h.v !== SHARE_VERSION) return null;
  const manifest = h.m as PortraitGroupManifestSource | undefined;
  if (typeof manifest !== "object" || manifest === null || typeof manifest.id !== "string" || manifest.id.length === 0) {
    return null;
  }
  const zlen = Number(h.z);
  const zipStart = nl + 1;
  if (!Number.isInteger(zlen) || zlen < 0 || zipStart + zlen > bytes.length) return null;
  return { zip: bytes.slice(zipStart, zipStart + zlen), manifest };
}

/**
 * Display count for the like button: the community (server) total, but never
 * below the local ledger — a liked-by-us group shows ≥1 even while offline.
 */
export function mergeLikeCount(liked: boolean, communityCount?: number): number {
  const community =
    typeof communityCount === "number" && Number.isFinite(communityCount)
      ? Math.max(0, Math.floor(communityCount))
      : 0;
  return Math.max(community, liked ? 1 : 0);
}
