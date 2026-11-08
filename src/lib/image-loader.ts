import { OPTIMIZED_PREFIX } from "./image-sizes";

const RASTER = /\.(png|jpe?g|webp|avif)$/i;

/**
 * next/image loader for the static export. Local raster images resolve to the
 * pre-rendered WebP variant for the requested width (see
 * scripts/optimize-images.mjs). Remote URLs and SVGs are returned untouched.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/") || !RASTER.test(src)) return src;
  return `${OPTIMIZED_PREFIX}${src.replace(RASTER, "")}-${width}.webp`;
}
