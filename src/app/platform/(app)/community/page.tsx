import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getRelevantCohorts } from "@/lib/platform";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function CommunityIndexPage() {
  const user = await getCurrentUser();
  const cohorts = await getRelevantCohorts(user!.id, user!.role);

  if (cohorts.length === 0) {
    return (
      <div>
        <PageHeader title="Community" />
        <p className="text-sm text-slate">No cohort community to show yet.</p>
      </div>
    );
  }

  if (cohorts.length === 1) {
    redirect(`/platform/community/${cohorts[0].id}/general`);
  }

  return (
    <div>
      <PageHeader title="Community" description="Choose a cohort." />
      <div className="flex flex-col gap-3">
        {cohorts.map((c) => (
          <Link
            key={c.id}
            href={`/platform/community/${c.id}/general`}
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
