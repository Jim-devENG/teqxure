"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/notifications";

export interface ActionState {
  error?: string;
}

export async function startThreadAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You need to sign in." };

  const email = String(formData.get("email") ?? "").trim();
  const recipient = await db.user.findUnique({ where: { email } });
  if (!recipient) return { error: "No user with that email." };
  if (recipient.id === user.id) return { error: "You can't message yourself." };

  const existing = await db.messageThread.findFirst({
    where: {
      AND: [{ participants: { some: { userId: user.id } } }, { participants: { some: { userId: recipient.id } } }],
    },
  });

  const thread =
    existing ??
    (await db.messageThread.create({
      data: { participants: { create: [{ userId: user.id }, { userId: recipient.id }] } },
    }));

  redirect(`/messages/${thread.id}`);
}

export async function postDirectMessageAction(threadId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You need to sign in." };

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Message can't be empty." };

  const participant = await db.threadParticipant.findUnique({ where: { threadId_userId: { threadId, userId: user.id } } });
  if (!participant) return { error: "You don't have access to this thread." };

  await db.directMessage.create({ data: { threadId, authorId: user.id, body } });
  await db.messageThread.update({ where: { id: threadId }, data: { lastMessageAt: new Date() } });
  await db.threadParticipant.update({ where: { id: participant.id }, data: { lastReadAt: new Date() } });

  const others = await db.threadParticipant.findMany({ where: { threadId, userId: { not: user.id } } });
  await Promise.all(
    others.map((p) =>
      notifyUser({
        userId: p.userId,
        type: "MESSAGE_RECEIVED",
        title: `New message from ${user.name ?? user.email}`,
        body,
        actionLabel: "Open conversation",
        actionUrl: `/messages/${threadId}`,
      }),
    ),
  );

  revalidatePath(`/platform/messages/${threadId}`);
  return {};
}

export async function markThreadReadAction(threadId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  await db.threadParticipant.updateMany({ where: { threadId, userId: user.id }, data: { lastReadAt: new Date() } });
}
