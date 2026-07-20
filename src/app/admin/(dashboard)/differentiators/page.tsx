import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DifferentiatorsList } from "@/components/admin/differentiators/DifferentiatorsList";

export default async function DifferentiatorsPage() {
  const differentiators = await db.differentiator.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="What Makes Teqxure Different"
        description="Differentiator cards shown on the About page."
        action={
          <Link
            href="/differentiators/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New differentiator
          </Link>
        }
      />
      <DifferentiatorsList items={differentiators} />
    </div>
  );
}
