"use client";

import { useActionState, useState } from "react";
import { updateEventBlockAction, saveBlockAsTemplateAction, type BlockFormState } from "@/lib/actions/eventBlocks";
import type { FieldMeta } from "@/lib/sectionSchemas";
import { FieldRenderer, type ReferenceOption } from "@/components/admin/FieldRenderer";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface DynamicBlockFormProps {
  blockId: string;
  fields: FieldMeta[];
  content: Record<string, unknown>;
  referenceOptions?: Record<string, ReferenceOption[]>;
}

const initialState: BlockFormState = {};

export function DynamicBlockForm({ blockId, fields, content, referenceOptions }: DynamicBlockFormProps) {
  const boundAction = updateEventBlockAction.bind(null, blockId);
  const [state, formAction] = useActionState(boundAction, initialState);
  const [templateName, setTemplateName] = useState("");
  const [templateMessage, setTemplateMessage] = useState("");

  async function handleSaveTemplate() {
    const result = await saveBlockAsTemplateAction(blockId, templateName);
    setTemplateMessage(result.error ?? "Saved as a reusable template.");
    if (!result.error) setTemplateName("");
  }

  return (
    <div className="flex flex-col gap-8">
      <form action={formAction} className="flex max-w-2xl flex-col gap-5">
        {fields.length === 0 ? (
          <p className="text-sm text-slate">This block has no configurable fields — it's a plain divider.</p>
        ) : (
          fields.map((field) => (
            <FieldRenderer key={field.key} field={field} value={content[field.key]} referenceOptions={referenceOptions} />
          ))
        )}

        <div className="flex items-center gap-3">
          <SubmitButton>Save changes</SubmitButton>
          {state.success && <span className="text-sm text-emerald">Saved. Live on the site now.</span>}
          {state.error && <span className="text-sm text-red-500">{state.error}</span>}
        </div>
      </form>

      <div className="max-w-2xl rounded-2xl border border-light-gray bg-soft-white p-5">
        <p className="text-sm font-medium text-graphite">Save as reusable template</p>
        <p className="mt-1 text-xs text-slate">
          Snapshot this block's current content so you can insert a copy of it into other events later.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template name"
            className="w-full max-w-xs rounded-lg border border-light-gray bg-white px-3 py-2 text-sm text-graphite outline-none focus:border-blue"
          />
          <button
            type="button"
            onClick={handleSaveTemplate}
            className="shrink-0 rounded-lg border border-light-gray px-3 py-2 text-sm text-graphite transition-colors hover:border-blue hover:text-blue cursor-pointer"
          >
            Save template
          </button>
        </div>
        {templateMessage && <p className="mt-2 text-xs text-slate">{templateMessage}</p>}
      </div>
    </div>
  );
}
