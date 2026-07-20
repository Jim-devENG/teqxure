import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductsList } from "@/components/admin/products/ProductsList";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Products"
        description="The case studies shown in the Product Showcase section."
        action={
          <Link
            href="/products/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New product
          </Link>
        }
      />
      <ProductsList products={products} />
    </div>
  );
}
