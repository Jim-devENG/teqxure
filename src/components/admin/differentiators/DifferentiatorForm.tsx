"use client";

import { useActionState } from "react";
import {
  createDifferentiatorAction,
  updateDifferentiatorAction,
  type DifferentiatorFormState,
} from "@/lib/actions/differentiators";
import { TextField, TextAreaField, CheckboxField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface DifferentiatorFormProps {
  differentiator?: {
    id: string;
    heading: string;
    description: string;
    icon: string;
    visible: boolean;
  };
}

const initialState: DifferentiatorFormState = {};

export function DifferentiatorForm({ differentiator }: DifferentiatorFormProps) {
  const action = differentiator
    ? updateDifferentiatorAction.bind(null, differentiator.id)
    : createDifferentiatorAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <TextField label="Heading" name="heading" defaultValue={differentiator?.heading} required placeholder="Product Engineering" />
      <TextAreaField label="Description" name="description" defaultValue={differentiator?.description} required />
      <TextField
        label="Icon"
        name="icon"
        defaultValue={differentiator?.icon}
        required
        placeholder="Layers"
        hint="A Lucide icon name (e.g. Layers, Blocks, Sparkles) — see lucide.dev/icons"
      />

      <CheckboxField label="Visible" name="visible" defaultChecked={differentiator?.visible ?? true} />

      <div className="flex items-center gap-3">
        <SubmitButton>{differentiator ? "Save changes" : "Add differentiator"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
