import "server-only";
import { db } from "@/lib/db";

/** The cohort a student is currently active in — students are assumed to be in one cohort at a time. */
export async function getStudentCohort(studentId: string) {
  const enrollment = await db.cohortEnrollment.findFirst({
    where: { studentId, status: "ACTIVE" },
    orderBy: { enrolledAt: "desc" },
    include: { cohort: { include: { bootcamp: true } } },
  });
  return enrollment?.cohort ?? null;
}

/** Cohorts a staff member (instructor/mentor/reviewer) is assigned to. */
export async function getStaffCohorts(userId: string) {
  const assignments = await db.cohortStaffAssignment.findMany({
    where: { userId },
    include: { cohort: { include: { bootcamp: true } } },
  });
  const seen = new Set<string>();
  return assignments
    .map((a) => a.cohort)
    .filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true)));
}

/** Every cohort — used for Super Admin / Program Manager who oversee the whole program. */
export async function getAllCohorts() {
  return db.cohort.findMany({ include: { bootcamp: true }, orderBy: { startDate: "desc" } });
}

/** Resolves the relevant cohort(s) for whichever role is looking, for Bootcamp/Sprint Room views. */
export async function getRelevantCohorts(userId: string, role: string) {
  if (role === "STUDENT") {
    const cohort = await getStudentCohort(userId);
    return cohort ? [cohort] : [];
  }
  if (role === "SUPER_ADMIN" || role === "PROGRAM_MANAGER") {
    return getAllCohorts();
  }
  return getStaffCohorts(userId);
}

/** Whether a user may read/post in a given cohort's community channels or DMs about it. */
export async function canAccessCohort(userId: string, role: string, cohortId: string): Promise<boolean> {
  if (role === "SUPER_ADMIN" || role === "PROGRAM_MANAGER") return true;
  if (role === "STUDENT") {
    const enrollment = await db.cohortEnrollment.findUnique({ where: { cohortId_studentId: { cohortId, studentId: userId } } });
    return !!enrollment;
  }
  const assignment = await db.cohortStaffAssignment.findFirst({ where: { cohortId, userId } });
  return !!assignment;
}
