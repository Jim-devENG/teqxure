"use client";

import { useActionState } from "react";
import { createBootcampAction, updateBootcampAction, type ActionState } from "@/lib/actions/bootcamp";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

interface BootcampFormProps {
  bootcamp?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    status: string;
  };
}

export function BootcampForm({ bootcamp }: BootcampFormProps) {
  const action = bootcamp ? updateBootcampAction.bind(null, bootcamp.id) : createBootcampAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <TextField label="Title" name="title" defaultValue={bootcamp?.title} required placeholder="Product Engineering Bootcamp" />
      <TextField
        label="Slug"
        name="slug"
        defaultValue={bootcamp?.slug}
        required
        placeholder="product-engineering"
        hint="Lowercase letters, numbers, and hyphens only."
      />
      <TextAreaField label="Description" name="description" defaultValue={bootcamp?.description ?? ""} />

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Status</span>
        <select
          name="status"
          defaultValue={bootcamp?.status ?? "DRAFT"}
          className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </label>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div>
        <SubmitButton>{bootcamp ? "Save changes" : "Create bootcamp"}</SubmitButton>
      </div>
    </form>
  );
}
