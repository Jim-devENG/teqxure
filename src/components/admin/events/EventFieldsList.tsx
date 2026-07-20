"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { reorderEventFieldsAction, deleteEventFieldAction } from "@/lib/actions/eventFormFields";

interface FieldRow {
  id: string;
  label: string;
  fieldType: string;
  required: boolean;
}

export function EventFieldsList({ eventId, fields }: { eventId: string; fields: FieldRow[] }) {
  const [rows, setRows] = useState(fields);
  const [, startTransition] = useTransition();

  function remove(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => {
      deleteEventFieldAction(eventId, id);
    });
  }

  if (rows.length === 0) {
    return <p className="text-sm text-slate">No fields yet — add one to start building the registration form.</p>;
  }

  return (
    <ReorderableList
      items={rows}
      onReorder={(orderedIds) => reorderEventFieldsAction(eventId, orderedIds)}
      renderItem={(row) => (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-graphite">
              {row.label} {row.required && <span className="text-blue">*</span>}
            </p>
            <p className="text-xs text-slate">{row.fieldType}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/events/${eventId}/form/${row.id}`}
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
