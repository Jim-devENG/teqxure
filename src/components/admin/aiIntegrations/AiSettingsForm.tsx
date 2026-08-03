"use client";

import { useActionState } from "react";
import { updateAiSettingsAction, type ProviderFormState } from "@/lib/actions/aiProviders";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface AiSettingsFormProps {
  defaults: {
    activeProvider: string;
    systemPrompt: string;
    dailyMessageLimit: number;
  };
  enabledProviders: { provider: string; label: string }[];
}

const initialState: ProviderFormState = {};

export function AiSettingsForm({ defaults, enabledProviders }: AiSettingsFormProps) {
  const [state, formAction] = useActionState(updateAiSettingsAction, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Active provider</span>
        <select
          name="activeProvider"
          defaultValue={defaults.activeProvider}
          className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-blue"
        >
          <option value="">None selected</option>
          {enabledProviders.map((p) => (
            <option key={p.provider} value={p.provider}>
              {p.label}
            </option>
          ))}
        </select>
        {enabledProviders.length === 0 && (
          <span className="mt-1.5 block text-xs text-slate">Enable at least one provider below before selecting it here.</span>
        )}
      </label>

      <TextAreaField
        label="System prompt"
        name="systemPrompt"
        defaultValue={defaults.systemPrompt}
        rows={8}
        required
        hint="Defines Teqxure AI's persona and instructions for every student conversation."
      />

      <TextField
        label="Daily message limit per student"
        name="dailyMessageLimit"
        type="number"
        min={1}
        defaultValue={defaults.dailyMessageLimit}
        required
        hint="Caps how many messages one student can send per day, to bound API cost."
      />

      <div className="flex items-center gap-3">
        <SubmitButton>Save</SubmitButton>
        {state.success && <span className="text-sm text-emerald">Saved.</span>}
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
