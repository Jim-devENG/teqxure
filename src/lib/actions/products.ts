"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const productSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1),
  category: z.string().min(1),
  oneLiner: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().optional(),
  logoUrl: z.string().optional(),
  builtWith: z.string().optional(),
  accent: z.enum(["blue", "cyan", "emerald"]),
  metricLabel: z.string().min(1),
  metricValue: z.string().min(1),
  liveUrl: z.string().optional(),
  caseStudyUrl: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  visible: z.coerce.boolean().optional(),
});

export interface ProductFormState {
  success?: boolean;
  error?: string;
}

function getScreenshots(formData: FormData): string[] {
  return formData
    .getAll("screenshots")
    .map((v) => String(v).trim())
    .filter(Boolean);
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    category: formData.get("category"),
    oneLiner: formData.get("oneLiner"),
    description: formData.get("description"),
    longDescription: formData.get("longDescription"),
    logoUrl: formData.get("logoUrl"),
    builtWith: formData.get("builtWith"),
    accent: formData.get("accent"),
    metricLabel: formData.get("metricLabel"),
    metricValue: formData.get("metricValue"),
    liveUrl: formData.get("liveUrl"),
    caseStudyUrl: formData.get("caseStudyUrl"),
    featured: formData.get("featured") === "on",
    visible: formData.get("visible") === "on",
  });
}

export async function createProductAction(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const user = await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }

  const count = await db.product.count();
  const { builtWith, ...rest } = parsed.data;

  const product = await db.product.create({
    data: {
      ...rest,
      builtWith: builtWith ? builtWith.split(",").map((t) => t.trim()).filter(Boolean) : [],
      screenshots: getScreenshots(formData),
      order: count,
    },
  });

  await logActivity({ userId: user.id, action: "created", entityType: "Product", entityId: product.id });
  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const user = await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }

  const { builtWith, ...rest } = parsed.data;

  await db.product.update({
    where: { id },
    data: {
      ...rest,
      builtWith: builtWith ? builtWith.split(",").map((t) => t.trim()).filter(Boolean) : [],
      screenshots: getScreenshots(formData),
    },
  });

  await logActivity({ userId: user.id, action: "updated", entityType: "Product", entityId: id });
  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.product.update({ where: { id }, data: { deletedAt: new Date(), visible: false } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "Product", entityId: id });
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function reorderProductsAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(orderedIds.map((id, index) => db.product.update({ where: { id }, data: { order: index } })));
  await logActivity({ userId: user.id, action: "reordered", entityType: "Product" });
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function toggleProductFieldAction(
  id: string,
  field: "visible" | "featured",
  value: boolean,
): Promise<void> {
  const user = await requireAdmin();
  await db.product.update({ where: { id }, data: { [field]: value } });
  await logActivity({ userId: user.id, action: "updated", entityType: "Product", entityId: id });
  revalidatePath("/");
  revalidatePath("/admin/products");
}
