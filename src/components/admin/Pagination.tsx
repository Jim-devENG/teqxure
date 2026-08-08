import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

function hrefFor(basePath: string, searchParams: Record<string, string | undefined>, page: number): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ page, totalPages, basePath, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-xs text-slate">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        <Link
          href={hrefFor(basePath, searchParams, Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={cn(
            "flex items-center gap-1 rounded-lg border border-light-gray px-2.5 py-1.5 text-xs text-slate transition-colors hover:bg-soft-white",
            page <= 1 && "pointer-events-none opacity-40",
          )}
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Prev
        </Link>
        <Link
          href={hrefFor(basePath, searchParams, Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          className={cn(
            "flex items-center gap-1 rounded-lg border border-light-gray px-2.5 py-1.5 text-xs text-slate transition-colors hover:bg-soft-white",
            page >= totalPages && "pointer-events-none opacity-40",
          )}
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
