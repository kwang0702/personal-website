import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type TMDBMovie = {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
};

type TMDBCredits = {
  cast: { name: string; order: number }[];
  crew: { name: string; job: string }[];
};

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = req.nextUrl.searchParams.get("q");
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const tmdbToken = process.env.TMDB_READ_TOKEN;

  // Search TMDB — supports English and Chinese titles natively
  const searchRes = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
    {
      headers: { Authorization: `Bearer ${tmdbToken}` },
    }
  );

  if (!searchRes.ok) {
    return NextResponse.json({ error: "TMDB search failed" }, { status: 502 });
  }

  const searchData = await searchRes.json();
  const results: TMDBMovie[] = searchData.results?.slice(0, 8) ?? [];

  // Fetch credits (director + cast) for each result in parallel
  const movies = await Promise.all(
    results
      .filter((m) => m.poster_path) // skip movies without posters
      .map(async (m) => {
        let director = "Unknown";
        let cast: string[] = [];

        try {
          const creditsRes = await fetch(
            `https://api.themoviedb.org/3/movie/${m.id}/credits?language=en-US`,
            {
              headers: { Authorization: `Bearer ${tmdbToken}` },
            }
          );
          if (creditsRes.ok) {
            const credits: TMDBCredits = await creditsRes.json();
            director =
              credits.crew.find((c) => c.job === "Director")?.name ?? "Unknown";
            cast = credits.cast
              .sort((a, b) => a.order - b.order)
              .slice(0, 4)
              .map((c) => c.name);
          }
        } catch {
          // Gracefully degrade — we still have the basic info
        }

        return {
          title: m.title,
          originalTitle: m.original_title,
          year: m.release_date ? parseInt(m.release_date.substring(0, 4)) : 0,
          director,
          cast,
          posterUrl: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
        };
      })
  );

  return NextResponse.json({ movies });
}
