import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { LiveSessionForm } from "@/components/platform/manage/LiveSessionForm";

export default async function NewLiveSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cohort = await db.cohort.findUnique({
    where: { id },
    include: { bootcamp: { include: { weeks: { orderBy: { weekNumber: "asc" } } } } },
  });
  if (!cohort) notFound();

  return (
    <div>
      <PageHeader title="Schedule a live session" description={cohort.name} />
      <LiveSessionForm cohortId={id} weeks={cohort.bootcamp.weeks} />
    </div>
  );
}
