import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { CohortForm } from "@/components/platform/manage/CohortForm";
import { EnrollStudentForm } from "@/components/platform/manage/EnrollStudentForm";
import { EnrollmentsList } from "@/components/platform/manage/EnrollmentsList";
import { AssignStaffForm } from "@/components/platform/manage/AssignStaffForm";
import { StaffList } from "@/components/platform/manage/StaffList";

export default async function CohortDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [cohort, bootcamps] = await Promise.all([
    db.cohort.findUnique({
      where: { id },
      include: {
        bootcamp: { include: { weeks: { orderBy: { weekNumber: "asc" } } } },
        enrollments: { include: { student: true }, orderBy: { enrolledAt: "desc" } },
        staff: { include: { user: true } },
        sprints: true,
        liveSessions: { orderBy: { startsAt: "asc" } },
        certificates: { select: { studentId: true } },
      },
    }),
    db.bootcamp.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
  ]);
  if (!cohort) notFound();

  const sprintByWeek = new Map(cohort.sprints.map((s) => [s.weekId, s]));
  const certifiedStudentIds = new Set(cohort.certificates.map((c) => c.studentId));
  const enrollmentRows = cohort.enrollments.map((e) => ({ ...e, hasCertificate: certifiedStudentIds.has(e.studentId) }));

  return (
    <div className="flex flex-col gap-10">
      <div>
        <PageHeader title={cohort.name} description={cohort.bootcamp.title} />
        <CohortForm bootcamps={bootcamps} cohort={cohort} />
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium text-graphite">Sprints by week</h2>
        <div className="flex flex-col gap-2">
          {cohort.bootcamp.weeks.map((week) => {
            const sprint = sprintByWeek.get(week.id);
            return (
              <Link
                key={week.id}
                href={`/manage/cohorts/${cohort.id}/sprints/${week.id}`}
                className="flex items-center justify-between rounded-xl border border-light-gray bg-white px-4 py-3 transition-colors hover:border-blue"
              >
                <p className="text-sm text-graphite">
                  <span className="font-mono text-xs text-slate">Week {week.weekNumber}</span> — {week.title}
                </p>
                <span className="text-xs text-slate">{sprint ? "Sprint set" : "No sprint yet"}</span>
              </Link>
            );
          })}
          {cohort.bootcamp.weeks.length === 0 && (
            <p className="text-sm text-slate">
              This bootcamp has no weeks yet.{" "}
              <Link href={`/manage/bootcamps/${cohort.bootcampId}`} className="text-blue hover:underline">
                Add weeks
              </Link>
              .
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-graphite">Live sessions</h2>
          <Link
            href={`/manage/cohorts/${cohort.id}/sessions/new`}
            className="rounded-lg border border-light-gray px-3 py-1.5 text-xs text-slate transition-colors hover:border-blue hover:text-blue"
          >
            Schedule session
          </Link>
        </div>
        {cohort.liveSessions.length === 0 ? (
          <p className="text-sm text-slate">No live sessions scheduled yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {cohort.liveSessions.map((session) => (
              <Link
                key={session.id}
                href={`/manage/cohorts/${cohort.id}/sessions/${session.id}`}
                className="flex items-center justify-between rounded-xl border border-light-gray bg-white px-4 py-3 transition-colors hover:border-blue"
              >
                <p className="text-sm text-graphite">{session.title}</p>
                <span className="text-xs text-slate">{session.startsAt.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium text-graphite">Enrolled students</h2>
        <div className="mb-4 rounded-2xl border border-light-gray bg-white p-5 shadow-sm">
          <EnrollStudentForm cohortId={cohort.id} />
        </div>
        <EnrollmentsList cohortId={cohort.id} enrollments={enrollmentRows} />
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium text-graphite">Staff</h2>
        <div className="mb-4 rounded-2xl border border-light-gray bg-white p-5 shadow-sm">
          <AssignStaffForm cohortId={cohort.id} />
        </div>
        <StaffList staff={cohort.staff} />
      </div>
    </div>
  );
}
