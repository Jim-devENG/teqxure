import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccessCohort } from "@/lib/platform";

export async function GET(request: NextRequest, { params }: { params: Promise<{ channelId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { channelId } = await params;
  const channel = await db.communityChannel.findUnique({ where: { id: channelId } });
  if (!channel) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const allowed = await canAccessCohort(user.id, user.role, channel.cohortId);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const messages = await db.communityMessage.findMany({
    where: { channelId },
    include: { author: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  return NextResponse.json({ messages });
}
