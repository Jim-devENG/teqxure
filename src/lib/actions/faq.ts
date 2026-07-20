"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export interface FaqFormState {
  success?: boolean;
  error?: string;
}

export async function createFaqAction(_prev: FaqFormState, formData: FormData): Promise<FaqFormState> {
  const user = await requireAdmin();
  const parsed = faqSchema.safeParse({ question: formData.get("question"), answer: formData.get("answer") });
  if (!parsed.success) return { error: "Please fill in both fields." };

  const count = await db.faqItem.count();
  const item = await db.faqItem.create({ data: { ...parsed.data, order: count } });

  await logActivity({ userId: user.id, action: "created", entityType: "FaqItem", entityId: item.id });
  revalidatePath("/");
  revalidatePath("/admin/faq");
  redirect("/faq");
}

export async function updateFaqAction(
  id: string,
  _prev: FaqFormState,
  formData: FormData,
): Promise<FaqFormState> {
  const user = await requireAdmin();
  const parsed = faqSchema.safeParse({ question: formData.get("question"), answer: formData.get("answer") });
  if (!parsed.success) return { error: "Please fill in both fields." };

  await db.faqItem.update({ where: { id }, data: parsed.data });

  await logActivity({ userId: user.id, action: "updated", entityType: "FaqItem", entityId: id });
  revalidatePath("/");
  revalidatePath("/admin/faq");
  redirect("/faq");
}

export async function deleteFaqAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.faqItem.update({ where: { id }, data: { deletedAt: new Date(), visible: false } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "FaqItem", entityId: id });
  revalidatePath("/");
  revalidatePath("/admin/faq");
}

export async function reorderFaqAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(orderedIds.map((id, index) => db.faqItem.update({ where: { id }, data: { order: index } })));
  await logActivity({ userId: user.id, action: "reordered", entityType: "FaqItem" });
  revalidatePath("/");
  revalidatePath("/admin/faq");
}
