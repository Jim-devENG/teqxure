import { PageHeader } from "@/components/admin/PageHeader";
import { CoreValueForm } from "@/components/admin/coreValues/CoreValueForm";

export default function NewCoreValuePage() {
  return (
    <div>
      <PageHeader title="New core value" />
      <CoreValueForm />
    </div>
  );
}
