"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, RefreshCw, AlertTriangle, Video } from "lucide-react";
import { requestAiAnalysisAction } from "@/lib/actions/aiAnalysis";
import { cn } from "@/lib/utils";
import type { AnalysisResult } from "@/lib/ai/admissions";

interface EvidenceRow {
  dimension: string;
  questionKey: string | null;
  excerpt: string;
}

interface AiAnalysisData {
  id: string;
  version: number;
  status: string;
  errorMessage: string | null;
  modelProvider: string | null;
  modelId: string | null;
  promptVersion: string | null;
  completedAt: string | null;
  result: AnalysisResult | null;
  evidence: EvidenceRow[];
}

interface AiReadinessProfilePanelProps {
  applicationId: string;
  analysis: AiAnalysisData | null;
  assessmentCompleted: boolean;
}

const DIMENSION_LABELS: Record<string, string> = {
  TECHNICAL_READINESS: "Technical Readiness",
  PRODUCT_THINKING: "Product Thinking",
  LEARNING_READINESS: "Learning Readiness",
  COMMITMENT_READINESS: "Commitment Readiness",
  INFRASTRUCTURE_READINESS: "Infrastructure Readiness",
  COMMUNICATION: "Communication",
};

export function AiReadinessProfilePanel({ applicationId, analysis, assessmentCompleted }: AiReadinessProfilePanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const status = analysis?.status ?? "NOT_STARTED";
  const isActive = status === "PENDING" || status === "PROCESSING";

  // Lightweight poll while a job is in flight — no new infra, just a client
  // timer that asks the server component to re-render.
  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => router.refresh(), 5000);
    return () => clearTimeout(timer);
  }, [isActive, router]);

  function trigger() {
    setError("");
    startTransition(async () => {
      const result = await requestAiAnalysisAction(applicationId);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-light-gray bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue" strokeWidth={1.5} />
          <div>
            <h2 className="text-sm font-medium text-graphite">AI Readiness Profile</h2>
            <p className="text-[11px] text-slate/60">Advisory only — not an admission decision.</p>
          </div>
        </div>
        <StatusPill status={status} />
      </div>

      {status === "NOT_STARTED" && (
        <EmptyState
          message={
            assessmentCompleted
              ? "No analysis has been generated yet."
              : "Available once the applicant completes their assessment."
          }
          action={
            assessmentCompleted && (
              <ActionButton onClick={trigger} disabled={isPending} label="Generate Analysis" pendingLabel="Starting…" />
            )
          }
        />
      )}

      {isActive && (
        <EmptyState
          message="Teqxure AI is reviewing this applicant's responses — this can take up to a minute."
          icon={<Loader2 className="h-4 w-4 animate-spin text-blue" strokeWidth={1.5} />}
        />
      )}

      {status === "FAILED" && (
        <EmptyState
          message={analysis?.errorMessage || "The analysis failed for an unknown reason."}
          icon={<AlertTriangle className="h-4 w-4 text-red-500" strokeWidth={1.5} />}
          action={<ActionButton onClick={trigger} disabled={isPending} label="Retry Analysis" pendingLabel="Retrying…" />}
        />
      )}

      {status === "COMPLETE" && analysis?.result && (
        <CompleteProfile analysis={analysis} onRerun={trigger} isPending={isPending} />
      )}

      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    NOT_STARTED: "bg-soft-white text-slate",
    PENDING: "bg-blue/10 text-blue",
    PROCESSING: "bg-blue/10 text-blue",
    COMPLETE: "bg-emerald/10 text-emerald",
    FAILED: "bg-red-100 text-red-600",
  };
  const labels: Record<string, string> = {
    NOT_STARTED: "Not Started",
    PENDING: "Queued",
    PROCESSING: "Processing",
    COMPLETE: "Complete",
    FAILED: "Failed",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", map[status] ?? map.NOT_STARTED)}>
      {labels[status] ?? status}
    </span>
  );
}

function EmptyState({ message, icon, action }: { message: string; icon?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-light-gray p-4">
      <p className="flex items-center gap-2 text-sm text-slate">
        {icon}
        {message}
      </p>
      {action}
    </div>
  );
}

function ActionButton({
  onClick,
  disabled,
  label,
  pendingLabel,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  pendingLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 rounded-lg border border-light-gray px-3 py-1.5 text-xs font-medium text-graphite transition-colors hover:bg-soft-white disabled:opacity-50 cursor-pointer"
    >
      <RefreshCw className={cn("h-3.5 w-3.5", disabled && "animate-spin")} strokeWidth={1.5} />
      {disabled ? pendingLabel : label}
    </button>
  );
}

function CompleteProfile({
  analysis,
  onRerun,
  isPending,
}: {
  analysis: AiAnalysisData;
  onRerun: () => void;
  isPending: boolean;
}) {
  const result = analysis.result!;
  const evidenceByDimension = new Map<string, EvidenceRow[]>();
  for (const row of analysis.evidence) {
    const list = evidenceByDimension.get(row.dimension) ?? [];
    list.push(row);
    evidenceByDimension.set(row.dimension, list);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border border-blue/20 bg-blue/5 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-blue">Overall Readiness</p>
        <p className="mt-1 text-base font-medium text-graphite">{result.overallReadiness.label}</p>
        <p className="mt-1 text-sm text-slate">{result.overallReadiness.summary}</p>
        <p className="mt-2 text-xs text-slate/70">This is a readiness summary, not an admission recommendation.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DimensionCard
          title="Technical Readiness"
          label={result.technicalReadiness.label}
          reason={result.technicalReadiness.reason}
          evidence={evidenceByDimension.get("TECHNICAL_READINESS")}
        />
        <DimensionCard
          title="Product Thinking"
          label={result.productThinking.label}
          reason={result.productThinking.reason}
          evidence={evidenceByDimension.get("PRODUCT_THINKING")}
        />
        <DimensionCard
          title="Learning Readiness"
          label={result.learningReadiness.label}
          reason={result.learningReadiness.reason}
          evidence={evidenceByDimension.get("LEARNING_READINESS")}
        />
        <DimensionCard
          title="Infrastructure Readiness"
          label={result.infrastructureReadiness.label}
          reason={result.infrastructureReadiness.reason}
          evidence={evidenceByDimension.get("INFRASTRUCTURE_READINESS")}
        />
        <DimensionCard
          title="Communication"
          label={result.communication.label}
          reason={result.communication.reason}
          evidence={evidenceByDimension.get("COMMUNICATION")}
        />
        <div className="rounded-lg border border-light-gray p-3">
          <p className="text-xs font-medium text-graphite">Commitment Readiness</p>
          <p className="mt-1 text-sm text-slate">{result.commitmentReadiness.availableCapacity}</p>
          {result.commitmentReadiness.schedulingConcerns.length > 0 && (
            <BulletList label="Scheduling concerns" items={result.commitmentReadiness.schedulingConcerns} />
          )}
          {result.commitmentReadiness.clarificationAreas.length > 0 && (
            <BulletList label="To clarify" items={result.commitmentReadiness.clarificationAreas} />
          )}
        </div>
      </div>

      {result.videoNote && (
        <p className="flex items-center gap-2 rounded-lg border border-light-gray bg-soft-white px-3 py-2 text-xs text-slate">
          <Video className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          {result.videoNote}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ListSection title="Strengths" items={result.strengths} />
        <ListSection title="Potential Concerns" items={result.potentialConcerns} />
        <ListSection title="Reviewer Attention" items={result.reviewerAttention} />
      </div>

      <div className="flex items-center justify-between border-t border-light-gray pt-3 text-xs text-slate">
        <span>
          v{analysis.version} · {analysis.modelProvider ?? "unknown model"} {analysis.modelId ? `(${analysis.modelId})` : ""} ·{" "}
          {analysis.completedAt ? new Date(analysis.completedAt).toLocaleString() : ""}
        </span>
        <ActionButton onClick={onRerun} disabled={isPending} label="Re-run Analysis" pendingLabel="Starting…" />
      </div>
    </div>
  );
}

function DimensionCard({
  title,
  label,
  reason,
  evidence,
}: {
  title: string;
  label: string;
  reason: string;
  evidence?: EvidenceRow[];
}) {
  return (
    <div className="rounded-lg border border-light-gray p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-graphite">{title}</p>
        <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[11px] font-medium text-blue">{label}</span>
      </div>
      <p className="mt-1.5 text-sm text-slate">{reason}</p>
      {evidence && evidence.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {evidence.map((e, i) => (
            <li key={i} className="border-l-2 border-light-gray pl-2 text-xs italic text-slate/80">
              "{e.excerpt}"{e.questionKey && <span className="not-italic text-slate/50"> — {e.questionKey}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BulletList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mt-2">
      <p className="text-[11px] font-medium text-slate">{label}</p>
      <ul className="mt-1 flex flex-col gap-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-slate">
            — {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">{title}</p>
      {items.length === 0 ? (
        <p className="mt-1 text-xs text-slate/50">None noted.</p>
      ) : (
        <ul className="mt-1.5 flex flex-col gap-1.5">
          {items.map((item, i) => (
            <li key={i} className="text-xs leading-relaxed text-graphite/80">
              • {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
