import { PageHeader } from "@/components/admin/PageHeader";
import { BootcampForm } from "@/components/platform/manage/BootcampForm";

export default function NewBootcampPage() {
  return (
    <div>
      <PageHeader title="New bootcamp" description="Create a curriculum container to build weeks and cohorts on top of." />
      <BootcampForm />
    </div>
  );
}
