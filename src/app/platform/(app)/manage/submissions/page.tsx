import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function ManageSubmissionsPage() {
  const submissions = await db.sprintSubmission.findMany({
    where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    include: { student: true, sprint: { include: { week: true, cohort: true } } },
    orderBy: { submittedAt: "asc" },
  });

  return (
    <div>
      <PageHeader title="Submissions review" description="Everything waiting on a reviewer, across every cohort." />
      {submissions.length === 0 ? (
        <p className="text-sm text-slate">Nothing waiting on review.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {submissions.map((s) => (
            <Link
              key={s.id}
              href={`/platform/sprint-room/${s.sprintId}`}
              className="flex items-center justify-between rounded-2xl border border-light-gray bg-white p-5 shadow-sm transition-colors hover:border-blue"
            >
              <div>
                <p className="text-sm font-medium text-graphite">{s.student.name ?? s.student.email}</p>
                <p className="mt-0.5 text-xs text-slate">
                  {s.sprint.cohort.name} · Week {s.sprint.week.weekNumber} — {s.sprint.goal}
                </p>
              </div>
              <span className="rounded-full bg-soft-white px-2 py-0.5 text-xs text-slate">{s.status.replace("_", " ")}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
