"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const differentiatorSchema = z.object({
  heading: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  visible: z.coerce.boolean().optional(),
});

export interface DifferentiatorFormState {
  success?: boolean;
  error?: string;
}

function parse(formData: FormData) {
  return differentiatorSchema.safeParse({
    heading: formData.get("heading"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    visible: formData.get("visible") === "on",
  });
}

export async function createDifferentiatorAction(
  _prev: DifferentiatorFormState,
  formData: FormData,
): Promise<DifferentiatorFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please check the form for errors." };

  const count = await db.differentiator.count();
  const created = await db.differentiator.create({ data: { ...parsed.data, order: count } });

  await logActivity({ userId: user.id, action: "created", entityType: "Differentiator", entityId: created.id });
  revalidatePath("/about");
  revalidatePath("/differentiators");
  redirect("/differentiators");
}

export async function updateDifferentiatorAction(
  id: string,
  _prev: DifferentiatorFormState,
  formData: FormData,
): Promise<DifferentiatorFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please check the form for errors." };

  await db.differentiator.update({ where: { id }, data: parsed.data });

  await logActivity({ userId: user.id, action: "updated", entityType: "Differentiator", entityId: id });
  revalidatePath("/about");
  revalidatePath("/differentiators");
  redirect("/differentiators");
}

export async function deleteDifferentiatorAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.differentiator.update({ where: { id }, data: { deletedAt: new Date(), visible: false } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "Differentiator", entityId: id });
  revalidatePath("/about");
  revalidatePath("/differentiators");
}

export async function reorderDifferentiatorsAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(orderedIds.map((id, index) => db.differentiator.update({ where: { id }, data: { order: index } })));
  await logActivity({ userId: user.id, action: "reordered", entityType: "Differentiator" });
  revalidatePath("/about");
  revalidatePath("/differentiators");
}
