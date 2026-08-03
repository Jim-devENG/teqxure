import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { AiChatView } from "@/components/platform/AiChatView";

export default async function AdminAiPage() {
  const user = await requireAdmin();

  const conversation = await db.aiConversation.upsert({
    where: { studentId: user.id },
    update: {},
    create: { studentId: user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return (
    <div>
      <PageHeader title="Teqxure AI" description="The same assistant students use — ask it anything." />
      <AiChatView
        initialMessages={conversation.messages.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
        }))}
      />
    </div>
  );
}
