"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  visible: z.coerce.boolean().optional(),
});

export interface TeamMemberFormState {
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
  return teamMemberSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    photoUrl: formData.get("photoUrl"),
    visible: formData.get("visible") === "on",
  });
}

export async function createTeamMemberAction(_prev: TeamMemberFormState, formData: FormData): Promise<TeamMemberFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please check the form for errors." };

  const count = await db.teamMember.count();
  const created = await db.teamMember.create({
    data: { ...parsed.data, socialLinks: parseSocialLinks(formData), order: count },
  });

  await logActivity({ userId: user.id, action: "created", entityType: "TeamMember", entityId: created.id });
  revalidatePath("/about");
  revalidatePath("/team");
  redirect("/team");
}

export async function updateTeamMemberAction(
  id: string,
  _prev: TeamMemberFormState,
  formData: FormData,
): Promise<TeamMemberFormState> {
  const user = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please check the form for errors." };

  await db.teamMember.update({ where: { id }, data: { ...parsed.data, socialLinks: parseSocialLinks(formData) } });

  await logActivity({ userId: user.id, action: "updated", entityType: "TeamMember", entityId: id });
  revalidatePath("/about");
  revalidatePath("/team");
  redirect("/team");
}

export async function deleteTeamMemberAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.teamMember.update({ where: { id }, data: { deletedAt: new Date(), visible: false } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "TeamMember", entityId: id });
  revalidatePath("/about");
  revalidatePath("/team");
}

export async function reorderTeamMembersAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(orderedIds.map((id, index) => db.teamMember.update({ where: { id }, data: { order: index } })));
  await logActivity({ userId: user.id, action: "reordered", entityType: "TeamMember" });
  revalidatePath("/about");
  revalidatePath("/team");
}
