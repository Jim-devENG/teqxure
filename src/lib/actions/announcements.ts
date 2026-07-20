"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { notifyCohortStudents, notifyUser } from "@/lib/notifications";

const STAFF_ROLES = ["SUPER_ADMIN", "PROGRAM_MANAGER", "INSTRUCTOR"] as const;

export interface ActionState {
  error?: string;
}

const announcementSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  cohortId: z.string().optional(),
});

export async function createAnnouncementAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireRole(...STAFF_ROLES);
  const cohortId = formData.get("cohortId");
  const parsed = announcementSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    cohortId: cohortId ? String(cohortId) : undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const announcement = await db.announcement.create({
    data: { title: parsed.data.title, body: parsed.data.body, cohortId: parsed.data.cohortId, createdById: user.id },
  });
  await logActivity({ userId: user.id, action: "created", entityType: "Announcement", entityId: announcement.id });

  if (parsed.data.cohortId) {
    await notifyCohortStudents(parsed.data.cohortId, {
      type: "ANNOUNCEMENT_POSTED",
      title: announcement.title,
      body: announcement.body,
      actionLabel: "View announcement",
      actionUrl: "/dashboard",
    });
  } else {
    const students = await db.user.findMany({ where: { role: "STUDENT" }, select: { id: true } });
    await Promise.all(
      students.map((s) =>
        notifyUser({
          userId: s.id,
          type: "ANNOUNCEMENT_POSTED",
          title: announcement.title,
          body: announcement.body,
          actionLabel: "View announcement",
          actionUrl: "/dashboard",
        }),
      ),
    );
  }

  revalidatePath("/platform/manage/announcements");
  return {};
}
