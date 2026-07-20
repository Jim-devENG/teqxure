import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getStudentCohort } from "@/lib/platform";
import { PageHeader } from "@/components/admin/PageHeader";

function timeUntil(date: Date): string {
  const ms = date.getTime() - Date.now();
  if (ms < 0) return "in progress";
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `in ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `in ${hours}h`;
  return `in ${Math.floor(hours / 24)}d`;
}

function StatCard({ label, value, href }: { label: string; value: string | number; href?: string }) {
  const content = (
    <>
      <p className="text-2xl font-medium text-graphite">{value}</p>
      <p className="mt-1 text-xs text-slate">{label}</p>
    </>
  );
  return href ? (
    <Link href={href} className="rounded-xl border border-light-gray bg-white p-5 transition-colors hover:border-blue">
      {content}
    </Link>
  ) : (
    <div className="rounded-xl border border-light-gray bg-white p-5">{content}</div>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  if (user.role === "STUDENT") return <StudentDashboard userId={user.id} name={user.name ?? user.email} />;
  if (user.role === "SUPER_ADMIN" || user.role === "PROGRAM_MANAGER") return <AdminDashboard />;
  return <StaffDashboard userId={user.id} />;
}

async function StudentDashboard({ userId, name }: { userId: string; name: string }) {
  const cohort = await getStudentCohort(userId);

  if (!cohort) {
    return (
      <div>
        <PageHeader title={`Welcome, ${name}`} />
        <p className="text-sm text-slate">You're not enrolled in a cohort yet — reach out to your program manager.</p>
      </div>
    );
  }

  const [currentWeek, submissions, upcomingSession, unreadCount, notifications] = await Promise.all([
    db.platformWeek.findFirst({ where: { bootcampId: cohort.bootcampId }, orderBy: { weekNumber: "desc" } }),
    db.sprintSubmission.findMany({ where: { studentId: userId }, include: { sprint: true }, orderBy: { updatedAt: "desc" } }),
    db.liveSession.findFirst({ where: { cohortId: cohort.id, startsAt: { gt: new Date() } }, orderBy: { startsAt: "asc" } }),
    db.notification.count({ where: { userId, read: false } }),
    db.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const activeSubmission = submissions.find((s) => s.status !== "APPROVED" && s.status !== "COMPLETED");

  return (
    <div>
      <PageHeader title={`Welcome, ${name}`} description={cohort.name} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Current week" value={currentWeek ? `Week ${currentWeek.weekNumber}` : "—"} href={`/bootcamp/${cohort.id}`} />
        <StatCard label="Sprint status" value={activeSubmission?.status.replace("_", " ") ?? "Not started"} href="/sprint-room" />
        <StatCard label="Unread notifications" value={unreadCount} />
        <StatCard label="Next live session" value={upcomingSession ? timeUntil(upcomingSession.startsAt) : "None scheduled"} />
      </div>

      {activeSubmission && (
        <Link
          href={`/sprint-room/${activeSubmission.sprintId}`}
          className="mt-8 block rounded-2xl border border-light-gray bg-white p-6 shadow-sm transition-colors hover:border-blue"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-blue">What to build today</p>
          <h2 className="mt-2 text-lg font-medium text-graphite">{activeSubmission.sprint.goal}</h2>
          <p className="mt-2 text-sm text-slate">{activeSubmission.sprint.description}</p>
        </Link>
      )}

      <div className="mt-8 rounded-xl border border-light-gray bg-white p-6">
        <h2 className="text-sm font-medium text-graphite">Recent notifications</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {notifications.length === 0 && <p className="text-sm text-slate">Nothing yet.</p>}
          {notifications.map((n) => (
            <li key={n.id} className="text-sm">
              <p className="text-graphite">{n.title}</p>
              <p className="text-xs text-slate">{n.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

async function StaffDashboard({ userId }: { userId: string }) {
  const assignments = await db.cohortStaffAssignment.findMany({ where: { userId }, select: { cohortId: true } });
  const cohortIds = assignments.map((a) => a.cohortId);

  const [pendingSubmissions, upcomingSessions] = await Promise.all([
    db.sprintSubmission.findMany({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] }, sprint: { cohortId: { in: cohortIds } } },
      include: { student: true, sprint: true },
      orderBy: { submittedAt: "desc" },
      take: 10,
    }),
    db.liveSession.findMany({
      where: { cohortId: { in: cohortIds }, startsAt: { gt: new Date() } },
      orderBy: { startsAt: "asc" },
      take: 5,
    }),
  ]);

  return (
    <div>
      <PageHeader title="Dashboard" description="Your cohorts, at a glance." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Cohorts" value={cohortIds.length} />
        <StatCard label="Submissions to review" value={pendingSubmissions.length} href="/sprint-room" />
        <StatCard label="Upcoming sessions" value={upcomingSessions.length} />
      </div>

      <div className="mt-8 rounded-xl border border-light-gray bg-white p-6">
        <h2 className="text-sm font-medium text-graphite">Submissions waiting on you</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {pendingSubmissions.length === 0 && <p className="text-sm text-slate">Nothing waiting on review.</p>}
          {pendingSubmissions.map((s) => (
            <li key={s.id}>
              <Link href={`/sprint-room/${s.sprintId}`} className="flex items-center justify-between text-sm">
                <span className="text-graphite">
                  {s.student.name ?? s.student.email} — {s.sprint.goal}
                </span>
                <span className="text-xs text-slate">{s.status.replace("_", " ")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-xl border border-light-gray bg-white p-6">
        <h2 className="text-sm font-medium text-graphite">Upcoming sessions</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {upcomingSessions.length === 0 && <p className="text-sm text-slate">Nothing scheduled.</p>}
          {upcomingSessions.map((s) => (
            <li key={s.id} className="flex items-center justify-between text-sm">
              <span className="text-graphite">{s.title}</span>
              <span className="text-xs text-slate">{s.startsAt.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

async function AdminDashboard() {
  const [studentCount, cohortCount, pendingPayments, pendingInvites, activity] = await Promise.all([
    db.user.count({ where: { role: "STUDENT" } }),
    db.cohort.count({ where: { status: "ACTIVE" } }),
    db.cohortEnrollment.count({ where: { paymentStatus: "PENDING" } }),
    db.inviteToken.count({ where: { usedAt: null, expiresAt: { gt: new Date() } } }),
    db.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { user: true } }),
  ]);

  const quickLinks = [
    { label: "Invite a user", href: "/manage/users" },
    { label: "New bootcamp", href: "/manage/bootcamps/new" },
    { label: "New cohort", href: "/manage/cohorts/new" },
    { label: "Verify payments", href: "/manage/payments" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Program overview." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Students" value={studentCount} href="/manage/users" />
        <StatCard label="Active cohorts" value={cohortCount} href="/manage/cohorts" />
        <StatCard label="Pending payments" value={pendingPayments} href="/manage/payments" />
        <StatCard label="Pending invites" value={pendingInvites} href="/manage/users" />
      </div>

      <div className="mt-8 rounded-xl border border-light-gray bg-white p-6">
        <h2 className="text-sm font-medium text-graphite">Recent activity</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {activity.length === 0 && <p className="text-sm text-slate">No activity yet.</p>}
          {activity.map((entry) => (
            <li key={entry.id} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-graphite">
                <span className="text-slate">{entry.user?.email ?? "System"}</span> {entry.action} {entry.entityType}
              </span>
            </li>
          ))}
        </ul>
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
