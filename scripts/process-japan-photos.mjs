import { readdirSync, renameSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const dir = "public/photos/japan";
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".jpg"))
  .sort();

console.log(`Found ${files.length} JPG files\n`);

const results = [];

for (let i = 0; i < files.length; i++) {
  const oldPath = join(dir, files[i]);
  const num = String(i + 1).padStart(2, "0");
  const newName = `japan-${num}.jpg`;
  const newPath = join(dir, newName);

  const metadata = await sharp(oldPath).metadata();
  const w = metadata.width;
  const h = metadata.height;
  const orientation = w >= h ? "horizontal" : "vertical";

  renameSync(oldPath, newPath);

  results.push({ newName, w, h, orientation });
  console.log(`${files[i]} -> ${newName}  (${w}x${h}, ${orientation})`);
}

// Output the data array for photos.ts
console.log("\n\n// ── Paste into photos.ts ──────────────────────────────────\n");
for (const { newName, orientation } of results) {
  console.log(`  {
    src: "/photos/japan/${newName}",
    alt: "",
    orientation: "${orientation}",
    collection: "japan",
  },`);
}
