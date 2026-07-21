import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { EventForm } from "@/components/admin/events/EventForm";

export default async function NewEventPage() {
  const categories = await db.category.findMany({ where: { deletedAt: null }, orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="New event" description="Create an event and choose how people register." />
      <EventForm categories={categories} />
    </div>
  );
}
