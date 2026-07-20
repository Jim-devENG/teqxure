import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { TeamMembersList } from "@/components/admin/team/TeamMembersList";

export default async function TeamPage() {
  const team = await db.teamMember.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Team"
        description="The people behind Teqxure, shown on the About page."
        action={
          <Link
            href="/team/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New team member
          </Link>
        }
      />
      <TeamMembersList items={team} />
    </div>
  );
}
