import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { CoreValuesList } from "@/components/admin/coreValues/CoreValuesList";

export default async function CoreValuesPage() {
  const coreValues = await db.coreValue.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Core Values"
        description="What Teqxure stands for — shown on the About page."
        action={
          <Link
            href="/core-values/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New core value
          </Link>
        }
      />
      <CoreValuesList items={coreValues} />
    </div>
  );
}
