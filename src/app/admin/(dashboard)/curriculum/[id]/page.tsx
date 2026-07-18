import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { WeekForm } from "@/components/admin/curriculum/WeekForm";

export default async function EditWeekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const week = await db.curriculumWeek.findUnique({
    where: { id },
    include: { outcomes: { orderBy: { order: "asc" } } },
  });

  if (!week) notFound();

  return (
    <div>
      <PageHeader title={`Week ${String(week.week).padStart(2, "0")}`} description={week.title} />
      <WeekForm week={week} />
    </div>
  );
}
