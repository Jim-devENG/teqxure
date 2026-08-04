"use client";

import { useActionState, useState, useTransition } from "react";
import { updateAiProviderAction, testAiProviderAction, type ProviderFormState } from "@/lib/actions/aiProviders";
import { TextField, CheckboxField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface AiProviderFormProps {
  provider: {
    provider: string;
    type: "CHAT" | "VIDEO";
    label: string;
    hasKey: boolean;
    baseUrl: string;
    defaultModel: string;
    enabled: boolean;
  };
}

const initialState: ProviderFormState = {};

export function AiProviderForm({ provider }: AiProviderFormProps) {
  const action = updateAiProviderAction.bind(null, provider.provider);
  const [state, formAction] = useActionState(action, initialState);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isTesting, startTest] = useTransition();

  function handleTest() {
    setTestResult(null);
    startTest(async () => {
      const result = await testAiProviderAction(provider.provider);
      setTestResult(result);
    });
  }

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <TextField
        label="API key"
        name="apiKey"
        type="password"
        autoComplete="off"
        placeholder={provider.hasKey ? "Leave blank to keep the saved key" : "Enter your API key"}
        hint={provider.hasKey ? "A key is already saved — this field never shows it back." : "Not configured yet."}
      />
      <TextField label="Default model" name="defaultModel" defaultValue={provider.defaultModel} required />
      <TextField
        label="Base URL"
        name="baseUrl"
        defaultValue={provider.baseUrl}
        hint="Optional — leave blank to use the provider's default endpoint."
      />
      <CheckboxField label="Enabled" name="enabled" defaultChecked={provider.enabled} />

      <div className="flex items-center gap-3">
        <SubmitButton>Save</SubmitButton>
        {state.success && <span className="text-sm text-emerald">Saved.</span>}
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>

      {provider.type === "CHAT" ? (
        <div className="rounded-lg border border-light-gray bg-soft-white p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="cursor-pointer rounded-lg border border-light-gray px-3 py-2 text-sm text-graphite transition-colors hover:border-blue hover:text-blue disabled:opacity-60"
            >
              {isTesting ? "Sending…" : "Send test message"}
            </button>
            {testResult && (
              <span className={`text-sm ${testResult.ok ? "text-emerald" : "text-red-500"}`}>
                {testResult.ok ? `Ok — "${testResult.message}"` : testResult.message}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-slate">Uses the key currently saved above — save first if you just changed it.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-light-gray bg-soft-white p-4">
          <p className="text-xs text-slate">
            This is a key-storage slot only — no video-generation feature is wired up to use it yet.
          </p>
        </div>
      )}
    </form>
  );
}
