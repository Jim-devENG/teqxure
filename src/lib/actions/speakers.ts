"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const speakerSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  company: z.string().optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  visible: z.coerce.boolean().optional(),
});

export interface SpeakerFormState {
  success?: boolean;
  error?: string;
}

function parseSocialLinks(formData: FormData): { platform: string; href: string }[] {
  const count = Number(formData.get("socialLinks__count") ?? 0);
  const links: { platform: string; href: string }[] = [];
  for (let i = 0; i < count; i++) {
    const platform = String(formData.get(`socialLinks.${i}.platform`) ?? "").trim();
    const href = String(formData.get(`socialLinks.${i}.href`) ?? "").trim();
    if (platform && href) links.push({ platform, href });
  }
  return links;
}

function parse(formData: FormData) {
  return speakerSchema.safeParse({
    name: formData.get("name"),
    title: formData.get("title"),
    company: formData.get("company"),
    bio: formData.get("bio"),
    photoUrl: formData.get("photoUrl"),
    visible: formData.get("visible") === "on",
  });
}

export async function createSpeakerAction(_prev: SpeakerFormState, formData: FormData): Promise<SpeakerFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please check the form for errors." };

  const count = await db.speaker.count();
  const created = await db.speaker.create({
    data: { ...parsed.data, socialLinks: parseSocialLinks(formData), order: count },
  });

  await logActivity({ userId: user.id, action: "created", entityType: "Speaker", entityId: created.id });
  revalidatePath("/speakers");
  redirect("/speakers");
}

export async function updateSpeakerAction(id: string, _prev: SpeakerFormState, formData: FormData): Promise<SpeakerFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please check the form for errors." };

  await db.speaker.update({ where: { id }, data: { ...parsed.data, socialLinks: parseSocialLinks(formData) } });

  await logActivity({ userId: user.id, action: "updated", entityType: "Speaker", entityId: id });
  revalidatePath("/speakers");
  redirect("/speakers");
}

export async function deleteSpeakerAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.speaker.update({ where: { id }, data: { deletedAt: new Date(), visible: false } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "Speaker", entityId: id });
  revalidatePath("/speakers");
}

export async function reorderSpeakersAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(orderedIds.map((id, index) => db.speaker.update({ where: { id }, data: { order: index } })));
  await logActivity({ userId: user.id, action: "reordered", entityType: "Speaker" });
  revalidatePath("/speakers");
}
