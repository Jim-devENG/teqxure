"use client";

import { useActionState, useState } from "react";
import {
  createEventFieldAction,
  updateEventFieldAction,
  type EventFieldFormState,
} from "@/lib/actions/eventFormFields";
import { FIELD_TYPES } from "@/lib/fieldTypes";
import { TextField, CheckboxField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface EventFieldFormProps {
  eventId: string;
  field?: {
    id: string;
    label: string;
    fieldType: string;
    placeholder: string | null;
    required: boolean;
    options: unknown;
  };
}

const initialState: EventFieldFormState = {};

export function EventFieldForm({ eventId, field }: EventFieldFormProps) {
  const action = field
    ? updateEventFieldAction.bind(null, eventId, field.id)
    : createEventFieldAction.bind(null, eventId);
  const [state, formAction] = useActionState(action, initialState);
  const [fieldType, setFieldType] = useState(field?.fieldType ?? "TEXT");
  const needsOptions = fieldType === "SELECT" || fieldType === "CHECKBOX";
  const optionsDefault = Array.isArray(field?.options) ? (field.options as string[]).join(", ") : "";

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <TextField label="Label" name="label" defaultValue={field?.label} required />

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Field type</span>
        <select
          name="fieldType"
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value)}
          className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          {FIELD_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <TextField label="Placeholder (optional)" name="placeholder" defaultValue={field?.placeholder ?? ""} />

      {needsOptions && (
        <TextField
          label="Options (comma-separated)"
          name="options"
          defaultValue={optionsDefault}
          hint="Used for Dropdown and Multiple Choice fields"
        />
      )}

      <CheckboxField label="Required" name="required" defaultChecked={field?.required ?? false} />

      <div className="flex items-center gap-3">
        <SubmitButton>{field ? "Save changes" : "Create field"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
