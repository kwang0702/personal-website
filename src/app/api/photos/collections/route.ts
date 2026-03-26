import { NextResponse } from "next/server";
import { getPhotoCatalog } from "@/lib/r2-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const photos = await getPhotoCatalog();
  const collections = [...new Set(photos.map((p) => p.collection))].sort();
  return NextResponse.json({ collections });
}
