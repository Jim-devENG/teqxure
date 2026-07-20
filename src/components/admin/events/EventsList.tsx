"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, ClipboardList, Inbox } from "lucide-react";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { reorderEventsAction, deleteEventAction } from "@/lib/actions/events";
import { cn } from "@/lib/utils";

interface EventRow {
  id: string;
  title: string;
  startsAt: string;
  status: string;
  registrationMode: string;
}

export function EventsList({ events }: { events: EventRow[] }) {
  const [rows, setRows] = useState(events);
  const [, startTransition] = useTransition();

  function remove(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => {
      deleteEventAction(id);
    });
  }

  if (rows.length === 0) {
    return <p className="text-sm text-slate">No events yet.</p>;
  }

  return (
    <ReorderableList
      items={rows}
      onReorder={(orderedIds) => reorderEventsAction(orderedIds)}
      renderItem={(row) => (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-graphite">{row.title}</p>
            <p className="text-xs text-slate">
              {new Date(row.startsAt).toLocaleString()} ·{" "}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5",
                  row.status === "PUBLISHED" ? "bg-emerald/10 text-emerald" : "bg-soft-white text-slate",
                )}
              >
                {row.status}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {row.registrationMode === "INTERNAL" && (
              <Link
                href={`/events/${row.id}/form`}
                className="flex items-center gap-1.5 rounded-lg border border-light-gray px-2.5 py-1.5 text-xs text-graphite transition-colors hover:border-blue hover:text-blue"
              >
                <ClipboardList className="h-3.5 w-3.5" strokeWidth={1.5} />
                Form
              </Link>
            )}
            <Link
              href={`/events/${row.id}/registrations`}
              className="flex items-center gap-1.5 rounded-lg border border-light-gray px-2.5 py-1.5 text-xs text-graphite transition-colors hover:border-blue hover:text-blue"
            >
              <Inbox className="h-3.5 w-3.5" strokeWidth={1.5} />
              Registrations
            </Link>
            <Link
              href={`/events/${row.id}`}
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
