import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { CoreValueForm } from "@/components/admin/coreValues/CoreValueForm";

export default async function EditCoreValuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coreValue = await db.coreValue.findUnique({ where: { id } });

  if (!coreValue) notFound();

  return (
    <div>
      <PageHeader title={coreValue.title} />
      <CoreValueForm coreValue={coreValue} />
    </div>
  );
}
