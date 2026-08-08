import { PageHeader } from "@/components/admin/PageHeader";
import { SectionForm } from "@/components/admin/assessmentBuilder/SectionForm";

export default function NewAssessmentSectionPage() {
  return (
    <div>
      <PageHeader title="New assessment section" />
      <SectionForm />
    </div>
  );
}
