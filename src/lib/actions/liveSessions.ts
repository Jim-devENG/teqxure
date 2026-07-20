"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { notifyCohortStudents } from "@/lib/notifications";

const STAFF_ROLES = ["SUPER_ADMIN", "PROGRAM_MANAGER", "INSTRUCTOR"] as const;

export interface ActionState {
  error?: string;
}

const sessionSchema = z.object({
  weekId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  startsAt: z.coerce.date(),
  provider: z.enum(["GOOGLE_MEET", "ZOOM", "TEAMS", "YOUTUBE_UNLISTED"]),
  meetingUrl: z.string().url(),
});

export async function createLiveSessionAction(cohortId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireRole(...STAFF_ROLES);
  const parsed = sessionSchema.safeParse({
    weekId: formData.get("weekId"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    startsAt: formData.get("startsAt"),
    provider: formData.get("provider"),
    meetingUrl: formData.get("meetingUrl"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const session = await db.liveSession.create({ data: { ...parsed.data, cohortId } });
  await logActivity({ userId: user.id, action: "created", entityType: "LiveSession", entityId: session.id });

  await notifyCohortStudents(cohortId, {
    type: "SESSION_SCHEDULED",
    title: `New live session: ${session.title}`,
    body: `Scheduled for ${session.startsAt.toLocaleString()}.`,
    actionLabel: "View in Bootcamp",
    actionUrl: `/bootcamp/${cohortId}/${session.weekId}`,
  });

  revalidatePath(`/platform/manage/cohorts/${cohortId}`);
  redirect(`/manage/cohorts/${cohortId}`);
}

export async function updateLiveSessionAction(sessionId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireRole(...STAFF_ROLES);
  const parsed = sessionSchema.safeParse({
    weekId: formData.get("weekId"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    startsAt: formData.get("startsAt"),
    provider: formData.get("provider"),
    meetingUrl: formData.get("meetingUrl"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const recordingUrl = formData.get("recordingUrl");
  const session = await db.liveSession.update({
    where: { id: sessionId },
    data: { ...parsed.data, recordingUrl: recordingUrl ? String(recordingUrl) : null },
  });
  await logActivity({ userId: user.id, action: "updated", entityType: "LiveSession", entityId: sessionId });
  revalidatePath(`/platform/manage/cohorts/${session.cohortId}`);
  return {};
}

export async function deleteLiveSessionAction(sessionId: string): Promise<void> {
  const user = await requireRole(...STAFF_ROLES);
  const session = await db.liveSession.delete({ where: { id: sessionId } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "LiveSession", entityId: sessionId });
  revalidatePath(`/platform/manage/cohorts/${session.cohortId}`);
}
