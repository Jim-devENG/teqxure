import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyCohortStudents, notifyUser } from "@/lib/notifications";
import { sendTemplatedEmail } from "@/lib/email";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results = { sessionReminders: 0, sessionStarted: 0, sprintDeadlines: 0, eventReminders: 0 };

  const upcomingSessions = await db.liveSession.findMany({
    where: {
      startsAt: { gt: now },
      OR: [{ reminder24hSent: false }, { reminder1hSent: false }, { reminder10mSent: false }],
    },
  });

  for (const session of upcomingSessions) {
    const msUntil = session.startsAt.getTime() - now.getTime();

    if (!session.reminder10mSent && msUntil <= 10 * 60 * 1000) {
      await notifyCohortStudents(session.cohortId, {
        type: "SESSION_REMINDER_10M",
        title: `Starting in 10 minutes: ${session.title}`,
        body: `Your live session starts at ${session.startsAt.toLocaleString()}.`,
        actionLabel: "Join session",
        actionUrl: `/bootcamp/${session.cohortId}/${session.weekId}`,
      });
      await db.liveSession.update({ where: { id: session.id }, data: { reminder10mSent: true } });
      results.sessionReminders++;
    } else if (!session.reminder1hSent && msUntil <= 60 * 60 * 1000) {
      await notifyCohortStudents(session.cohortId, {
        type: "SESSION_REMINDER_1H",
        title: `Live session in 1 hour: ${session.title}`,
        body: `Your live session starts at ${session.startsAt.toLocaleString()}.`,
        actionLabel: "View details",
        actionUrl: `/bootcamp/${session.cohortId}/${session.weekId}`,
      });
      await db.liveSession.update({ where: { id: session.id }, data: { reminder1hSent: true } });
      results.sessionReminders++;
    } else if (!session.reminder24hSent && msUntil <= 24 * 60 * 60 * 1000) {
      await notifyCohortStudents(session.cohortId, {
        type: "SESSION_REMINDER_24H",
        title: `Live session tomorrow: ${session.title}`,
        body: `Your live session starts at ${session.startsAt.toLocaleString()}.`,
        actionLabel: "View details",
        actionUrl: `/bootcamp/${session.cohortId}/${session.weekId}`,
      });
      await db.liveSession.update({ where: { id: session.id }, data: { reminder24hSent: true } });
      results.sessionReminders++;
    }
  }

  const startingSessions = await db.liveSession.findMany({
    where: { startsAt: { lte: now }, startedNotifSent: false },
  });
  for (const session of startingSessions) {
    await notifyCohortStudents(session.cohortId, {
      type: "SESSION_STARTED",
      title: `Live now: ${session.title}`,
      body: "Your live session has started.",
      actionLabel: "Join now",
      actionUrl: `/bootcamp/${session.cohortId}/${session.weekId}`,
    });
    await db.liveSession.update({ where: { id: session.id }, data: { startedNotifSent: true } });
    results.sessionStarted++;
  }

  const dueSprints = await db.sprint.findMany({
    where: { dueAt: { gt: now, lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) }, deadlineReminderSent: false },
    include: { submissions: true },
  });
  for (const sprint of dueSprints) {
    const enrollments = await db.cohortEnrollment.findMany({
      where: { cohortId: sprint.cohortId, status: "ACTIVE" },
      select: { studentId: true },
    });
    const doneIds = new Set(
      sprint.submissions.filter((s) => s.status !== "NOT_STARTED" && s.status !== "IN_PROGRESS").map((s) => s.studentId),
    );
    const studentIdsToNotify = enrollments.map((e) => e.studentId).filter((id) => !doneIds.has(id));

    await Promise.all(
      studentIdsToNotify.map((studentId) =>
        notifyUser({
          userId: studentId,
          type: "SPRINT_DEADLINE_REMINDER",
          title: `Sprint deadline approaching: ${sprint.goal}`,
          body: `This sprint is due ${sprint.dueAt!.toLocaleString()}.`,
          actionLabel: "Open Sprint Room",
          actionUrl: `/sprint-room/${sprint.id}`,
        }),
      ),
    );
    await db.sprint.update({ where: { id: sprint.id }, data: { deadlineReminderSent: true } });
    results.sprintDeadlines++;
  }

  const upcomingEvents = await db.event.findMany({
    where: {
      deletedAt: null,
      status: "PUBLISHED",
      startsAt: { gt: now },
      OR: [{ reminder24hSent: false }, { reminder1hSent: false }],
    },
  });

  for (const event of upcomingEvents) {
    const msUntil = event.startsAt.getTime() - now.getTime();
    const templateKey = !event.reminder1hSent && msUntil <= 60 * 60 * 1000
      ? "EVENT_REMINDER_1H"
      : !event.reminder24hSent && msUntil <= 24 * 60 * 60 * 1000
        ? "EVENT_REMINDER_24H"
        : null;
    if (!templateKey) continue;

    const registrations = await db.eventRegistration.findMany({
      where: { eventId: event.id, registrantEmail: { not: null } },
      select: { registrantEmail: true },
      distinct: ["registrantEmail"],
    });

    await Promise.all(
      registrations.map((r) =>
        sendTemplatedEmail(templateKey, r.registrantEmail!, {
          eventTitle: event.title,
          eventDate: event.startsAt.toLocaleString(),
        }),
      ),
    );

    await db.event.update({
      where: { id: event.id },
      data: templateKey === "EVENT_REMINDER_1H" ? { reminder1hSent: true } : { reminder24hSent: true },
    });
    results.eventReminders++;
  }

  return NextResponse.json({ ok: true, ...results });
}
