import "server-only";
import { db } from "@/lib/db";
import { sendTemplatedEmail } from "@/lib/email";

export const NOTIFICATION_TYPES = [
  "WELCOME",
  "PAYMENT_CONFIRMED",
  "COHORT_ASSIGNED",
  "SESSION_SCHEDULED",
  "SESSION_REMINDER_24H",
  "SESSION_REMINDER_1H",
  "SESSION_REMINDER_10M",
  "SESSION_STARTED",
  "SPRINT_RELEASED",
  "SPRINT_DEADLINE_REMINDER",
  "SUBMISSION_RECEIVED",
  "FEEDBACK_RECEIVED",
  "SUBMISSION_APPROVED",
  "SUBMISSION_NEEDS_REVISION",
  "RESOURCE_UPLOADED",
  "ANNOUNCEMENT_POSTED",
  "MESSAGE_RECEIVED",
  "CERTIFICATE_AVAILABLE",
  "BOOTCAMP_COMPLETED",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

interface NotifyInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  actionLabel?: string;
  actionUrl?: string;
  emailVariables?: Record<string, string>;
}

/**
 * Central fan-out for every notification in the platform: writes the
 * in-app Notification row, then — if the user hasn't opted out — sends the
 * matching branded email via the existing EmailTemplate/sendTemplatedEmail
 * system (the notification `type` doubles as the EmailTemplate `key`).
 */
export async function notifyUser({
  userId,
  type,
  title,
  body,
  actionLabel,
  actionUrl,
  emailVariables,
}: NotifyInput): Promise<void> {
  const [preference, user] = await Promise.all([
    db.notificationPreference.findUnique({ where: { userId } }),
    db.user.findUnique({ where: { id: userId } }),
  ]);

  const inAppEnabled = preference?.inAppEnabled ?? true;
  const emailEnabled = preference?.emailEnabled ?? true;
  const reminderFrequency = preference?.reminderFrequency ?? "ALL";
  const isReminder = type.includes("REMINDER");

  if (inAppEnabled) {
    await db.notification.create({
      data: { userId, type, title, body, actionLabel, actionUrl },
    });
  }

  if (!emailEnabled) return;
  if (isReminder && reminderFrequency === "NONE") return;
  if (isReminder && reminderFrequency === "IMPORTANT_ONLY" && type !== "SESSION_REMINDER_1H") return;

  if (user) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.teqxure.xyz";
    const absoluteActionUrl = actionUrl?.startsWith("/") ? `${appUrl}${actionUrl}` : (actionUrl ?? "");

    await sendTemplatedEmail(type, user.email, {
      name: user.name ?? "there",
      title,
      body,
      actionLabel: actionLabel ?? "",
      actionUrl: absoluteActionUrl,
      ...emailVariables,
    });
  }
}

/** Notifies every active student in a cohort at once (announcements, new sprints, etc). */
export async function notifyCohortStudents(
  cohortId: string,
  input: Omit<NotifyInput, "userId">,
): Promise<void> {
  const enrollments = await db.cohortEnrollment.findMany({
    where: { cohortId, status: "ACTIVE" },
    select: { studentId: true },
  });

  await Promise.all(enrollments.map((e) => notifyUser({ ...input, userId: e.studentId })));
}
