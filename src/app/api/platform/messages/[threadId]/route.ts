import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { threadId } = await params;
  const participant = await db.threadParticipant.findUnique({ where: { threadId_userId: { threadId, userId: user.id } } });
  if (!participant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const messages = await db.directMessage.findMany({
    where: { threadId },
    include: { author: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  return NextResponse.json({ messages });
}
