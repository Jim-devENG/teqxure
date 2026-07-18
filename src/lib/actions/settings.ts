"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const settingsSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  notificationEmail: z.string().email().optional().or(z.literal("")),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export interface SettingsState {
  success?: boolean;
  error?: string;
}

function getSocialLinks(formData: FormData): { platform: string; href: string }[] {
  const count = Number(formData.get("socialLinks__count") ?? 0);
  const links: { platform: string; href: string }[] = [];

  for (let i = 0; i < count; i++) {
    const platform = String(formData.get(`socialLinks.${i}.platform`) ?? "").trim();
    const href = String(formData.get(`socialLinks.${i}.href`) ?? "").trim();
    if (platform && href) {
      links.push({ platform, href });
    }
  }

  return links;
}

export async function updateSettingsAction(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const user = await requireAdmin();

  const parsed = settingsSchema.safeParse({
    siteName: formData.get("siteName"),
    tagline: formData.get("tagline"),
    contactEmail: formData.get("contactEmail"),
    notificationEmail: formData.get("notificationEmail"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  });

  if (!parsed.success) {
    return { error: "Please check the form for errors." };
  }

  const socialLinks = getSocialLinks(formData);

  const existing = await db.siteSettings.findFirst();
  if (existing) {
    await db.siteSettings.update({ where: { id: existing.id }, data: { ...parsed.data, socialLinks } });
  } else {
    await db.siteSettings.create({ data: { ...parsed.data, socialLinks } });
  }

  await logActivity({ userId: user.id, action: "updated", entityType: "SiteSettings" });
  revalidatePath("/");
  revalidatePath("/admin/settings");

  return { success: true };
}
