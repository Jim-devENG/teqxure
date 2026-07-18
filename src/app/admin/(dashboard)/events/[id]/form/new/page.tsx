import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { EventFieldForm } from "@/components/admin/events/EventFieldForm";

export default async function NewEventFieldPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await db.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div>
      <PageHeader title="New field" description={`Add a field to the ${event.title} registration form.`} />
      <EventFieldForm eventId={id} />
    </div>
  );
}
