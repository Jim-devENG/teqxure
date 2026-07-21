import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { BlocksList } from "@/components/admin/events/BlocksList";
import { AddBlockForm } from "@/components/admin/events/AddBlockForm";
import { UseTemplateForm } from "@/components/admin/events/UseTemplateForm";

export default async function EventBlocksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [event, templates] = await Promise.all([
    db.event.findUnique({ where: { id }, include: { blocks: { orderBy: { order: "asc" } } } }),
    db.blockTemplate.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  if (!event) notFound();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={event.title} description="Compose this event's page from content blocks — drag to reorder." />

      <BlocksList eventId={event.id} blocks={event.blocks} />

      <div className="flex flex-col gap-4">
        <AddBlockForm eventId={event.id} />
        <UseTemplateForm eventId={event.id} templates={templates} />
      </div>
    </div>
  );
}
