import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { markAllNotificationsReadAction } from "@/lib/actions/profile";
import { PageHeader } from "@/components/admin/PageHeader";
import { NotificationPreferenceForm } from "@/components/platform/NotificationPreferenceForm";

function roleLabel(role: string): string {
  return role
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function ProfilePage() {
  const user = await getCurrentUser();

  const [preference, notifications] = await Promise.all([
    db.notificationPreference.findUnique({ where: { userId: user!.id } }),
    db.notification.findMany({ where: { userId: user!.id }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Profile" description={`${user!.name ?? user!.email} · ${roleLabel(user!.role)}`} />

      <NotificationPreferenceForm preference={preference ?? undefined} />

      <div className="rounded-2xl border border-light-gray bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-graphite">Notifications</h2>
          {unreadCount > 0 && (
            <form action={markAllNotificationsReadAction}>
              <button type="submit" className="text-xs text-blue hover:underline cursor-pointer">
                Mark all as read
              </button>
            </form>
          )}
        </div>
        <ul className="mt-4 flex flex-col gap-3">
          {notifications.length === 0 && <p className="text-sm text-slate">No notifications yet.</p>}
          {notifications.map((n) => (
            <li key={n.id} className="flex items-start justify-between gap-3 text-sm">
              <div>
                <p className={n.read ? "text-slate" : "text-graphite"}>{n.title}</p>
                <p className="text-xs text-slate">{n.body}</p>
              </div>
              {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
