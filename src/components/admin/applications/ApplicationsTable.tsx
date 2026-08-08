"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { changeApplicationStatusAction } from "@/lib/actions/applications";
import { StatusBadge, statusLabel } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

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

interface ApplicationRow {
  id: string;
  referenceCode: string;
  status: string;
  submittedAt: string;
  assessmentCompletedAt: string | null;
  applicantName: string;
  applicantEmail: string;
  cohortName: string;
  aiAnalysisStatus: string | null;
}

function AiStatusIndicator({ status }: { status: string | null }) {
  if (!status) return <span className="text-xs text-slate/40">—</span>;
  if (status === "PENDING" || status === "PROCESSING") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-blue" title="AI analysis in progress">
        <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
      </span>
    );
  }
  if (status === "FAILED") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-500" title="AI analysis failed">
        <Sparkles className="h-3 w-3" strokeWidth={1.5} />
      </span>
    );
  }
  return (
    <span
      className={cn("inline-flex items-center gap-1 text-xs text-emerald")}
      title="AI readiness profile ready"
    >
      <Sparkles className="h-3 w-3" strokeWidth={1.5} />
    </span>
  );
}

export function ApplicationsTable({ applications }: { applications: ApplicationRow[] }) {
  const [rows, setRows] = useState(applications);
  const [, startTransition] = useTransition();

  function handleStatusChange(id: string, status: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    startTransition(() => {
      changeApplicationStatusAction(id, status);
    });
  }

  if (rows.length === 0) {
    return <p className="text-sm text-slate">No applications match these filters.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-light-gray bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-light-gray text-xs uppercase tracking-wide text-slate">
            <th className="px-4 py-3 font-medium">Reference</th>
            <th className="px-4 py-3 font-medium">Applicant</th>
            <th className="px-4 py-3 font-medium">Cohort</th>
            <th className="px-4 py-3 font-medium">Submitted</th>
            <th className="px-4 py-3 font-medium">Completed</th>
            <th className="px-4 py-3 font-medium">AI</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-light-gray last:border-0 hover:bg-soft-white/60">
              <td className="px-4 py-3">
                <Link href={`/applications/${row.id}`} className="font-mono text-xs text-blue hover:underline">
                  {row.referenceCode}
                </Link>
              </td>
              <td className="px-4 py-3">
                <Link href={`/applications/${row.id}`} className="block">
                  <p className="text-graphite">{row.applicantName}</p>
                  <p className="text-xs text-slate">{row.applicantEmail}</p>
                </Link>
              </td>
              <td className="px-4 py-3 text-slate">{row.cohortName}</td>
              <td className="px-4 py-3 text-slate">{new Date(row.submittedAt).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-slate">
                {row.assessmentCompletedAt ? new Date(row.assessmentCompletedAt).toLocaleDateString() : "—"}
              </td>
              <td className="px-4 py-3">
                <AiStatusIndicator status={row.aiAnalysisStatus} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <StatusBadge status={row.status} />
                  <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    className="rounded-md border border-light-gray bg-white px-1.5 py-1 text-xs text-slate outline-none focus:border-blue cursor-pointer"
                    aria-label={`Change status for ${row.applicantName}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {statusLabel(s)}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
