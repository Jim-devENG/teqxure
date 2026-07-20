"use client";

import { useActionState } from "react";
import { enrollStudentAction, type ActionState } from "@/lib/actions/bootcamp";
import { TextField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

export function EnrollStudentForm({ cohortId }: { cohortId: string }) {
  const [state, formAction] = useActionState(enrollStudentAction.bind(null, cohortId), initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <TextField label="Student email" name="email" type="email" required placeholder="student@example.com" wrapperClassName="flex-1 min-w-[220px]" />
      <SubmitButton pendingLabel="Enrolling…">Enroll</SubmitButton>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
