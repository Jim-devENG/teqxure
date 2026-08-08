import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdmissionCohortsPage() {
  const cohorts = await db.admissionCohort.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Admission Cohorts"
        description="Application cycles — each one controls what /apply routes new applicants into."
        action={
          <Link
            href="/applications/cohorts/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New cohort
          </Link>
        }
      />

      {cohorts.length === 0 ? (
        <p className="text-sm text-slate">No cohorts yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-light-gray bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-light-gray text-xs uppercase tracking-wide text-slate">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Applications open</th>
                <th className="px-4 py-3 font-medium">Applications close</th>
                <th className="px-4 py-3 font-medium">Capacity</th>
                <th className="px-4 py-3 font-medium">Applicants</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map((cohort) => (
                <tr key={cohort.id} className="border-b border-light-gray last:border-0 hover:bg-soft-white/60">
                  <td className="px-4 py-3">
                    <Link href={`/applications/cohorts/${cohort.id}`} className="text-graphite hover:text-blue">
                      {cohort.name}
                    </Link>
                    <p className="font-mono text-xs text-slate">{cohort.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-slate">{cohort.applicationsOpenAt.toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate">
                    {cohort.applicationsCloseAt ? cohort.applicationsCloseAt.toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate">{cohort.capacity ?? "—"}</td>
                  <td className="px-4 py-3 text-slate">{cohort._count.applications}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={cohort.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
