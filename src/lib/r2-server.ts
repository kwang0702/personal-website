import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { Movie } from "@/data/movies";
import type { Album } from "@/data/albums";
import type { Photo } from "@/data/photos";

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

// --- Photo Catalog ---

export async function getPhotoCatalog(): Promise<Photo[]> {
  try {
    const res = await R2.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: "photography/catalog.json" })
    );
    const text = await res.Body?.transformToString();
    return text ? JSON.parse(text) : [];
  } catch {
    return [];
  }
}

export async function putPhotoCatalog(photos: Photo[]): Promise<void> {
  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: "photography/catalog.json",
      Body: JSON.stringify(photos, null, 2),
      ContentType: "application/json",
    })
  );
}

// --- Fits Catalog ---

export type FitPhoto = {
  id: string;
  src: string;
  thumb: string;
  alt: string;
  orientation: "horizontal" | "vertical";
  uploadedAt: string;
};

export async function getFitsCatalog(): Promise<FitPhoto[]> {
  try {
    const res = await R2.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: "fits/catalog.json" })
    );
    const text = await res.Body?.transformToString();
    return text ? JSON.parse(text) : [];
  } catch {
    return [];
  }
}

export async function putFitsCatalog(fits: FitPhoto[]): Promise<void> {
  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: "fits/catalog.json",
      Body: JSON.stringify(fits, null, 2),
      ContentType: "application/json",
    })
  );
}

// --- Binary Download / Upload / Delete ---

export async function downloadFromR2(key: string): Promise<Buffer | null> {
  try {
    const res = await R2.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: key })
    );
    const bytes = await res.Body?.transformToByteArray();
    return bytes ? Buffer.from(bytes) : null;
  } catch {
    return null;
  }
}

export async function uploadToR2(key: string, body: Buffer, contentType: string): Promise<void> {
  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

export async function deleteFromR2(key: string): Promise<void> {
  await R2.send(
    new DeleteObjectCommand({ Bucket: BUCKET, Key: key })
  );
}
