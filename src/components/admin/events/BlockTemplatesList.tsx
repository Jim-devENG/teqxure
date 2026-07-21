"use client";

import { useState, useTransition } from "react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteBlockTemplateAction } from "@/lib/actions/eventBlocks";
import { blockRegistry, type BlockType } from "@/lib/blockSchemas";

interface TemplateRow {
  id: string;
  name: string;
  type: string;
}

export function BlockTemplatesList({ templates }: { templates: TemplateRow[] }) {
  const [rows, setRows] = useState(templates);
  const [, startTransition] = useTransition();

  function remove(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => {
      deleteBlockTemplateAction(id);
    });
  }

  if (rows.length === 0) {
    return <p className="text-sm text-slate">No saved templates yet — save one from any event's block editor.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between rounded-xl border border-light-gray bg-white px-4 py-3">
          <div>
            <p className="text-sm text-graphite">{row.name}</p>
            <p className="text-xs text-slate">{blockRegistry[row.type as BlockType]?.label ?? row.type}</p>
          </div>
          <ConfirmDeleteButton action={() => remove(row.id)} label="Delete" />
        </div>
      ))}
    </div>
  );
}
