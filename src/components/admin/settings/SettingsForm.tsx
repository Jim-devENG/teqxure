"use client";

import { useActionState } from "react";
import { updateSettingsAction, type SettingsState } from "@/lib/actions/settings";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { SocialLinksEditor } from "@/components/admin/SocialLinksEditor";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface SettingsFormProps {
  defaults: {
    siteName: string;
    tagline: string;
    contactEmail: string;
    notificationEmail: string;
    seoTitle: string;
    seoDescription: string;
    socialLinks: { platform: string; href: string }[];
  };
}

const initialState: SettingsState = {};

export function SettingsForm({ defaults }: SettingsFormProps) {
  const [state, formAction] = useActionState(updateSettingsAction, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <section className="rounded-xl border border-light-gray bg-white p-6">
        <h2 className="mb-4 text-sm font-medium text-graphite">Brand</h2>
        <div className="flex flex-col gap-4">
          <TextField label="Site name" name="siteName" defaultValue={defaults.siteName} required />
          <TextField label="Tagline" name="tagline" defaultValue={defaults.tagline} />
          <TextField label="Contact email" name="contactEmail" type="email" defaultValue={defaults.contactEmail} />
          <TextField
            label="Notification email"
            name="notificationEmail"
            type="email"
            defaultValue={defaults.notificationEmail}
            hint="Receives an email whenever someone joins the waitlist or registers for an event"
          />
        </div>
      </section>

      <section className="rounded-xl border border-light-gray bg-white p-6">
        <h2 className="mb-4 text-sm font-medium text-graphite">SEO defaults</h2>
        <div className="flex flex-col gap-4">
          <TextField label="Default SEO title" name="seoTitle" defaultValue={defaults.seoTitle} />
          <TextAreaField label="Default SEO description" name="seoDescription" defaultValue={defaults.seoDescription} />
        </div>
      </section>

      <section className="rounded-xl border border-light-gray bg-white p-6">
        <SocialLinksEditor defaultValues={defaults.socialLinks} />
      </section>

      <div className="flex items-center gap-3">
        <SubmitButton>Save settings</SubmitButton>
        {state.success && <span className="text-sm text-emerald">Saved.</span>}
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
