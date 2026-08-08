"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { ASSESSMENT_FIELD_TYPES } from "@/lib/assessmentFieldTypes";

const BUILDER_PATH = "/applications/assessment-builder";

// ---------- Sections ----------

const sectionSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
});

export interface SectionFormState {
  success?: boolean;
  error?: string;
}

export async function createAssessmentSectionAction(
  _prev: SectionFormState,
  formData: FormData,
): Promise<SectionFormState> {
  const user = await requireAdmin();
  const parsed = sectionSchema.safeParse({
    key: formData.get("key"),
    title: formData.get("title"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { error: "Please check the form for errors." };

  const existing = await db.assessmentSection.findUnique({ where: { key: parsed.data.key } });
  if (existing) return { error: "That section key is already in use." };

  const count = await db.assessmentSection.count();
  const created = await db.assessmentSection.create({ data: { ...parsed.data, order: count } });

  await logActivity({ userId: user.id, action: "created", entityType: "AssessmentSection", entityId: created.id });
  revalidatePath(BUILDER_PATH);
  redirect(BUILDER_PATH);
}

export async function updateAssessmentSectionAction(
  id: string,
  _prev: SectionFormState,
  formData: FormData,
): Promise<SectionFormState> {
  const user = await requireAdmin();
  const parsed = sectionSchema.safeParse({
    key: formData.get("key"),
    title: formData.get("title"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { error: "Please check the form for errors." };

  await db.assessmentSection.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: user.id, action: "updated", entityType: "AssessmentSection", entityId: id });
  revalidatePath(BUILDER_PATH);
  redirect(BUILDER_PATH);
}

export async function toggleAssessmentSectionVisibleAction(id: string, visible: boolean): Promise<void> {
  const user = await requireAdmin();
  await db.assessmentSection.update({ where: { id }, data: { visible } });
  await logActivity({ userId: user.id, action: visible ? "published" : "unpublished", entityType: "AssessmentSection", entityId: id });
  revalidatePath(BUILDER_PATH);
}

export async function deleteAssessmentSectionAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.assessmentSection.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "AssessmentSection", entityId: id });
  revalidatePath(BUILDER_PATH);
}

export async function reorderAssessmentSectionsAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(orderedIds.map((id, index) => db.assessmentSection.update({ where: { id }, data: { order: index } })));
  await logActivity({ userId: user.id, action: "reordered", entityType: "AssessmentSection" });
  revalidatePath(BUILDER_PATH);
}

// ---------- Questions ----------

const questionSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  helpText: z.string().optional(),
  fieldType: z.enum(ASSESSMENT_FIELD_TYPES),
  options: z.string().optional(),
  required: z.coerce.boolean().optional(),
  conditionalOnKey: z.string().optional(),
  conditionalOnEquals: z.string().optional(),
});

export interface QuestionFormState {
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

function buildQuestionData(parsed: z.infer<typeof questionSchema>) {
  const { options, conditionalOnKey, conditionalOnEquals, ...rest } = parsed;
  return {
    ...rest,
    options: parseOptions(options),
    conditionalOn: conditionalOnKey && conditionalOnEquals ? { questionKey: conditionalOnKey, equals: conditionalOnEquals } : undefined,
  };
}

export async function createAssessmentQuestionAction(
  sectionId: string,
  _prev: QuestionFormState,
  formData: FormData,
): Promise<QuestionFormState> {
  const user = await requireAdmin();
  const parsed = questionSchema.safeParse({
    key: formData.get("key"),
    label: formData.get("label"),
    helpText: formData.get("helpText"),
    fieldType: formData.get("fieldType"),
    options: formData.get("options"),
    required: formData.get("required") === "on",
    conditionalOnKey: formData.get("conditionalOnKey"),
    conditionalOnEquals: formData.get("conditionalOnEquals"),
  });
  if (!parsed.success) return { error: "Please check the form for errors." };

  const existing = await db.assessmentQuestion.findUnique({ where: { key: parsed.data.key } });
  if (existing) return { error: "That question key is already in use." };

  const count = await db.assessmentQuestion.count({ where: { sectionId } });
  const created = await db.assessmentQuestion.create({
    data: { ...buildQuestionData(parsed.data), sectionId, order: count },
  });

  await logActivity({ userId: user.id, action: "created", entityType: "AssessmentQuestion", entityId: created.id });
  revalidatePath(BUILDER_PATH);
  redirect(BUILDER_PATH);
}

export async function updateAssessmentQuestionAction(
  id: string,
  _prev: QuestionFormState,
  formData: FormData,
): Promise<QuestionFormState> {
  const user = await requireAdmin();
  const parsed = questionSchema.safeParse({
    key: formData.get("key"),
    label: formData.get("label"),
    helpText: formData.get("helpText"),
    fieldType: formData.get("fieldType"),
    options: formData.get("options"),
    required: formData.get("required") === "on",
    conditionalOnKey: formData.get("conditionalOnKey"),
    conditionalOnEquals: formData.get("conditionalOnEquals"),
  });
  if (!parsed.success) return { error: "Please check the form for errors." };

  await db.assessmentQuestion.update({ where: { id }, data: buildQuestionData(parsed.data) });
  await logActivity({ userId: user.id, action: "updated", entityType: "AssessmentQuestion", entityId: id });
  revalidatePath(BUILDER_PATH);
  redirect(BUILDER_PATH);
}

export async function deleteAssessmentQuestionAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.assessmentQuestion.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "AssessmentQuestion", entityId: id });
  revalidatePath(BUILDER_PATH);
}

export async function reorderAssessmentQuestionsAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(orderedIds.map((id, index) => db.assessmentQuestion.update({ where: { id }, data: { order: index } })));
  await logActivity({ userId: user.id, action: "reordered", entityType: "AssessmentQuestion" });
  revalidatePath(BUILDER_PATH);
}
