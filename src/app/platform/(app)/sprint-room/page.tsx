import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getRelevantCohorts } from "@/lib/platform";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";

const STATUS_LABEL: Record<string, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  NEEDS_REVISION: "Needs revision",
  APPROVED: "Approved",
  COMPLETED: "Completed",
};

export default async function SprintRoomIndexPage() {
  const user = await getCurrentUser();
  const cohorts = await getRelevantCohorts(user!.id, user!.role);
  const cohortIds = cohorts.map((c) => c.id);

  const sprints = await db.sprint.findMany({
    where: { cohortId: { in: cohortIds } },
    include: {
      week: true,
      cohort: true,
      submissions: user!.role === "STUDENT" ? { where: { studentId: user!.id } } : { select: { id: true, status: true } },
    },
    orderBy: [{ cohortId: "asc" }, { week: { weekNumber: "asc" } }],
  });

  return (
    <div>
      <PageHeader title="Sprint Room" description="Every sprint you're responsible for, across your cohort." />
      {sprints.length === 0 ? (
        <p className="text-sm text-slate">No sprints released yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sprints.map((sprint) => {
            const mine = user!.role === "STUDENT" ? sprint.submissions[0] : undefined;
            const submittedCount = sprint.submissions.filter((s) => s.status !== "NOT_STARTED" && s.status !== "IN_PROGRESS").length;

            return (
              <Link
                key={sprint.id}
                href={`/sprint-room/${sprint.id}`}
                className="flex items-center justify-between rounded-2xl border border-light-gray bg-white p-5 shadow-sm transition-colors hover:border-blue"
              >
                <div>
                  <p className="text-sm font-medium text-graphite">
                    Week {sprint.week.weekNumber} — {sprint.goal}
                  </p>
                  <p className="mt-0.5 text-xs text-slate">{sprint.cohort.name}</p>
                </div>
                <span className="rounded-full bg-soft-white px-2 py-0.5 text-xs text-slate">
                  {user!.role === "STUDENT" ? STATUS_LABEL[mine?.status ?? "NOT_STARTED"] : `${submittedCount} submitted`}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
