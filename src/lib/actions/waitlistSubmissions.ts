"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { sendTemplatedEmail, formatFieldsAsHtml } from "@/lib/email";

export interface SubmitWaitlistState {
  success?: boolean;
  error?: string;
}

export async function submitWaitlistAction(
  _prev: SubmitWaitlistState,
  formData: FormData,
): Promise<SubmitWaitlistState> {
  // Honeypot: real visitors never see or fill this field. Bots that
  // auto-fill every input do. Pretend success without doing any work.
  if (String(formData.get("company_website") ?? "").trim()) {
    return { success: true };
  }

  const fields = await db.waitlistField.findMany({ where: { deletedAt: null, visible: true } });

  const data: Record<string, string> = {};
  let registrantEmail = "";

  for (const field of fields) {
    const value = String(formData.get(field.id) ?? "").trim();
    if (field.required && !value) {
      return { error: `${field.label} is required.` };
    }
    if (value) {
      data[field.label] = value;
      if (field.fieldType === "EMAIL" && !registrantEmail) {
        registrantEmail = value;
      }
    }
  }

  if (registrantEmail) {
    const recentDuplicate = await db.waitlistSubmission.findFirst({
      where: { createdAt: { gte: new Date(Date.now() - 60_000) } },
      orderBy: { createdAt: "desc" },
    });
    if (recentDuplicate && JSON.stringify(recentDuplicate.data).includes(registrantEmail)) {
      return { success: true };
    }
  }

  await db.waitlistSubmission.create({ data: { data } });

  const fieldsHtml = formatFieldsAsHtml(data);
  const settings = await db.siteSettings.findFirst();
  const notificationEmail = settings?.notificationEmail || process.env.ADMIN_EMAIL || "";

  await Promise.all([
    registrantEmail
      ? sendTemplatedEmail("WAITLIST_CONFIRMATION", registrantEmail, { fields: fieldsHtml })
      : Promise.resolve(),
    notificationEmail
      ? sendTemplatedEmail("WAITLIST_ADMIN_NOTIFICATION", notificationEmail, { fields: fieldsHtml })
      : Promise.resolve(),
  ]);

  return { success: true };
}

export async function markSubmissionReviewedAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.waitlistSubmission.update({ where: { id }, data: { status: "REVIEWED" } });
  await logActivity({ userId: user.id, action: "updated", entityType: "WaitlistSubmission", entityId: id });
  revalidatePath("/admin/waitlist-submissions");
  revalidatePath("/admin");
}
