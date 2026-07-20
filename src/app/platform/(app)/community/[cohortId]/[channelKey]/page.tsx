import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccessCohort } from "@/lib/platform";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/PageHeader";
import { ChannelView } from "@/components/platform/ChannelView";

export default async function ChannelPage({ params }: { params: Promise<{ cohortId: string; channelKey: string }> }) {
  const { cohortId, channelKey } = await params;
  const user = await getCurrentUser();

  const allowed = await canAccessCohort(user!.id, user!.role, cohortId);
  if (!allowed) notFound();

  const [cohort, channels] = await Promise.all([
    db.cohort.findUnique({ where: { id: cohortId } }),
    db.communityChannel.findMany({ where: { cohortId }, orderBy: { order: "asc" } }),
  ]);
  if (!cohort) notFound();

  const channel = channels.find((c) => c.key === channelKey);
  if (!channel) notFound();

  const messages = await db.communityMessage.findMany({
    where: { channelId: channel.id },
    include: { author: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  return (
    <div>
      <PageHeader title={cohort.name} description="Community" />
      <div className="mb-4 flex flex-wrap gap-1 border-b border-light-gray pb-3">
        {channels.map((c) => (
          <Link
            key={c.id}
            href={`/platform/community/${cohortId}/${c.key}`}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm transition-colors",
              c.key === channelKey ? "bg-blue/10 text-blue" : "text-slate hover:bg-soft-white hover:text-graphite",
            )}
          >
            #{c.name}
          </Link>
        ))}
      </div>
      <ChannelView
        channelId={channel.id}
        currentUserId={user!.id}
        initialMessages={messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))}
      />
    </div>
  );
}
