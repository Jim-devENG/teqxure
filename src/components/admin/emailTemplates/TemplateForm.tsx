"use client";

import { useActionState } from "react";
import { updateEmailTemplateAction, type TemplateFormState } from "@/lib/actions/emailTemplates";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface TemplateFormProps {
  template: { key: string; subject: string; body: string };
  variableHints: string[];
}

const initialState: TemplateFormState = {};

export function TemplateForm({ template, variableHints }: TemplateFormProps) {
  const action = updateEmailTemplateAction.bind(null, template.key);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <TextField label="Subject" name="subject" defaultValue={template.subject} required />
      <TextAreaField label="Body (HTML)" name="body" defaultValue={template.body} rows={12} required />

      {variableHints.length > 0 && (
        <div className="rounded-lg border border-light-gray bg-soft-white p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Available variables</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {variableHints.map((hint) => (
              <code key={hint} className="rounded bg-white px-2 py-1 text-xs text-graphite">
                {`{{${hint}}}`}
              </code>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton>Save template</SubmitButton>
        {state.success && <span className="text-sm text-emerald">Saved.</span>}
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
