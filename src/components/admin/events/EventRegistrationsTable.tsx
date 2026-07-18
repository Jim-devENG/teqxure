"use client";

import { useState, useTransition } from "react";
import { markEventRegistrationReviewedAction } from "@/lib/actions/eventRegistrations";
import { cn } from "@/lib/utils";

interface RegistrationRow {
  id: string;
  data: Record<string, string>;
  status: string;
  createdAt: string;
}

export function EventRegistrationsTable({
  eventId,
  registrations,
}: {
  eventId: string;
  registrations: RegistrationRow[];
}) {
  const [rows, setRows] = useState(registrations);
  const [, startTransition] = useTransition();
  const columns = Array.from(new Set(rows.flatMap((r) => Object.keys(r.data))));

  function markReviewed(id: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "REVIEWED" } : r)));
    startTransition(() => {
      markEventRegistrationReviewedAction(id, eventId);
    });
  }

  if (rows.length === 0) {
    return <p className="text-sm text-slate">No registrations yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-light-gray bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-light-gray text-xs uppercase tracking-wide text-slate">
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-medium">
                {col}
              </th>
            ))}
            <th className="px-4 py-3 font-medium">Registered</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-light-gray last:border-0">
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 text-graphite">
                  {row.data[col] ?? "—"}
                </td>
              ))}
              <td className="px-4 py-3 text-slate">{new Date(row.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs",
                    row.status === "NEW" ? "bg-blue/10 text-blue" : "bg-soft-white text-slate",
                  )}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {row.status === "NEW" && (
                  <button
                    type="button"
                    onClick={() => markReviewed(row.id)}
                    className="text-xs text-blue cursor-pointer"
                  >
                    Mark reviewed
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
