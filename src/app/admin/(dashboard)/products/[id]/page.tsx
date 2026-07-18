import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/products/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <div>
      <PageHeader title={product.name} description="Edit this product's case study." />
      <ProductForm product={product} />
    </div>
  );
}
