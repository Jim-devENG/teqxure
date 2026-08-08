"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Clock3, ListPlus, Send } from "lucide-react";
import { changeApplicationStatusAction, decideApplicationAction, resendApplicationTokenAction } from "@/lib/actions/applications";
import { statusLabel } from "@/components/admin/StatusBadge";

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

interface DecisionPanelProps {
  applicationId: string;
  status: string;
  hasToken: boolean;
  tokenUsed: boolean;
}

export function DecisionPanel({ applicationId, status, hasToken, tokenUsed }: DecisionPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function runDecision(decision: "ACCEPTED" | "WAITLISTED" | "REJECTED" | "INTERVIEW_REQUIRED") {
    setMessage(null);
    startTransition(async () => {
      const result = await decideApplicationAction(applicationId, decision);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: `Marked ${statusLabel(decision)} and emailed the applicant.` });
        router.refresh();
      }
    });
  }

  function handleStatusChange(newStatus: string) {
    setMessage(null);
    startTransition(async () => {
      await changeApplicationStatusAction(applicationId, newStatus);
      router.refresh();
    });
  }

  function handleResend() {
    setMessage(null);
    startTransition(async () => {
      const result = await resendApplicationTokenAction(applicationId);
      setMessage(
        result.error ? { type: "error", text: result.error } : { type: "success", text: "Onboarding link resent." },
      );
    });
  }

  return (
    <div className="rounded-xl border border-light-gray bg-white p-5">
      <h2 className="mb-4 text-sm font-medium text-graphite">Pipeline</h2>

      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">Status</span>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isPending}
          className="mt-1.5 w-full rounded-lg border border-light-gray bg-white px-3 py-2 text-sm text-graphite outline-none focus:border-blue"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">Decision</span>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => runDecision("ACCEPTED")}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald/10 px-3 py-2 text-xs font-medium text-emerald transition-colors hover:bg-emerald/20 disabled:opacity-50 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
            Admit
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => runDecision("WAITLISTED")}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50 cursor-pointer"
          >
            <ListPlus className="h-3.5 w-3.5" strokeWidth={2} />
            Waitlist
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => runDecision("INTERVIEW_REQUIRED")}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-purple-50 px-3 py-2 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-100 disabled:opacity-50 cursor-pointer"
          >
            <Clock3 className="h-3.5 w-3.5" strokeWidth={2} />
            Interview
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => runDecision("REJECTED")}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
            Reject
          </button>
        </div>
        <p className="mt-2 text-xs text-slate">Each decision emails the applicant automatically.</p>
      </div>

      {hasToken && !tokenUsed && (
        <button
          type="button"
          disabled={isPending}
          onClick={handleResend}
          className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-light-gray px-3 py-2 text-xs text-slate transition-colors hover:bg-soft-white disabled:opacity-50 cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
          Resend onboarding link
        </button>
      )}

      {message && (
        <p className={`mt-4 text-xs ${message.type === "error" ? "text-red-500" : "text-emerald"}`}>{message.text}</p>
      )}
    </div>
  );
}
