/**
 * Regenerates the site favicon from one of Benny's photos.
 *
 *   npm run icons
 *   npm run icons -- public/benny/bow-tie.jpg 200 400 900
 *
 * Arguments, all optional:
 *   1. source photo            (default: public/benny/first-snow.jpg)
 *   2-4. left, top, size       a square crop box in the source photo's own
 *                              pixels — use these to re-centre on the face
 *
 * Writes `app/icon.png` (512×512, browser tabs) and `app/apple-icon.png`
 * (180×180, phone home screens). Next.js picks both up automatically from
 * those filenames; there is nothing to import or register.
 */
import sharp from "sharp";

const [source = "public/benny/first-snow.jpg", left, top, size] = process.argv.slice(2);

const crop = {
  left: Number(left ?? 95),
  top: Number(top ?? 300),
  width: Number(size ?? 1260),
  height: Number(size ?? 1260),
};

const { width: srcW, height: srcH } = await sharp(source).metadata();

if (crop.left + crop.width > srcW || crop.top + crop.height > srcH) {
  console.error(
    `Crop box ${crop.left},${crop.top} ${crop.width}×${crop.height} falls outside ` +
      `${source} (${srcW}×${srcH}). Pass smaller values.`
  );
  process.exit(1);
}

for (const [file, px] of [
  ["app/icon.png", 512],
  ["app/apple-icon.png", 180],
]) {
  await sharp(source).extract(crop).resize(px, px).png().toFile(file);
  console.log(`wrote ${file} (${px}×${px}) from ${source}`);
}
