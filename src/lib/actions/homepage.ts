"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { sectionRegistry, type SectionKey, type FieldMeta } from "@/lib/sectionSchemas";

export interface SectionFormState {
  success?: boolean;
  error?: string;
}

function formDataToSectionContent(key: SectionKey, formData: FormData): unknown {
  const definition = sectionRegistry[key];
  const fields = definition.fields as unknown as FieldMeta[];
  const result: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.type === "list-string") {
      result[field.key] = formData
        .getAll(field.key)
        .map((v) => String(v).trim())
        .filter(Boolean);
    } else if (field.type === "list-object" && field.subFields) {
      const groupCount = Number(formData.get(`${field.key}__count`) ?? 0);
      const list = [];
      for (let i = 0; i < groupCount; i++) {
        const item: Record<string, unknown> = {};
        for (const sub of field.subFields) {
          const raw = formData.get(`${field.key}.${i}.${sub.key}`);
          item[sub.key] = sub.type === "number" ? Number(raw ?? 0) : String(raw ?? "");
        }
        list.push(item);
      }
      result[field.key] = list;
    } else if (field.type === "number") {
      result[field.key] = Number(formData.get(field.key) ?? 0);
    } else if (field.type === "boolean") {
      result[field.key] = formData.get(field.key) === "on";
    } else {
      result[field.key] = String(formData.get(field.key) ?? "");
    }
  }

  return result;
}

export async function updateSectionAction(
  key: SectionKey,
  _prev: SectionFormState,
  formData: FormData,
): Promise<SectionFormState> {
  const user = await requireAdmin();
  const definition = sectionRegistry[key];
  if (!definition) return { error: "Unknown section." };

  const content = formDataToSectionContent(key, formData);
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
