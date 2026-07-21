"use client";

import { useActionState } from "react";
import { createSpeakerAction, updateSpeakerAction, type SpeakerFormState } from "@/lib/actions/speakers";
import { TextField, TextAreaField, CheckboxField } from "@/components/admin/Field";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SocialLinksEditor } from "@/components/admin/SocialLinksEditor";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { normalizeSocialLinks } from "@/lib/socialPlatforms";

interface SpeakerFormProps {
  speaker?: {
    id: string;
    name: string;
    title: string;
    company: string | null;
    bio: string | null;
    photoUrl: string | null;
    socialLinks: unknown;
    visible: boolean;
  };
}

const initialState: SpeakerFormState = {};

export function SpeakerForm({ speaker }: SpeakerFormProps) {
  const action = speaker ? updateSpeakerAction.bind(null, speaker.id) : createSpeakerAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <TextField label="Name" name="name" defaultValue={speaker?.name} required />
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Professional title" name="title" defaultValue={speaker?.title} required placeholder="CTO" />
        <TextField label="Company (optional)" name="company" defaultValue={speaker?.company ?? ""} />
      </div>
      <TextAreaField label="Biography (optional)" name="bio" defaultValue={speaker?.bio ?? ""} />
      <ImageUploader name="photoUrl" label="Photo" defaultValue={speaker?.photoUrl} />
      <SocialLinksEditor defaultValues={normalizeSocialLinks(speaker?.socialLinks)} />
      <CheckboxField label="Visible" name="visible" defaultChecked={speaker?.visible ?? true} />

      <div className="flex items-center gap-3">
        <SubmitButton>{speaker ? "Save changes" : "Add speaker"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
