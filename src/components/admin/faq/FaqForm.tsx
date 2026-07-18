"use client";

import { useActionState } from "react";
import { createFaqAction, updateFaqAction, type FaqFormState } from "@/lib/actions/faq";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface FaqFormProps {
  item?: { id: string; question: string; answer: string };
}

const initialState: FaqFormState = {};

export function FaqForm({ item }: FaqFormProps) {
  const action = item ? updateFaqAction.bind(null, item.id) : createFaqAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <TextField label="Question" name="question" defaultValue={item?.question} required />
      <TextAreaField label="Answer" name="answer" defaultValue={item?.answer} rows={5} required />
      <div className="flex items-center gap-3">
        <SubmitButton>{item ? "Save changes" : "Create FAQ"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
