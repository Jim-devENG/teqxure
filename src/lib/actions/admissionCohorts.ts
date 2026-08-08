"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const STATUSES = ["DRAFT", "OPEN", "REVIEWING", "CLOSED"] as const;

const cohortSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  applicationsOpenAt: z.coerce.date(),
  applicationsCloseAt: z.string().optional(),
  capacity: z.string().optional(),
  status: z.enum(STATUSES),
});

export interface AdmissionCohortFormState {
  success?: boolean;
  error?: string;
}

function parse(formData: FormData) {
  return cohortSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    applicationsOpenAt: formData.get("applicationsOpenAt"),
    applicationsCloseAt: formData.get("applicationsCloseAt"),
    capacity: formData.get("capacity"),
    status: formData.get("status"),
  });
}

export async function createAdmissionCohortAction(
  _prev: AdmissionCohortFormState,
  formData: FormData,
): Promise<AdmissionCohortFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };

  const existing = await db.admissionCohort.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "That slug is already in use." };

  const created = await db.admissionCohort.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      applicationsOpenAt: parsed.data.applicationsOpenAt,
      applicationsCloseAt: parsed.data.applicationsCloseAt ? new Date(parsed.data.applicationsCloseAt) : null,
      capacity: parsed.data.capacity ? Number(parsed.data.capacity) : null,
      status: parsed.data.status,
    },
  });

  await logActivity({ userId: user.id, action: "created", entityType: "AdmissionCohort", entityId: created.id });
  revalidatePath("/applications/cohorts");
  revalidatePath("/apply");
  redirect("/applications/cohorts");
}

export async function updateAdmissionCohortAction(
  id: string,
  _prev: AdmissionCohortFormState,
  formData: FormData,
): Promise<AdmissionCohortFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };

  const existing = await db.admissionCohort.findFirst({ where: { slug: parsed.data.slug, id: { not: id } } });
  if (existing) return { error: "That slug is already in use." };

  await db.admissionCohort.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      applicationsOpenAt: parsed.data.applicationsOpenAt,
      applicationsCloseAt: parsed.data.applicationsCloseAt ? new Date(parsed.data.applicationsCloseAt) : null,
      capacity: parsed.data.capacity ? Number(parsed.data.capacity) : null,
      status: parsed.data.status,
    },
  });

  await logActivity({ userId: user.id, action: "updated", entityType: "AdmissionCohort", entityId: id });
  revalidatePath("/applications/cohorts");
  revalidatePath("/apply");
  redirect("/applications/cohorts");
}

export async function deleteAdmissionCohortAction(id: string): Promise<{ error?: string }> {
  const user = await requireAdmin();
  const count = await db.application.count({ where: { admissionCohortId: id } });
  if (count > 0) {
    return { error: "This cohort has applications tied to it and can't be deleted. Close it instead." };
  }
  await db.admissionCohort.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "AdmissionCohort", entityId: id });
  revalidatePath("/applications/cohorts");
  return {};
}
