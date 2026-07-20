"use client";

import { useActionState } from "react";
import { assignStaffAction, type ActionState } from "@/lib/actions/bootcamp";
import { TextField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

export function AssignStaffForm({ cohortId }: { cohortId: string }) {
  const [state, formAction] = useActionState(assignStaffAction.bind(null, cohortId), initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <TextField label="Staff email" name="email" type="email" required placeholder="mentor@example.com" wrapperClassName="flex-1 min-w-[200px]" />
      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Role</span>
        <select
          name="role"
          defaultValue="MENTOR"
          className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          <option value="INSTRUCTOR">Instructor</option>
          <option value="MENTOR">Mentor</option>
          <option value="REVIEWER">Reviewer</option>
        </select>
      </label>
      <SubmitButton pendingLabel="Assigning…">Assign</SubmitButton>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
