"use client";

import { useActionState } from "react";
import { createWeekAction, updateWeekAction, type ActionState } from "@/lib/actions/bootcamp";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

interface WeekFormProps {
  bootcampId: string;
  week?: {
    id: string;
    weekNumber: number;
    title: string;
    objectives: string;
  };
}

export function WeekForm({ bootcampId, week }: WeekFormProps) {
  const action = week ? updateWeekAction.bind(null, week.id) : createWeekAction.bind(null, bootcampId);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <TextField label="Week number" name="weekNumber" type="number" min={1} defaultValue={week?.weekNumber} required />
      <TextField label="Title" name="title" defaultValue={week?.title} required placeholder="Foundations & tooling" />
      <TextAreaField
        label="Objectives"
        name="objectives"
        defaultValue={week?.objectives}
        required
        hint="What a student should be able to do by the end of this week."
      />

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div>
        <SubmitButton>{week ? "Save changes" : "Add week"}</SubmitButton>
      </div>
    </form>
  );
}
