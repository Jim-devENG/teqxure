import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { AiProviderForm } from "@/components/admin/aiIntegrations/AiProviderForm";

const VALID_PROVIDERS = ["NVIDIA", "OPENAI", "ANTHROPIC", "NVIDIA_COSMOS"];

export function generateStaticParams() {
  return VALID_PROVIDERS.map((provider) => ({ provider }));
}

export default async function EditAiProviderPage({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;

  if (!VALID_PROVIDERS.includes(provider)) {
    notFound();
  }

  const row = await db.aiProvider.findUnique({ where: { provider } });
  if (!row) notFound();

  return (
    <div>
      <PageHeader title={row.label} description="Configure this provider's API key, model, and availability." />
      <AiProviderForm
        provider={{
          provider: row.provider,
          type: row.type as "CHAT" | "VIDEO",
          label: row.label,
          hasKey: Boolean(row.apiKeyCiphertext),
          baseUrl: row.baseUrl ?? "",
          defaultModel: row.defaultModel,
          enabled: row.enabled,
        }}
      />
    </div>
  );
}
