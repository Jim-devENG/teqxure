import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DifferentiatorForm } from "@/components/admin/differentiators/DifferentiatorForm";

export default async function EditDifferentiatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const differentiator = await db.differentiator.findUnique({ where: { id } });

  if (!differentiator) notFound();

  return (
    <div>
      <PageHeader title={differentiator.heading} />
      <DifferentiatorForm differentiator={differentiator} />
    </div>
  );
}
