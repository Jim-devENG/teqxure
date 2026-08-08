import "server-only";
import { db } from "@/lib/db";

/**
 * "TQX-2026-0001" — sequential within a year, padded to 4 digits. Generated
 * from a count query at create time (application volume is low enough that
 * the tiny race window between count and insert is an acceptable trade-off
 * for not needing a dedicated sequence table).
 */
export async function generateReferenceCode(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await db.application.count({
    where: { createdAt: { gte: new Date(`${year}-01-01T00:00:00.000Z`) } },
  });
  const sequence = String(count + 1).padStart(4, "0");
  return `TQX-${year}-${sequence}`;
}
