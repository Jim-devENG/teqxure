"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface ListEditorProps {
  name: string;
  label: string;
  defaultValues?: string[];
  placeholder?: string;
  multiline?: boolean;
}

export function ListEditor({ name, label, defaultValues = [], placeholder, multiline }: ListEditorProps) {
  const [items, setItems] = useState(defaultValues.length > 0 ? defaultValues : [""]);
  const Field = multiline ? "textarea" : "input";

  return (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">{label}</span>
      <div className="mt-2 flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <Field
              name={name}
              defaultValue={item}
              placeholder={placeholder}
              rows={multiline ? 2 : undefined}
              className="w-full rounded-lg border border-light-gray bg-white px-3 py-2 text-sm text-graphite outline-none focus:border-blue"
            />
            <button
              type="button"
              onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
              className="mt-2 text-slate hover:text-red-500 cursor-pointer"
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, ""])}
          className="flex w-fit items-center gap-1.5 text-xs text-blue cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
          Add item
        </button>
      </div>
    </div>
  );
}
