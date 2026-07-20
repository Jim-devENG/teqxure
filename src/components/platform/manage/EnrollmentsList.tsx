"use client";

import { useState, useTransition } from "react";
import { updateEnrollmentAction } from "@/lib/actions/bootcamp";
import { issueCertificateAction } from "@/lib/actions/certificates";
import { cn } from "@/lib/utils";

interface EnrollmentRow {
  id: string;
  status: string;
  paymentStatus: string;
  studentId: string;
  student: { name: string | null; email: string };
  hasCertificate: boolean;
}

export function EnrollmentsList({ cohortId, enrollments }: { cohortId: string; enrollments: EnrollmentRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [issued, setIssued] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  function issueCertificate(studentId: string) {
    startTransition(async () => {
      const result = await issueCertificateAction(cohortId, studentId);
      if (result.error) {
        setErrors((prev) => ({ ...prev, [studentId]: result.error! }));
      } else {
        setIssued((prev) => ({ ...prev, [studentId]: true }));
      }
    });
  }

  if (enrollments.length === 0) {
    return <p className="text-sm text-slate">No students enrolled yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-light-gray bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-light-gray text-xs text-slate">
            <th className="px-5 py-3 font-normal">Student</th>
            <th className="px-5 py-3 font-normal">Enrollment status</th>
            <th className="px-5 py-3 font-normal">Payment</th>
            <th className="px-5 py-3 font-normal">Certificate</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => {
            const hasCertificate = e.hasCertificate || issued[e.studentId];
            return (
              <tr key={e.id} className="border-b border-light-gray last:border-0">
                <td className="px-5 py-3">
                  <p className="text-graphite">{e.student.name ?? "—"}</p>
                  <p className="text-xs text-slate">{e.student.email}</p>
                </td>
                <td className="px-5 py-3">
                  <select
                    defaultValue={e.status}
                    disabled={isPending}
                    onChange={(ev) => startTransition(() => updateEnrollmentAction(e.id, { status: ev.target.value }))}
                    className="rounded-lg border border-light-gray bg-white px-2 py-1.5 text-xs text-graphite outline-none focus:border-blue"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                  </select>
                </td>
                <td className="px-5 py-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(() =>
                        updateEnrollmentAction(e.id, { paymentStatus: e.paymentStatus === "VERIFIED" ? "PENDING" : "VERIFIED" }),
                      )
                    }
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium transition-colors cursor-pointer",
                      e.paymentStatus === "VERIFIED" ? "bg-emerald/10 text-emerald" : "bg-blue/10 text-blue",
                    )}
                  >
                    {e.paymentStatus === "VERIFIED" ? "Verified" : "Pending — mark verified"}
                  </button>
                </td>
                <td className="px-5 py-3">
                  {hasCertificate ? (
                    <span className="text-xs text-emerald">Issued</span>
                  ) : (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => issueCertificate(e.studentId)}
                      className="rounded-lg border border-light-gray px-3 py-1.5 text-xs text-slate transition-colors hover:border-blue hover:text-blue disabled:opacity-60 cursor-pointer"
                    >
                      Issue certificate
                    </button>
                  )}
                  {errors[e.studentId] && <p className="mt-1 text-xs text-red-500">{errors[e.studentId]}</p>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
