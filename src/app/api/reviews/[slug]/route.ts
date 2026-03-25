import { NextRequest, NextResponse } from "next/server";
import { getReview, putReview } from "@/lib/r2-server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const review = await getReview(slug);
  return NextResponse.json({ review });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Admin auth check
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await req.json();
  await putReview(slug, content);
  return NextResponse.json({ ok: true });
}
