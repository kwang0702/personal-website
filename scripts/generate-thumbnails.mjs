import { execSync } from "child_process";
import { mkdirSync, existsSync, unlinkSync } from "fs";
import sharp from "sharp";

const BUCKET = "personal-website-media";
const COLLECTION = "photography/japan";
const THUMB_WIDTH_H = 1200; // horizontal photos
const THUMB_WIDTH_V = 800;  // vertical photos
const THUMB_QUALITY = 80;
const TMP = "tmp-thumbnails";

if (!existsSync(TMP)) mkdirSync(TMP, { recursive: true });

for (let i = 1; i <= 32; i++) {
  const name = `japan-${String(i).padStart(2, "0")}.jpg`;
  const tmpOriginal = `${TMP}/${name}`;
  const tmpThumb = `${TMP}/thumb-${name}`;

  // Download original from R2
  console.log(`Downloading ${name}...`);
  execSync(
    `npx wrangler r2 object get "${BUCKET}/${COLLECTION}/${name}" --file="${tmpOriginal}" --remote`,
    { stdio: "pipe" }
  );

  // Get dimensions and resize
  const meta = await sharp(tmpOriginal).metadata();
  const isVertical = meta.height > meta.width;
  const targetWidth = isVertical ? THUMB_WIDTH_V : THUMB_WIDTH_H;

  console.log(`  ${meta.width}x${meta.height} (${isVertical ? "vertical" : "horizontal"}) → ${targetWidth}px wide`);

  await sharp(tmpOriginal)
    .resize(targetWidth, null, { withoutEnlargement: true })
    .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
    .toFile(tmpThumb);

  // Upload thumbnail to R2
  console.log(`  Uploading thumbnail...`);
  execSync(
    `npx wrangler r2 object put "${BUCKET}/${COLLECTION}/thumbs/${name}" --file="${tmpThumb}" --remote`,
    { stdio: "pipe" }
  );

  // Clean up temp files
  unlinkSync(tmpOriginal);
  unlinkSync(tmpThumb);

  console.log(`  Done.`);
}

// Clean up temp dir
execSync(`rm -rf ${TMP}`);
console.log("\nAll thumbnails generated and uploaded.");
