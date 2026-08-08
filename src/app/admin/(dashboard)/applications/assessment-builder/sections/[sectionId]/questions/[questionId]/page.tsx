import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { QuestionForm } from "@/components/admin/assessmentBuilder/QuestionForm";

export default async function EditAssessmentQuestionPage({
  params,
}: {
  params: Promise<{ sectionId: string; questionId: string }>;
}) {
  const { sectionId, questionId } = await params;
  const question = await db.assessmentQuestion.findUnique({ where: { id: questionId } });
  if (!question) notFound();

  return (
    <div>
      <PageHeader title={question.label} />
      <QuestionForm sectionId={sectionId} question={question} />
    </div>
  );
}
