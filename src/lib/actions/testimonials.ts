"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const testimonialSchema = z.object({
  quote: z.string().min(1),
  authorName: z.string().min(1),
  authorRole: z.string().optional(),
  authorCompany: z.string().optional(),
  avatarUrl: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  pinned: z.coerce.boolean().optional(),
  approved: z.coerce.boolean().optional(),
  visible: z.coerce.boolean().optional(),
});

export interface TestimonialFormState {
  success?: boolean;
  error?: string;
}

function parse(formData: FormData) {
  return testimonialSchema.safeParse({
    quote: formData.get("quote"),
    authorName: formData.get("authorName"),
    authorRole: formData.get("authorRole"),
    authorCompany: formData.get("authorCompany"),
    avatarUrl: formData.get("avatarUrl"),
    rating: formData.get("rating") || undefined,
    pinned: formData.get("pinned") === "on",
    approved: formData.get("approved") === "on",
    visible: formData.get("visible") === "on",
  });
}

export async function createTestimonialAction(
  _prev: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please check the form for errors." };

  const count = await db.testimonial.count();
  const created = await db.testimonial.create({ data: { ...parsed.data, order: count } });

  await logActivity({ userId: user.id, action: "created", entityType: "Testimonial", entityId: created.id });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  redirect("/testimonials");
}

export async function updateTestimonialAction(
  id: string,
  _prev: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please check the form for errors." };

  await db.testimonial.update({ where: { id }, data: parsed.data });

  await logActivity({ userId: user.id, action: "updated", entityType: "Testimonial", entityId: id });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  redirect("/testimonials");
}

export async function deleteTestimonialAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.testimonial.update({ where: { id }, data: { deletedAt: new Date(), visible: false } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "Testimonial", entityId: id });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function reorderTestimonialsAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(
    orderedIds.map((id, index) => db.testimonial.update({ where: { id }, data: { order: index } })),
  );
  await logActivity({ userId: user.id, action: "reordered", entityType: "Testimonial" });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function togglePinnedAction(id: string, pinned: boolean): Promise<void> {
  const user = await requireAdmin();
  await db.testimonial.update({ where: { id }, data: { pinned } });
  await logActivity({ userId: user.id, action: "updated", entityType: "Testimonial", entityId: id });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}
