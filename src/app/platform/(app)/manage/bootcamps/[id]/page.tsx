import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { BootcampForm } from "@/components/platform/manage/BootcampForm";
import { WeeksList } from "@/components/platform/manage/WeeksList";
import { ResourceForm } from "@/components/platform/manage/ResourceForm";
import { ResourcesList } from "@/components/platform/manage/ResourcesList";

export default async function BootcampDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bootcamp = await db.bootcamp.findUnique({
    where: { id },
    include: { weeks: { orderBy: { weekNumber: "asc" } }, resources: { orderBy: { order: "asc" } } },
  });
  if (!bootcamp) notFound();

  const weekLabels = Object.fromEntries(bootcamp.weeks.map((w) => [w.id, `Week ${w.weekNumber}`]));

  return (
    <div className="flex flex-col gap-10">
      <div>
        <PageHeader title={bootcamp.title} description="Edit the bootcamp's details." />
        <BootcampForm bootcamp={bootcamp} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-graphite">Weeks</h2>
          <Link
            href={`/manage/bootcamps/${bootcamp.id}/weeks/new`}
            className="flex items-center gap-1.5 rounded-lg border border-light-gray px-3 py-1.5 text-xs text-slate transition-colors hover:border-blue hover:text-blue"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Add week
          </Link>
        </div>
        <WeeksList weeks={bootcamp.weeks} />
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium text-graphite">Resources</h2>
        <div className="mb-4 rounded-2xl border border-light-gray bg-white p-5 shadow-sm">
          <ResourceForm bootcampId={bootcamp.id} weeks={bootcamp.weeks} />
        </div>
        <ResourcesList resources={bootcamp.resources} weekLabels={weekLabels} />
      </div>
    </div>
  );
}
