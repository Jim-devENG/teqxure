import { PageHeader } from "@/components/admin/PageHeader";
import { DifferentiatorForm } from "@/components/admin/differentiators/DifferentiatorForm";

export default function NewDifferentiatorPage() {
  return (
    <div>
      <PageHeader title="New differentiator" />
      <DifferentiatorForm />
    </div>
  );
}
