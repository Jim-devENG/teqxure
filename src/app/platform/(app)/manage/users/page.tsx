import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { InviteUserForm } from "@/components/platform/manage/InviteUserForm";
import { UsersList } from "@/components/platform/manage/UsersList";

export default async function ManageUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { invites: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  const rows = users.map((u) => {
    const latestInvite = u.invites[0];
    const status: "ACTIVE" | "PENDING" | "EXPIRED" = u.lastLoginAt
      ? "ACTIVE"
      : latestInvite && !latestInvite.usedAt && latestInvite.expiresAt > new Date()
        ? "PENDING"
        : latestInvite && !latestInvite.usedAt
          ? "EXPIRED"
          : "ACTIVE";

    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      status,
      createdAt: u.createdAt.toISOString(),
    };
  });

  return (
    <div>
      <PageHeader
        title="Users & invites"
        description="Provision accounts for staff and students. Invited users set their own password to activate."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        <InviteUserForm />
        <UsersList users={rows} />
      </div>
    </div>
  );
}
