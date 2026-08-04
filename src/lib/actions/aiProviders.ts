"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { encrypt, decrypt } from "@/lib/crypto";
import { getProviderAdapter, type AiProviderName } from "@/lib/ai/providers";

export interface ProviderFormState {
  success?: boolean;
  error?: string;
}

const providerSchema = z.object({
  defaultModel: z.string().min(1),
  baseUrl: z.string().optional(),
  enabled: z.boolean(),
});

export async function updateAiProviderAction(
  provider: string,
  _prev: ProviderFormState,
  formData: FormData,
): Promise<ProviderFormState> {
  const user = await requireAdmin();

  const parsed = providerSchema.safeParse({
    defaultModel: formData.get("defaultModel"),
    baseUrl: formData.get("baseUrl") || undefined,
    enabled: formData.get("enabled") === "on",
  });
  if (!parsed.success) return { error: "Please check the form for errors." };

  const apiKey = String(formData.get("apiKey") ?? "").trim();

  await db.aiProvider.update({
    where: { provider },
    data: {
      defaultModel: parsed.data.defaultModel,
      baseUrl: parsed.data.baseUrl || null,
      enabled: parsed.data.enabled,
      ...(apiKey ? { apiKeyCiphertext: encrypt(apiKey) } : {}),
    },
  });

  await logActivity({ userId: user.id, action: "updated", entityType: "AiProvider", entityId: provider });
  revalidatePath("/admin/ai-integrations");
  revalidatePath(`/admin/ai-integrations/${provider}`);

  return { success: true };
}

const settingsSchema = z.object({
  activeProvider: z.string().optional(),
  systemPrompt: z.string().min(1),
  dailyMessageLimit: z.coerce.number().int().positive(),
});

export async function updateAiSettingsAction(_prev: ProviderFormState, formData: FormData): Promise<ProviderFormState> {
  const user = await requireAdmin();

  const parsed = settingsSchema.safeParse({
    activeProvider: formData.get("activeProvider") || undefined,
    systemPrompt: formData.get("systemPrompt"),
    dailyMessageLimit: formData.get("dailyMessageLimit"),
  });
  if (!parsed.success) return { error: "Please check the form for errors." };

  const data = {
    activeProvider: parsed.data.activeProvider ?? null,
    systemPrompt: parsed.data.systemPrompt,
    dailyMessageLimit: parsed.data.dailyMessageLimit,
  };

  const existing = await db.aiSettings.findFirst();
  if (existing) {
    await db.aiSettings.update({ where: { id: existing.id }, data });
  } else {
    await db.aiSettings.create({ data });
  }

  await logActivity({ userId: user.id, action: "updated", entityType: "AiSettings" });
  revalidatePath("/admin/ai-integrations");

  return { success: true };
}

export async function testAiProviderAction(provider: string): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();

  const row = await db.aiProvider.findUnique({ where: { provider } });
  if (!row?.apiKeyCiphertext) {
    return { ok: false, message: "No API key saved yet — save one first, then test." };
  }
  if (row.type !== "CHAT") {
    return { ok: false, message: "This provider isn't wired up to a calling feature yet — nothing to test." };
  }

  try {
    const apiKey = decrypt(row.apiKeyCiphertext);
    const adapter = getProviderAdapter(row.provider as AiProviderName, {
      apiKey,
      baseUrl: row.baseUrl,
      model: row.defaultModel,
    });
    const text = await adapter.chat(
      [{ role: "user", content: "Reply with just the word OK." }],
      "You are a connectivity test. Reply with exactly one word.",
      { signal: AbortSignal.timeout(15000) },
    );
    return { ok: true, message: text.trim() || "(empty response)" };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}
