import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { SubmissionForm } from "@/components/platform/SubmissionForm";
import { SubmissionReviewForm } from "@/components/platform/manage/SubmissionReviewForm";

export default async function SprintRoomDetailPage({ params }: { params: Promise<{ sprintId: string }> }) {
  const { sprintId } = await params;
  const user = await getCurrentUser();

  const sprint = await db.sprint.findUnique({
    where: { id: sprintId },
    include: {
      week: true,
      cohort: true,
      submissions: { include: { student: true }, orderBy: { student: { name: "asc" } } },
    },
  });
  if (!sprint) notFound();

  const session = await db.liveSession.findFirst({
    where: { weekId: sprint.weekId, cohortId: sprint.cohortId },
    orderBy: { startsAt: "desc" },
  });

  const isStudent = user!.role === "STUDENT";
  const mySubmission = isStudent ? sprint.submissions.find((s) => s.studentId === user!.id) : undefined;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={sprint.goal} description={`Week ${sprint.week.weekNumber} · ${sprint.cohort.name}`} />

      <section className="rounded-2xl border border-light-gray bg-white p-6 shadow-sm">
        <h2 className="text-sm font-medium text-graphite">Description</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-slate">{sprint.description}</p>

        <h2 className="mt-6 text-sm font-medium text-graphite">Deliverables</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-slate">{sprint.deliverables}</p>

        {sprint.referenceMaterials && (
          <>
            <h2 className="mt-6 text-sm font-medium text-graphite">Reference materials</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-slate">{sprint.referenceMaterials}</p>
          </>
        )}

        {sprint.architectureNotes && (
          <>
            <h2 className="mt-6 text-sm font-medium text-graphite">Architecture notes</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-slate">{sprint.architectureNotes}</p>
          </>
        )}

        {sprint.dueAt && (
          <p className="mt-6 text-xs text-slate">Due {sprint.dueAt.toLocaleString()}</p>
        )}
      </section>

      {session && (
        <section className="flex items-center justify-between rounded-2xl border border-light-gray bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-medium text-graphite">Live session</h2>
            <p className="mt-1 text-xs text-slate">{session.title} · {session.startsAt.toLocaleString()}</p>
          </div>
          <a
            href={session.recordingUrl ?? session.meetingUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
            {session.recordingUrl ? "Watch recording" : "Join live session"}
          </a>
        </section>
      )}

      {isStudent ? (
        <section>
          <h2 className="mb-4 text-sm font-medium text-graphite">Submission portal</h2>
          <SubmissionForm sprintId={sprint.id} submission={mySubmission} />
        </section>
      ) : (
        <section>
          <h2 className="mb-4 text-sm font-medium text-graphite">Student submissions</h2>
          {sprint.submissions.length === 0 ? (
            <p className="text-sm text-slate">No students have started this sprint yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {sprint.submissions.map((submission) => (
                <SubmissionReviewForm key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
