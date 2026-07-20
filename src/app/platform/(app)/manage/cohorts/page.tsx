import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function ManageCohortsPage() {
  const cohorts = await db.cohort.findMany({
    orderBy: { startDate: "desc" },
    include: { bootcamp: true, _count: { select: { enrollments: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Cohorts"
        description="Timed runs of a bootcamp — enroll students, assign staff, and release sprints per cohort."
        action={
          <Link
            href="/platform/manage/cohorts/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New cohort
          </Link>
        }
      />

      {cohorts.length === 0 ? (
        <p className="text-sm text-slate">No cohorts yet — create a bootcamp first, then start a cohort.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {cohorts.map((c) => (
            <Link
              key={c.id}
              href={`/platform/manage/cohorts/${c.id}`}
              className="flex items-center justify-between rounded-2xl border border-light-gray bg-white p-5 shadow-sm transition-colors hover:border-blue"
            >
              <div>
                <p className="text-sm font-medium text-graphite">{c.name}</p>
                <p className="mt-0.5 text-xs text-slate">
                  {c.bootcamp.title} · {c._count.enrollments} student{c._count.enrollments === 1 ? "" : "s"} ·{" "}
                  starts {c.startDate.toLocaleDateString()}
                </p>
              </div>
              <span className="rounded-full bg-soft-white px-2 py-0.5 text-xs text-slate">{c.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
