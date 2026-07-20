"use client";

import { useActionState } from "react";
import { inviteUserAction, ROLES, type InviteUserState } from "@/lib/actions/users";
import { TextField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: InviteUserState = {};

function roleLabel(role: string): string {
  return role
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export function InviteUserForm() {
  const [state, formAction] = useActionState(inviteUserAction, initialState);

  return (
    <form
      action={formAction}
      className="flex h-fit flex-col gap-4 rounded-2xl border border-light-gray bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-sm font-medium text-graphite">Invite a user</h2>
        <p className="mt-1 text-xs text-slate">They'll get an email to set their password and activate the account.</p>
      </div>

      <TextField label="Name" name="name" required placeholder="Ada Lovelace" />
      <TextField label="Email" name="email" type="email" required placeholder="ada@example.com" />

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Role</span>
        <select
          name="role"
          defaultValue="STUDENT"
          className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {roleLabel(role)}
            </option>
          ))}
        </select>
      </label>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <SubmitButton pendingLabel="Sending invite…">Send invite</SubmitButton>
    </form>
  );
}
