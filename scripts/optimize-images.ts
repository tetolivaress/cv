// Pre-renders WebP variants of every image under public/{images,projects,certificates}
// for each width next/image can request. Output goes to public/_img (git-ignored).
// Unchanged sources are skipped, so this is cheap to run before every dev/build.
import { readdir, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ALL_IMAGE_WIDTHS, OPTIMIZED_DIRS, OPTIMIZED_PREFIX } from "../src/lib/image-sizes";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");
const outRoot = path.join(publicDir, OPTIMIZED_PREFIX.replace(/^\//, ""));
const RASTER = /\.(png|jpe?g|webp|avif)$/i;

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (RASTER.test(entry.name)) yield full;
  }
}

const mtime = async (file: string) => (await stat(file).catch(() => null))?.mtimeMs ?? 0;

let written = 0;
let skipped = 0;
for (const dir of OPTIMIZED_DIRS) {
  for await (const file of walk(path.join(publicDir, dir))) {
    const rel = path.relative(publicDir, file).replace(RASTER, "");
    const srcTime = await mtime(file);
    for (const width of ALL_IMAGE_WIDTHS) {
      const out = path.join(outRoot, `${rel}-${width}.webp`);
      if ((await mtime(out)) >= srcTime) {
        skipped++;
        continue;
      }
      await mkdir(path.dirname(out), { recursive: true });
      await sharp(file)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toFile(out);
      written++;
    }
  }
}
console.log(`[images] ${written} variants written, ${skipped} up to date → public${OPTIMIZED_PREFIX}`);
