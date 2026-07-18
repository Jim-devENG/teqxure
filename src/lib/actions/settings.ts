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
  socialTwitter: z.string().optional(),
  socialLinkedin: z.string().optional(),
  socialGithub: z.string().optional(),
});

export interface SettingsState {
  success?: boolean;
  error?: string;
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
    socialTwitter: formData.get("socialTwitter"),
    socialLinkedin: formData.get("socialLinkedin"),
    socialGithub: formData.get("socialGithub"),
  });

  if (!parsed.success) {
    return { error: "Please check the form for errors." };
  }

  const { socialTwitter, socialLinkedin, socialGithub, ...rest } = parsed.data;
  const socialLinks: { label: string; href: string }[] = [
    socialTwitter && { label: "X / Twitter", href: socialTwitter },
    socialLinkedin && { label: "LinkedIn", href: socialLinkedin },
    socialGithub && { label: "GitHub", href: socialGithub },
  ].filter((link): link is { label: string; href: string } => Boolean(link));

  const existing = await db.siteSettings.findFirst();
  if (existing) {
    await db.siteSettings.update({ where: { id: existing.id }, data: { ...rest, socialLinks } });
  } else {
    await db.siteSettings.create({ data: { ...rest, socialLinks } });
  }

  await logActivity({ userId: user.id, action: "updated", entityType: "SiteSettings" });
  revalidatePath("/");
  revalidatePath("/admin/settings");

  return { success: true };
}
