/**
 * logic.ts — thin re-export barrel.
 *
 * The level/palette/share math that previously lived entirely in this file is
 * now split per-domain under `src/client/logic/`. This module re-exports every
 * domain so downstream importers (`index.tsx`) keep the exact same surface
 * without any change on their side.
 */
export * from "./logic/constants";
export * from "./logic/effort";
export * from "./logic/palette";
export * from "./logic/frames";
export * from "./logic/composite";
export * from "./logic/manifest";
export * from "./logic/share";
