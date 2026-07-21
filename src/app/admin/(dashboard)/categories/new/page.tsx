import { PageHeader } from "@/components/admin/PageHeader";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <PageHeader title="New category" />
      <CategoryForm />
    </div>
  );
}
