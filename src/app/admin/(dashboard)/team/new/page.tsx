import { PageHeader } from "@/components/admin/PageHeader";
import { TeamMemberForm } from "@/components/admin/team/TeamMemberForm";

export default function NewTeamMemberPage() {
  return (
    <div>
      <PageHeader title="New team member" />
      <TeamMemberForm />
    </div>
  );
}
