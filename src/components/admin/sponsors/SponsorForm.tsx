"use client";

import { useActionState } from "react";
import { createSponsorAction, updateSponsorAction, type SponsorFormState } from "@/lib/actions/sponsors";
import { TextField, CheckboxField } from "@/components/admin/Field";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface SponsorFormProps {
  sponsor?: {
    id: string;
    name: string;
    logoUrl: string | null;
    url: string | null;
    visible: boolean;
  };
}

const initialState: SponsorFormState = {};

export function SponsorForm({ sponsor }: SponsorFormProps) {
  const action = sponsor ? updateSponsorAction.bind(null, sponsor.id) : createSponsorAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <TextField label="Name" name="name" defaultValue={sponsor?.name} required />
      <ImageUploader name="logoUrl" label="Logo" defaultValue={sponsor?.logoUrl} />
      <TextField label="Website (optional)" name="url" defaultValue={sponsor?.url ?? ""} placeholder="https://…" />
      <CheckboxField label="Visible" name="visible" defaultChecked={sponsor?.visible ?? true} />

      <div className="flex items-center gap-3">
        <SubmitButton>{sponsor ? "Save changes" : "Add sponsor"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
