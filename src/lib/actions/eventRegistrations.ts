"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { sendTemplatedEmail, formatFieldsAsHtml } from "@/lib/email";
import { generateEventIcs } from "@/lib/calendarInvite";

export interface SubmitEventRegistrationState {
  success?: boolean;
  error?: string;
}

export async function submitEventRegistrationAction(
  eventId: string,
  _prev: SubmitEventRegistrationState,
  formData: FormData,
): Promise<SubmitEventRegistrationState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("company_website") ?? "").trim()) {
    return { success: true };
  }

  const event = await db.event.findUnique({ where: { id: eventId } });
  if (!event || event.deletedAt || !event.visible || event.status !== "PUBLISHED") {
    return { error: "This event is not accepting registrations." };
  }

  if (event.capacity) {
    const registrationCount = await db.eventRegistration.count({ where: { eventId } });
    if (registrationCount >= event.capacity) {
      return { error: "This event is full." };
    }
  }

  const fields = await db.eventFormField.findMany({ where: { eventId, deletedAt: null, visible: true } });

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
    const recentDuplicate = await db.eventRegistration.findFirst({
      where: { eventId, createdAt: { gte: new Date(Date.now() - 60_000) } },
      orderBy: { createdAt: "desc" },
    });
    if (recentDuplicate && JSON.stringify(recentDuplicate.data).includes(registrantEmail)) {
      return { success: true };
    }
  }

  await db.eventRegistration.create({ data: { eventId, data, registrantEmail: registrantEmail || null } });

  const fieldsHtml = formatFieldsAsHtml({ Event: event.title, ...data });
  const settings = await db.siteSettings.findFirst();
  const notificationEmail = settings?.notificationEmail || process.env.ADMIN_EMAIL || "";

  const ics = generateEventIcs(event);
  const icsAttachment = ics ? [{ filename: `${event.slug}.ics`, content: ics }] : undefined;

  await Promise.all([
    registrantEmail
      ? sendTemplatedEmail(
          "EVENT_REGISTRATION_CONFIRMATION",
          registrantEmail,
          { fields: fieldsHtml, eventTitle: event.title },
          icsAttachment,
        )
      : Promise.resolve(),
    notificationEmail
      ? sendTemplatedEmail("EVENT_REGISTRATION_ADMIN_NOTIFICATION", notificationEmail, {
          fields: fieldsHtml,
          eventTitle: event.title,
        })
      : Promise.resolve(),
  ]);

  return { success: true };
}

export async function markEventRegistrationReviewedAction(id: string, eventId: string): Promise<void> {
  const user = await requireAdmin();
  await db.eventRegistration.update({ where: { id }, data: { status: "REVIEWED" } });
  await logActivity({ userId: user.id, action: "updated", entityType: "EventRegistration", entityId: id });
  revalidatePath(`/admin/events/${eventId}/registrations`);
}
