import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PENDING_ONBOARDING: "bg-soft-white text-slate",
  ONBOARDING_IN_PROGRESS: "bg-blue/10 text-blue",
  ASSESSMENT_COMPLETED: "bg-cyan/10 text-cyan",
  UNDER_REVIEW: "bg-amber-100 text-amber-700",
  INTERVIEW_REQUIRED: "bg-purple-100 text-purple-700",
  ACCEPTED: "bg-emerald/10 text-emerald",
  WAITLISTED: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-100 text-red-600",
  // AdmissionCohort statuses
  DRAFT: "bg-soft-white text-slate",
  OPEN: "bg-emerald/10 text-emerald",
  REVIEWING: "bg-blue/10 text-blue",
  CLOSED: "bg-soft-white text-slate/70",
};

export function statusLabel(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        STATUS_STYLES[status] ?? "bg-soft-white text-slate",
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
