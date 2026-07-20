"use client";

import { useTransition } from "react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { removeStaffAssignmentAction } from "@/lib/actions/bootcamp";

interface StaffRow {
  id: string;
  role: string;
  user: { name: string | null; email: string };
}

function roleLabel(role: string): string {
  return role[0] + role.slice(1).toLowerCase();
}

export function StaffList({ staff }: { staff: StaffRow[] }) {
  const [, startTransition] = useTransition();

  if (staff.length === 0) {
    return <p className="text-sm text-slate">No staff assigned yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {staff.map((s) => (
        <div key={s.id} className="flex items-center justify-between rounded-xl border border-light-gray bg-white px-4 py-3">
          <div>
            <p className="text-sm text-graphite">{s.user.name ?? s.user.email}</p>
            <p className="text-xs text-slate">{roleLabel(s.role)}</p>
          </div>
          <ConfirmDeleteButton action={() => startTransition(() => removeStaffAssignmentAction(s.id))} label="Remove" />
        </div>
      ))}
    </div>
  );
}
