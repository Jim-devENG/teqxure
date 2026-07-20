import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { WeekForm } from "@/components/platform/manage/WeekForm";

export default async function EditWeekPage({ params }: { params: Promise<{ id: string; weekId: string }> }) {
  const { id, weekId } = await params;
  const week = await db.platformWeek.findUnique({ where: { id: weekId } });
  if (!week || week.bootcampId !== id) notFound();

  return (
    <div>
      <PageHeader title={`Week ${week.weekNumber}: ${week.title}`} description="Edit this week's objectives." />
      <WeekForm bootcampId={id} week={week} />
    </div>
  );
}
