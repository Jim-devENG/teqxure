"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2, AlertTriangle } from "lucide-react";
import { requestPreparationPlanAction } from "@/lib/actions/aiAnalysis";
import { cn } from "@/lib/utils";
import type { PreparationPlanResult } from "@/lib/ai/admissions";

interface PreparationPlanData {
  status: string;
  errorMessage: string | null;
  result: PreparationPlanResult | null;
  completedAt: string | null;
  version: number;
}

export function PreparationPlanPanel({
  applicationId,
  plan,
  hasCompleteAnalysis,
}: {
  applicationId: string;
  plan: PreparationPlanData | null;
  hasCompleteAnalysis: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const status = plan?.status ?? "NOT_STARTED";
  const isActive = status === "PENDING" || status === "PROCESSING";

  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => router.refresh(), 5000);
    return () => clearTimeout(timer);
  }, [isActive, router]);

  function trigger() {
    setError("");
    startTransition(async () => {
      const result = await requestPreparationPlanAction(applicationId);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-light-gray bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-blue" strokeWidth={1.5} />
        <h2 className="text-sm font-medium text-graphite">Pre-Cohort Preparation Plan</h2>
      </div>

      {status === "NOT_STARTED" && (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-light-gray p-4">
          <p className="text-sm text-slate">
            {hasCompleteAnalysis
              ? "Generate a personalized preparation plan based on this applicant's readiness profile."
              : "Run the AI Readiness Profile analysis first — the preparation plan is built from it."}
          </p>
          <button
            type="button"
            onClick={trigger}
            disabled={isPending || !hasCompleteAnalysis}
            className="rounded-lg border border-light-gray px-3 py-1.5 text-xs font-medium text-graphite transition-colors hover:bg-soft-white disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Starting…" : "Generate Preparation Plan"}
          </button>
        </div>
      )}

      {isActive && (
        <p className="flex items-center gap-2 rounded-lg border border-dashed border-light-gray p-4 text-sm text-slate">
          <Loader2 className="h-4 w-4 animate-spin text-blue" strokeWidth={1.5} />
          Generating preparation plan…
        </p>
      )}

      {status === "FAILED" && (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-light-gray p-4">
          <p className="flex items-center gap-2 text-sm text-slate">
            <AlertTriangle className="h-4 w-4 text-red-500" strokeWidth={1.5} />
            {plan?.errorMessage || "Generation failed."}
          </p>
          <button
            type="button"
            onClick={trigger}
            disabled={isPending}
            className="rounded-lg border border-light-gray px-3 py-1.5 text-xs font-medium text-graphite transition-colors hover:bg-soft-white disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Retrying…" : "Retry"}
          </button>
        </div>
      )}

      {status === "COMPLETE" && plan?.result && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate">{plan.result.summary}</p>
          <div className="flex flex-col gap-3">
            {plan.result.focusAreas.map((area, i) => (
              <div key={i} className="rounded-lg border border-light-gray p-3">
                <p className="text-sm font-medium text-graphite">{area.title}</p>
                <p className="mt-1 text-xs text-slate">{area.reason}</p>
                <ul className="mt-2 flex flex-col gap-1">
                  {area.recommendations.map((rec, j) => (
                    <li key={j} className="text-xs text-graphite/80">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-light-gray pt-3 text-xs text-slate">
            <span>
              v{plan.version} · {plan.completedAt ? new Date(plan.completedAt).toLocaleString() : ""}
            </span>
            <button
              type="button"
              onClick={trigger}
              disabled={isPending}
              className={cn(
                "rounded-lg border border-light-gray px-3 py-1.5 text-xs font-medium text-graphite transition-colors hover:bg-soft-white disabled:opacity-50 cursor-pointer",
              )}
            >
              {isPending ? "Regenerating…" : "Regenerate"}
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
    </div>
  );
}
