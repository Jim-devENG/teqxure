import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, PlayCircle } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function WeekDetailPage({ params }: { params: Promise<{ cohortId: string; weekId: string }> }) {
  const { cohortId, weekId } = await params;

  const week = await db.platformWeek.findUnique({
    where: { id: weekId },
    include: {
      bootcamp: true,
      sprints: { where: { cohortId } },
      liveSessions: { where: { cohortId }, orderBy: { startsAt: "asc" } },
      resources: { where: { visible: true }, orderBy: { order: "asc" } },
    },
  });
  if (!week) notFound();

  const bootcampResources = await db.resource.findMany({
    where: { bootcampId: week.bootcampId, weekId: null, visible: true },
    orderBy: { order: "asc" },
  });

  const sprint = week.sprints[0];
  const session = week.liveSessions[0];
  const resources = [...week.resources, ...bootcampResources];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={`Week ${week.weekNumber}: ${week.title}`} description={week.bootcamp.title} />

      <section className="rounded-2xl border border-light-gray bg-white p-6 shadow-sm">
        <h2 className="text-sm font-medium text-graphite">Objectives</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-slate">{week.objectives}</p>
      </section>

      <section className="rounded-2xl border border-light-gray bg-white p-6 shadow-sm">
        <h2 className="text-sm font-medium text-graphite">Live session</h2>
        {session ? (
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-sm text-graphite">{session.title}</p>
              <p className="mt-0.5 text-xs text-slate">{session.startsAt.toLocaleString()} · {session.provider.replace("_", " ")}</p>
            </div>
            {session.recordingUrl ? (
              <a
                href={session.recordingUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
              >
                <PlayCircle className="h-4 w-4" strokeWidth={1.5} />
                Watch recording
              </a>
            ) : (
              <a
                href={session.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
                Join live session
              </a>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate">No live session scheduled for this week yet.</p>
        )}
      </section>

      <section className="rounded-2xl border border-light-gray bg-white p-6 shadow-sm">
        <h2 className="text-sm font-medium text-graphite">Resources</h2>
        {resources.length === 0 ? (
          <p className="mt-2 text-sm text-slate">No resources published yet.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {resources.map((r) => (
              <li key={r.id}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg border border-light-gray px-4 py-2.5 text-sm text-graphite transition-colors hover:border-blue"
                >
                  {r.title}
                  <span className="text-xs text-slate">{r.type.replace("_", " ")}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {sprint && (
        <Link
          href={`/sprint-room/${sprint.id}`}
          className="rounded-2xl border border-light-gray bg-white p-6 shadow-sm transition-colors hover:border-blue"
        >
          <h2 className="text-sm font-medium text-graphite">This week's sprint</h2>
          <p className="mt-2 text-sm text-slate">{sprint.goal}</p>
          <p className="mt-3 text-xs text-blue">Open Sprint Room →</p>
        </Link>
      )}
    </div>
  );
}
