"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEventBlockAction } from "@/lib/actions/eventBlocks";
import { blockRegistry, BLOCK_TYPES, type BlockType } from "@/lib/blockSchemas";
import { SubmitButton } from "@/components/admin/SubmitButton";

export function AddBlockForm({ eventId }: { eventId: string }) {
  const [type, setType] = useState<BlockType>(BLOCK_TYPES[0]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAdd() {
    startTransition(async () => {
      const result = await createEventBlockAction(eventId, type);
      if ("error" in result) {
        setError(result.error);
      } else {
        router.push(`/events/${eventId}/blocks/${result.id}`);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-light-gray bg-white p-5 shadow-sm">
      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Add a block</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as BlockType)}
          className="mt-2 rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          {BLOCK_TYPES.map((t) => (
            <option key={t} value={t}>
              {blockRegistry[t].label}
            </option>
          ))}
        </select>
      </label>
      <SubmitButton type="button" onClick={handleAdd} disabled={isPending}>
        {isPending ? "Adding…" : "Add block"}
      </SubmitButton>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
