import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const SESSION_COOKIE = "teqxure_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.session.create({ data: { token, userId, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { token } }).catch(() => undefined);
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await db.session.delete({ where: { token } }).catch(() => undefined);
    return null;
  }

  return session.user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

/**
 * Generalized role guard for the /platform workspace. All six roles share
 * the same session cookie, so every platform Server Action must state
 * exactly which roles it's open to rather than only checking "is signed in".
 */
export async function requireRole<T extends string>(...allowedRoles: T[]) {
  const user = await getCurrentUser();
  if (!user || !allowedRoles.includes(user.role as T)) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export type AuthResult =
  | { user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>> }
  | { error: string };

/**
 * Shared credential check (used by both the /admin and /platform login
 * actions): verifies the password, enforces the brute-force lockout, and
 * resets the counters on success. Callers decide what role(s) are allowed
 * to actually sign in through their entry point and create the session.
 */
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  const user = await db.user.findUnique({ where: { email } });

  // Always run a bcrypt comparison, even for an unknown email, so response
  // timing doesn't reveal whether the address exists.
  const hashToCompare = user?.passwordHash ?? "$2b$12$invalidsaltinvalidsaltinvalidsalu";
  const passwordMatches = await verifyPassword(password, hashToCompare);

  if (!user) {
    return { error: "Invalid email or password." };
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    return { error: `Too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}.` };
  }

  if (!passwordMatches) {
    const attempts = user.failedLoginAttempts + 1;
    await db.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: attempts,
        lockedUntil: attempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MS) : null,
      },
    });
    return { error: "Invalid email or password." };
  }

  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date(), failedLoginAttempts: 0, lockedUntil: null },
  });

  return { user };
}

export { SESSION_COOKIE };
