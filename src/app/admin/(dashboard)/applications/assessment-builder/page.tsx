import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectionCard } from "@/components/admin/assessmentBuilder/SectionCard";

export default async function AssessmentBuilderPage() {
  const sections = await db.assessmentSection.findMany({
    orderBy: { order: "asc" },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <PageHeader
        title="Assessment Builder"
        description="The onboarding assessment applicants complete after applying. Seeded with all 7 sections from the readiness assessment — edit freely."
        action={
          <Link
            href="/applications/assessment-builder/sections/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New section
          </Link>
        }
      />

      <div className="flex flex-col gap-5">
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={{
              id: section.id,
              title: section.title,
              description: section.description,
              visible: section.visible,
              questions: section.questions.map((q) => ({
                id: q.id,
                label: q.label,
                fieldType: q.fieldType,
                required: q.required,
                visible: q.visible,
              })),
            }}
          />
        ))}
      </div>
    </div>
  );
}
