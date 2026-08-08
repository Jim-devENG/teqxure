import { PageHeader } from "@/components/admin/PageHeader";
import { AdmissionCohortForm } from "@/components/admin/admissionCohorts/AdmissionCohortForm";

export default function NewAdmissionCohortPage() {
  return (
    <div>
      <PageHeader title="New admission cohort" />
      <AdmissionCohortForm />
    </div>
  );
}
