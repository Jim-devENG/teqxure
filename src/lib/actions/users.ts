"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole, hashPassword } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { sendTemplatedEmail } from "@/lib/email";

const ROLES = ["SUPER_ADMIN", "PROGRAM_MANAGER", "INSTRUCTOR", "MENTOR", "REVIEWER", "STUDENT"] as const;
const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const inviteSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(ROLES),
});

export interface InviteUserState {
  success?: boolean;
  error?: string;
}

export async function inviteUserAction(_prev: InviteUserState, formData: FormData): Promise<InviteUserState> {
  const admin = await requireRole("SUPER_ADMIN", "PROGRAM_MANAGER");

  const parsed = inviteSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "A user with that email already exists." };
  }

  // Placeholder password hash — replaced the moment the invite is accepted.
  const placeholderHash = await hashPassword(randomBytes(24).toString("hex"));

  const user = await db.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      role: parsed.data.role,
      passwordHash: placeholderHash,
    },
  });

  const token = randomBytes(32).toString("hex");
  await db.inviteToken.create({
    data: { token, userId: user.id, expiresAt: new Date(Date.now() + INVITE_TTL_MS) },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.teqxure.xyz";
  const inviteUrl = `${appUrl}/set-password?token=${token}`;

  await sendTemplatedEmail("ACCOUNT_INVITE", user.email, {
    name: user.name ?? "there",
    role: roleLabel(user.role),
    inviteUrl,
  });

  await logActivity({ userId: admin.id, action: "created", entityType: "User", entityId: user.id });
  revalidatePath("/platform/manage/users");
  redirect("/manage/users");
}

export async function resendInviteAction(userId: string): Promise<void> {
  const admin = await requireRole("SUPER_ADMIN", "PROGRAM_MANAGER");

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return;

  await db.inviteToken.updateMany({ where: { userId, usedAt: null }, data: { expiresAt: new Date() } });

  const token = randomBytes(32).toString("hex");
  await db.inviteToken.create({
    data: { token, userId, expiresAt: new Date(Date.now() + INVITE_TTL_MS) },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.teqxure.xyz";
  const inviteUrl = `${appUrl}/set-password?token=${token}`;

  await sendTemplatedEmail("ACCOUNT_INVITE", user.email, {
    name: user.name ?? "there",
    role: roleLabel(user.role),
    inviteUrl,
  });

  await logActivity({ userId: admin.id, action: "updated", entityType: "User", entityId: userId, metadata: { action: "resend-invite" } });
  revalidatePath("/platform/manage/users");
}

export async function updateUserRoleAction(userId: string, role: string): Promise<void> {
  const admin = await requireRole("SUPER_ADMIN");
  await db.user.update({ where: { id: userId }, data: { role: role as (typeof ROLES)[number] } });
  await logActivity({ userId: admin.id, action: "updated", entityType: "User", entityId: userId, metadata: { role } });
  revalidatePath("/platform/manage/users");
}

function roleLabel(role: string): string {
  return role
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export { ROLES };
