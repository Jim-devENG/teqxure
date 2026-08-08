import Link from "next/link";
import { Download, ListChecks, CalendarRange } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { ApplicationsTable } from "@/components/admin/applications/ApplicationsTable";

const PAGE_SIZE = 25;

const STATUSES = [
  "PENDING_ONBOARDING",
  "ONBOARDING_IN_PROGRESS",
  "ASSESSMENT_COMPLETED",
  "UNDER_REVIEW",
  "INTERVIEW_REQUIRED",
  "ACCEPTED",
  "WAITLISTED",
  "REJECTED",
];

interface PageProps {
  searchParams: Promise<{ status?: string; cohort?: string; q?: string; page?: string }>;
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;
  if (params.cohort) where.admissionCohortId = params.cohort;
  if (params.q) {
    where.OR = [
      { referenceCode: { contains: params.q, mode: "insensitive" } },
      { applicant: { fullName: { contains: params.q, mode: "insensitive" } } },
      { applicant: { email: { contains: params.q, mode: "insensitive" } } },
    ];
  }

  const [applications, total, cohorts] = await Promise.all([
    db.application.findMany({
      where: where as never,
      include: {
        applicant: true,
        admissionCohort: true,
        aiAnalyses: { orderBy: { version: "desc" }, take: 1, select: { status: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.application.count({ where: where as never }),
    db.admissionCohort.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const exportQs = new URLSearchParams();
  if (params.status) exportQs.set("status", params.status);
  if (params.cohort) exportQs.set("cohort", params.cohort);
  if (params.q) exportQs.set("q", params.q);

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Cohort applications and onboarding assessments."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/applications/assessment-builder"
              className="flex items-center gap-1.5 rounded-lg border border-light-gray px-3 py-2 text-sm text-slate transition-colors hover:bg-soft-white"
            >
              <ListChecks className="h-4 w-4" strokeWidth={1.5} />
              Assessment
            </Link>
            <Link
              href="/applications/cohorts"
              className="flex items-center gap-1.5 rounded-lg border border-light-gray px-3 py-2 text-sm text-slate transition-colors hover:bg-soft-white"
            >
              <CalendarRange className="h-4 w-4" strokeWidth={1.5} />
              Cohorts
            </Link>
            <a
              href={`/applications/export?${exportQs.toString()}`}
              className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
            >
              <Download className="h-4 w-4" strokeWidth={1.5} />
              Export CSV
            </a>
          </div>
        }
      />

      <form method="GET" className="mb-5 flex flex-wrap items-center gap-3">
        <input
          type="text"
          name="q"
          defaultValue={params.q}
          placeholder="Search name, email, or reference code…"
          className="min-w-[220px] flex-1 rounded-lg border border-light-gray bg-white px-3 py-2 text-sm text-graphite outline-none focus:border-blue"
        />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="rounded-lg border border-light-gray bg-white px-3 py-2 text-sm text-graphite outline-none focus:border-blue"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select
          name="cohort"
          defaultValue={params.cohort ?? ""}
          className="rounded-lg border border-light-gray bg-white px-3 py-2 text-sm text-graphite outline-none focus:border-blue"
        >
          <option value="">All cohorts</option>
          {cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-graphite px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-graphite/90 cursor-pointer"
        >
          Filter
        </button>
        {(params.q || params.status || params.cohort) && (
          <Link href="/applications" className="text-sm text-slate underline-offset-2 hover:underline">
            Clear
          </Link>
        )}
      </form>

      <ApplicationsTable
        applications={applications.map((a) => ({
          id: a.id,
          referenceCode: a.referenceCode,
          status: a.status,
          submittedAt: a.submittedAt.toISOString(),
          assessmentCompletedAt: a.assessmentCompletedAt?.toISOString() ?? null,
          applicantName: a.applicant.fullName,
          applicantEmail: a.applicant.email,
          cohortName: a.admissionCohort.name,
          aiAnalysisStatus: a.aiAnalyses[0]?.status ?? null,
        }))}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/applications"
        searchParams={{ status: params.status, cohort: params.cohort, q: params.q }}
      />
    </div>
  );
}
