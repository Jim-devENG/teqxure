"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export interface ActionState {
  error?: string;
  success?: boolean;
}

const urlField = z.string().url().optional().or(z.literal(""));

const productSchema = z.object({
  name: z.string().optional(),
  problemStatement: z.string().optional(),
  repositoryUrl: urlField,
  designFilesUrl: urlField,
  backendUrl: urlField,
  frontendUrl: urlField,
  deploymentUrl: urlField,
  productionUrl: urlField,
  currentMilestone: z.string().optional(),
});

export async function updateStudentProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const student = await requireRole("STUDENT");
  const parsed = productSchema.safeParse({
    name: formData.get("name") || undefined,
    problemStatement: formData.get("problemStatement") || undefined,
    repositoryUrl: formData.get("repositoryUrl") || "",
    designFilesUrl: formData.get("designFilesUrl") || "",
    backendUrl: formData.get("backendUrl") || "",
    frontendUrl: formData.get("frontendUrl") || "",
    deploymentUrl: formData.get("deploymentUrl") || "",
    productionUrl: formData.get("productionUrl") || "",
    currentMilestone: formData.get("currentMilestone") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form — links must be full URLs." };

  const data = {
    ...parsed.data,
    repositoryUrl: parsed.data.repositoryUrl || null,
    designFilesUrl: parsed.data.designFilesUrl || null,
    backendUrl: parsed.data.backendUrl || null,
    frontendUrl: parsed.data.frontendUrl || null,
    deploymentUrl: parsed.data.deploymentUrl || null,
    productionUrl: parsed.data.productionUrl || null,
  };

  await db.studentProduct.upsert({
    where: { studentId: student.id },
    update: data,
    create: { ...data, studentId: student.id },
  });

  revalidatePath("/platform/my-product");
  return { success: true };
}

export async function updateMentorNotesAction(studentId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole("SUPER_ADMIN", "PROGRAM_MANAGER", "INSTRUCTOR", "MENTOR");
  const mentorNotes = String(formData.get("mentorNotes") ?? "");

  await db.studentProduct.upsert({
    where: { studentId },
    update: { mentorNotes },
    create: { studentId, mentorNotes },
  });

  revalidatePath(`/platform/manage/students/${studentId}`);
  return { success: true };
}
