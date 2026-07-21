"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const sponsorSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().optional(),
  url: z.string().optional(),
  visible: z.coerce.boolean().optional(),
});

export interface SponsorFormState {
  success?: boolean;
  error?: string;
}

function parse(formData: FormData) {
  return sponsorSchema.safeParse({
    name: formData.get("name"),
    logoUrl: formData.get("logoUrl"),
    url: formData.get("url"),
    visible: formData.get("visible") === "on",
  });
}

export async function createSponsorAction(_prev: SponsorFormState, formData: FormData): Promise<SponsorFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please check the form for errors." };

  const count = await db.sponsor.count();
  const created = await db.sponsor.create({ data: { ...parsed.data, order: count } });

  await logActivity({ userId: user.id, action: "created", entityType: "Sponsor", entityId: created.id });
  revalidatePath("/sponsors");
  redirect("/sponsors");
}

export async function updateSponsorAction(id: string, _prev: SponsorFormState, formData: FormData): Promise<SponsorFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please check the form for errors." };

  await db.sponsor.update({ where: { id }, data: parsed.data });

  await logActivity({ userId: user.id, action: "updated", entityType: "Sponsor", entityId: id });
  revalidatePath("/sponsors");
  redirect("/sponsors");
}

export async function deleteSponsorAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.sponsor.update({ where: { id }, data: { deletedAt: new Date(), visible: false } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "Sponsor", entityId: id });
  revalidatePath("/sponsors");
}

export async function reorderSponsorsAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(orderedIds.map((id, index) => db.sponsor.update({ where: { id }, data: { order: index } })));
  await logActivity({ userId: user.id, action: "reordered", entityType: "Sponsor" });
  revalidatePath("/sponsors");
}
