import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { TemplateForm } from "@/components/admin/emailTemplates/TemplateForm";

const VARIABLE_HINTS: Record<string, string[]> = {
  WAITLIST_CONFIRMATION: ["fields"],
  WAITLIST_ADMIN_NOTIFICATION: ["fields"],
};

export default async function EditEmailTemplatePage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const template = await db.emailTemplate.findUnique({ where: { key } });

  if (!template) notFound();

  return (
    <div>
      <PageHeader title={template.name} description={`Template key: ${template.key}`} />
      <TemplateForm template={template} variableHints={VARIABLE_HINTS[key] ?? []} />
    </div>
  );
}
