"use client";

import { useState, useTransition } from "react";
import { updateEnrollmentAction } from "@/lib/actions/bootcamp";

interface EnrollmentRow {
  id: string;
  student: { name: string | null; email: string };
  cohortName: string;
  bootcampTitle: string;
}

export function PaymentsList({ enrollments }: { enrollments: EnrollmentRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [verified, setVerified] = useState<Record<string, boolean>>({});

  if (enrollments.length === 0) {
    return <p className="text-sm text-slate">No pending payments — everyone's verified.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {enrollments.map((e) => (
        <div key={e.id} className="flex items-center justify-between rounded-2xl border border-light-gray bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-graphite">{e.student.name ?? e.student.email}</p>
            <p className="mt-0.5 text-xs text-slate">
              {e.bootcampTitle} · {e.cohortName}
            </p>
          </div>
          {verified[e.id] ? (
            <span className="text-xs text-emerald">Verified</span>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await updateEnrollmentAction(e.id, { paymentStatus: "VERIFIED" });
                  setVerified((prev) => ({ ...prev, [e.id]: true }));
                })
              }
              className="rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark disabled:opacity-60 cursor-pointer"
            >
              Mark verified
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
