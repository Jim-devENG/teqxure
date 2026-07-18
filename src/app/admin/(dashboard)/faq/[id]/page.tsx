import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { FaqForm } from "@/components/admin/faq/FaqForm";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.faqItem.findUnique({ where: { id } });

  if (!item) notFound();

  return (
    <div>
      <PageHeader title="Edit question" />
      <FaqForm item={item} />
    </div>
  );
}
