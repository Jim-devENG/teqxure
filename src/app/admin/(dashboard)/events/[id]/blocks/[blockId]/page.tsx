import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DynamicBlockForm } from "@/components/admin/events/DynamicBlockForm";
import { blockRegistry, getReferenceFields, type BlockType } from "@/lib/blockSchemas";
import type { ReferenceOption } from "@/components/admin/FieldRenderer";

async function fetchReferenceOptions(refModel: string): Promise<ReferenceOption[]> {
  switch (refModel) {
    case "Speaker": {
      const rows = await db.speaker.findMany({ where: { deletedAt: null }, orderBy: { order: "asc" } });
      return rows.map((r) => ({ id: r.id, label: r.name }));
    }
    case "Sponsor": {
      const rows = await db.sponsor.findMany({ where: { deletedAt: null }, orderBy: { order: "asc" } });
      return rows.map((r) => ({ id: r.id, label: r.name }));
    }
    case "Testimonial": {
      const rows = await db.testimonial.findMany({ where: { deletedAt: null }, orderBy: { order: "asc" } });
      return rows.map((r) => ({ id: r.id, label: `${r.authorName} — ${r.quote.slice(0, 40)}…` }));
    }
    case "Event": {
      const rows = await db.event.findMany({ where: { deletedAt: null }, orderBy: { startsAt: "desc" } });
      return rows.map((r) => ({ id: r.id, label: r.title }));
    }
    default:
      return [];
  }
}

export default async function EditEventBlockPage({ params }: { params: Promise<{ id: string; blockId: string }> }) {
  const { id, blockId } = await params;

  const block = await db.eventBlock.findUnique({ where: { id: blockId } });
  if (!block || block.eventId !== id) notFound();

  const definition = blockRegistry[block.type as BlockType];
  if (!definition) notFound();

  const referenceFields = getReferenceFields(block.type as BlockType);
  const referenceOptions: Record<string, ReferenceOption[]> = {};
  for (const field of referenceFields) {
    if (field.refModel) referenceOptions[field.key] = await fetchReferenceOptions(field.refModel);
  }

  return (
    <div>
      <PageHeader title={definition.label} description={definition.description} />
      <DynamicBlockForm
        blockId={block.id}
        fields={definition.fields as never}
        content={block.content as Record<string, unknown>}
        referenceOptions={referenceOptions}
      />
    </div>
  );
}
