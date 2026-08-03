import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { HomepageSectionsList } from "@/components/admin/homepage/HomepageSectionsList";
import { PAGE_GROUPS } from "@/lib/sectionPages";

export default async function HomepageSectionsPage() {
  const sections = await db.homepageSection.findMany({
    where: { key: { in: PAGE_GROUPS.home.keys } },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Homepage"
        description="Drag to reorder sections, toggle visibility, or edit their content."
      />
      <HomepageSectionsList sections={sections.map((s) => ({ id: s.id, key: s.key, visible: s.visible }))} />
    </div>
  );
}
