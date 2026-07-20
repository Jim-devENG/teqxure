"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const coreValueSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  visible: z.coerce.boolean().optional(),
});

export interface CoreValueFormState {
  success?: boolean;
  error?: string;
}

function parse(formData: FormData) {
  return coreValueSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    visible: formData.get("visible") === "on",
  });
}

export async function createCoreValueAction(_prev: CoreValueFormState, formData: FormData): Promise<CoreValueFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please check the form for errors." };

  const count = await db.coreValue.count();
  const created = await db.coreValue.create({ data: { ...parsed.data, order: count } });

  await logActivity({ userId: user.id, action: "created", entityType: "CoreValue", entityId: created.id });
  revalidatePath("/about");
  revalidatePath("/core-values");
  redirect("/core-values");
}

export async function updateCoreValueAction(
  id: string,
  _prev: CoreValueFormState,
  formData: FormData,
): Promise<CoreValueFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please check the form for errors." };

  await db.coreValue.update({ where: { id }, data: parsed.data });

  await logActivity({ userId: user.id, action: "updated", entityType: "CoreValue", entityId: id });
  revalidatePath("/about");
  revalidatePath("/core-values");
  redirect("/core-values");
}

export async function deleteCoreValueAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.coreValue.update({ where: { id }, data: { deletedAt: new Date(), visible: false } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "CoreValue", entityId: id });
  revalidatePath("/about");
  revalidatePath("/core-values");
}

export async function reorderCoreValuesAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(orderedIds.map((id, index) => db.coreValue.update({ where: { id }, data: { order: index } })));
  await logActivity({ userId: user.id, action: "reordered", entityType: "CoreValue" });
  revalidatePath("/about");
  revalidatePath("/core-values");
}
