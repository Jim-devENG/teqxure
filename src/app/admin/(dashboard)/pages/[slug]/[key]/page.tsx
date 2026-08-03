import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DynamicSectionForm } from "@/components/admin/homepage/DynamicSectionForm";
import { sectionRegistry, type SectionKey } from "@/lib/sectionSchemas";
import { PAGE_GROUPS, type PageGroupSlug } from "@/lib/sectionPages";

const MANAGED_SLUGS: PageGroupSlug[] = ["academy", "studio", "community", "research"];

export function generateStaticParams() {
  return MANAGED_SLUGS.flatMap((slug) => PAGE_GROUPS[slug].keys.map((key) => ({ slug, key })));
}

export default async function EditPageGroupSectionPage({
  params,
}: {
  params: Promise<{ slug: string; key: string }>;
}) {
  const { slug, key } = await params;

  if (!MANAGED_SLUGS.includes(slug as PageGroupSlug)) {
    notFound();
  }

  const group = PAGE_GROUPS[slug as PageGroupSlug];
  if (!(group.keys as string[]).includes(key)) {
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
