"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export const FIELD_TYPES = ["TEXT", "EMAIL", "TEXTAREA", "PHONE", "SELECT", "CHECKBOX", "FILE", "URL"] as const;

const fieldSchema = z.object({
  label: z.string().min(1),
  fieldType: z.enum(FIELD_TYPES),
  placeholder: z.string().optional(),
  required: z.coerce.boolean().optional(),
  options: z.string().optional(),
});

export interface FieldFormState {
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

export async function createFieldAction(_prev: FieldFormState, formData: FormData): Promise<FieldFormState> {
  const user = await requireAdmin();
  const parsed = fieldSchema.safeParse({
    label: formData.get("label"),
    fieldType: formData.get("fieldType"),
    placeholder: formData.get("placeholder"),
    required: formData.get("required") === "on",
    options: formData.get("options"),
  });
  if (!parsed.success) return { error: "Please check the form for errors." };

  const count = await db.waitlistField.count();
  const { options, ...rest } = parsed.data;
  const created = await db.waitlistField.create({
    data: { ...rest, options: parseOptions(options), order: count },
  });

  await logActivity({ userId: user.id, action: "created", entityType: "WaitlistField", entityId: created.id });
  revalidatePath("/");
  revalidatePath("/admin/waitlist-form");
  redirect("/admin/waitlist-form");
}

export async function updateFieldAction(
  id: string,
  _prev: FieldFormState,
  formData: FormData,
): Promise<FieldFormState> {
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
  await db.waitlistField.update({ where: { id }, data: { ...rest, options: parseOptions(options) } });

  await logActivity({ userId: user.id, action: "updated", entityType: "WaitlistField", entityId: id });
  revalidatePath("/");
  revalidatePath("/admin/waitlist-form");
  redirect("/admin/waitlist-form");
}

export async function deleteFieldAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.waitlistField.update({ where: { id }, data: { deletedAt: new Date(), visible: false } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "WaitlistField", entityId: id });
  revalidatePath("/");
  revalidatePath("/admin/waitlist-form");
}

export async function reorderFieldsAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(
    orderedIds.map((id, index) => db.waitlistField.update({ where: { id }, data: { order: index } })),
  );
  await logActivity({ userId: user.id, action: "reordered", entityType: "WaitlistField" });
  revalidatePath("/");
  revalidatePath("/admin/waitlist-form");
}
