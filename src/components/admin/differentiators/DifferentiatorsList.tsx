"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { reorderDifferentiatorsAction, deleteDifferentiatorAction } from "@/lib/actions/differentiators";

interface DifferentiatorRow {
  id: string;
  heading: string;
  icon: string;
}

export function DifferentiatorsList({ items }: { items: DifferentiatorRow[] }) {
  const [rows, setRows] = useState(items);
  const [, startTransition] = useTransition();

  function remove(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => {
      deleteDifferentiatorAction(id);
    });
  }

  if (rows.length === 0) {
    return <p className="text-sm text-slate">No differentiators yet.</p>;
  }

  return (
    <ReorderableList
      items={rows}
      onReorder={(orderedIds) => reorderDifferentiatorsAction(orderedIds)}
      renderItem={(row) => (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-graphite">{row.heading}</p>
            <p className="text-xs text-slate">{row.icon}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/differentiators/${row.id}`}
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
