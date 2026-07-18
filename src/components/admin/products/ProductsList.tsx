"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Star, Eye, EyeOff, Pencil } from "lucide-react";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { reorderProductsAction, toggleProductFieldAction, deleteProductAction } from "@/lib/actions/products";
import { cn } from "@/lib/utils";

interface ProductRow {
  id: string;
  name: string;
  category: string;
  accent: string;
  featured: boolean;
  visible: boolean;
}

export function ProductsList({ products }: { products: ProductRow[] }) {
  const [rows, setRows] = useState(products);
  const [, startTransition] = useTransition();

  function toggle(id: string, field: "visible" | "featured", value: boolean) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    startTransition(() => {
      toggleProductFieldAction(id, field, value);
    });
  }

  function remove(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => {
      deleteProductAction(id);
    });
  }

  return (
    <ReorderableList
      items={rows}
      onReorder={(orderedIds) => reorderProductsAction(orderedIds)}
      renderItem={(row) => (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-graphite">{row.name}</p>
            <p className="text-xs text-slate">{row.category}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggle(row.id, "featured", !row.featured)}
              className={cn(
                "rounded-lg border border-light-gray p-1.5 transition-colors cursor-pointer",
                row.featured ? "text-blue" : "text-slate hover:text-blue",
              )}
              aria-label="Toggle featured"
            >
              <Star className="h-3.5 w-3.5" strokeWidth={1.5} fill={row.featured ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              onClick={() => toggle(row.id, "visible", !row.visible)}
              className="rounded-lg border border-light-gray p-1.5 text-slate transition-colors hover:text-blue cursor-pointer"
              aria-label="Toggle visible"
            >
              {row.visible ? <Eye className="h-3.5 w-3.5" strokeWidth={1.5} /> : <EyeOff className="h-3.5 w-3.5" strokeWidth={1.5} />}
            </button>
            <Link
              href={`/admin/products/${row.id}`}
              className="rounded-lg border border-light-gray p-1.5 text-slate transition-colors hover:text-blue"
              aria-label="Edit"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
            <ConfirmDeleteButton action={() => remove(row.id)} label="" />
          </div>
        </div>
      )}
    />
  );
}
