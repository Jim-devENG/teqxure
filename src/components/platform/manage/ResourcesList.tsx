"use client";

import { useTransition } from "react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteResourceAction, toggleResourceVisibilityAction } from "@/lib/actions/resources";
import { cn } from "@/lib/utils";

interface ResourceRow {
  id: string;
  title: string;
  type: string;
  url: string;
  visible: boolean;
  weekId: string | null;
}

export function ResourcesList({ resources, weekLabels }: { resources: ResourceRow[]; weekLabels: Record<string, string> }) {
  const [, startTransition] = useTransition();

  if (resources.length === 0) {
    return <p className="text-sm text-slate">No resources yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {resources.map((r) => (
        <div key={r.id} className="flex items-center justify-between rounded-xl border border-light-gray bg-white px-4 py-3">
          <div>
            <p className="text-sm text-graphite">{r.title}</p>
            <p className="text-xs text-slate">
              {r.type.replace("_", " ")} {r.weekId ? `· ${weekLabels[r.weekId] ?? ""}` : "· Bootcamp-wide"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => startTransition(() => toggleResourceVisibilityAction(r.id, !r.visible))}
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium transition-colors cursor-pointer",
                r.visible ? "bg-emerald/10 text-emerald" : "bg-soft-white text-slate",
              )}
            >
              {r.visible ? "Visible" : "Hidden"}
            </button>
            <ConfirmDeleteButton action={() => startTransition(() => deleteResourceAction(r.id))} label="" />
          </div>
        </div>
      ))}
    </div>
  );
}
