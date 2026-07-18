import { PageHeader } from "@/components/admin/PageHeader";
import { FieldForm } from "@/components/admin/waitlist/FieldForm";

export default function NewFieldPage() {
  return (
    <div>
      <PageHeader title="New field" description="Add a field to the waitlist form." />
      <FieldForm />
    </div>
  );
}
