import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { SubmissionsTable } from "@/components/admin/waitlist/SubmissionsTable";

export default async function WaitlistSubmissionsPage() {
  const submissions = await db.waitlistSubmission.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Submissions" description="People who joined the waitlist." />
      <SubmissionsTable
        submissions={submissions.map((s) => ({
          id: s.id,
          data: s.data as Record<string, string>,
          status: s.status,
          createdAt: s.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
