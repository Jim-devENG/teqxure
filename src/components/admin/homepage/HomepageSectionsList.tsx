"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { reorderSectionsAction, toggleSectionVisibilityAction } from "@/lib/actions/homepage";
import { sectionRegistry, type SectionKey } from "@/lib/sectionSchemas";
import { cn } from "@/lib/utils";

interface SectionRow {
  id: string;
  key: string;
  visible: boolean;
}

export function HomepageSectionsList({ sections }: { sections: SectionRow[] }) {
  const [rows, setRows] = useState(sections);
  const [, startTransition] = useTransition();

  function handleToggle(key: string, visible: boolean) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, visible } : r)));
    startTransition(() => {
      toggleSectionVisibilityAction(key, visible);
    });
  }

  return (
    <ReorderableList
      items={rows}
      onReorder={(orderedIds) => {
        const orderedKeys = orderedIds
          .map((id) => rows.find((r) => r.id === id)?.key)
          .filter((k): k is string => Boolean(k));
        reorderSectionsAction(orderedKeys);
      }}
      renderItem={(row) => {
        const definition = sectionRegistry[row.key as SectionKey];
        return (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-graphite">{definition?.label ?? row.key}</p>
              <p className="text-xs text-slate">{definition?.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleToggle(row.key, !row.visible)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors cursor-pointer",
                  row.visible
                    ? "border-light-gray text-slate hover:border-blue hover:text-blue"
                    : "border-light-gray bg-soft-white text-slate",
                )}
              >
                {row.visible ? <Eye className="h-3.5 w-3.5" strokeWidth={1.5} /> : <EyeOff className="h-3.5 w-3.5" strokeWidth={1.5} />}
                {row.visible ? "Visible" : "Hidden"}
              </button>
              <Link
                href={`/homepage/${row.key}`}
                className="flex items-center gap-1.5 rounded-lg border border-light-gray px-2.5 py-1.5 text-xs text-graphite transition-colors hover:border-blue hover:text-blue"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                Edit
              </Link>
            </div>
          </div>
        );
      }}
    />
  );
}
