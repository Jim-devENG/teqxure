"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { notifyCohortStudents, notifyUser } from "@/lib/notifications";

const STAFF_ROLES = ["SUPER_ADMIN", "PROGRAM_MANAGER", "INSTRUCTOR"] as const;
const REVIEW_ROLES = ["SUPER_ADMIN", "PROGRAM_MANAGER", "INSTRUCTOR", "MENTOR", "REVIEWER"] as const;

export interface ActionState {
  error?: string;
}

const sprintSchema = z.object({
  goal: z.string().min(1),
  description: z.string().min(1),
  deliverables: z.string().min(1),
  referenceMaterials: z.string().optional(),
  architectureNotes: z.string().optional(),
  dueAt: z.coerce.date().optional().nullable(),
});

export async function upsertSprintAction(
  weekId: string,
  cohortId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireRole(...STAFF_ROLES);
  const dueAtRaw = formData.get("dueAt");
  const parsed = sprintSchema.safeParse({
    goal: formData.get("goal"),
    description: formData.get("description"),
    deliverables: formData.get("deliverables"),
    referenceMaterials: formData.get("referenceMaterials") || undefined,
    architectureNotes: formData.get("architectureNotes") || undefined,
    dueAt: dueAtRaw ? dueAtRaw : null,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const existing = await db.sprint.findUnique({ where: { weekId_cohortId: { weekId, cohortId } } });

  const sprint = await db.sprint.upsert({
    where: { weekId_cohortId: { weekId, cohortId } },
    update: parsed.data,
    create: { ...parsed.data, weekId, cohortId },
  });

  await logActivity({
    userId: user.id,
    action: existing ? "updated" : "created",
    entityType: "Sprint",
    entityId: sprint.id,
  });

  if (!existing) {
    await notifyCohortStudents(cohortId, {
      type: "SPRINT_RELEASED",
      title: `New sprint: ${sprint.goal}`,
      body: sprint.description,
      actionLabel: "Open Sprint Room",
      actionUrl: `/platform/sprint-room/${sprint.id}`,
    });
  }

  revalidatePath(`/platform/manage/cohorts/${cohortId}`);
  revalidatePath(`/platform/sprint-room/${sprint.id}`);
  return {};
}

const submissionSchema = z.object({
  content: z.string().optional(),
  submissionUrl: z.string().url().optional().or(z.literal("")),
});

export async function submitSprintAction(sprintId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const student = await requireRole("STUDENT");
  const parsed = submissionSchema.safeParse({
    content: formData.get("content") || undefined,
    submissionUrl: formData.get("submissionUrl") || "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const sprint = await db.sprint.findUnique({ where: { id: sprintId } });
  if (!sprint) return { error: "Sprint not found." };

  await db.sprintSubmission.upsert({
    where: { sprintId_studentId: { sprintId, studentId: student.id } },
    update: {
      content: parsed.data.content,
      submissionUrl: parsed.data.submissionUrl || null,
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
    create: {
      sprintId,
      studentId: student.id,
      content: parsed.data.content,
      submissionUrl: parsed.data.submissionUrl || null,
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });

  await logActivity({ userId: student.id, action: "created", entityType: "SprintSubmission" });

  const staff = await db.cohortStaffAssignment.findMany({
    where: { cohortId: sprint.cohortId, role: { in: ["MENTOR", "REVIEWER", "INSTRUCTOR"] } },
    select: { userId: true },
  });
  await Promise.all(
    staff.map((s) =>
      notifyUser({
        userId: s.userId,
        type: "SUBMISSION_RECEIVED",
        title: `Submission received: ${sprint.goal}`,
        body: `${student.name ?? student.email} submitted their sprint deliverable.`,
        actionLabel: "Review submission",
        actionUrl: `/platform/sprint-room/${sprintId}`,
      }),
    ),
  );

  revalidatePath(`/platform/sprint-room/${sprintId}`);
  return {};
}

export async function startSprintAction(sprintId: string): Promise<void> {
  const student = await requireRole("STUDENT");
  await db.sprintSubmission.upsert({
    where: { sprintId_studentId: { sprintId, studentId: student.id } },
    update: {},
    create: { sprintId, studentId: student.id, status: "IN_PROGRESS" },
  });
  revalidatePath(`/platform/sprint-room/${sprintId}`);
}

const reviewSchema = z.object({
  status: z.enum(["APPROVED", "SUBMISSION_NEEDS_REVISION", "UNDER_REVIEW"]),
  feedback: z.string().optional(),
});

export async function reviewSubmissionAction(
  submissionId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const reviewer = await requireRole(...REVIEW_ROLES);
  const parsed = reviewSchema.safeParse({
    status: formData.get("status"),
    feedback: formData.get("feedback") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const dbStatus = parsed.data.status === "SUBMISSION_NEEDS_REVISION" ? "NEEDS_REVISION" : parsed.data.status;

  const submission = await db.sprintSubmission.update({
    where: { id: submissionId },
    data: {
      status: dbStatus,
      feedback: parsed.data.feedback,
      reviewedById: reviewer.id,
      reviewedAt: new Date(),
    },
    include: { sprint: true },
  });

  await logActivity({ userId: reviewer.id, action: "updated", entityType: "SprintSubmission", entityId: submissionId });

  const notifType =
    parsed.data.status === "APPROVED"
      ? "SUBMISSION_APPROVED"
      : parsed.data.status === "SUBMISSION_NEEDS_REVISION"
        ? "SUBMISSION_NEEDS_REVISION"
        : "FEEDBACK_RECEIVED";

  await notifyUser({
    userId: submission.studentId,
    type: notifType,
    title: `Feedback on: ${submission.sprint.goal}`,
    body: parsed.data.feedback || "Your mentor left feedback on your submission.",
    actionLabel: "View feedback",
    actionUrl: `/platform/sprint-room/${submission.sprintId}`,
  });

  revalidatePath(`/platform/sprint-room/${submission.sprintId}`);
  return {};
}
