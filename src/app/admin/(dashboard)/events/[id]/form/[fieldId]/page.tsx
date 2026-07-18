import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { EventFieldForm } from "@/components/admin/events/EventFieldForm";

export default async function EditEventFieldPage({
  params,
}: {
  params: Promise<{ id: string; fieldId: string }>;
}) {
  const { id, fieldId } = await params;
  const field = await db.eventFormField.findUnique({ where: { id: fieldId } });
  if (!field || field.eventId !== id) notFound();

  return (
    <div>
      <PageHeader title={field.label} />
      <EventFieldForm eventId={id} field={field} />
    </div>
  );
}
