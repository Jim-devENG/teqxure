"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { notifyCohortStudents } from "@/lib/notifications";

const STAFF_ROLES = ["SUPER_ADMIN", "PROGRAM_MANAGER", "INSTRUCTOR"] as const;

export interface ActionState {
  error?: string;
}

const RESOURCE_TYPES = ["NOTES", "SLIDES", "PDF", "REPO", "PROMPT_PACK", "ARCHITECTURE_DIAGRAM", "DB_SCHEMA", "API_DOC"] as const;

const resourceSchema = z.object({
  title: z.string().min(1),
  type: z.enum(RESOURCE_TYPES),
  url: z.string().url(),
  weekId: z.string().optional(),
});

export async function createResourceAction(bootcampId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireRole(...STAFF_ROLES);
  const weekId = formData.get("weekId");
  const parsed = resourceSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    url: formData.get("url"),
    weekId: weekId ? String(weekId) : undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const count = await db.resource.count({ where: { bootcampId } });
  const resource = await db.resource.create({
    data: {
      title: parsed.data.title,
      type: parsed.data.type,
      url: parsed.data.url,
      bootcampId,
      weekId: parsed.data.weekId || null,
      order: count,
    },
  });
  await logActivity({ userId: user.id, action: "created", entityType: "Resource", entityId: resource.id });

  const cohorts = await db.cohort.findMany({ where: { bootcampId }, select: { id: true } });
  await Promise.all(
    cohorts.map((c) =>
      notifyCohortStudents(c.id, {
        type: "RESOURCE_UPLOADED",
        title: `New resource: ${resource.title}`,
        body: "A new resource was just added to your bootcamp.",
        actionLabel: "View resources",
        actionUrl: "/resources",
      }),
    ),
  );

  revalidatePath("/platform/manage/bootcamps");
  revalidatePath("/platform/resources");
  return {};
}

export async function deleteResourceAction(resourceId: string): Promise<void> {
  const user = await requireRole(...STAFF_ROLES);
  await db.resource.delete({ where: { id: resourceId } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "Resource", entityId: resourceId });
  revalidatePath("/platform/manage/bootcamps");
  revalidatePath("/platform/resources");
}

export async function toggleResourceVisibilityAction(resourceId: string, visible: boolean): Promise<void> {
  await requireRole(...STAFF_ROLES);
  await db.resource.update({ where: { id: resourceId }, data: { visible } });
  revalidatePath("/platform/manage/bootcamps");
  revalidatePath("/platform/resources");
}

export { RESOURCE_TYPES };
