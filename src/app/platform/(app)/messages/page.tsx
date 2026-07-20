import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { NewThreadForm } from "@/components/platform/NewThreadForm";

export default async function MessagesIndexPage() {
  const user = await getCurrentUser();

  const participations = await db.threadParticipant.findMany({
    where: { userId: user!.id },
    include: {
      thread: {
        include: {
          participants: { include: { user: true } },
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      },
    },
    orderBy: { thread: { lastMessageAt: "desc" } },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Messages" description="Direct conversations with mentors, instructors, and staff." />
      <NewThreadForm />

      <div className="flex flex-col gap-2">
        {participations.length === 0 && <p className="text-sm text-slate">No conversations yet.</p>}
        {participations.map((p) => {
          const other = p.thread.participants.find((tp) => tp.userId !== user!.id)?.user;
          const lastMessage = p.thread.messages[0];
          const unread = lastMessage && (!p.lastReadAt || lastMessage.createdAt > p.lastReadAt) && lastMessage.authorId !== user!.id;

          return (
            <Link
              key={p.threadId}
              href={`/platform/messages/${p.threadId}`}
              className="flex items-center justify-between rounded-2xl border border-light-gray bg-white p-5 shadow-sm transition-colors hover:border-blue"
            >
              <div>
                <p className="text-sm font-medium text-graphite">{other?.name ?? other?.email ?? "Unknown"}</p>
                {lastMessage && <p className="mt-0.5 truncate text-xs text-slate">{lastMessage.body}</p>}
              </div>
              {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-blue" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
