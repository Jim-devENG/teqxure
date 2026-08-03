import "server-only";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { getProviderAdapter, type AiProviderName, type ProviderAdapter } from "@/lib/ai/providers";

export type ActiveProviderResult =
  | { ok: true; adapter: ProviderAdapter; systemPrompt: string; dailyMessageLimit: number }
  | { ok: false; reason: string };

/** Loads the configured active provider, decrypts its key, and returns a ready-to-use adapter. */
export async function getActiveProviderAdapter(): Promise<ActiveProviderResult> {
  const settings = await db.aiSettings.findFirst();
  if (!settings?.activeProvider) {
    return { ok: false, reason: "No AI provider is set as active yet." };
  }

  const provider = await db.aiProvider.findUnique({ where: { provider: settings.activeProvider } });
  if (!provider || !provider.enabled) {
    return { ok: false, reason: "The active AI provider is not enabled." };
  }
  if (!provider.apiKeyCiphertext) {
    return { ok: false, reason: "The active AI provider has no API key configured." };
  }

  const apiKey = decrypt(provider.apiKeyCiphertext);
  const adapter = getProviderAdapter(provider.provider as AiProviderName, {
    apiKey,
    baseUrl: provider.baseUrl,
    model: provider.defaultModel,
  });

  return { ok: true, adapter, systemPrompt: settings.systemPrompt, dailyMessageLimit: settings.dailyMessageLimit };
}
