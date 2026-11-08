import type { NextConfig } from "next";
import { DEVICE_SIZES, IMAGE_SIZES } from "./src/lib/image-sizes";
import { getSiteUrl } from "./src/lib/site-url";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  env: {
    // Resolved once at build time so server and client agree on the origin.
    NEXT_PUBLIC_SITE_URL: getSiteUrl(),
  },
  images: {
    // Static export has no image server: scripts/optimize-images.ts pre-renders
    // every width below to /_img/*.webp and the custom loader points at them.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [...DEVICE_SIZES],
    imageSizes: [...IMAGE_SIZES],
  },
};

export default nextConfig;
