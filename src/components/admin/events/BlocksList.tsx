"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import {
  reorderEventBlocksAction,
  deleteEventBlockAction,
  toggleEventBlockVisibilityAction,
} from "@/lib/actions/eventBlocks";
import { blockRegistry, type BlockType } from "@/lib/blockSchemas";
import { cn } from "@/lib/utils";

interface BlockRow {
  id: string;
  type: string;
  visible: boolean;
}

export function BlocksList({ eventId, blocks }: { eventId: string; blocks: BlockRow[] }) {
  const [rows, setRows] = useState(blocks);
  const [, startTransition] = useTransition();

  function remove(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => {
      deleteEventBlockAction(id);
    });
  }

  function handleToggle(id: string, visible: boolean) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, visible } : r)));
    startTransition(() => {
      toggleEventBlockVisibilityAction(id, visible);
    });
  }

  if (rows.length === 0) {
    return <p className="text-sm text-slate">No content blocks yet — add one below.</p>;
  }

  return (
    <ReorderableList
      items={rows}
      onReorder={(orderedIds) => reorderEventBlocksAction(eventId, orderedIds)}
      renderItem={(row) => {
        const definition = blockRegistry[row.type as BlockType];
        return (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-graphite">{definition?.label ?? row.type}</p>
              <p className="text-xs text-slate">{definition?.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggle(row.id, !row.visible)}
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
                href={`/events/${eventId}/blocks/${row.id}`}
                className="flex items-center gap-1.5 rounded-lg border border-light-gray px-2.5 py-1.5 text-xs text-graphite transition-colors hover:border-blue hover:text-blue"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                Edit
              </Link>
              <ConfirmDeleteButton action={() => remove(row.id)} label="" />
            </div>
          </div>
        );
      }}
    />
  );
}
