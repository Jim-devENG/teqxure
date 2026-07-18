import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { FieldForm } from "@/components/admin/waitlist/FieldForm";

export default async function EditFieldPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const field = await db.waitlistField.findUnique({ where: { id } });

  if (!field) notFound();

  return (
    <div>
      <PageHeader title={field.label} />
      <FieldForm field={field} />
    </div>
  );
}
