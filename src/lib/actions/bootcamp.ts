"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { notifyUser } from "@/lib/notifications";

const STAFF_ROLES = ["SUPER_ADMIN", "PROGRAM_MANAGER"] as const;

export interface ActionState {
  error?: string;
}

const bootcampSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
});

export async function createBootcampAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireRole(...STAFF_ROLES);
  const parsed = bootcampSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    status: formData.get("status"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const existing = await db.bootcamp.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A bootcamp with that slug already exists." };

  const bootcamp = await db.bootcamp.create({ data: parsed.data });
  await logActivity({ userId: user.id, action: "created", entityType: "Bootcamp", entityId: bootcamp.id });
  revalidatePath("/platform/manage/bootcamps");
  redirect(`/platform/manage/bootcamps/${bootcamp.id}`);
}

export async function updateBootcampAction(bootcampId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireRole(...STAFF_ROLES);
  const parsed = bootcampSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    status: formData.get("status"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const existing = await db.bootcamp.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== bootcampId) return { error: "A bootcamp with that slug already exists." };

  await db.bootcamp.update({ where: { id: bootcampId }, data: parsed.data });
  await logActivity({ userId: user.id, action: "updated", entityType: "Bootcamp", entityId: bootcampId });
  revalidatePath(`/platform/manage/bootcamps/${bootcampId}`);
  return {};
}

const weekSchema = z.object({
  weekNumber: z.coerce.number().int().min(1),
  title: z.string().min(1),
  objectives: z.string().min(1),
});

export async function createWeekAction(bootcampId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireRole(...STAFF_ROLES);
  const parsed = weekSchema.safeParse({
    weekNumber: formData.get("weekNumber"),
    title: formData.get("title"),
    objectives: formData.get("objectives"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const existing = await db.platformWeek.findUnique({
    where: { bootcampId_weekNumber: { bootcampId, weekNumber: parsed.data.weekNumber } },
  });
  if (existing) return { error: `Week ${parsed.data.weekNumber} already exists for this bootcamp.` };

  const count = await db.platformWeek.count({ where: { bootcampId } });
  await db.platformWeek.create({ data: { ...parsed.data, bootcampId, order: count } });
  await logActivity({ userId: user.id, action: "created", entityType: "PlatformWeek" });
  revalidatePath(`/platform/manage/bootcamps/${bootcampId}`);
  return {};
}

export async function updateWeekAction(weekId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireRole(...STAFF_ROLES);
  const parsed = weekSchema.safeParse({
    weekNumber: formData.get("weekNumber"),
    title: formData.get("title"),
    objectives: formData.get("objectives"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const week = await db.platformWeek.update({ where: { id: weekId }, data: parsed.data });
  await logActivity({ userId: user.id, action: "updated", entityType: "PlatformWeek", entityId: weekId });
  revalidatePath(`/platform/manage/bootcamps/${week.bootcampId}`);
  return {};
}

export async function deleteWeekAction(weekId: string): Promise<void> {
  const user = await requireRole(...STAFF_ROLES);
  const week = await db.platformWeek.delete({ where: { id: weekId } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "PlatformWeek", entityId: weekId });
  revalidatePath(`/platform/manage/bootcamps/${week.bootcampId}`);
}

const cohortSchema = z.object({
  bootcampId: z.string().min(1),
  name: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  status: z.enum(["UPCOMING", "ACTIVE", "COMPLETED"]),
});

export async function createCohortAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireRole(...STAFF_ROLES);
  const endDateRaw = formData.get("endDate");
  const parsed = cohortSchema.safeParse({
    bootcampId: formData.get("bootcampId"),
    name: formData.get("name"),
    startDate: formData.get("startDate"),
    endDate: endDateRaw ? endDateRaw : null,
    status: formData.get("status"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const cohort = await db.cohort.create({ data: parsed.data });

  // Every cohort gets the standard community channels out of the box.
  const channels = [
    { key: "general", name: "General" },
    { key: "questions", name: "Questions" },
    { key: "architecture", name: "Architecture" },
    { key: "showcase", name: "Showcase" },
    { key: "help", name: "Help" },
    { key: "announcements", name: "Announcements" },
  ];
  await db.communityChannel.createMany({
    data: channels.map((c, i) => ({ cohortId: cohort.id, key: c.key, name: c.name, order: i })),
  });

  await logActivity({ userId: user.id, action: "created", entityType: "Cohort", entityId: cohort.id });
  revalidatePath("/platform/manage/cohorts");
  redirect(`/platform/manage/cohorts/${cohort.id}`);
}

export async function updateCohortAction(cohortId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireRole(...STAFF_ROLES);
  const endDateRaw = formData.get("endDate");
  const parsed = cohortSchema.safeParse({
    bootcampId: formData.get("bootcampId"),
    name: formData.get("name"),
    startDate: formData.get("startDate"),
    endDate: endDateRaw ? endDateRaw : null,
    status: formData.get("status"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  await db.cohort.update({ where: { id: cohortId }, data: parsed.data });
  await logActivity({ userId: user.id, action: "updated", entityType: "Cohort", entityId: cohortId });
  revalidatePath(`/platform/manage/cohorts/${cohortId}`);
  return {};
}

export async function enrollStudentAction(cohortId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireRole(...STAFF_ROLES);
  const email = String(formData.get("email") ?? "").trim();
  const student = await db.user.findUnique({ where: { email } });
  if (!student) return { error: "No user with that email — invite them first from Users." };
  if (student.role !== "STUDENT") return { error: "That user isn't a Student." };

  const existing = await db.cohortEnrollment.findUnique({
    where: { cohortId_studentId: { cohortId, studentId: student.id } },
  });
  if (existing) return { error: "That student is already enrolled in this cohort." };

  const cohort = await db.cohort.findUnique({ where: { id: cohortId } });
  await db.cohortEnrollment.create({ data: { cohortId, studentId: student.id } });
  await logActivity({ userId: admin.id, action: "created", entityType: "CohortEnrollment" });
  await notifyUser({
    userId: student.id,
    type: "COHORT_ASSIGNED",
    title: `You've been assigned to ${cohort?.name ?? "a cohort"}`,
    body: "Head to your dashboard to see this week's objectives and sprint.",
    actionLabel: "Go to dashboard",
    actionUrl: "/platform/dashboard",
  });
  revalidatePath(`/platform/manage/cohorts/${cohortId}`);
  return {};
}

export async function updateEnrollmentAction(
  enrollmentId: string,
  data: { status?: string; paymentStatus?: string },
): Promise<void> {
  const admin = await requireRole(...STAFF_ROLES);
  const enrollment = await db.cohortEnrollment.update({ where: { id: enrollmentId }, data, include: { student: true } });
  await logActivity({ userId: admin.id, action: "updated", entityType: "CohortEnrollment", entityId: enrollmentId });

  if (data.paymentStatus === "VERIFIED") {
    await notifyUser({
      userId: enrollment.studentId,
      type: "PAYMENT_CONFIRMED",
      title: "Your payment has been confirmed",
      body: "You're all set — your cohort access is fully active.",
      actionLabel: "Go to dashboard",
      actionUrl: "/platform/dashboard",
    });
  }

  revalidatePath(`/platform/manage/cohorts/${enrollment.cohortId}`);
  revalidatePath("/platform/manage/payments");
}

export async function assignStaffAction(cohortId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireRole(...STAFF_ROLES);
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "");
  if (!["INSTRUCTOR", "MENTOR", "REVIEWER"].includes(role)) return { error: "Invalid staff role." };

  const staffUser = await db.user.findUnique({ where: { email } });
  if (!staffUser) return { error: "No user with that email — invite them first from Users." };

  const existing = await db.cohortStaffAssignment.findUnique({
    where: { cohortId_userId_role: { cohortId, userId: staffUser.id, role } },
  });
  if (existing) return { error: "That person already has this role on this cohort." };

  await db.cohortStaffAssignment.create({ data: { cohortId, userId: staffUser.id, role } });
  await logActivity({ userId: admin.id, action: "created", entityType: "CohortStaffAssignment" });
  revalidatePath(`/platform/manage/cohorts/${cohortId}`);
  return {};
}

export async function removeStaffAssignmentAction(assignmentId: string): Promise<void> {
  const admin = await requireRole(...STAFF_ROLES);
  const assignment = await db.cohortStaffAssignment.delete({ where: { id: assignmentId } });
  await logActivity({ userId: admin.id, action: "deleted", entityType: "CohortStaffAssignment", entityId: assignmentId });
  revalidatePath(`/platform/manage/cohorts/${assignment.cohortId}`);
}
