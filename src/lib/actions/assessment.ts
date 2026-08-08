"use server";

import "server-only";
import { db } from "@/lib/db";
import { sendTemplatedEmail } from "@/lib/email";
import { getPresignedUploadUrl } from "@/lib/r2";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { scheduleAiAnalysis } from "@/lib/ai/admissions";

// Video is the only upload type the spec actually calls for (the Section 7
// intro video); a handful of document/image types are allowed too so a
// generic FILE question added later through the assessment builder isn't
// dead on arrival.
const ALLOWED_UPLOAD_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];
const MAX_UPLOAD_BYTES = 150 * 1024 * 1024; // 150MB

async function loadApplicationByToken(token: string) {
  return db.applicationToken.findUnique({
    where: { token },
    include: {
      application: {
        include: {
          applicant: true,
          admissionCohort: true,
          responses: true,
        },
      },
    },
  });
}

export type TokenValidation =
  | { status: "invalid" }
  | { status: "expired" }
  | { status: "completed"; record: NonNullable<Awaited<ReturnType<typeof loadApplicationByToken>>> }
  | { status: "valid"; record: NonNullable<Awaited<ReturnType<typeof loadApplicationByToken>>> };

/**
 * Re-run on every read and every mutation below — nothing here trusts a
 * client-supplied application id, only the opaque token.
 */
export async function validateApplicationToken(token: string): Promise<TokenValidation> {
  if (!token) return { status: "invalid" };

  const record = await loadApplicationByToken(token);
  if (!record) return { status: "invalid" };

  if (record.usedAt) return { status: "completed", record };
  if (record.expiresAt < new Date()) return { status: "expired" };

  return { status: "valid", record };
}

export async function getAssessmentSections() {
  return db.assessmentSection.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
    include: { questions: { where: { visible: true }, orderBy: { order: "asc" } } },
  });
}

export interface SaveResponseState {
  success?: boolean;
  error?: string;
}

export async function saveAssessmentResponseAction(
  token: string,
  questionKey: string,
  value: unknown,
): Promise<SaveResponseState> {
  const validation = await validateApplicationToken(token);
  if (validation.status !== "valid") {
    return { error: "This onboarding link is no longer active." };
  }

  const { application } = validation.record;

  // Snapshot the question's current label/type alongside the answer, so
  // this response stays interpretable even if the question is edited or
  // removed later through the assessment builder.
  const question = await db.assessmentQuestion.findUnique({
    where: { key: questionKey },
    select: { label: true, fieldType: true },
  });

  await db.assessmentResponse.upsert({
    where: { applicationId_questionKey: { applicationId: application.id, questionKey } },
    update: { value: value as never, questionLabel: question?.label, fieldType: question?.fieldType },
    create: {
      applicationId: application.id,
      questionKey,
      value: value as never,
      questionLabel: question?.label,
      fieldType: question?.fieldType,
    },
  });

  if (application.status === "PENDING_ONBOARDING") {
    await db.application.update({ where: { id: application.id }, data: { status: "ONBOARDING_IN_PROGRESS" } });
  }

  return { success: true };
}

export interface VideoUploadUrlState {
  key?: string;
  url?: string;
  uploadUrl?: string;
  error?: string;
}

export async function requestVideoUploadUrlAction(
  token: string,
  fileName: string,
  mimeType: string,
  fileSize: number,
): Promise<VideoUploadUrlState> {
  const validation = await validateApplicationToken(token);
  if (validation.status !== "valid") {
    return { error: "This onboarding link is no longer active." };
  }

  if (!ALLOWED_UPLOAD_MIME_TYPES.includes(mimeType)) {
    return { error: "That file type isn't supported. Please upload an MP4, WebM, or MOV video." };
  }
  if (fileSize > MAX_UPLOAD_BYTES) {
    return { error: "That file is too large — please keep it under 150MB." };
  }

  const ip = await getClientIp();
  const { allowed } = await checkRateLimit(`video-upload:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!allowed) {
    return { error: "Too many upload attempts. Please try again shortly." };
  }

  const { key, url, uploadUrl } = await getPresignedUploadUrl(
    fileName,
    mimeType,
    `applications/${validation.record.application.id}`,
  );

  return { key, url, uploadUrl };
}

export interface CompleteAssessmentState {
  success?: boolean;
  error?: string;
}

export async function completeAssessmentAction(token: string): Promise<CompleteAssessmentState> {
  const validation = await validateApplicationToken(token);
  if (validation.status === "completed") return { success: true };
  if (validation.status !== "valid") {
    return { error: "This onboarding link is no longer active." };
  }

  const { record } = validation;
  const application = record.application;
  const responsesByKey = new Map(application.responses.map((r) => [r.questionKey, r.value]));

  const sections = await getAssessmentSections();
  for (const section of sections) {
    for (const question of section.questions) {
      if (!question.required) continue;

      if (question.conditionalOn) {
        const cond = question.conditionalOn as { questionKey: string; equals: string };
        const dependsOnValue = responsesByKey.get(cond.questionKey);
        if (dependsOnValue !== cond.equals) continue; // not applicable, skip requirement
      }

      const value = responsesByKey.get(question.key);
      const isEmpty =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);
      if (isEmpty) {
        return { error: `Please complete "${question.label}" in the ${section.title} section before submitting.` };
      }
    }
  }

  await db.$transaction([
    db.application.update({
      where: { id: application.id },
      data: { status: "ASSESSMENT_COMPLETED", assessmentCompletedAt: new Date() },
    }),
    db.applicationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  // Schedule the AI readiness analysis to run after this response is sent —
  // the applicant should never wait on it (see src/lib/ai/admissions.ts).
  await scheduleAiAnalysis(application.id, null);

  const settings = await db.siteSettings.findFirst();
  const notificationEmail = settings?.notificationEmail || process.env.ADMIN_EMAIL || "";
  if (notificationEmail) {
    await sendTemplatedEmail(
      "ASSESSMENT_COMPLETED_ADMIN_NOTIFICATION",
      notificationEmail,
      {
        fullName: application.applicant.fullName,
        email: application.applicant.email,
        cohortName: application.admissionCohort.name,
        referenceCode: application.referenceCode,
      },
      undefined,
      application.id,
    );
  }

  return { success: true };
}
