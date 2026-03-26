import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import {
  getPhotoCatalog,
  putPhotoCatalog,
  downloadFromR2,
  uploadToR2,
} from "@/lib/r2-server";
import { R2_BASE } from "@/lib/r2";

export const dynamic = "force-dynamic";

/**
 * Re-processes photos: downloads the original from R2, auto-orients,
 * regenerates the thumbnail, re-uploads both, and updates catalog metadata.
 *
 * Body: { ids?: string[] }
 *   - If ids provided, only reprocess those photos
 *   - If omitted, reprocess ALL photos in the catalog
 */
export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const targetIds: string[] | undefined = body.ids;

  const catalog = await getPhotoCatalog();
  const toProcess = targetIds
    ? catalog.filter((p) => targetIds.includes(p.id))
    : catalog;

  if (toProcess.length === 0) {
    return NextResponse.json({ error: "No matching photos" }, { status: 404 });
  }

  const results: { id: string; orientation: string; ok: boolean }[] = [];

  for (const photo of toProcess) {
    const fullKey = photo.src.replace(`${R2_BASE}/`, "");
    const thumbKey = photo.thumb.replace(`${R2_BASE}/`, "");

    const original = await downloadFromR2(fullKey);
    if (!original) {
      results.push({ id: photo.id, orientation: photo.orientation, ok: false });
      continue;
    }

    // Auto-orient and detect true dimensions
    const orientedBuffer = await sharp(original).rotate().toBuffer();
    const metadata = await sharp(orientedBuffer).metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;
    const orientation: "horizontal" | "vertical" =
      width >= height ? "horizontal" : "vertical";

    // Regenerate full-res with EXIF rotation baked in
    const fullBuffer = await sharp(original)
      .rotate()
      .jpeg({ quality: 92 })
      .toBuffer();

    // Regenerate thumbnail
    const thumbWidth = orientation === "horizontal" ? 1200 : 800;
    const thumbBuffer = await sharp(original)
      .rotate()
      .resize({ width: thumbWidth })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();

    await uploadToR2(fullKey, fullBuffer, "image/jpeg");
    await uploadToR2(thumbKey, thumbBuffer, "image/jpeg");

    // Update catalog entry
    photo.orientation = orientation;

    results.push({ id: photo.id, orientation, ok: true });
  }

  await putPhotoCatalog(catalog);

  return NextResponse.json({
    ok: true,
    processed: results.length,
    results,
  });
}
