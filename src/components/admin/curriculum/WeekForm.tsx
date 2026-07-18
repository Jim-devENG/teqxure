"use client";

import { useActionState } from "react";
import { createWeekAction, updateWeekAction, type WeekFormState } from "@/lib/actions/curriculum";
import { TextField } from "@/components/admin/Field";
import { ListEditor } from "@/components/admin/ListEditor";
import { SubmitButton } from "@/components/admin/SubmitButton";

const PHASES = ["Problem", "Pattern", "Architecture", "Engineering", "Production", "Users", "Iteration"];

interface WeekFormProps {
  week?: {
    id: string;
    week: number;
    phase: string;
    title: string;
    outcomes: { text: string }[];
  };
}

const initialState: WeekFormState = {};

export function WeekForm({ week }: WeekFormProps) {
  const action = week ? updateWeekAction.bind(null, week.id) : createWeekAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Week number" name="week" type="number" defaultValue={week?.week} required />
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Phase</span>
          <select
            name="phase"
            defaultValue={week?.phase ?? "Problem"}
            className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
          >
            {PHASES.map((phase) => (
              <option key={phase} value={phase}>
                {phase}
              </option>
            ))}
          </select>
        </label>
      </div>

      <TextField label="Title" name="title" defaultValue={week?.title} required />

      <ListEditor
        name="outcomes"
        label="Outcomes"
        defaultValues={week?.outcomes.map((o) => o.text) ?? []}
        multiline
      />

      <div className="flex items-center gap-3">
        <SubmitButton>{week ? "Save changes" : "Create week"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
