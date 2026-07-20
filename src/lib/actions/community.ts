"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccessCohort } from "@/lib/platform";

export interface ActionState {
  error?: string;
}

export async function postCommunityMessageAction(
  channelId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You need to sign in." };

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Message can't be empty." };

  const channel = await db.communityChannel.findUnique({ where: { id: channelId } });
  if (!channel) return { error: "Channel not found." };

  const allowed = await canAccessCohort(user.id, user.role, channel.cohortId);
  if (!allowed) return { error: "You don't have access to this channel." };

  await db.communityMessage.create({ data: { channelId, authorId: user.id, body } });
  revalidatePath(`/platform/community/${channel.cohortId}/${channel.key}`);
  return {};
}
