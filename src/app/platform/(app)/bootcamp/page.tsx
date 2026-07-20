import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getRelevantCohorts } from "@/lib/platform";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function BootcampIndexPage() {
  const user = await getCurrentUser();
  const cohorts = await getRelevantCohorts(user!.id, user!.role);

  if (cohorts.length === 0) {
    return (
      <div>
        <PageHeader title="Bootcamp" />
        <p className="text-sm text-slate">
          {user!.role === "STUDENT"
            ? "You're not enrolled in a cohort yet — reach out to your program manager."
            : "You're not assigned to any cohort yet."}
        </p>
      </div>
    );
  }

  if (cohorts.length === 1) {
    redirect(`/bootcamp/${cohorts[0].id}`);
  }

  return (
    <div>
      <PageHeader title="Bootcamp" description="Choose a cohort to view its curriculum." />
      <div className="flex flex-col gap-3">
        {cohorts.map((c) => (
          <Link
            key={c.id}
            href={`/bootcamp/${c.id}`}
            className="flex items-center justify-between rounded-2xl border border-light-gray bg-white p-5 shadow-sm transition-colors hover:border-blue"
          >
            <p className="text-sm font-medium text-graphite">{c.name}</p>
            <span className="text-xs text-slate">{c.bootcamp.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
