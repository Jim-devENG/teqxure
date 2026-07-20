"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteWeekAction } from "@/lib/actions/bootcamp";

interface WeekRow {
  id: string;
  weekNumber: number;
  title: string;
  bootcampId: string;
}

export function WeeksList({ weeks }: { weeks: WeekRow[] }) {
  const [, startTransition] = useTransition();

  if (weeks.length === 0) {
    return <p className="text-sm text-slate">No weeks yet — add the first one.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {weeks.map((week) => (
        <div
          key={week.id}
          className="flex items-center justify-between rounded-xl border border-light-gray bg-white px-4 py-3"
        >
          <p className="text-sm text-graphite">
            <span className="font-mono text-xs text-slate">Week {week.weekNumber}</span> — {week.title}
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={`/platform/manage/bootcamps/${week.bootcampId}/weeks/${week.id}`}
              className="rounded-lg border border-light-gray p-1.5 text-slate transition-colors hover:text-blue"
              aria-label="Edit"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
            <ConfirmDeleteButton action={() => startTransition(() => deleteWeekAction(week.id))} label="" />
          </div>
        </div>
      ))}
    </div>
  );
}
