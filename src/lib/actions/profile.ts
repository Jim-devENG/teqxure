"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export interface ActionState {
  error?: string;
  success?: boolean;
}

export async function updateNotificationPreferenceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You need to sign in." };

  const emailEnabled = formData.get("emailEnabled") === "on";
  const inAppEnabled = formData.get("inAppEnabled") === "on";
  const communityNotifications = formData.get("communityNotifications") === "on";
  const reminderFrequency = String(formData.get("reminderFrequency") ?? "ALL");

  await db.notificationPreference.upsert({
    where: { userId: user.id },
    update: { emailEnabled, inAppEnabled, communityNotifications, reminderFrequency },
    create: { userId: user.id, emailEnabled, inAppEnabled, communityNotifications, reminderFrequency },
  });

  revalidatePath("/platform/profile");
  return { success: true };
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  await db.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true, readAt: new Date() } });
  revalidatePath("/platform/profile");
}
