"use client";

import { useActionState } from "react";
import { updateSettingsAction, type SettingsState } from "@/lib/actions/settings";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface SocialLink {
  label: string;
  href: string;
}

interface SettingsFormProps {
  defaults: {
    siteName: string;
    tagline: string;
    contactEmail: string;
    notificationEmail: string;
    seoTitle: string;
    seoDescription: string;
    socialLinks: SocialLink[];
  };
}

const initialState: SettingsState = {};

export function SettingsForm({ defaults }: SettingsFormProps) {
  const [state, formAction] = useActionState(updateSettingsAction, initialState);

  const twitter = defaults.socialLinks.find((l) => l.label.includes("Twitter"))?.href ?? "";
  const linkedin = defaults.socialLinks.find((l) => l.label.includes("LinkedIn"))?.href ?? "";
  const github = defaults.socialLinks.find((l) => l.label.includes("GitHub"))?.href ?? "";

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
            hint="Receives an email whenever someone joins the waitlist"
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
        <h2 className="mb-4 text-sm font-medium text-graphite">Social links</h2>
        <div className="flex flex-col gap-4">
          <TextField label="X / Twitter URL" name="socialTwitter" defaultValue={twitter} />
          <TextField label="LinkedIn URL" name="socialLinkedin" defaultValue={linkedin} />
          <TextField label="GitHub URL" name="socialGithub" defaultValue={github} />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <SubmitButton>Save settings</SubmitButton>
        {state.success && <span className="text-sm text-emerald">Saved.</span>}
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
