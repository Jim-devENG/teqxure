import "server-only";
import { db } from "@/lib/db";

interface LogActivityInput {
  userId: string;
  action: "created" | "updated" | "deleted" | "reordered" | "published" | "unpublished";
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity({ userId, action, entityType, entityId, metadata }: LogActivityInput) {
  await db.activityLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      metadata: metadata as never,
    },
  });
}
