"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pin, Pencil } from "lucide-react";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import {
  reorderTestimonialsAction,
  deleteTestimonialAction,
  togglePinnedAction,
} from "@/lib/actions/testimonials";
import { cn } from "@/lib/utils";

interface TestimonialRow {
  id: string;
  authorName: string;
  authorCompany: string | null;
  pinned: boolean;
  approved: boolean;
}

export function TestimonialsList({ testimonials }: { testimonials: TestimonialRow[] }) {
  const [rows, setRows] = useState(testimonials);
  const [, startTransition] = useTransition();

  function remove(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => {
      deleteTestimonialAction(id);
    });
  }

  function togglePinned(id: string, pinned: boolean) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, pinned } : r)));
    startTransition(() => {
      togglePinnedAction(id, pinned);
    });
  }

  if (rows.length === 0) {
    return <p className="text-sm text-slate">No testimonials yet.</p>;
  }

  return (
    <ReorderableList
      items={rows}
      onReorder={(orderedIds) => reorderTestimonialsAction(orderedIds)}
      renderItem={(row) => (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-graphite">{row.authorName}</p>
            <p className="text-xs text-slate">
              {row.authorCompany ?? "—"} {!row.approved && "· Pending approval"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => togglePinned(row.id, !row.pinned)}
              className={cn(
                "rounded-lg border border-light-gray p-1.5 transition-colors cursor-pointer",
                row.pinned ? "text-blue" : "text-slate hover:text-blue",
              )}
              aria-label="Toggle pinned"
            >
              <Pin className="h-3.5 w-3.5" strokeWidth={1.5} fill={row.pinned ? "currentColor" : "none"} />
            </button>
            <Link
              href={`/admin/testimonials/${row.id}`}
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
