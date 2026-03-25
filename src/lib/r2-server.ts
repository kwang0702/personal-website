import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = "personal-website-media";

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
