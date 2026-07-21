import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { EventForm } from "@/components/admin/events/EventForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, categories] = await Promise.all([
    db.event.findUnique({ where: { id }, include: { categories: true } }),
    db.category.findMany({ where: { deletedAt: null }, orderBy: { order: "asc" } }),
  ]);

  if (!event) notFound();

  return (
    <div>
      <PageHeader title={event.title} description="Edit this event." />
      <EventForm event={{ ...event, categoryIds: event.categories.map((c) => c.id) }} categories={categories} />
    </div>
  );
}
