"use server";

import { requireAdmin } from "@/lib/auth";
import { uploadToR2 } from "@/lib/r2";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity";

export interface UploadMediaResult {
  url: string;
  error?: string;
}

export async function uploadMediaAction(formData: FormData): Promise<UploadMediaResult> {
  const user = await requireAdmin();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { url: "", error: "No file selected." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { url: "", error: "File must be under 10MB." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { key, url } = await uploadToR2(buffer, file.name, file.type, "media");

  await db.media.create({
    data: {
      url,
      key,
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
    },
  });

  await logActivity({
    userId: user.id,
    action: "created",
    entityType: "Media",
    entityId: key,
    metadata: { fileName: file.name },
  });

  return { url };
}
