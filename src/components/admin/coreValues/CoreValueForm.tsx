"use client";

import { useActionState } from "react";
import { createCoreValueAction, updateCoreValueAction, type CoreValueFormState } from "@/lib/actions/coreValues";
import { TextField, TextAreaField, CheckboxField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface CoreValueFormProps {
  coreValue?: {
    id: string;
    title: string;
    description: string;
    icon: string;
    visible: boolean;
  };
}

const initialState: CoreValueFormState = {};

export function CoreValueForm({ coreValue }: CoreValueFormProps) {
  const action = coreValue ? updateCoreValueAction.bind(null, coreValue.id) : createCoreValueAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <TextField label="Title" name="title" defaultValue={coreValue?.title} required placeholder="Craftsmanship" />
      <TextAreaField label="Description" name="description" defaultValue={coreValue?.description} required />
      <TextField
        label="Icon"
        name="icon"
        defaultValue={coreValue?.icon}
        required
        placeholder="Hammer"
        hint="A Lucide icon name (e.g. Hammer, Flag, Eye, Lightbulb) — see lucide.dev/icons"
      />

      <CheckboxField label="Visible" name="visible" defaultChecked={coreValue?.visible ?? true} />

      <div className="flex items-center gap-3">
        <SubmitButton>{coreValue ? "Save changes" : "Add core value"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
