import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Spotify client credentials token (cached in memory)
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getSpotifyToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error("Failed to get Spotify token");
  }

  const data = await res.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000, // refresh 1 min early
  };
  return cachedToken.value;
}

type SpotifyAlbum = {
  id: string;
  name: string;
  release_date: string;
  images: { url: string; height: number }[];
  artists: { name: string }[];
};

type SpotifyTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    release_date: string;
    images: { url: string; height: number }[];
  };
};

export async function GET(req: NextRequest) {
  const adminToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = req.nextUrl.searchParams.get("q");
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const spotifyToken = await getSpotifyToken();

  const searchRes = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album,track&limit=10`,
    {
      headers: { Authorization: `Bearer ${spotifyToken}` },
    }
  );

  if (!searchRes.ok) {
    const errText = await searchRes.text();
    console.error("Spotify search error:", searchRes.status, errText);
    return NextResponse.json({ error: "Spotify search failed", detail: errText }, { status: 502 });
  }

  const searchData = await searchRes.json();

  const albumResults: SpotifyAlbum[] = searchData.albums?.items ?? [];
  const trackResults: SpotifyTrack[] = searchData.tracks?.items ?? [];

  const albums = albumResults
    .filter((a) => a.images.length > 0)
    .map((a) => ({
      title: a.name,
      artist: a.artists.map((ar) => ar.name).join(", "),
      year: a.release_date ? parseInt(a.release_date.substring(0, 4)) : 0,
      coverUrl: a.images.sort((x, y) => y.height - x.height)[0].url,
      spotifyId: a.id,
      type: "album" as const,
    }));

  const tracks = trackResults
    .filter((t) => t.album.images.length > 0)
    .map((t) => ({
      title: t.name,
      artist: t.artists.map((ar) => ar.name).join(", "),
      year: t.album.release_date ? parseInt(t.album.release_date.substring(0, 4)) : 0,
      coverUrl: t.album.images.sort((x, y) => y.height - x.height)[0].url,
      spotifyId: t.id,
      type: "track" as const,
    }));

  return NextResponse.json({ results: [...albums, ...tracks] });
}
