import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function ManageBootcampsPage() {
  const bootcamps = await db.bootcamp.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { weeks: true, cohorts: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Bootcamps"
        description="Curriculum containers — weeks, objectives, and the resources shared across every cohort that runs them."
        action={
          <Link
            href="/platform/manage/bootcamps/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New bootcamp
          </Link>
        }
      />

      {bootcamps.length === 0 ? (
        <p className="text-sm text-slate">No bootcamps yet — create the first one.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {bootcamps.map((b) => (
            <Link
              key={b.id}
              href={`/platform/manage/bootcamps/${b.id}`}
              className="flex items-center justify-between rounded-2xl border border-light-gray bg-white p-5 shadow-sm transition-colors hover:border-blue"
            >
              <div>
                <p className="text-sm font-medium text-graphite">{b.title}</p>
                <p className="mt-0.5 text-xs text-slate">
                  {b._count.weeks} week{b._count.weeks === 1 ? "" : "s"} · {b._count.cohorts} cohort
                  {b._count.cohorts === 1 ? "" : "s"}
                </p>
              </div>
              <span className="rounded-full bg-soft-white px-2 py-0.5 text-xs text-slate">{b.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
