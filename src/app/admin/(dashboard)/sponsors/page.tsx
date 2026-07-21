import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { SponsorsList } from "@/components/admin/sponsors/SponsorsList";

export default async function SponsorsPage() {
  const sponsors = await db.sponsor.findMany({ where: { deletedAt: null }, orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Sponsors"
        description="A reusable directory — attach sponsors to any event's Sponsors block."
        action={
          <Link
            href="/sponsors/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New sponsor
          </Link>
        }
      />
      <SponsorsList items={sponsors} />
    </div>
  );
}
