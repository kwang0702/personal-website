import { NextRequest, NextResponse } from "next/server";
import { getMovieCatalog, putMovieCatalog } from "@/lib/r2-server";
import type { Movie } from "@/data/movies";

export const dynamic = "force-dynamic";

export async function GET() {
  const movies = await getMovieCatalog();
  return NextResponse.json({ movies });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const movie: Movie = await req.json();

  // Validate required fields
  if (!movie.title || !movie.posterUrl || !movie.year) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const catalog = await getMovieCatalog();

  // Check for duplicates by title + year
  const exists = catalog.some(
    (m) => m.title === movie.title && m.year === movie.year
  );
  if (exists) {
    return NextResponse.json({ error: "Movie already exists" }, { status: 409 });
  }

  catalog.push(movie);
  await putMovieCatalog(catalog);
  return NextResponse.json({ ok: true, count: catalog.length });
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, year } = await req.json();
  const catalog = await getMovieCatalog();
  const filtered = catalog.filter(
    (m) => !(m.title === title && m.year === year)
  );

  if (filtered.length === catalog.length) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }

  await putMovieCatalog(filtered);
  return NextResponse.json({ ok: true, count: filtered.length });
}
