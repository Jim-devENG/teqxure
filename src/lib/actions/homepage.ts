"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { sectionRegistry, type SectionKey, type FieldMeta } from "@/lib/sectionSchemas";
import { formDataToContent } from "@/lib/formDataToContent";

export interface SectionFormState {
  success?: boolean;
  error?: string;
}

export async function updateSectionAction(
  key: SectionKey,
  _prev: SectionFormState,
  formData: FormData,
): Promise<SectionFormState> {
  const user = await requireAdmin();
  const definition = sectionRegistry[key];
  if (!definition) return { error: "Unknown section." };

  const content = formDataToContent(definition.fields as unknown as FieldMeta[], formData);
  const parsed = definition.schema.safeParse(content);
  if (!parsed.success) {
    return { error: "Please check the form for errors." };
  }

  await db.homepageSection.update({
    where: { key },
    data: { content: parsed.data },
  });

  await logActivity({ userId: user.id, action: "updated", entityType: "HomepageSection", entityId: key });
  const isAbout = key.startsWith("ABOUT_");
  revalidatePath(isAbout ? "/about" : "/");
  revalidatePath(`/admin/${isAbout ? "about" : "homepage"}/${key}`);

  return { success: true };
}

export async function reorderSectionsAction(orderedKeys: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(
    orderedKeys.map((key, index) => db.homepageSection.update({ where: { key }, data: { order: index } })),
  );
  await logActivity({ userId: user.id, action: "reordered", entityType: "HomepageSection" });
  const isAbout = orderedKeys[0]?.startsWith("ABOUT_");
  revalidatePath(isAbout ? "/about" : "/");
  revalidatePath(isAbout ? "/admin/about" : "/admin/homepage");
}

export async function toggleSectionVisibilityAction(key: string, visible: boolean): Promise<void> {
  const user = await requireAdmin();
  await db.homepageSection.update({ where: { key }, data: { visible } });
  await logActivity({
    userId: user.id,
    action: visible ? "published" : "unpublished",
    entityType: "HomepageSection",
    entityId: key,
  });
  const isAbout = key.startsWith("ABOUT_");
  revalidatePath(isAbout ? "/about" : "/");
  revalidatePath(isAbout ? "/admin/about" : "/admin/homepage");
}
