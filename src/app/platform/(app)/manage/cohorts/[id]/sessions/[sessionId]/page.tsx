import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { LiveSessionForm } from "@/components/platform/manage/LiveSessionForm";

export default async function EditLiveSessionPage({ params }: { params: Promise<{ id: string; sessionId: string }> }) {
  const { id, sessionId } = await params;
  const [cohort, session] = await Promise.all([
    db.cohort.findUnique({ where: { id }, include: { bootcamp: { include: { weeks: { orderBy: { weekNumber: "asc" } } } } } }),
    db.liveSession.findUnique({ where: { id: sessionId } }),
  ]);
  if (!cohort || !session || session.cohortId !== id) notFound();

  return (
    <div>
      <PageHeader title="Edit live session" description={cohort.name} />
      <LiveSessionForm cohortId={id} weeks={cohort.bootcamp.weeks} session={session} />
    </div>
  );
}
