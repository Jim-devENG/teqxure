"use client";

import { useActionState } from "react";
import { createLiveSessionAction, updateLiveSessionAction, type ActionState } from "@/lib/actions/liveSessions";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

function toLocalInputValue(date?: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

interface LiveSessionFormProps {
  cohortId: string;
  weeks: { id: string; weekNumber: number; title: string }[];
  session?: {
    id: string;
    weekId: string;
    title: string;
    description: string | null;
    startsAt: Date;
    provider: string;
    meetingUrl: string;
    recordingUrl: string | null;
  };
}

export function LiveSessionForm({ cohortId, weeks, session }: LiveSessionFormProps) {
  const action = session ? updateLiveSessionAction.bind(null, session.id) : createLiveSessionAction.bind(null, cohortId);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Week</span>
        <select
          name="weekId"
          defaultValue={session?.weekId}
          required
          className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          {weeks.map((w) => (
            <option key={w.id} value={w.id}>
              Week {w.weekNumber} — {w.title}
            </option>
          ))}
        </select>
      </label>

      <TextField label="Title" name="title" defaultValue={session?.title} required placeholder="Live: API design walkthrough" />
      <TextAreaField label="Description (optional)" name="description" defaultValue={session?.description ?? ""} />
      <TextField label="Starts at" name="startsAt" type="datetime-local" defaultValue={toLocalInputValue(session?.startsAt)} required />

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Provider</span>
        <select
          name="provider"
          defaultValue={session?.provider ?? "GOOGLE_MEET"}
          className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          <option value="GOOGLE_MEET">Google Meet</option>
          <option value="ZOOM">Zoom</option>
          <option value="TEAMS">Microsoft Teams</option>
          <option value="YOUTUBE_UNLISTED">YouTube (unlisted)</option>
        </select>
      </label>

      <TextField
        label="Private meeting link"
        name="meetingUrl"
        type="url"
        defaultValue={session?.meetingUrl}
        required
        placeholder="https://meet.google.com/…"
      />

      {session && (
        <TextField
          label="Recording link (optional)"
          name="recordingUrl"
          type="url"
          defaultValue={session.recordingUrl ?? ""}
          hint="Add this once the session has happened — students will see 'Watch Recording' instead of 'Join'."
        />
      )}

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div>
        <SubmitButton>{session ? "Save changes" : "Schedule session"}</SubmitButton>
      </div>
    </form>
  );
}
