"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDeleteButtonProps {
  action: () => void;
  label?: string;
  className?: string;
}

export function ConfirmDeleteButton({ action, label = "Delete", className }: ConfirmDeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setConfirming(false);
            action();
          }}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white cursor-pointer"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-light-gray px-3 py-1.5 text-xs text-slate cursor-pointer"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate transition-colors hover:text-red-500 cursor-pointer",
        className,
      )}
    >
      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
      {label}
    </button>
  );
}
