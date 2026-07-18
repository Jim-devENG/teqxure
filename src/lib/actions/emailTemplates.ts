"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const templateSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
});

export interface TemplateFormState {
  success?: boolean;
  error?: string;
}

export async function updateEmailTemplateAction(
  key: string,
  _prev: TemplateFormState,
  formData: FormData,
): Promise<TemplateFormState> {
  const user = await requireAdmin();
  const parsed = templateSchema.safeParse({
    subject: formData.get("subject"),
    body: formData.get("body"),
  });
  if (!parsed.success) return { error: "Please check the form for errors." };

  await db.emailTemplate.update({ where: { key }, data: parsed.data });

  await logActivity({ userId: user.id, action: "updated", entityType: "EmailTemplate", entityId: key });
  revalidatePath("/admin/email-templates");
  revalidatePath(`/admin/email-templates/${key}`);

  return { success: true };
}
