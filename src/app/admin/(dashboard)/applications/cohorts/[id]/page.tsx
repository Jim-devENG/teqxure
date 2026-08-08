import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdmissionCohortForm } from "@/components/admin/admissionCohorts/AdmissionCohortForm";

export default async function EditAdmissionCohortPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cohort = await db.admissionCohort.findUnique({ where: { id } });

  if (!cohort) notFound();

  return (
    <div>
      <PageHeader title={cohort.name} />
      <AdmissionCohortForm cohort={cohort} />
    </div>
  );
}
