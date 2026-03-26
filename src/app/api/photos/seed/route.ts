import { NextRequest, NextResponse } from "next/server";
import { getPhotoCatalog, putPhotoCatalog } from "@/lib/r2-server";
import { SEED_PHOTOS } from "@/data/photos";

export const dynamic = "force-dynamic";

/** One-time seed: writes the static photo array to R2 catalog.json */
export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await getPhotoCatalog();
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Catalog already has entries. Delete it first to re-seed.", count: existing.length },
      { status: 409 }
    );
  }

  await putPhotoCatalog(SEED_PHOTOS);
  return NextResponse.json({ ok: true, seeded: SEED_PHOTOS.length });
}
