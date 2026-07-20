import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { SprintForm } from "@/components/platform/manage/SprintForm";

export default async function ManageSprintPage({ params }: { params: Promise<{ id: string; weekId: string }> }) {
  const { id, weekId } = await params;

  const [week, sprint] = await Promise.all([
    db.platformWeek.findUnique({ where: { id: weekId } }),
    db.sprint.findUnique({
      where: { weekId_cohortId: { weekId, cohortId: id } },
      include: { submissions: { include: { student: true }, orderBy: { submittedAt: "desc" } } },
    }),
  ]);
  if (!week) notFound();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <PageHeader title={`Week ${week.weekNumber} sprint`} description={week.title} />
        <SprintForm weekId={weekId} cohortId={id} sprint={sprint ?? undefined} />
      </div>

      {sprint && (
        <div>
          <h2 className="mb-4 text-sm font-medium text-graphite">Submissions</h2>
          {sprint.submissions.length === 0 ? (
            <p className="text-sm text-slate">No submissions yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {sprint.submissions.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/platform/manage/submissions/${sub.id}`}
                  className="flex items-center justify-between rounded-xl border border-light-gray bg-white px-4 py-3 transition-colors hover:border-blue"
                >
                  <p className="text-sm text-graphite">{sub.student.name ?? sub.student.email}</p>
                  <span className="text-xs text-slate">{sub.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
