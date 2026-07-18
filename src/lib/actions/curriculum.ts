"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const PHASES = ["Problem", "Pattern", "Architecture", "Engineering", "Production", "Users", "Iteration"] as const;

const weekSchema = z.object({
  week: z.coerce.number().int().min(1),
  phase: z.enum(PHASES),
  title: z.string().min(1),
});

export interface WeekFormState {
  success?: boolean;
  error?: string;
}

function getOutcomes(formData: FormData): string[] {
  return formData
    .getAll("outcomes")
    .map((v) => String(v).trim())
    .filter(Boolean);
}

export async function createWeekAction(_prev: WeekFormState, formData: FormData): Promise<WeekFormState> {
  const user = await requireAdmin();
  const parsed = weekSchema.safeParse({
    week: formData.get("week"),
    phase: formData.get("phase"),
    title: formData.get("title"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }

  const count = await db.curriculumWeek.count();
  const outcomes = getOutcomes(formData);

  const created = await db.curriculumWeek.create({
    data: {
      ...parsed.data,
      order: count,
      outcomes: { create: outcomes.map((text, i) => ({ text, order: i })) },
    },
  });

  await logActivity({ userId: user.id, action: "created", entityType: "CurriculumWeek", entityId: created.id });
  revalidatePath("/");
  revalidatePath("/admin/curriculum");
  redirect("/admin/curriculum");
}

export async function updateWeekAction(
  id: string,
  _prev: WeekFormState,
  formData: FormData,
): Promise<WeekFormState> {
  const user = await requireAdmin();
  const parsed = weekSchema.safeParse({
    week: formData.get("week"),
    phase: formData.get("phase"),
    title: formData.get("title"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }

  const outcomes = getOutcomes(formData);

  await db.$transaction([
    db.curriculumWeek.update({ where: { id }, data: parsed.data }),
    db.curriculumOutcome.deleteMany({ where: { weekId: id } }),
    db.curriculumOutcome.createMany({
      data: outcomes.map((text, i) => ({ weekId: id, text, order: i })),
    }),
  ]);

  await logActivity({ userId: user.id, action: "updated", entityType: "CurriculumWeek", entityId: id });
  revalidatePath("/");
  revalidatePath("/admin/curriculum");
  redirect("/admin/curriculum");
}

export async function deleteWeekAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.curriculumWeek.update({ where: { id }, data: { deletedAt: new Date(), visible: false } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "CurriculumWeek", entityId: id });
  revalidatePath("/");
  revalidatePath("/admin/curriculum");
}

export async function reorderWeeksAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(
    orderedIds.map((id, index) => db.curriculumWeek.update({ where: { id }, data: { order: index } })),
  );
  await logActivity({ userId: user.id, action: "reordered", entityType: "CurriculumWeek" });
  revalidatePath("/");
  revalidatePath("/admin/curriculum");
}
