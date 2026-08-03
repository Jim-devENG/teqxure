import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AiChatView } from "@/components/platform/AiChatView";

export default async function TeqxureAiPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") redirect("/dashboard");

  const conversation = await db.aiConversation.upsert({
    where: { studentId: user.id },
    update: {},
    create: { studentId: user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-medium tracking-tight text-graphite">Teqxure AI</h1>
        <p className="mt-1 text-sm text-slate">Your assistant for curriculum questions and sprint feedback.</p>
      </div>
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
