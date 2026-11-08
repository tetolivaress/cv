/**
 * Widths that next/image may request. scripts/optimize-images.mjs renders a
 * WebP for every one of them, so the custom loader can never point at a file
 * that does not exist. Keep both lists in sync by importing from here.
 */
export const DEVICE_SIZES = [640, 828, 1080, 1280, 1920, 2560] as const;
export const IMAGE_SIZES = [96, 128, 256, 384] as const;
export const ALL_IMAGE_WIDTHS = [...IMAGE_SIZES, ...DEVICE_SIZES];

/** Folders under /public whose images get optimized variants. */
export const OPTIMIZED_DIRS = ["images", "projects", "certificates"] as const;
export const OPTIMIZED_PREFIX = "/_img";
