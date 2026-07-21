"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  visible: z.coerce.boolean().optional(),
});

export interface CategoryFormState {
  success?: boolean;
  error?: string;
}

function parse(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    visible: formData.get("visible") === "on",
  });
}

export async function createCategoryAction(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const existing = await db.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A category with that slug already exists." };

  const count = await db.category.count();
  const created = await db.category.create({ data: { ...parsed.data, order: count } });

  await logActivity({ userId: user.id, action: "created", entityType: "Category", entityId: created.id });
  revalidatePath("/categories");
  redirect("/categories");
}

export async function updateCategoryAction(id: string, _prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const existing = await db.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== id) return { error: "A category with that slug already exists." };

  await db.category.update({ where: { id }, data: parsed.data });

  await logActivity({ userId: user.id, action: "updated", entityType: "Category", entityId: id });
  revalidatePath("/categories");
  redirect("/categories");
}

export async function deleteCategoryAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.category.update({ where: { id }, data: { deletedAt: new Date(), visible: false } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "Category", entityId: id });
  revalidatePath("/categories");
}

export async function reorderCategoriesAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(orderedIds.map((id, index) => db.category.update({ where: { id }, data: { order: index } })));
  await logActivity({ userId: user.id, action: "reordered", entityType: "Category" });
  revalidatePath("/categories");
}
