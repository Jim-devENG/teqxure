import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { QuestionForm } from "@/components/admin/assessmentBuilder/QuestionForm";

export default async function NewAssessmentQuestionPage({ params }: { params: Promise<{ sectionId: string }> }) {
  const { sectionId } = await params;
  const section = await db.assessmentSection.findUnique({ where: { id: sectionId } });
  if (!section) notFound();

  return (
    <div>
      <PageHeader title={`New question — ${section.title}`} />
      <QuestionForm sectionId={sectionId} />
    </div>
  );
}
