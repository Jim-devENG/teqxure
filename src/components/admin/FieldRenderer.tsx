"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { FieldMeta } from "@/lib/sectionSchemas";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { ListEditor } from "@/components/admin/ListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { MultiImageUploader } from "@/components/admin/MultiImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SocialLinksEditor } from "@/components/admin/SocialLinksEditor";
import { ReferenceListField } from "@/components/admin/ReferenceListField";

export interface ReferenceOption {
  id: string;
  label: string;
}

interface FieldRendererProps {
  field: FieldMeta;
  value: unknown;
  referenceOptions?: Record<string, ReferenceOption[]>;
}

export function FieldRenderer({ field, value, referenceOptions }: FieldRendererProps) {
  switch (field.type) {
    case "textarea":
      return <TextAreaField label={field.label} name={field.key} defaultValue={String(value ?? "")} />;
    case "richtext":
      return <RichTextEditor name={field.key} label={field.label} defaultValue={String(value ?? "")} />;
    case "image":
      return <ImageUploader name={field.key} label={field.label} defaultValue={String(value ?? "")} />;
    case "image-list":
      return (
        <MultiImageUploader
          name={field.key}
          label={field.label}
          defaultValues={Array.isArray(value) ? (value as string[]) : []}
        />
      );
    case "reference-list":
      return (
        <ReferenceListField
          name={field.key}
          label={field.label}
          options={referenceOptions?.[field.key] ?? []}
          defaultValues={Array.isArray(value) ? (value as string[]) : []}
        />
      );
    case "list-string":
      return (
        <ListEditor
          name={field.key}
          label={field.label}
          defaultValues={Array.isArray(value) ? (value as string[]) : []}
        />
      );
    case "list-object":
      if (field.key === "socialLinks") {
        return (
          <SocialLinksEditor
            defaultValues={Array.isArray(value) ? (value as { platform: string; href: string }[]) : []}
          />
        );
      }
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
                {sub.type === "textarea" ? (
                  <textarea
                    name={`${field.key}.${i}.${sub.key}`}
                    defaultValue={String(item[sub.key] ?? "")}
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-light-gray bg-white px-2.5 py-2 text-sm text-graphite outline-none focus:border-blue"
                  />
                ) : (
                  <input
                    name={`${field.key}.${i}.${sub.key}`}
                    defaultValue={String(item[sub.key] ?? "")}
                    type={sub.type === "number" ? "number" : "text"}
                    className="mt-1 w-full rounded-lg border border-light-gray bg-white px-2.5 py-2 text-sm text-graphite outline-none focus:border-blue"
                  />
                )}
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
