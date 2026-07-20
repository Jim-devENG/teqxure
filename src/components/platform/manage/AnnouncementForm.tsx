"use client";

import { useActionState } from "react";
import { createAnnouncementAction, type ActionState } from "@/lib/actions/announcements";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

export function AnnouncementForm({ cohorts }: { cohorts: { id: string; name: string }[] }) {
  const [state, formAction] = useActionState(createAnnouncementAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-2xl border border-light-gray bg-white p-6 shadow-sm">
      <TextField label="Title" name="title" required placeholder="Cohort 3 kickoff moved to Monday" />
      <TextAreaField label="Message" name="body" required />

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Audience</span>
        <select
          name="cohortId"
          defaultValue=""
          className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          <option value="">Every student on the platform</option>
          {cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div>
        <SubmitButton pendingLabel="Posting…">Post announcement</SubmitButton>
      </div>
    </form>
  );
}
