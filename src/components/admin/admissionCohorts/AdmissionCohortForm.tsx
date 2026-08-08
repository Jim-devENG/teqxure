"use client";

import { useActionState } from "react";
import {
  createAdmissionCohortAction,
  updateAdmissionCohortAction,
  type AdmissionCohortFormState,
} from "@/lib/actions/admissionCohorts";
import { TextField, SelectField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface AdmissionCohortFormProps {
  cohort?: {
    id: string;
    name: string;
    slug: string;
    applicationsOpenAt: Date;
    applicationsCloseAt: Date | null;
    capacity: number | null;
    status: string;
  };
}

const initialState: AdmissionCohortFormState = {};

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function AdmissionCohortForm({ cohort }: AdmissionCohortFormProps) {
  const action = cohort ? updateAdmissionCohortAction.bind(null, cohort.id) : createAdmissionCohortAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <TextField label="Name" name="name" defaultValue={cohort?.name} required placeholder="Cohort 8" />
      <TextField
        label="Slug"
        name="slug"
        defaultValue={cohort?.slug}
        required
        placeholder="cohort-8"
        hint="Lowercase letters, numbers, and hyphens only."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          label="Applications open"
          name="applicationsOpenAt"
          type="date"
          defaultValue={toDateInputValue(cohort?.applicationsOpenAt ?? new Date())}
          required
        />
        <TextField
          label="Applications close (optional)"
          name="applicationsCloseAt"
          type="date"
          defaultValue={toDateInputValue(cohort?.applicationsCloseAt ?? null)}
          hint="Also sets when onboarding links for this cohort expire."
        />
      </div>

      <TextField
        label="Capacity (optional)"
        name="capacity"
        type="number"
        min={0}
        defaultValue={cohort?.capacity ?? undefined}
      />

      <SelectField label="Status" name="status" defaultValue={cohort?.status ?? "DRAFT"} required>
        <option value="DRAFT">Draft — not visible on /apply</option>
        <option value="OPEN">Open — accepting applications</option>
        <option value="REVIEWING">Reviewing — applications closed, under review</option>
        <option value="CLOSED">Closed</option>
      </SelectField>

      <div className="flex items-center gap-3">
        <SubmitButton>{cohort ? "Save changes" : "Create cohort"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
