import "server-only";
import { after } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma";
import { getActiveProviderAdapter } from "@/lib/ai/settings";
import type { ChatMessage } from "@/lib/ai/providers";

// A PROCESSING job whose after() callback died mid-flight (function crash,
// deploy, etc.) would otherwise stay stuck forever with no way to tell it's
// dead. Generous relative to the 45s AI call timeout below plus the 60s
// route maxDuration — this only fires for a genuinely abandoned job.
const STALE_AFTER_MS = 5 * 60 * 1000;

async function reapStaleAiAnalysis(applicationId: string): Promise<void> {
  await db.aiAnalysis.updateMany({
    where: { applicationId, status: "PROCESSING", startedAt: { lt: new Date(Date.now() - STALE_AFTER_MS) } },
    data: {
      status: "FAILED",
      errorMessage: "Analysis timed out — the background job may have been interrupted. Retry below.",
      completedAt: new Date(),
    },
  });
}

async function reapStalePreparationPlan(applicationId: string): Promise<void> {
  await db.preparationPlan.updateMany({
    where: { applicationId, status: "PROCESSING", startedAt: { lt: new Date(Date.now() - STALE_AFTER_MS) } },
    data: {
      status: "FAILED",
      errorMessage: "Plan generation timed out — the background job may have been interrupted. Retry below.",
      completedAt: new Date(),
    },
  });
}

/**
 * Call before displaying an analysis/plan so a stuck spinner self-heals
 * into a retryable "Failed" state on the next page load, with no cron or
 * queue needed.
 */
export async function reapStaleAiJobs(applicationId: string): Promise<void> {
  await Promise.all([reapStaleAiAnalysis(applicationId), reapStalePreparationPlan(applicationId)]);
}

// Teqxure AI's Admissions Intelligence surface — a second, distinct use of
// the same provider infrastructure in src/lib/ai/providers.ts and
// src/lib/ai/settings.ts. Deliberately does NOT reuse AiSettings.systemPrompt
// (the student-mentor persona) or AiConversation (one row per student) —
// this needs its own persona and its own per-applicant, versioned storage.
//
// Core rule enforced throughout this file: Teqxure AI never decides
// admission. It only produces evidence-grounded observations for a human
// reviewer.

export const READINESS_DIMENSIONS = [
  "TECHNICAL_READINESS",
  "PRODUCT_THINKING",
  "LEARNING_READINESS",
  "COMMITMENT_READINESS",
  "INFRASTRUCTURE_READINESS",
  "COMMUNICATION",
] as const;

export const ANALYSIS_PROMPT_VERSION = "v1";
export const PREP_PLAN_PROMPT_VERSION = "v1";

// ---------- Structured output schemas ----------

const evidenceItemSchema = z.object({
  questionKey: z.string().optional(),
  excerpt: z.string(),
});

function labeledDimensionSchema(labels: [string, ...string[]]) {
  return z.object({
    label: z.enum(labels),
    reason: z.string(),
    evidence: z.array(evidenceItemSchema).default([]),
  });
}

export const analysisResultSchema = z.object({
  technicalReadiness: labeledDimensionSchema(["Beginning", "Developing", "Intermediate", "Strong"]),
  productThinking: labeledDimensionSchema(["Emerging", "Developing", "Strong", "Exceptional"]),
  learningReadiness: labeledDimensionSchema(["Beginning", "Developing", "Intermediate", "Strong"]),
  commitmentReadiness: z.object({
    availableCapacity: z.string(),
    schedulingConcerns: z.array(z.string()).default([]),
    clarificationAreas: z.array(z.string()).default([]),
    evidence: z.array(evidenceItemSchema).default([]),
  }),
  infrastructureReadiness: labeledDimensionSchema([
    "Ready",
    "Potential Constraint",
    "Significant Constraint",
    "Insufficient Information",
  ]),
  communication: labeledDimensionSchema(["Clear", "Developing Clarity", "Needs Clarification", "Insufficient Information"]),
  overallReadiness: z.object({
    label: z.enum(["Strongly Ready", "Ready", "Promising — Needs Preparation", "Needs Clarification", "Not Yet Ready"]),
    summary: z.string(),
  }),
  strengths: z.array(z.string()).min(1).max(6),
  potentialConcerns: z.array(z.string()).default([]),
  reviewerAttention: z.array(z.string()).default([]),
});

export type AnalysisResultData = z.infer<typeof analysisResultSchema>;
export type AnalysisResult = AnalysisResultData & { videoNote: string | null };

const preparationPlanResultSchema = z.object({
  summary: z.string(),
  focusAreas: z
    .array(
      z.object({
        title: z.string(),
        reason: z.string(),
        recommendations: z.array(z.string()).min(1),
      }),
    )
    .min(1),
});

export type PreparationPlanResult = z.infer<typeof preparationPlanResultSchema>;

// ---------- Data minimization ----------
// The single choke point for what reaches the model. Deliberately excludes
// full name, email, phone, and country (the assessment's own internet/
// electricity/device questions already give direct signal for
// infrastructure readiness, so a proxy like country isn't needed). Video/
// file uploads are never sent — only a boolean "was something submitted".

interface AnalysisPayload {
  occupation: string;
  hasLinkedin: boolean;
  hasGithub: boolean;
  hasPortfolio: boolean;
  hasVideo: boolean;
  answers: { sectionTitle: string; questionKey: string; label: string; answer: string }[];
}

async function buildAnalysisPayload(applicationId: string): Promise<AnalysisPayload> {
  const application = await db.application.findUniqueOrThrow({
    where: { id: applicationId },
    include: { applicant: true, responses: true },
  });

  const sections = await db.assessmentSection.findMany({
    orderBy: { order: "asc" },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  const responseByKey = new Map(application.responses.map((r) => [r.questionKey, r.value]));
  let hasVideo = false;
  const answers: AnalysisPayload["answers"] = [];

  for (const section of sections) {
    for (const question of section.questions) {
      const value = responseByKey.get(question.key);
      if (value === undefined || value === null || value === "") continue;

      if (question.fieldType === "VIDEO") {
        hasVideo = true;
        continue;
      }
      if (question.fieldType === "FILE") continue;

      const answerText = Array.isArray(value) ? value.join(", ") : String(value);
      answers.push({ sectionTitle: section.title, questionKey: question.key, label: question.label, answer: answerText });
    }
  }

  return {
    occupation: application.applicant.occupation,
    hasLinkedin: Boolean(application.applicant.linkedin),
    hasGithub: Boolean(application.applicant.github),
    hasPortfolio: Boolean(application.applicant.portfolio),
    hasVideo,
    answers,
  };
}

function formatPayloadAsPrompt(payload: AnalysisPayload): string {
  const lines: string[] = [
    `Applicant's stated occupation: ${payload.occupation}`,
    `Provided a LinkedIn profile: ${payload.hasLinkedin ? "yes" : "no"}`,
    `Provided a GitHub profile: ${payload.hasGithub ? "yes" : "no"}`,
    `Provided a portfolio site: ${payload.hasPortfolio ? "yes" : "no"}`,
    `Submitted an introduction video: ${payload.hasVideo ? "yes (content not provided to you — do not comment on it beyond noting it exists)" : "no"}`,
    "",
    "Assessment responses:",
  ];

  let currentSection = "";
  for (const a of payload.answers) {
    if (a.sectionTitle !== currentSection) {
      currentSection = a.sectionTitle;
      lines.push(`\n## ${currentSection}`);
    }
    lines.push(`Q (key: ${a.questionKey}): ${a.label}\nA: ${a.answer}`);
  }

  return lines.join("\n");
}

// ---------- Prompts ----------

const GUARDRAILS = `Never infer, mention, or let the following influence your assessment, even if suggested by writing style, word choice, or any other cue: race, ethnicity, religion, gender identity, sexual orientation, health conditions, political affiliation, family status, nationality, or socioeconomic background. Do not treat grammar, accent, or writing style as an indicator of intelligence or capability — evaluate only the clarity and completeness of the ideas expressed. Do not automatically penalize applicants for limited device access, unreliable internet or electricity, having a job, being in school, or family obligations — describe these as constraints for a human to weigh, not as disqualifying factors. A constraint noted in Infrastructure Readiness must never lower the label given for Technical Readiness, Product Thinking, or Learning Readiness — evaluate each dimension only on its own relevant evidence; someone with intermittent laptop access is not thereby less capable, ambitious, or ready to learn.`;

function buildAnalysisSystemPrompt(): string {
  return `You are the Teqxure Admissions Intelligence Assistant — an internal tool that helps Teqxure's human admissions reviewers understand applicants faster. You do NOT decide admission. You never recommend "admit," "reject," or "waitlist." You only describe evidence from what the applicant actually wrote, for a human to weigh.

Ground every conclusion in the applicant's own answers below. Never invent, assume, or infer information the applicant did not provide.

${GUARDRAILS}

Respond with ONLY a single JSON object — no markdown code fences, no commentary before or after — matching exactly this shape:

{
  "technicalReadiness": { "label": "Beginning"|"Developing"|"Intermediate"|"Strong", "reason": string, "evidence": [{"questionKey": string, "excerpt": string}] },
  "productThinking": { "label": "Emerging"|"Developing"|"Strong"|"Exceptional", "reason": string, "evidence": [...] },
  "learningReadiness": { "label": "Beginning"|"Developing"|"Intermediate"|"Strong", "reason": string, "evidence": [...] },
  "commitmentReadiness": { "availableCapacity": string, "schedulingConcerns": string[], "clarificationAreas": string[], "evidence": [...] },
  "infrastructureReadiness": { "label": "Ready"|"Potential Constraint"|"Significant Constraint"|"Insufficient Information", "reason": string, "evidence": [...] },
  "communication": { "label": "Clear"|"Developing Clarity"|"Needs Clarification"|"Insufficient Information", "reason": string, "evidence": [...] },
  "overallReadiness": { "label": "Strongly Ready"|"Ready"|"Promising — Needs Preparation"|"Needs Clarification"|"Not Yet Ready", "summary": string },
  "strengths": string[] (3 to 5 items, each traceable to a real answer),
  "potentialConcerns": string[] (neutral language — observations, not judgments),
  "reviewerAttention": string[] (specific things the admissions team may want to explore or clarify, e.g. in an interview)
}

Every "excerpt" must be a short, near-verbatim quote from the applicant's actual answer — do not paraphrase. "questionKey" must exactly match one of the "Q (key: ...)" keys given to you. "overallReadiness" is a readiness summary for a human reviewer, not an admission recommendation.`;
}

function buildPrepPlanSystemPrompt(): string {
  return `You are the Teqxure Admissions Intelligence Assistant, generating a personalized PRE-COHORT PREPARATION PLAN for an applicant who has already been accepted. Base your recommendations only on the readiness profile provided below. Recommend preparation activities the applicant can do BEFORE the cohort starts to strengthen weaker areas while building on strengths. Do NOT recommend changes to the Academy's curriculum — only personal preparation activities for this individual. Keep recommendations realistic for someone likely balancing this alongside existing work, school, or family commitments — prefer a small number of focused activities over an exhaustive list.

${GUARDRAILS}

Respond with ONLY a single JSON object — no markdown code fences — matching exactly this shape:
{
  "summary": string,
  "focusAreas": [{ "title": string, "reason": string, "recommendations": string[] }]
}`;
}

function buildAskSystemPrompt(payload: AnalysisPayload, analysisResult: unknown | null): string {
  return `You are the Teqxure Admissions Intelligence Assistant, helping an admissions reviewer understand one specific applicant. Answer ONLY using the information below. If the answer isn't contained in this information, say so plainly rather than guessing or inventing anything. You may summarize evidence and suggest what to clarify, but the admission decision belongs to the reviewer alone — never recommend admit/reject/waitlist.

If the reviewer asks you directly whether to admit, reject, or waitlist this applicant (or asks for your recommendation on the outcome), do not answer that question. Say plainly that the admission decision isn't yours to make, then offer what you *can* help with instead: the relevant evidence from their answers, their notable strengths, potential concerns, and specific questions worth exploring — so the reviewer has what they need to decide.

${GUARDRAILS}

${analysisResult ? `READINESS PROFILE ALREADY GENERATED:\n${JSON.stringify(analysisResult, null, 2)}` : "No AI readiness analysis has been generated for this applicant yet."}

RAW APPLICATION DATA:
${formatPayloadAsPrompt(payload)}`;
}

function parseJsonResponse(raw: string): unknown {
  const stripped = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(stripped);
}

// ---------- Readiness analysis job ----------

async function currentModelInfo(): Promise<{ provider: string | null; modelId: string | null }> {
  const settings = await db.aiSettings.findFirst();
  const provider = settings?.activeProvider ?? null;
  if (!provider) return { provider: null, modelId: null };
  const row = await db.aiProvider.findUnique({ where: { provider } });
  return { provider, modelId: row?.defaultModel ?? null };
}

function extractEvidenceRows(data: AnalysisResultData) {
  const rows: { dimension: string; questionKey: string | null; excerpt: string; order: number }[] = [];
  const push = (dimension: string, evidence: { questionKey?: string; excerpt: string }[]) => {
    evidence.forEach((e, i) => rows.push({ dimension, questionKey: e.questionKey ?? null, excerpt: e.excerpt, order: i }));
  };
  push("TECHNICAL_READINESS", data.technicalReadiness.evidence);
  push("PRODUCT_THINKING", data.productThinking.evidence);
  push("LEARNING_READINESS", data.learningReadiness.evidence);
  push("COMMITMENT_READINESS", data.commitmentReadiness.evidence);
  push("INFRASTRUCTURE_READINESS", data.infrastructureReadiness.evidence);
  push("COMMUNICATION", data.communication.evidence);
  return rows;
}

export async function runAiAnalysis(analysisId: string): Promise<void> {
  const analysis = await db.aiAnalysis.update({
    where: { id: analysisId },
    data: { status: "PROCESSING", startedAt: new Date() },
  });

  try {
    const payload = await buildAnalysisPayload(analysis.applicationId);
    const active = await getActiveProviderAdapter();
    if (!active.ok) {
      await db.aiAnalysis.update({
        where: { id: analysisId },
        data: { status: "FAILED", errorMessage: active.reason, completedAt: new Date() },
      });
      return;
    }

    const raw = await active.adapter.chat(
      [{ role: "user", content: formatPayloadAsPrompt(payload) }],
      buildAnalysisSystemPrompt(),
      { maxTokens: 2000, signal: AbortSignal.timeout(45_000) },
    );

    const validated = analysisResultSchema.safeParse(parseJsonResponse(raw));
    if (!validated.success) {
      await db.aiAnalysis.update({
        where: { id: analysisId },
        data: {
          status: "FAILED",
          errorMessage: `AI response did not match the expected shape: ${validated.error.message}`.slice(0, 2000),
          completedAt: new Date(),
        },
      });
      return;
    }

    const { provider, modelId } = await currentModelInfo();
    const result: AnalysisResult = {
      ...validated.data,
      videoNote: payload.hasVideo ? "Video submitted — manual review recommended." : null,
    };
    const evidenceRows = extractEvidenceRows(validated.data);

    await db.$transaction([
      db.aiAnalysis.update({
        where: { id: analysisId },
        data: {
          status: "COMPLETE",
          result: result as never,
          modelProvider: provider,
          modelId,
          promptVersion: ANALYSIS_PROMPT_VERSION,
          completedAt: new Date(),
        },
      }),
      db.aiAnalysisEvidence.createMany({ data: evidenceRows.map((e) => ({ ...e, analysisId })) }),
    ]);
  } catch (error) {
    await db.aiAnalysis
      .update({
        where: { id: analysisId },
        data: {
          status: "FAILED",
          errorMessage: error instanceof Error ? error.message.slice(0, 2000) : "Unknown error",
          completedAt: new Date(),
        },
      })
      .catch(() => undefined);
  }
}

/**
 * Never throws — callers (including the applicant-facing completion flow)
 * must always get a response back regardless of what goes wrong here. A
 * P2002 from the @@unique([applicationId, version]) constraint means a
 * concurrent call already won the race (double-click, retry racing the
 * original auto-trigger, etc.) and is treated as a benign no-op, not an error.
 */
export async function scheduleAiAnalysis(
  applicationId: string,
  requestedBy: string | null,
): Promise<{ scheduled: boolean; reason?: string }> {
  try {
    const application = await db.application.findUnique({ where: { id: applicationId } });
    if (!application?.assessmentCompletedAt) {
      return { scheduled: false, reason: "The applicant hasn't completed their assessment yet." };
    }

    await reapStaleAiAnalysis(applicationId);

    const inFlight = await db.aiAnalysis.findFirst({
      where: { applicationId, status: { in: ["PENDING", "PROCESSING"] } },
    });
    if (inFlight) {
      return { scheduled: false, reason: "An analysis is already in progress for this application." };
    }

    const lastVersion = await db.aiAnalysis.findFirst({
      where: { applicationId },
      orderBy: { version: "desc" },
      select: { version: true },
    });
    const version = (lastVersion?.version ?? 0) + 1;

    const created = await db.aiAnalysis.create({
      data: { applicationId, version, status: "PENDING", requestedBy: requestedBy ?? undefined },
    });

    after(() => runAiAnalysis(created.id));

    return { scheduled: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { scheduled: false, reason: "An analysis is already in progress for this application." };
    }
    console.error("scheduleAiAnalysis failed:", error);
    return { scheduled: false, reason: "Couldn't schedule the AI analysis right now." };
  }
}

// ---------- Preparation plan job ----------

function formatAnalysisAsPrepInput(result: AnalysisResult): string {
  return `Readiness profile for an ACCEPTED applicant:\n${JSON.stringify(result, null, 2)}`;
}

export async function runPreparationPlan(planId: string): Promise<void> {
  const plan = await db.preparationPlan.update({
    where: { id: planId },
    data: { status: "PROCESSING", startedAt: new Date() },
  });

  try {
    const analysis = await db.aiAnalysis.findFirst({
      where: { applicationId: plan.applicationId, status: "COMPLETE" },
      orderBy: { version: "desc" },
    });
    if (!analysis?.result) {
      await db.preparationPlan.update({
        where: { id: planId },
        data: {
          status: "FAILED",
          errorMessage: "No completed readiness analysis exists to base a plan on yet.",
          completedAt: new Date(),
        },
      });
      return;
    }

    const active = await getActiveProviderAdapter();
    if (!active.ok) {
      await db.preparationPlan.update({
        where: { id: planId },
        data: { status: "FAILED", errorMessage: active.reason, completedAt: new Date() },
      });
      return;
    }

    const raw = await active.adapter.chat(
      [{ role: "user", content: formatAnalysisAsPrepInput(analysis.result as AnalysisResult) }],
      buildPrepPlanSystemPrompt(),
      { maxTokens: 1500, signal: AbortSignal.timeout(45_000) },
    );

    const validated = preparationPlanResultSchema.safeParse(parseJsonResponse(raw));
    if (!validated.success) {
      await db.preparationPlan.update({
        where: { id: planId },
        data: {
          status: "FAILED",
          errorMessage: `AI response did not match the expected shape: ${validated.error.message}`.slice(0, 2000),
          completedAt: new Date(),
        },
      });
      return;
    }

    const { provider, modelId } = await currentModelInfo();
    await db.preparationPlan.update({
      where: { id: planId },
      data: {
        status: "COMPLETE",
        result: validated.data as never,
        basedOnAnalysisId: analysis.id,
        modelProvider: provider,
        modelId,
        completedAt: new Date(),
      },
    });
  } catch (error) {
    await db.preparationPlan
      .update({
        where: { id: planId },
        data: {
          status: "FAILED",
          errorMessage: error instanceof Error ? error.message.slice(0, 2000) : "Unknown error",
          completedAt: new Date(),
        },
      })
      .catch(() => undefined);
  }
}

/** Never throws — see scheduleAiAnalysis above for why. */
export async function schedulePreparationPlan(
  applicationId: string,
  requestedBy: string | null,
): Promise<{ scheduled: boolean; reason?: string }> {
  try {
    const application = await db.application.findUnique({ where: { id: applicationId } });
    if (!application || application.status !== "ACCEPTED") {
      return { scheduled: false, reason: "Preparation plans can only be generated for accepted applicants." };
    }

    await reapStalePreparationPlan(applicationId);

    const inFlight = await db.preparationPlan.findFirst({
      where: { applicationId, status: { in: ["PENDING", "PROCESSING"] } },
    });
    if (inFlight) {
      return { scheduled: false, reason: "A preparation plan is already being generated." };
    }

    const hasCompleteAnalysis = await db.aiAnalysis.findFirst({ where: { applicationId, status: "COMPLETE" } });
    if (!hasCompleteAnalysis) {
      return { scheduled: false, reason: "No completed readiness analysis exists yet — run the readiness analysis first." };
    }

    const lastVersion = await db.preparationPlan.findFirst({
      where: { applicationId },
      orderBy: { version: "desc" },
      select: { version: true },
    });
    const version = (lastVersion?.version ?? 0) + 1;

    const created = await db.preparationPlan.create({
      data: { applicationId, version, status: "PENDING", requestedBy: requestedBy ?? undefined },
    });

    after(() => runPreparationPlan(created.id));

    return { scheduled: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { scheduled: false, reason: "A preparation plan is already being generated." };
    }
    console.error("schedulePreparationPlan failed:", error);
    return { scheduled: false, reason: "Couldn't schedule the preparation plan right now." };
  }
}

// ---------- Ask Teqxure AI about this applicant (stateless) ----------

export interface AskTurn {
  question: string;
  answer: string;
}

export async function askAboutApplicant(
  applicationId: string,
  question: string,
  priorTurns: AskTurn[],
): Promise<{ answer: string } | { error: string }> {
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion) return { error: "Ask a question first." };

  const [analysis, payload, active] = await Promise.all([
    db.aiAnalysis.findFirst({ where: { applicationId, status: "COMPLETE" }, orderBy: { version: "desc" } }),
    buildAnalysisPayload(applicationId),
    getActiveProviderAdapter(),
  ]);

  if (!active.ok) return { error: active.reason };

  const messages: ChatMessage[] = [];
  for (const turn of priorTurns.slice(-6)) {
    messages.push({ role: "user", content: turn.question });
    messages.push({ role: "assistant", content: turn.answer });
  }
  messages.push({ role: "user", content: trimmedQuestion });

  try {
    const answer = await active.adapter.chat(messages, buildAskSystemPrompt(payload, analysis?.result ?? null), {
      maxTokens: 800,
      signal: AbortSignal.timeout(30_000),
    });
    return { answer: answer.trim() || "(no response)" };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Something went wrong asking Teqxure AI." };
  }
}
