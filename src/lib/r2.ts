import "server-only";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET = process.env.R2_BUCKET_NAME ?? "teqxure";

export interface UploadResult {
  key: string;
  url: string;
}

function publicUrlFor(key: string): string {
  const base = process.env.R2_PUBLIC_URL;
  if (base) return `${base.replace(/\/$/, "")}/${key}`;
  // Cloudflare R2's S3-API endpoint (*.r2.cloudflarestorage.com) always
  // requires SigV4 authentication — it never serves objects to anonymous
  // requests, regardless of any "public access" bucket setting. Rather than
  // depend on a Cloudflare dashboard step (a public dev URL or custom
  // domain) that may never get configured, default to our own authenticated
  // proxy route, which works out of the box in every environment.
  return `/api/media/${key}`;
}

export async function uploadToR2(
  file: Buffer,
  originalName: string,
  mimeType: string,
  folder = "uploads",
): Promise<UploadResult> {
  const ext = originalName.includes(".") ? originalName.split(".").pop() : undefined;
  const key = `${folder}/${Date.now()}-${randomBytes(6).toString("hex")}${ext ? `.${ext}` : ""}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: mimeType,
    }),
  );

  return { key, url: publicUrlFor(key) };
}

export interface StoredObject {
  body: Uint8Array;
  contentType: string;
}

export async function getFromR2(key: string): Promise<StoredObject | null> {
  try {
    const result = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    const body = await result.Body?.transformToByteArray();
    if (!body) return null;
    return { body, contentType: result.ContentType ?? "application/octet-stream" };
  } catch {
    return null;
  }
}

export async function deleteFromR2(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
