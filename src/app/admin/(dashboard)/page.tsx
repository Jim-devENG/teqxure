import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function AdminDashboardPage() {
  const [productCount, weekCount, testimonialCount, pendingSubmissions, activity, submissions] = await Promise.all([
    db.product.count({ where: { deletedAt: null } }),
    db.curriculumWeek.count({ where: { deletedAt: null } }),
    db.testimonial.count({ where: { deletedAt: null } }),
    db.waitlistSubmission.count({ where: { status: "NEW" } }),
    db.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { user: true } }),
    db.waitlistSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Products", value: productCount, href: "/admin/products" },
    { label: "Curriculum weeks", value: weekCount, href: "/admin/curriculum" },
    { label: "Testimonials", value: testimonialCount, href: "/admin/testimonials" },
    { label: "New applications", value: pendingSubmissions, href: "/admin/waitlist-submissions" },
  ];

  const quickLinks = [
    { label: "Edit homepage", href: "/admin/homepage" },
    { label: "Add a product", href: "/admin/products/new" },
    { label: "Add a testimonial", href: "/admin/testimonials/new" },
    { label: "Edit waitlist form", href: "/admin/waitlist-form" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of the Teqxure site." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-light-gray bg-white p-5 transition-colors hover:border-blue"
          >
            <p className="text-2xl font-medium text-graphite">{stat.value}</p>
            <p className="mt-1 text-xs text-slate">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-light-gray bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-graphite">Recent activity</h2>
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {activity.length === 0 && <p className="text-sm text-slate">No activity yet.</p>}
            {activity.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-graphite">
                  <span className="text-slate">{entry.user?.email ?? "System"}</span> {entry.action}{" "}
                  {entry.entityType}
                </span>
                <span className="shrink-0 text-xs text-slate">{timeAgo(entry.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-light-gray bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-graphite">Latest applications</h2>
            <Link href="/admin/waitlist-submissions" className="text-xs text-blue">
              View all
            </Link>
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {submissions.length === 0 && <p className="text-sm text-slate">No submissions yet.</p>}
            {submissions.map((submission) => {
              const data = submission.data as Record<string, string>;
              const values = Object.values(data);
              return (
                <li key={submission.id} className="flex items-start justify-between gap-3 text-sm">
                  <span className="truncate text-graphite">{values[0] ?? "—"}</span>
                  <span className="shrink-0 text-xs text-slate">{timeAgo(submission.createdAt)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-light-gray bg-white p-6">
        <h2 className="text-sm font-medium text-graphite">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-light-gray px-3 py-2 text-sm text-graphite transition-colors hover:border-blue hover:text-blue"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
