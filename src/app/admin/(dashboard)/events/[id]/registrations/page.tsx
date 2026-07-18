import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { EventRegistrationsTable } from "@/components/admin/events/EventRegistrationsTable";

export default async function EventRegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await db.event.findUnique({ where: { id } });
  if (!event) notFound();

  const registrations = await db.eventRegistration.findMany({
    where: { eventId: id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title={`${event.title} — Registrations`} description="People who registered for this event." />
      <EventRegistrationsTable
        eventId={id}
        registrations={registrations.map((r) => ({
          id: r.id,
          data: r.data as Record<string, string>,
          status: r.status,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
