import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { AnnouncementForm } from "@/components/platform/manage/AnnouncementForm";

export default async function ManageAnnouncementsPage() {
  const [cohorts, announcements] = await Promise.all([
    db.cohort.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { cohort: true, createdBy: true } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Announcements" description="Broadcast a message to a cohort, or everyone on the platform." />
      <AnnouncementForm cohorts={cohorts} />

      <div>
        <h2 className="mb-4 text-sm font-medium text-graphite">Recent announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-sm text-slate">No announcements yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {announcements.map((a) => (
              <div key={a.id} className="rounded-xl border border-light-gray bg-white p-4">
                <p className="text-sm font-medium text-graphite">{a.title}</p>
                <p className="mt-1 text-sm text-slate">{a.body}</p>
                <p className="mt-2 text-xs text-slate">
                  {a.cohort?.name ?? "Everyone"} · {a.createdAt.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
