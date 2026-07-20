"use client";

import { useActionState } from "react";
import { createResourceAction, RESOURCE_TYPES, type ActionState } from "@/lib/actions/resources";
import { TextField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

function typeLabel(type: string): string {
  return type
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

interface ResourceFormProps {
  bootcampId: string;
  weeks: { id: string; weekNumber: number; title: string }[];
}

export function ResourceForm({ bootcampId, weeks }: ResourceFormProps) {
  const [state, formAction] = useActionState(createResourceAction.bind(null, bootcampId), initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <TextField label="Title" name="title" required placeholder="System design notes" wrapperClassName="min-w-[180px]" />
      <TextField label="URL" name="url" type="url" required placeholder="https://…" wrapperClassName="min-w-[220px] flex-1" />

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Type</span>
        <select name="type" defaultValue="NOTES" className="mt-2 rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue">
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {typeLabel(t)}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Week (optional)</span>
        <select name="weekId" defaultValue="" className="mt-2 rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue">
          <option value="">Bootcamp-wide</option>
          {weeks.map((w) => (
            <option key={w.id} value={w.id}>
              Week {w.weekNumber} — {w.title}
            </option>
          ))}
        </select>
      </label>

      <SubmitButton pendingLabel="Adding…">Add resource</SubmitButton>
      {state.error && <p className="w-full text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
