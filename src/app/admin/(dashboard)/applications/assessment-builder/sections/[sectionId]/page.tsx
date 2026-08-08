import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectionForm } from "@/components/admin/assessmentBuilder/SectionForm";

export default async function EditAssessmentSectionPage({ params }: { params: Promise<{ sectionId: string }> }) {
  const { sectionId } = await params;
  const section = await db.assessmentSection.findUnique({ where: { id: sectionId } });

  if (!section) notFound();

  return (
    <div>
      <PageHeader title={section.title} />
      <SectionForm section={section} />
    </div>
  );
}
