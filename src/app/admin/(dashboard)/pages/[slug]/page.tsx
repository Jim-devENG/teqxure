import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { HomepageSectionsList } from "@/components/admin/homepage/HomepageSectionsList";
import { PAGE_GROUPS, type PageGroupSlug } from "@/lib/sectionPages";

const MANAGED_SLUGS: PageGroupSlug[] = ["academy", "studio", "community", "research"];

export function generateStaticParams() {
  return MANAGED_SLUGS.map((slug) => ({ slug }));
}

export default async function PageGroupSectionsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!MANAGED_SLUGS.includes(slug as PageGroupSlug)) {
    notFound();
  }

  const group = PAGE_GROUPS[slug as PageGroupSlug];
  const sections = await db.homepageSection.findMany({
    where: { key: { in: group.keys } },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title={`${group.label} Page`}
        description={`Every section of the public ${group.label} page — drag to reorder, toggle visibility, or edit content.`}
      />
      <HomepageSectionsList
        sections={sections.map((s) => ({ id: s.id, key: s.key, visible: s.visible }))}
        basePath={group.adminBasePath}
      />
    </div>
  );
}
