"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { sendTemplatedEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { generateReferenceCode } from "@/lib/referenceCode";
import { schedulePreparationPlan } from "@/lib/ai/admissions";

const TOKEN_FALLBACK_TTL_MS = 1000 * 60 * 60 * 24 * 90; // 90 days, when a cohort has no close date

const applicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(1, "Phone number is required."),
  country: z.string().min(1, "Country is required."),
  occupation: z.string().min(1, "Current occupation is required."),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
});

export interface SubmitApplicationState {
  success?: boolean;
  error?: string;
}

async function issueApplicationToken(applicationId: string, closesAt: Date | null) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = closesAt ?? new Date(Date.now() + TOKEN_FALLBACK_TTL_MS);
  await db.applicationToken.create({ data: { token, applicationId, expiresAt } });
  return token;
}

export async function submitApplicationAction(
  _prev: SubmitApplicationState,
  formData: FormData,
): Promise<SubmitApplicationState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("company_website") ?? "").trim()) {
    return { success: true };
  }

  const ip = await getClientIp();
  const { allowed } = await checkRateLimit(`apply:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!allowed) {
    return { error: "Too many applications from this connection. Please try again in a little while." };
  }

  const parsed = applicationSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    country: formData.get("country"),
    occupation: formData.get("occupation"),
    linkedin: formData.get("linkedin") || undefined,
    github: formData.get("github") || undefined,
    portfolio: formData.get("portfolio") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }

  const cohort = await db.admissionCohort.findFirst({
    where: { status: "OPEN" },
    orderBy: { applicationsOpenAt: "desc" },
  });
  if (!cohort) {
    return { error: "Applications aren't open right now. Check back soon." };
  }

  const applicant = await db.applicant.upsert({
    where: { email: parsed.data.email },
    update: {
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      country: parsed.data.country,
      occupation: parsed.data.occupation,
      linkedin: parsed.data.linkedin,
      github: parsed.data.github,
      portfolio: parsed.data.portfolio,
    },
    create: parsed.data,
  });

  const alreadyApplied = await db.application.findUnique({
    where: { applicantId_admissionCohortId: { applicantId: applicant.id, admissionCohortId: cohort.id } },
  });
  if (alreadyApplied) {
    return { error: "You've already applied to this cohort. Check your email for your onboarding link." };
  }

  const referenceCode = await generateReferenceCode();
  const application = await db.application.create({
    data: { applicantId: applicant.id, admissionCohortId: cohort.id, referenceCode },
  });

  const token = await issueApplicationToken(application.id, cohort.applicationsCloseAt);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://teqxure.xyz";
  const onboardingUrl = `${siteUrl}/onboarding?token=${token}`;
  const firstName = parsed.data.fullName.split(" ")[0];

  const settings = await db.siteSettings.findFirst();
  const notificationEmail = settings?.notificationEmail || process.env.ADMIN_EMAIL || "";

  await Promise.all([
    sendTemplatedEmail(
      "APPLICATION_WELCOME",
      parsed.data.email,
      { firstName, onboardingUrl, cohortName: cohort.name },
      undefined,
      application.id,
    ),
    notificationEmail
      ? sendTemplatedEmail(
          "APPLICATION_ADMIN_NOTIFICATION",
          notificationEmail,
          { fullName: parsed.data.fullName, email: parsed.data.email, cohortName: cohort.name, referenceCode },
          undefined,
          application.id,
        )
      : Promise.resolve(),
  ]);

  return { success: true };
}

// ---------- Admin actions ----------

const STATUSES = [
  "PENDING_ONBOARDING",
  "ONBOARDING_IN_PROGRESS",
  "ASSESSMENT_COMPLETED",
  "UNDER_REVIEW",
  "INTERVIEW_REQUIRED",
  "ACCEPTED",
  "WAITLISTED",
  "REJECTED",
] as const;

const DECISION_TEMPLATES: Record<string, string> = {
  ACCEPTED: "APPLICATION_ACCEPTED",
  WAITLISTED: "APPLICATION_WAITLISTED",
  REJECTED: "APPLICATION_REJECTED",
  INTERVIEW_REQUIRED: "APPLICATION_INTERVIEW_REQUIRED",
};

export async function changeApplicationStatusAction(id: string, status: string): Promise<{ error?: string }> {
  const user = await requireAdmin();
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) return { error: "Unknown status." };

  await db.application.update({ where: { id }, data: { status } });
  await logActivity({ userId: user.id, action: "updated", entityType: "Application", entityId: id, metadata: { status } });
  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);
  return {};
}

export async function decideApplicationAction(
  id: string,
  decision: "ACCEPTED" | "WAITLISTED" | "REJECTED" | "INTERVIEW_REQUIRED",
): Promise<{ error?: string }> {
  const user = await requireAdmin();

  const application = await db.application.update({
    where: { id },
    data: { status: decision, decisionAt: new Date(), decisionBy: user.id },
    include: { applicant: true, admissionCohort: true },
  });

  if (decision === "ACCEPTED") {
    // No-ops internally if no completed readiness analysis exists yet —
    // an admin can trigger it later from the applicant's detail page.
    await schedulePreparationPlan(application.id, user.id);
  }

  const templateKey = DECISION_TEMPLATES[decision];
  await sendTemplatedEmail(
    templateKey,
    application.applicant.email,
    {
      firstName: application.applicant.fullName.split(" ")[0],
      cohortName: application.admissionCohort.name,
      referenceCode: application.referenceCode,
    },
    undefined,
    application.id,
  );

  await logActivity({ userId: user.id, action: "updated", entityType: "Application", entityId: id, metadata: { decision } });
  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);
  return {};
}

export async function addReviewerNoteAction(applicationId: string, body: string): Promise<{ error?: string }> {
  const user = await requireAdmin();
  const trimmed = body.trim();
  if (!trimmed) return { error: "Note can't be empty." };

  await db.reviewerNote.create({ data: { applicationId, authorId: user.id, body: trimmed } });
  await logActivity({ userId: user.id, action: "created", entityType: "ReviewerNote", entityId: applicationId });
  revalidatePath(`/applications/${applicationId}`);
  return {};
}

export async function resendApplicationTokenAction(applicationId: string): Promise<{ error?: string }> {
  const user = await requireAdmin();

  const application = await db.application.findUnique({
    where: { id: applicationId },
    include: { applicant: true, admissionCohort: true, token: true },
  });
  if (!application) return { error: "Application not found." };
  if (application.token?.usedAt) return { error: "This applicant already completed their assessment." };

  const token = randomBytes(32).toString("hex");
  const expiresAt = application.admissionCohort.applicationsCloseAt ?? new Date(Date.now() + TOKEN_FALLBACK_TTL_MS);

  await db.applicationToken.upsert({
    where: { applicationId },
    update: { token, expiresAt, usedAt: null },
    create: { applicationId, token, expiresAt },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://teqxure.xyz";
  const onboardingUrl = `${siteUrl}/onboarding?token=${token}`;

  await sendTemplatedEmail(
    "APPLICATION_WELCOME",
    application.applicant.email,
    {
      firstName: application.applicant.fullName.split(" ")[0],
      onboardingUrl,
      cohortName: application.admissionCohort.name,
    },
    undefined,
    application.id,
  );

  await logActivity({ userId: user.id, action: "updated", entityType: "Application", entityId: applicationId, metadata: { action: "resend-token" } });
  revalidatePath(`/applications/${applicationId}`);
  return {};
}
