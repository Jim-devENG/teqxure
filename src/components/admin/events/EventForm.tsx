"use client";

import { useActionState, useState } from "react";
import { createEventAction, updateEventAction, type EventFormState } from "@/lib/actions/events";
import { TextField, TextAreaField, CheckboxField } from "@/components/admin/Field";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SubmitButton } from "@/components/admin/SubmitButton";

function toLocalInputValue(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

interface EventFormProps {
  event?: {
    id: string;
    slug: string;
    title: string;
    description: string;
    startsAt: string | Date;
    endsAt: string | Date | null;
    location: string | null;
    isVirtual: boolean;
    coverImageUrl: string | null;
    status: string;
    registrationMode: string;
    externalUrl: string | null;
    visible: boolean;
  };
}

const initialState: EventFormState = {};

export function EventForm({ event }: EventFormProps) {
  const action = event ? updateEventAction.bind(null, event.id) : createEventAction;
  const [state, formAction] = useActionState(action, initialState);
  const [registrationMode, setRegistrationMode] = useState(event?.registrationMode ?? "INTERNAL");

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Title" name="title" defaultValue={event?.title} required />
        <TextField
          label="Slug"
          name="slug"
          defaultValue={event?.slug}
          hint="Lowercase letters, numbers, hyphens — used in the event URL"
          required
        />
      </div>

      <TextAreaField label="Description" name="description" defaultValue={event?.description} required />

      <ImageUploader name="coverImageUrl" label="Cover image" defaultValue={event?.coverImageUrl} />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Starts at"
          name="startsAt"
          type="datetime-local"
          defaultValue={toLocalInputValue(event?.startsAt)}
          required
        />
        <TextField
          label="Ends at (optional)"
          name="endsAt"
          type="datetime-local"
          defaultValue={toLocalInputValue(event?.endsAt)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField label="Location (optional)" name="location" defaultValue={event?.location ?? ""} />
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Status</span>
          <select
            name="status"
            defaultValue={event?.status ?? "DRAFT"}
            className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </label>
      </div>

      <CheckboxField label="This is a virtual / online event" name="isVirtual" defaultChecked={event?.isVirtual ?? false} />

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Registration</span>
        <select
          name="registrationMode"
          value={registrationMode}
          onChange={(e) => setRegistrationMode(e.target.value)}
          className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          <option value="INTERNAL">Use the built-in registration form</option>
          <option value="EXTERNAL">Link out to an external form (Google Forms, Eventbrite, Luma, etc.)</option>
        </select>
      </label>

      {registrationMode === "EXTERNAL" && (
        <TextField
          label="Destination link"
          name="externalUrl"
          defaultValue={event?.externalUrl ?? ""}
          placeholder="https://forms.google.com/…"
          hint="The Register button will send people straight to this URL"
          required
        />
      )}

      <CheckboxField label="Visible on the site" name="visible" defaultChecked={event?.visible ?? true} />

      <div className="flex items-center gap-3">
        <SubmitButton>{event ? "Save changes" : "Create event"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
