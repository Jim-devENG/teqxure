import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { EventFieldsList } from "@/components/admin/events/EventFieldsList";

export default async function EventFormFieldsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await db.event.findUnique({ where: { id } });
  if (!event) notFound();

  const fields = await db.eventFormField.findMany({
    where: { eventId: id, deletedAt: null },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title={`${event.title} — Registration form`}
        description="The fields shown on this event's registration form, in order."
        action={
          <Link
            href={`/events/${id}/form/new`}
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New field
          </Link>
        }
      />
      <EventFieldsList eventId={id} fields={fields} />
    </div>
  );
}
