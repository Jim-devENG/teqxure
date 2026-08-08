"use client";

import { useActionState } from "react";
import {
  createAssessmentSectionAction,
  updateAssessmentSectionAction,
  type SectionFormState,
} from "@/lib/actions/assessmentQuestions";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface SectionFormProps {
  section?: { id: string; key: string; title: string; description: string | null };
}

const initialState: SectionFormState = {};

export function SectionForm({ section }: SectionFormProps) {
  const action = section ? updateAssessmentSectionAction.bind(null, section.id) : createAssessmentSectionAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <TextField
        label="Key"
        name="key"
        defaultValue={section?.key}
        required
        placeholder="PERSONAL_BACKGROUND"
        hint="A stable identifier — used internally, not shown to applicants."
      />
      <TextField label="Title" name="title" defaultValue={section?.title} required placeholder="Personal Background" />
      <TextAreaField label="Description (optional)" name="description" defaultValue={section?.description ?? ""} />

      <div className="flex items-center gap-3">
        <SubmitButton>{section ? "Save changes" : "Add section"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
