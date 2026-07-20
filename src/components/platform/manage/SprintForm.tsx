"use client";

import { useActionState } from "react";
import { upsertSprintAction, type ActionState } from "@/lib/actions/sprints";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

function toLocalInputValue(date?: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

interface SprintFormProps {
  weekId: string;
  cohortId: string;
  sprint?: {
    goal: string;
    description: string;
    deliverables: string;
    referenceMaterials: string | null;
    architectureNotes: string | null;
    dueAt: Date | null;
  };
}

export function SprintForm({ weekId, cohortId, sprint }: SprintFormProps) {
  const [state, formAction] = useActionState(upsertSprintAction.bind(null, weekId, cohortId), initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <TextField label="Sprint goal" name="goal" defaultValue={sprint?.goal} required placeholder="Ship an authenticated CRUD API" />
      <TextAreaField label="Description" name="description" defaultValue={sprint?.description} required />
      <TextAreaField label="Deliverables" name="deliverables" defaultValue={sprint?.deliverables} required hint="What exactly should be submitted." />
      <TextAreaField
        label="Reference materials (optional)"
        name="referenceMaterials"
        defaultValue={sprint?.referenceMaterials ?? ""}
      />
      <TextAreaField label="Architecture notes (optional)" name="architectureNotes" defaultValue={sprint?.architectureNotes ?? ""} />
      <TextField label="Due date (optional)" name="dueAt" type="datetime-local" defaultValue={toLocalInputValue(sprint?.dueAt)} />

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div>
        <SubmitButton>{sprint ? "Save sprint" : "Release sprint"}</SubmitButton>
      </div>
    </form>
  );
}
