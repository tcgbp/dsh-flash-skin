export const MAX_LEVEL = 6;

// Mirror of the client's per-import image cap (MAX_IMAGES_PER_IMPORT)
// so a manifest-URL list is trimmed to the same size as embedded images.
export const PORTRAIT_IMPORT_MAX_IMAGES = 64;

// Minimum frames a *populated* portrait group needs. External imports (zip /
// URL / share text) are rejected below this so the count-driven level staging
// stays meaningful. The brand-new empty placeholder group is exempt: it is
// grown locally, frame by frame, rather than imported.
export const PORTRAIT_IMPORT_MIN_IMAGES = 3;
