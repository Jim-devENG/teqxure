"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { reorderSpeakersAction, deleteSpeakerAction } from "@/lib/actions/speakers";

interface SpeakerRow {
  id: string;
  name: string;
  title: string;
}

export function SpeakersList({ items }: { items: SpeakerRow[] }) {
  const [rows, setRows] = useState(items);
  const [, startTransition] = useTransition();

  function remove(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => {
      deleteSpeakerAction(id);
    });
  }

  if (rows.length === 0) {
    return <p className="text-sm text-slate">No speakers yet.</p>;
  }

  return (
    <ReorderableList
      items={rows}
      onReorder={(orderedIds) => reorderSpeakersAction(orderedIds)}
      renderItem={(row) => (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-graphite">{row.name}</p>
            <p className="text-xs text-slate">{row.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/speakers/${row.id}`}
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
