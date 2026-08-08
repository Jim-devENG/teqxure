import "server-only";
import { headers } from "next/headers";
import { db } from "@/lib/db";

/**
 * Lightweight IP-based rate limiting backed by a DB table — there's no
 * Redis/Upstash anywhere in this stack, and this traffic volume (admissions
 * forms) doesn't need one. Swap for a proper store if that ever changes.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export interface RateLimitResult {
  allowed: boolean;
}

export async function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): Promise<RateLimitResult> {
  const since = new Date(Date.now() - windowMs);
  const hits = await db.rateLimitHit.count({ where: { key, createdAt: { gte: since } } });

  if (hits >= limit) {
    return { allowed: false };
  }

  await db.rateLimitHit.create({ data: { key } });
  return { allowed: true };
}
