"use client";

import { useState, useTransition } from "react";
import { insertBlockFromTemplateAction } from "@/lib/actions/eventBlocks";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface TemplateOption {
  id: string;
  name: string;
  type: string;
}

export function UseTemplateForm({ eventId, templates }: { eventId: string; templates: TemplateOption[] }) {
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (templates.length === 0) return null;

  function handleInsert() {
    startTransition(async () => {
      const result = await insertBlockFromTemplateAction(eventId, templateId);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-light-gray bg-white p-5 shadow-sm">
      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Insert a saved template</span>
        <select
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="mt-2 rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.type})
            </option>
          ))}
        </select>
      </label>
      <SubmitButton type="button" onClick={handleInsert} disabled={isPending}>
        {isPending ? "Inserting…" : "Insert"}
      </SubmitButton>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
