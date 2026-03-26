import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getPhotoCatalog, putPhotoCatalog, uploadToR2, deleteFromR2 } from "@/lib/r2-server";
import { R2_BASE } from "@/lib/r2";
import type { Photo } from "@/data/photos";

export const dynamic = "force-dynamic";

export async function GET() {
  const photos = await getPhotoCatalog();
  return NextResponse.json({ photos });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const collection = (formData.get("collection") as string)?.trim().toLowerCase().replace(/\s+/g, "-");
  if (!collection) {
    return NextResponse.json({ error: "Collection is required" }, { status: 400 });
  }

  const files = formData.getAll("files") as File[];
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  // Optional alt texts (JSON array matching file order)
  const altsRaw = formData.get("alts") as string | null;
  const alts: string[] = altsRaw ? JSON.parse(altsRaw) : [];

  const catalog = await getPhotoCatalog();

  // Find the next number using a high-water mark across ALL entries ever
  // (including deleted ones whose numbers we must not reuse, to avoid CDN cache collisions).
  const existing = catalog.filter((p) => p.collection === collection);
  const maxNum = existing.reduce((max, p) => {
    const match = p.id.match(/-(\d+)$/);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
  let nextNum = maxNum + 1;

  const added: Photo[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const buffer = Buffer.from(await file.arrayBuffer());

    // Auto-orient first (applies EXIF rotation to actual pixels),
    // then read the corrected dimensions to detect orientation.
    // Without this, phone photos stored as landscape + EXIF "rotate 90°"
    // would be misclassified as horizontal.
    const oriented = sharp(buffer).rotate(); // .rotate() without args = auto-orient from EXIF
    const metadata = await oriented.toBuffer().then((buf) => sharp(buf).metadata());
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;
    const orientation: "horizontal" | "vertical" = width >= height ? "horizontal" : "vertical";

    // Generate a unique filename using timestamp suffix to avoid CDN cache collisions
    const ts = Date.now().toString(36);
    const paddedNum = String(nextNum).padStart(2, "0");
    const filename = `${collection}-${paddedNum}-${ts}.jpg`;
    nextNum++;

    // Generate thumbnail (from auto-oriented image)
    const thumbWidth = orientation === "horizontal" ? 1200 : 800;
    const thumbBuffer = await sharp(buffer)
      .rotate()
      .resize({ width: thumbWidth })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();

    // Upload full-res original with EXIF rotation baked in
    const fullBuffer = await sharp(buffer)
      .rotate()
      .jpeg({ quality: 92 })
      .toBuffer();

    const fullKey = `photography/${collection}/${filename}`;
    const thumbKey = `photography/${collection}/thumbs/${filename}`;

    await uploadToR2(fullKey, fullBuffer, "image/jpeg");
    await uploadToR2(thumbKey, thumbBuffer, "image/jpeg");

    const photo: Photo = {
      id: `${collection}-${paddedNum}-${ts}`,
      src: `${R2_BASE}/${fullKey}`,
      thumb: `${R2_BASE}/${thumbKey}`,
      alt: alts[i] || "",
      orientation,
      collection,
      uploadedAt: new Date().toISOString(),
    };

    catalog.push(photo);
    added.push(photo);
  }

  await putPhotoCatalog(catalog);
  return NextResponse.json({ ok: true, added, count: catalog.length });
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const catalog = await getPhotoCatalog();
  const photo = catalog.find((p) => p.id === id);

  if (!photo) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  // Delete both full-res and thumbnail from R2
  const fullKey = photo.src.replace(`${R2_BASE}/`, "");
  const thumbKey = photo.thumb.replace(`${R2_BASE}/`, "");

  const errors: string[] = [];
  await deleteFromR2(fullKey).catch((e) => errors.push(`full: ${e.message}`));
  await deleteFromR2(thumbKey).catch((e) => errors.push(`thumb: ${e.message}`));

  const filtered = catalog.filter((p) => p.id !== id);
  await putPhotoCatalog(filtered);
  return NextResponse.json({ ok: true, count: filtered.length, deletedKeys: [fullKey, thumbKey], errors });
}
