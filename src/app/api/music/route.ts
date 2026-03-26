import { NextRequest, NextResponse } from "next/server";
import { getMusicCatalog, putMusicCatalog } from "@/lib/r2-server";
import type { Album } from "@/data/albums";

export const dynamic = "force-dynamic";

export async function GET() {
  const albums = await getMusicCatalog();
  return NextResponse.json({ albums });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const album: Album = await req.json();

  if (!album.title || !album.artist || !album.spotifyId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const catalog = await getMusicCatalog();

  const exists = catalog.some((a) => a.spotifyId === album.spotifyId);
  if (exists) {
    return NextResponse.json({ error: "Album already exists" }, { status: 409 });
  }

  catalog.push(album);
  await putMusicCatalog(catalog);
  return NextResponse.json({ ok: true, count: catalog.length });
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { spotifyId } = await req.json();
  const catalog = await getMusicCatalog();
  const filtered = catalog.filter((a) => a.spotifyId !== spotifyId);

  if (filtered.length === catalog.length) {
    return NextResponse.json({ error: "Album not found" }, { status: 404 });
  }

  await putMusicCatalog(filtered);
  return NextResponse.json({ ok: true, count: filtered.length });
}
