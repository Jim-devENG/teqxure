import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
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

export default async function CohortBootcampPage({ params }: { params: Promise<{ cohortId: string }> }) {
  const { cohortId } = await params;
  const user = await getCurrentUser();

  const cohort = await db.cohort.findUnique({
    where: { id: cohortId },
    include: {
      bootcamp: {
        include: {
          weeks: {
            orderBy: { weekNumber: "asc" },
            include: {
              sprints: { where: { cohortId }, include: { submissions: { where: { studentId: user!.id } } } },
              liveSessions: { where: { cohortId }, orderBy: { startsAt: "asc" } },
            },
          },
        },
      },
    },
  });
  if (!cohort) notFound();

  return (
    <div>
      <PageHeader title={cohort.name} description={cohort.bootcamp.title} />
      <div className="flex flex-col gap-3">
        {cohort.bootcamp.weeks.map((week) => {
          const sprint = week.sprints[0];
          const submission = sprint?.submissions[0];
          const session = week.liveSessions[0];

          return (
            <Link
              key={week.id}
              href={`/platform/bootcamp/${cohortId}/${week.id}`}
              className="flex items-center justify-between rounded-2xl border border-light-gray bg-white p-5 shadow-sm transition-colors hover:border-blue"
            >
              <div>
                <p className="text-sm font-medium text-graphite">
                  Week {week.weekNumber} — {week.title}
                </p>
                <p className="mt-1 text-xs text-slate">
                  {session ? `Live session ${session.startsAt.toLocaleString()}` : "No live session scheduled"}
                </p>
              </div>
              {sprint && (
                <span className="rounded-full bg-soft-white px-2 py-0.5 text-xs text-slate">
                  {STATUS_LABEL[submission?.status ?? "NOT_STARTED"]}
                </span>
              )}
            </Link>
          );
        })}
        {cohort.bootcamp.weeks.length === 0 && <p className="text-sm text-slate">No weeks published yet.</p>}
      </div>
    </div>
  );
}
