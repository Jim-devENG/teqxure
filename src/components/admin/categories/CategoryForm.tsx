"use client";

import { useActionState } from "react";
import { createCategoryAction, updateCategoryAction, type CategoryFormState } from "@/lib/actions/categories";
import { TextField, CheckboxField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    slug: string;
    visible: boolean;
  };
}

const initialState: CategoryFormState = {};

export function CategoryForm({ category }: CategoryFormProps) {
  const action = category ? updateCategoryAction.bind(null, category.id) : createCategoryAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <TextField label="Name" name="name" defaultValue={category?.name} required placeholder="Artificial Intelligence" />
      <TextField
        label="Slug"
        name="slug"
        defaultValue={category?.slug}
        required
        placeholder="artificial-intelligence"
        hint="Lowercase letters, numbers, hyphens"
      />
      <CheckboxField label="Visible" name="visible" defaultChecked={category?.visible ?? true} />

      <div className="flex items-center gap-3">
        <SubmitButton>{category ? "Save changes" : "Add category"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
