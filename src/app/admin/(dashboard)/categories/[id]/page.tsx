import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await db.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <PageHeader title={category.name} />
      <CategoryForm category={category} />
    </div>
  );
}
