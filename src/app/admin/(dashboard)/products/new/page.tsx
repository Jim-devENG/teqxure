import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <PageHeader title="New product" description="Add a new case study to the Product Showcase." />
      <ProductForm />
    </div>
  );
}
