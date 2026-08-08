import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DecisionPanel } from "@/components/admin/applications/DecisionPanel";
import { ReviewerNotesPanel } from "@/components/admin/applications/ReviewerNotesPanel";
import { ApplicationResponses } from "@/components/admin/applications/ApplicationResponses";
import { EmailLogPanel } from "@/components/admin/applications/EmailLogPanel";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const application = await db.application.findUnique({
    where: { id },
    include: {
      applicant: true,
      admissionCohort: true,
      token: true,
      responses: true,
      reviewerNotes: { include: { author: true }, orderBy: { createdAt: "desc" } },
      emailLogs: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!application) notFound();

  const sections = await db.assessmentSection.findMany({
    orderBy: { order: "asc" },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  const { applicant } = application;

  return (
    <div>
      <Link href="/applications" className="mb-6 flex items-center gap-1.5 text-sm text-slate hover:text-graphite">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        All applications
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium tracking-tight text-graphite">{applicant.fullName}</h1>
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-1 font-mono text-xs text-slate">{application.referenceCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-light-gray bg-white p-5">
            <h2 className="mb-4 text-sm font-medium text-graphite">Applicant</h2>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <Field label="Email" value={applicant.email} href={`mailto:${applicant.email}`} />
              <Field label="Phone" value={applicant.phone} />
              <Field label="Country" value={applicant.country} />
              <Field label="Occupation" value={applicant.occupation} />
              {applicant.linkedin && <Field label="LinkedIn" value={applicant.linkedin} href={applicant.linkedin} />}
              {applicant.github && <Field label="GitHub" value={applicant.github} href={applicant.github} />}
              {applicant.portfolio && <Field label="Portfolio" value={applicant.portfolio} href={applicant.portfolio} />}
              <Field label="Cohort" value={application.admissionCohort.name} />
              <Field label="Submitted" value={application.submittedAt.toLocaleString()} />
              <Field
                label="Assessment completed"
                value={application.assessmentCompletedAt ? application.assessmentCompletedAt.toLocaleString() : "Not yet"}
              />
            </dl>
          </div>

          <ApplicationResponses
            sections={sections.map((s) => ({
              id: s.id,
              title: s.title,
              questions: s.questions.map((q) => ({
                id: q.id,
                key: q.key,
                label: q.label,
                fieldType: q.fieldType,
              })),
            }))}
            responses={application.responses.map((r) => ({ questionKey: r.questionKey, value: r.value }))}
          />

          <ReviewerNotesPanel
            applicationId={application.id}
            notes={application.reviewerNotes.map((n) => ({
              id: n.id,
              body: n.body,
              createdAt: n.createdAt.toISOString(),
              authorName: n.author.name ?? n.author.email,
            }))}
          />
        </div>

        <div className="flex flex-col gap-6">
          <DecisionPanel
            applicationId={application.id}
            status={application.status}
            hasToken={Boolean(application.token)}
            tokenUsed={Boolean(application.token?.usedAt)}
          />
          <EmailLogPanel
            logs={application.emailLogs.map((l) => ({
              id: l.id,
              templateKey: l.templateKey,
              to: l.to,
              status: l.status,
              errorMessage: l.errorMessage,
              createdAt: l.createdAt.toISOString(),
            }))}
          />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">{label}</dt>
      <dd className="mt-0.5 text-graphite">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="text-blue hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
