import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { WeeksList } from "@/components/admin/curriculum/WeeksList";

export default async function CurriculumPage() {
  const weeks = await db.curriculumWeek.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Curriculum"
        description="The twelve-week roadmap shown on the homepage."
        action={
          <Link
            href="/curriculum/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New week
          </Link>
        }
      />
      <WeeksList weeks={weeks} />
    </div>
  );
}
