import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getFitsCatalog, putFitsCatalog, uploadToR2, deleteFromR2 } from "@/lib/r2-server";
import type { FitPhoto } from "@/lib/r2-server";
import { R2_BASE } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function GET() {
  const fits = await getFitsCatalog();
  return NextResponse.json({ fits });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const catalog = await getFitsCatalog();

  // High-water mark numbering
  const maxNum = catalog.reduce((max, f) => {
    const match = f.id.match(/^fit-(\d+)/);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
  let nextNum = maxNum + 1;

  const added: FitPhoto[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const buffer = Buffer.from(await file.arrayBuffer());

    // Auto-orient from EXIF, then detect dimensions
    const oriented = sharp(buffer).rotate();
    const metadata = await oriented.toBuffer().then((buf) => sharp(buf).metadata());
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;
    const orientation: "horizontal" | "vertical" = width >= height ? "horizontal" : "vertical";

    const ts = Date.now().toString(36);
    const paddedNum = String(nextNum).padStart(2, "0");
    const filename = `fit-${paddedNum}-${ts}.jpg`;
    nextNum++;

    // Thumbnail
    const thumbWidth = orientation === "horizontal" ? 1200 : 800;
    const thumbBuffer = await sharp(buffer)
      .rotate()
      .resize({ width: thumbWidth })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();

    // Full-res with EXIF baked in
    const fullBuffer = await sharp(buffer)
      .rotate()
      .jpeg({ quality: 92 })
      .toBuffer();

    const fullKey = `fits/${filename}`;
    const thumbKey = `fits/thumbs/${filename}`;

    await uploadToR2(fullKey, fullBuffer, "image/jpeg");
    await uploadToR2(thumbKey, thumbBuffer, "image/jpeg");

    const fit: FitPhoto = {
      id: `fit-${paddedNum}-${ts}`,
      src: `${R2_BASE}/${fullKey}`,
      thumb: `${R2_BASE}/${thumbKey}`,
      alt: "",
      orientation,
      uploadedAt: new Date().toISOString(),
    };

    catalog.push(fit);
    added.push(fit);
  }

  await putFitsCatalog(catalog);
  return NextResponse.json({ ok: true, added, count: catalog.length });
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const catalog = await getFitsCatalog();
  const fit = catalog.find((f) => f.id === id);

  if (!fit) {
    return NextResponse.json({ error: "Fit not found" }, { status: 404 });
  }

  const fullKey = fit.src.replace(`${R2_BASE}/`, "");
  const thumbKey = fit.thumb.replace(`${R2_BASE}/`, "");
  await deleteFromR2(fullKey).catch(() => {});
  await deleteFromR2(thumbKey).catch(() => {});

  const filtered = catalog.filter((f) => f.id !== id);
  await putFitsCatalog(filtered);
  return NextResponse.json({ ok: true, count: filtered.length });
}
