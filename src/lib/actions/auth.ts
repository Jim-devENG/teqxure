"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticateUser, createSession, destroySession } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export interface LoginState {
  error?: string;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
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

  if (result.user.role !== "SUPER_ADMIN") {
    return { error: "This account doesn't have admin access." };
  }

  await createSession(result.user.id);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
