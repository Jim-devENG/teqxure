"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { authenticateUser, createSession, destroySession, hashPassword } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export interface LoginState {
  error?: string;
}

export async function platformLoginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const result = await authenticateUser(parsed.data.email, parsed.data.password);
  if ("error" in result) {
    return result;
  }

  await createSession(result.user.id);
  redirect("/dashboard");
}

export async function platformLogoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}

const acceptInviteSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export interface AcceptInviteState {
  error?: string;
}

export async function acceptInviteAction(
  _prevState: AcceptInviteState,
  formData: FormData,
): Promise<AcceptInviteState> {
  const parsed = acceptInviteSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }

  const invite = await db.inviteToken.findUnique({ where: { token: parsed.data.token } });
  if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
    return { error: "This invite link is invalid or has expired." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await db.$transaction([
    db.user.update({ where: { id: invite.userId }, data: { passwordHash } }),
    db.inviteToken.update({ where: { id: invite.id }, data: { usedAt: new Date() } }),
  ]);

  await createSession(invite.userId);
  redirect("/dashboard");
}
