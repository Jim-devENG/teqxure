import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { BlockTemplatesList } from "@/components/admin/events/BlockTemplatesList";

export default async function BlockTemplatesPage() {
  const templates = await db.blockTemplate.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Block Templates"
        description="Reusable content blocks saved from event pages — insert them into any event's block editor."
      />
      <BlockTemplatesList templates={templates} />
    </div>
  );
}
