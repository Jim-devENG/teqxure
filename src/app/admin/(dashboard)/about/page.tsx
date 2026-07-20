import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { HomepageSectionsList } from "@/components/admin/homepage/HomepageSectionsList";

const COLLECTIONS = [
  { href: "/core-values", label: "Core Values", description: "Add, edit, delete, reorder" },
  { href: "/differentiators", label: "What Makes Teqxure Different", description: "Add, edit, delete, reorder" },
  { href: "/team", label: "Team", description: "Add, edit, delete, hide, reorder" },
];

export default async function AboutPage() {
  const sections = await db.homepageSection.findMany({
    where: { key: { startsWith: "ABOUT_" } },
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex flex-col gap-10">
      <div>
        <PageHeader
          title="About Page"
          description="Every section of the public About page — drag to reorder, toggle visibility, or edit content."
        />
        <HomepageSectionsList
          sections={sections.map((s) => ({ id: s.id, key: s.key, visible: s.visible }))}
          basePath="/about"
        />
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium text-graphite">Collections</h2>
        <div className="flex flex-col gap-2">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex items-center justify-between rounded-xl border border-light-gray bg-white px-4 py-3 transition-colors hover:border-blue"
            >
              <p className="text-sm text-graphite">{c.label}</p>
              <span className="text-xs text-slate">{c.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
