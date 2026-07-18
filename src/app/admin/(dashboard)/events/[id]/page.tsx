import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { EventForm } from "@/components/admin/events/EventForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await db.event.findUnique({ where: { id } });

  if (!event) notFound();

  return (
    <div>
      <PageHeader title={event.title} description="Edit this event." />
      <EventForm event={event} />
    </div>
  );
}
