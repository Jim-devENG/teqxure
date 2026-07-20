import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DynamicSectionForm } from "@/components/admin/homepage/DynamicSectionForm";
import { sectionRegistry, SECTION_KEYS, type SectionKey } from "@/lib/sectionSchemas";

const ABOUT_SECTION_KEYS = SECTION_KEYS.filter((key) => key.startsWith("ABOUT_"));

export function generateStaticParams() {
  return ABOUT_SECTION_KEYS.map((key) => ({ key }));
}

export default async function EditAboutSectionPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  if (!ABOUT_SECTION_KEYS.includes(key as SectionKey)) {
    notFound();
  }

  const sectionKey = key as SectionKey;
  const definition = sectionRegistry[sectionKey];
  const section = await db.homepageSection.findUnique({ where: { key: sectionKey } });

  if (!section) notFound();

  return (
    <div>
      <PageHeader title={definition.label} description={definition.description} />
      <DynamicSectionForm
        sectionKey={sectionKey}
        fields={definition.fields}
        content={section.content as Record<string, unknown>}
      />
    </div>
  );
}
