import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import type { Movie } from "@/data/movies";
import type { Album } from "@/data/albums";

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = "personal-website-media";

// --- Reviews ---

export async function getReview(slug: string): Promise<string | null> {
  try {
    const res = await R2.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: `reviews/${slug}.md` })
    );
    return (await res.Body?.transformToString()) ?? null;
  } catch {
    return null;
  }
}

export async function putReview(slug: string, content: string): Promise<void> {
  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: `reviews/${slug}.md`,
      Body: content,
      ContentType: "text/markdown",
    })
  );
}

// --- Movie Catalog ---

export async function getMovieCatalog(): Promise<Movie[]> {
  try {
    const res = await R2.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: "movies/catalog.json" })
    );
    const text = await res.Body?.transformToString();
    return text ? JSON.parse(text) : [];
  } catch {
    return [];
  }
}

export async function putMovieCatalog(movies: Movie[]): Promise<void> {
  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: "movies/catalog.json",
      Body: JSON.stringify(movies, null, 2),
      ContentType: "application/json",
    })
  );
}

// --- Music Catalog ---

export async function getMusicCatalog(): Promise<Album[]> {
  try {
    const res = await R2.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: "music/catalog.json" })
    );
    const text = await res.Body?.transformToString();
    return text ? JSON.parse(text) : [];
  } catch {
    return [];
  }
}

export async function putMusicCatalog(albums: Album[]): Promise<void> {
  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: "music/catalog.json",
      Body: JSON.stringify(albums, null, 2),
      ContentType: "application/json",
    })
  );
}
