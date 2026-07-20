"use client";

import { useActionState } from "react";
import { createTeamMemberAction, updateTeamMemberAction, type TeamMemberFormState } from "@/lib/actions/team";
import { TextField, TextAreaField, CheckboxField } from "@/components/admin/Field";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SocialLinksEditor } from "@/components/admin/SocialLinksEditor";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { normalizeSocialLinks } from "@/lib/socialPlatforms";

interface TeamMemberFormProps {
  teamMember?: {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    photoUrl: string | null;
    socialLinks: unknown;
    visible: boolean;
  };
}

const initialState: TeamMemberFormState = {};

export function TeamMemberForm({ teamMember }: TeamMemberFormProps) {
  const action = teamMember ? updateTeamMemberAction.bind(null, teamMember.id) : createTeamMemberAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <TextField label="Name" name="name" defaultValue={teamMember?.name} required />
      <TextField label="Position" name="role" defaultValue={teamMember?.role} required placeholder="Senior Product Engineer" />
      <TextAreaField label="Biography (optional)" name="bio" defaultValue={teamMember?.bio ?? ""} />

      <ImageUploader name="photoUrl" label="Profile image" defaultValue={teamMember?.photoUrl} />

      <SocialLinksEditor defaultValues={normalizeSocialLinks(teamMember?.socialLinks)} />

      <CheckboxField label="Visible" name="visible" defaultChecked={teamMember?.visible ?? true} />

      <div className="flex items-center gap-3">
        <SubmitButton>{teamMember ? "Save changes" : "Add team member"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
