import "server-only";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
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
  // Falls back to the private R2 endpoint URL until public access / a custom
  // domain is configured on the bucket in the Cloudflare dashboard.
  return `${process.env.R2_ENDPOINT}/${BUCKET}/${key}`;
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

export async function deleteFromR2(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
