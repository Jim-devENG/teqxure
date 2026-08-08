"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import {
  scheduleAiAnalysis,
  schedulePreparationPlan,
  askAboutApplicant,
  type AskTurn,
} from "@/lib/ai/admissions";

export async function requestAiAnalysisAction(applicationId: string): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  const result = await scheduleAiAnalysis(applicationId, admin.id);
  if (!result.scheduled) return { error: result.reason };

  await logActivity({ userId: admin.id, action: "created", entityType: "AiAnalysis", entityId: applicationId });
  revalidatePath(`/applications/${applicationId}`);
  return {};
}

export async function requestPreparationPlanAction(applicationId: string): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  const result = await schedulePreparationPlan(applicationId, admin.id);
  if (!result.scheduled) return { error: result.reason };

  await logActivity({ userId: admin.id, action: "created", entityType: "PreparationPlan", entityId: applicationId });
  revalidatePath(`/applications/${applicationId}`);
  return {};
}

export async function askAboutApplicantAction(
  applicationId: string,
  question: string,
  priorTurns: AskTurn[],
): Promise<{ answer?: string; error?: string }> {
  await requireAdmin();
  const result = await askAboutApplicant(applicationId, question, priorTurns);
  return "error" in result ? { error: result.error } : { answer: result.answer };
}
