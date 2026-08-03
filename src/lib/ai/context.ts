import "server-only";
import { db } from "@/lib/db";
import { getStudentCohort } from "@/lib/platform";

/** A short, freshly-computed blurb about where a student is in the program, appended to the system prompt per-request. */
export async function getStudentAiContext(studentId: string): Promise<string> {
  const cohort = await getStudentCohort(studentId);
  if (!cohort) {
    return "This user is not currently enrolled in an active cohort.";
  }

  const submission = await db.sprintSubmission.findFirst({
    where: { studentId, sprint: { cohortId: cohort.id } },
    orderBy: { updatedAt: "desc" },
    include: { sprint: { include: { week: true } } },
  });

  const base = `Student is enrolled in ${cohort.bootcamp.title} — ${cohort.name}.`;
  if (!submission) {
    return `${base} They have not started a sprint yet.`;
  }

  return `${base} Most recent sprint: Week ${submission.sprint.week.weekNumber} — ${submission.sprint.goal} (status: ${submission.status}).`;
}
