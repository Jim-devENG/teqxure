"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { sendNotificationEmail } from "@/lib/email";

export interface SubmitWaitlistState {
  success?: boolean;
  error?: string;
}

export async function submitWaitlistAction(
  _prev: SubmitWaitlistState,
  formData: FormData,
): Promise<SubmitWaitlistState> {
  const fields = await db.waitlistField.findMany({ where: { deletedAt: null, visible: true } });

  const data: Record<string, string> = {};
  for (const field of fields) {
    const value = String(formData.get(field.id) ?? "").trim();
    if (field.required && !value) {
      return { error: `${field.label} is required.` };
    }
    if (value) data[field.label] = value;
  }

  await db.waitlistSubmission.create({ data: { data } });

  const summary = Object.entries(data)
    .map(([label, value]) => `<p><strong>${label}:</strong> ${value}</p>`)
    .join("");
  await sendNotificationEmail("New waitlist submission", summary);

  return { success: true };
}

export async function markSubmissionReviewedAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.waitlistSubmission.update({ where: { id }, data: { status: "REVIEWED" } });
  await logActivity({ userId: user.id, action: "updated", entityType: "WaitlistSubmission", entityId: id });
  revalidatePath("/admin/waitlist-submissions");
  revalidatePath("/admin");
}
