"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateSectionAction, type SectionFormState } from "@/lib/actions/homepage";
import type { FieldMeta, SectionKey } from "@/lib/sectionSchemas";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { ListEditor } from "@/components/admin/ListEditor";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface DynamicSectionFormProps {
  sectionKey: SectionKey;
  fields: FieldMeta[];
  content: Record<string, unknown>;
}

const initialState: SectionFormState = {};

export function DynamicSectionForm({ sectionKey, fields, content }: DynamicSectionFormProps) {
  const boundAction = updateSectionAction.bind(null, sectionKey);
  const [state, formAction] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {fields.map((field) => (
        <FieldRenderer key={field.key} field={field} value={content[field.key]} />
      ))}

      <div className="flex items-center gap-3">
        <SubmitButton>Save changes</SubmitButton>
        {state.success && <span className="text-sm text-emerald">Saved. Live on the site now.</span>}
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}

function FieldRenderer({ field, value }: { field: FieldMeta; value: unknown }) {
  switch (field.type) {
    case "textarea":
      return <TextAreaField label={field.label} name={field.key} defaultValue={String(value ?? "")} />;
    case "list-string":
      return (
        <ListEditor
          name={field.key}
          label={field.label}
          defaultValues={Array.isArray(value) ? (value as string[]) : []}
        />
      );
    case "list-object":
      return (
        <ListObjectField
          field={field}
          value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
        />
      );
    case "number":
      return <TextField label={field.label} name={field.key} type="number" defaultValue={String(value ?? 0)} />;
    default:
      return <TextField label={field.label} name={field.key} defaultValue={String(value ?? "")} />;
  }
}

function ListObjectField({ field, value }: { field: FieldMeta; value: Record<string, unknown>[] }) {
  const subFields = field.subFields ?? [];
  const [items, setItems] = useState(
    value.length > 0 ? value : [Object.fromEntries(subFields.map((s) => [s.key, ""]))],
  );

  return (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">{field.label}</span>
      <input type="hidden" name={`${field.key}__count`} value={items.length} />
      <div className="mt-2 flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-end gap-2 rounded-lg border border-light-gray p-3">
            {subFields.map((sub) => (
              <label key={sub.key} className="flex-1">
                <span className="text-[10px] uppercase tracking-wide text-slate">{sub.label}</span>
                <input
                  name={`${field.key}.${i}.${sub.key}`}
                  defaultValue={String(item[sub.key] ?? "")}
                  type={sub.type === "number" ? "number" : "text"}
                  className="mt-1 w-full rounded-lg border border-light-gray bg-white px-2.5 py-2 text-sm text-graphite outline-none focus:border-blue"
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
              className="mb-2 text-slate hover:text-red-500 cursor-pointer"
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setItems((prev) => [...prev, Object.fromEntries(subFields.map((s) => [s.key, ""]))])
          }
          className="flex w-fit items-center gap-1.5 text-xs text-blue cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
          Add row
        </button>
      </div>
    </div>
  );
}
