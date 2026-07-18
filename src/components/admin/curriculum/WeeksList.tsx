"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { reorderWeeksAction, deleteWeekAction } from "@/lib/actions/curriculum";

interface WeekRow {
  id: string;
  week: number;
  phase: string;
  title: string;
}

export function WeeksList({ weeks }: { weeks: WeekRow[] }) {
  const [rows, setRows] = useState(weeks);
  const [, startTransition] = useTransition();

  function remove(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => {
      deleteWeekAction(id);
    });
  }

  return (
    <ReorderableList
      items={rows}
      onReorder={(orderedIds) => reorderWeeksAction(orderedIds)}
      renderItem={(row) => (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-graphite">
              Week {String(row.week).padStart(2, "0")} · {row.title}
            </p>
            <p className="text-xs text-slate">{row.phase}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/curriculum/${row.id}`}
              className="rounded-lg border border-light-gray p-1.5 text-slate transition-colors hover:text-blue"
              aria-label="Edit"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
            <ConfirmDeleteButton action={() => remove(row.id)} label="" />
          </div>
        </div>
      )}
    />
  );
}
