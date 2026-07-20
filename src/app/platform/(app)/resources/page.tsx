import { getCurrentUser } from "@/lib/auth";
import { getRelevantCohorts } from "@/lib/platform";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";

function typeLabel(type: string): string {
  return type
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function ResourcesPage() {
  const user = await getCurrentUser();
  const cohorts = await getRelevantCohorts(user!.id, user!.role);
  const bootcampIds = [...new Set(cohorts.map((c) => c.bootcampId))];

  const resources = await db.resource.findMany({
    where: { bootcampId: { in: bootcampIds }, visible: true },
    include: { week: true },
    orderBy: [{ weekId: "asc" }, { order: "asc" }],
  });

  const bootcampWide = resources.filter((r) => !r.weekId);
  const perWeek = resources.filter((r) => r.weekId);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Resources" description="Engineering notes, slides, repos, and reference material for your bootcamp." />

      {resources.length === 0 ? (
        <p className="text-sm text-slate">No resources published yet.</p>
      ) : (
        <>
          {bootcampWide.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-graphite">Bootcamp-wide</h2>
              <ResourceGrid resources={bootcampWide} />
            </section>
          )}
          {perWeek.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-graphite">By week</h2>
              <ResourceGrid resources={perWeek} showWeek />
            </section>
          )}
        </>
      )}
    </div>
  );
}

function ResourceGrid({
  resources,
  showWeek,
}: {
  resources: { id: string; title: string; type: string; url: string; week: { weekNumber: number } | null }[];
  showWeek?: boolean;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {resources.map((r) => (
        <li key={r.id}>
          <a
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-light-gray bg-white px-4 py-3 text-sm text-graphite shadow-sm transition-colors hover:border-blue"
          >
            <span>
              {showWeek && r.week && <span className="mr-2 font-mono text-xs text-slate">Week {r.week.weekNumber}</span>}
              {r.title}
            </span>
            <span className="text-xs text-slate">{typeLabel(r.type)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
