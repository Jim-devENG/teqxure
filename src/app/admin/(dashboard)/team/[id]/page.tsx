import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { TeamMemberForm } from "@/components/admin/team/TeamMemberForm";

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teamMember = await db.teamMember.findUnique({ where: { id } });

  if (!teamMember) notFound();

  return (
    <div>
      <PageHeader title={teamMember.name} />
      <TeamMemberForm teamMember={teamMember} />
    </div>
  );
}
