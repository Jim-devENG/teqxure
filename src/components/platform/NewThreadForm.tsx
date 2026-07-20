"use client";

import { useActionState } from "react";
import { startThreadAction, type ActionState } from "@/lib/actions/messages";
import { TextField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

export function NewThreadForm() {
  const [state, formAction] = useActionState(startThreadAction, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-2xl border border-light-gray bg-white p-5 shadow-sm">
      <TextField label="Message someone by email" name="email" type="email" required placeholder="name@example.com" wrapperClassName="flex-1 min-w-[220px]" />
      <SubmitButton pendingLabel="Starting…">Start conversation</SubmitButton>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
