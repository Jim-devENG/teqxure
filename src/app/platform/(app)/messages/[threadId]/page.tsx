import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { markThreadReadAction } from "@/lib/actions/messages";
import { PageHeader } from "@/components/admin/PageHeader";
import { ThreadView } from "@/components/platform/ThreadView";

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;
  const user = await getCurrentUser();

  const participant = await db.threadParticipant.findUnique({
    where: { threadId_userId: { threadId, userId: user!.id } },
  });
  if (!participant) notFound();

  const thread = await db.messageThread.findUnique({
    where: { id: threadId },
    include: { participants: { include: { user: true } } },
  });
  if (!thread) notFound();

  const other = thread.participants.find((p) => p.userId !== user!.id)?.user;
  const messages = await db.directMessage.findMany({
    where: { threadId },
    include: { author: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  await markThreadReadAction(threadId);

  return (
    <div>
      <PageHeader title={other?.name ?? other?.email ?? "Conversation"} />
      <ThreadView
        threadId={threadId}
        currentUserId={user!.id}
        initialMessages={messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))}
      />
    </div>
  );
}
