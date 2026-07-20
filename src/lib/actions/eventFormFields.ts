"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { FIELD_TYPES } from "@/lib/fieldTypes";

const fieldSchema = z.object({
  label: z.string().min(1),
  fieldType: z.enum(FIELD_TYPES),
  placeholder: z.string().optional(),
  required: z.coerce.boolean().optional(),
  options: z.string().optional(),
});

export interface EventFieldFormState {
  success?: boolean;
  error?: string;
}

function parseOptions(raw?: string): string[] | undefined {
  if (!raw) return undefined;
  const options = raw
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  return options.length > 0 ? options : undefined;
}

export async function createEventFieldAction(
  eventId: string,
  _prev: EventFieldFormState,
  formData: FormData,
): Promise<EventFieldFormState> {
  const user = await requireAdmin();
  const parsed = fieldSchema.safeParse({
    label: formData.get("label"),
    fieldType: formData.get("fieldType"),
    placeholder: formData.get("placeholder"),
    required: formData.get("required") === "on",
    options: formData.get("options"),
  });
  if (!parsed.success) return { error: "Please check the form for errors." };

  const count = await db.eventFormField.count({ where: { eventId } });
  const { options, ...rest } = parsed.data;
  const created = await db.eventFormField.create({
    data: { ...rest, eventId, options: parseOptions(options), order: count },
  });

  await logActivity({ userId: user.id, action: "created", entityType: "EventFormField", entityId: created.id });
  revalidatePath(`/admin/events/${eventId}/form`);
  redirect(`/events/${eventId}/form`);
}

export async function updateEventFieldAction(
  eventId: string,
  fieldId: string,
  _prev: EventFieldFormState,
  formData: FormData,
): Promise<EventFieldFormState> {
  const user = await requireAdmin();
  const parsed = fieldSchema.safeParse({
    label: formData.get("label"),
    fieldType: formData.get("fieldType"),
    placeholder: formData.get("placeholder"),
    required: formData.get("required") === "on",
    options: formData.get("options"),
  });
  if (!parsed.success) return { error: "Please check the form for errors." };

  const { options, ...rest } = parsed.data;
  await db.eventFormField.update({ where: { id: fieldId }, data: { ...rest, options: parseOptions(options) } });

  await logActivity({ userId: user.id, action: "updated", entityType: "EventFormField", entityId: fieldId });
  revalidatePath(`/admin/events/${eventId}/form`);
  redirect(`/events/${eventId}/form`);
}

export async function deleteEventFieldAction(eventId: string, fieldId: string): Promise<void> {
  const user = await requireAdmin();
  await db.eventFormField.update({ where: { id: fieldId }, data: { deletedAt: new Date(), visible: false } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "EventFormField", entityId: fieldId });
  revalidatePath(`/admin/events/${eventId}/form`);
}

export async function reorderEventFieldsAction(eventId: string, orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(
    orderedIds.map((id, index) => db.eventFormField.update({ where: { id }, data: { order: index } })),
  );
  await logActivity({ userId: user.id, action: "reordered", entityType: "EventFormField", entityId: eventId });
  revalidatePath(`/admin/events/${eventId}/form`);
}
