import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { EventsList } from "@/components/admin/events/EventsList";

export default async function EventsPage() {
  const events = await db.event.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Events"
        description="Manage events, their registration forms, and sign-ups."
        action={
          <Link
            href="/events/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New event
          </Link>
        }
      />
      <EventsList
        events={events.map((e) => ({
          id: e.id,
          title: e.title,
          startsAt: e.startsAt.toISOString(),
          status: e.status,
          registrationMode: e.registrationMode,
        }))}
      />
    </div>
  );
}
