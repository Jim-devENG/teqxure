import Link from "next/link";
import { Pencil } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { AiSettingsForm } from "@/components/admin/aiIntegrations/AiSettingsForm";
import { cn } from "@/lib/utils";

const FIXED_PROVIDERS = [
  { provider: "NVIDIA", type: "CHAT", label: "NVIDIA NIM", defaultModel: "meta/llama-3.1-70b-instruct", baseUrl: "https://integrate.api.nvidia.com/v1" },
  { provider: "OPENAI", type: "CHAT", label: "OpenAI", defaultModel: "gpt-4o-mini", baseUrl: null },
  { provider: "ANTHROPIC", type: "CHAT", label: "Anthropic", defaultModel: "claude-3-5-sonnet-20241022", baseUrl: null },
  {
    provider: "NVIDIA_COSMOS",
    type: "VIDEO",
    label: "NVIDIA Cosmos (Video)",
    defaultModel: "nvidia/cosmos3-generator",
    baseUrl: "https://api.ngc.nvidia.com/v2/org/nim/team/nvidia/repos/cosmos3-generator",
  },
];

function ProviderRow({ provider }: { provider: { id: string; provider: string; label: string; apiKeyCiphertext: string | null; defaultModel: string; enabled: boolean } }) {
  return (
    <Link
      href={`/ai-integrations/${provider.provider}`}
      className="flex items-center justify-between rounded-xl border border-light-gray bg-white px-4 py-3 transition-colors hover:border-blue"
    >
      <div>
        <p className="text-sm text-graphite">{provider.label}</p>
        <p className="mt-0.5 text-xs text-slate">
          {provider.apiKeyCiphertext ? "API key configured" : "No API key yet"} · {provider.defaultModel}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs",
            provider.enabled ? "bg-emerald/10 text-emerald" : "bg-soft-white text-slate",
          )}
        >
          {provider.enabled ? "Enabled" : "Disabled"}
        </span>
        <Pencil className="h-3.5 w-3.5 text-slate" strokeWidth={1.5} />
      </div>
    </Link>
  );
}

export default async function AiIntegrationsPage() {
  // Self-healing: guarantees the fixed rows exist even if the seed script was never (re-)run.
  for (const p of FIXED_PROVIDERS) {
    await db.aiProvider.upsert({
      where: { provider: p.provider },
      update: {},
      create: { provider: p.provider, type: p.type, label: p.label, defaultModel: p.defaultModel, baseUrl: p.baseUrl },
    });
  }
  let settings = await db.aiSettings.findFirst();
  if (!settings) {
    settings = await db.aiSettings.create({ data: {} });
  }

  const providers = await db.aiProvider.findMany({ orderBy: { provider: "asc" } });
  const chatProviders = providers.filter((p) => p.type === "CHAT");
  const videoProviders = providers.filter((p) => p.type === "VIDEO");

  return (
    <div className="flex flex-col gap-10">
      <div>
        <PageHeader
          title="AI Integrations"
          description="Configure the AI providers behind Teqxure AI, and which one is active."
        />

        <h2 className="mb-3 text-sm font-medium text-graphite">Chat providers</h2>
        <div className="flex flex-col gap-2">
          {chatProviders.map((p) => (
            <ProviderRow key={p.id} provider={p} />
          ))}
        </div>

        {videoProviders.length > 0 && (
          <>
            <h2 className="mb-3 mt-8 text-sm font-medium text-graphite">Video providers</h2>
            <div className="flex flex-col gap-2">
              {videoProviders.map((p) => (
                <ProviderRow key={p.id} provider={p} />
              ))}
            </div>
          </>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium text-graphite">Assistant settings</h2>
        <AiSettingsForm
          defaults={{
            activeProvider: settings.activeProvider ?? "",
            systemPrompt: settings.systemPrompt,
            dailyMessageLimit: settings.dailyMessageLimit,
          }}
          enabledProviders={chatProviders.filter((p) => p.enabled).map((p) => ({ provider: p.provider, label: p.label }))}
        />
      </div>
    </div>
  );
}
