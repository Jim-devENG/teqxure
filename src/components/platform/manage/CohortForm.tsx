"use client";

import { useActionState } from "react";
import { createCohortAction, updateCohortAction, type ActionState } from "@/lib/actions/bootcamp";
import { TextField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

function toDateInputValue(date?: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

interface CohortFormProps {
  bootcamps: { id: string; title: string }[];
  cohort?: {
    id: string;
    bootcampId: string;
    name: string;
    startDate: Date;
    endDate: Date | null;
    status: string;
  };
}

export function CohortForm({ bootcamps, cohort }: CohortFormProps) {
  const action = cohort ? updateCohortAction.bind(null, cohort.id) : createCohortAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Bootcamp</span>
        <select
          name="bootcampId"
          defaultValue={cohort?.bootcampId}
          required
          className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          {bootcamps.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>
      </label>

      <TextField label="Cohort name" name="name" defaultValue={cohort?.name} required placeholder="Cohort 3 — Jan 2027" />

      <div className="grid grid-cols-2 gap-4">
        <TextField label="Start date" name="startDate" type="date" defaultValue={toDateInputValue(cohort?.startDate)} required />
        <TextField label="End date (optional)" name="endDate" type="date" defaultValue={toDateInputValue(cohort?.endDate)} />
      </div>

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Status</span>
        <select
          name="status"
          defaultValue={cohort?.status ?? "UPCOMING"}
          className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          <option value="UPCOMING">Upcoming</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </label>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div>
        <SubmitButton>{cohort ? "Save changes" : "Create cohort"}</SubmitButton>
      </div>
    </form>
  );
}
