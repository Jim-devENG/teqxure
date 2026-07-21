"use client";

import { useActionState } from "react";
import { updateSectionAction, type SectionFormState } from "@/lib/actions/homepage";
import type { FieldMeta, SectionKey } from "@/lib/sectionSchemas";
import { FieldRenderer } from "@/components/admin/FieldRenderer";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface DynamicSectionFormProps {
  sectionKey: SectionKey;
  fields: FieldMeta[];
  content: Record<string, unknown>;
}

const initialState: SectionFormState = {};

export function DynamicSectionForm({ sectionKey, fields, content }: DynamicSectionFormProps) {
  const boundAction = updateSectionAction.bind(null, sectionKey);
  const [state, formAction] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {fields.map((field) => (
        <FieldRenderer key={field.key} field={field} value={content[field.key]} />
      ))}

      <div className="flex items-center gap-3">
        <SubmitButton>Save changes</SubmitButton>
        {state.success && <span className="text-sm text-emerald">Saved. Live on the site now.</span>}
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
