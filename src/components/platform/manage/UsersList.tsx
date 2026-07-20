"use client";

import { useTransition } from "react";
import { resendInviteAction } from "@/lib/actions/users";
import { cn } from "@/lib/utils";

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: "ACTIVE" | "PENDING" | "EXPIRED";
  createdAt: string;
}

function roleLabel(role: string): string {
  return role
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

const statusClasses: Record<UserRow["status"], string> = {
  ACTIVE: "bg-emerald/10 text-emerald",
  PENDING: "bg-blue/10 text-blue",
  EXPIRED: "bg-red-50 text-red-500",
};

export function UsersList({ users }: { users: UserRow[] }) {
  const [isPending, startTransition] = useTransition();

  if (users.length === 0) {
    return <p className="text-sm text-slate">No users yet — invite the first one.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-light-gray bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-light-gray text-xs text-slate">
            <th className="px-5 py-3 font-normal">Name</th>
            <th className="px-5 py-3 font-normal">Email</th>
            <th className="px-5 py-3 font-normal">Role</th>
            <th className="px-5 py-3 font-normal">Status</th>
            <th className="px-5 py-3 font-normal"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-light-gray last:border-0">
              <td className="px-5 py-3 text-graphite">{user.name ?? "—"}</td>
              <td className="px-5 py-3 text-slate">{user.email}</td>
              <td className="px-5 py-3 text-slate">{roleLabel(user.role)}</td>
              <td className="px-5 py-3">
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusClasses[user.status])}>
                  {user.status === "ACTIVE" ? "Active" : user.status === "PENDING" ? "Invite pending" : "Invite expired"}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                {user.status !== "ACTIVE" && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => startTransition(() => resendInviteAction(user.id))}
                    className="rounded-lg border border-light-gray px-3 py-1.5 text-xs text-slate transition-colors hover:border-blue hover:text-blue disabled:opacity-60 cursor-pointer"
                  >
                    Resend invite
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
