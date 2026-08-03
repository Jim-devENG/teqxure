import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getActiveProviderAdapter } from "@/lib/ai/settings";
import { getStudentAiContext } from "@/lib/ai/context";
import { getProductEngineeringKnowledge } from "@/lib/ai/knowledge";
import type { ChatMessage } from "@/lib/ai/providers";

export const maxDuration = 60;

const HISTORY_LIMIT = 20;

function startOfTodayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// A single line of JSON on its own, prefixed so the client can tell it apart from ordinary text deltas.
function errorSentinel(message: string): string {
  return `\n[[TEQXURE_AI_ERROR]]${JSON.stringify({ message })}\n`;
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !["STUDENT", "SUPER_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const conversation = await db.aiConversation.upsert({
    where: { studentId: user.id },
    update: {},
    create: { studentId: user.id },
  });

  const active = await getActiveProviderAdapter();
  if (!active.ok) {
    return NextResponse.json({ error: active.reason }, { status: 503 });
  }

  const todaysMessageCount = await db.aiMessage.count({
    where: { conversationId: conversation.id, role: "user", createdAt: { gte: startOfTodayUtc() } },
  });
  if (todaysMessageCount >= active.dailyMessageLimit) {
    return NextResponse.json(
      { error: `You've reached today's limit of ${active.dailyMessageLimit} messages. Try again tomorrow.` },
      { status: 429 },
    );
  }

  await db.aiMessage.create({ data: { conversationId: conversation.id, role: "user", content: message } });

  const history = await db.aiMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
    take: HISTORY_LIMIT,
  });
  const chatMessages: ChatMessage[] = history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const [knowledge, context] = await Promise.all([getProductEngineeringKnowledge(), getStudentAiContext(user.id)]);
  const system = `${active.systemPrompt}\n\n${knowledge}\n\nContext about this student: ${context}`;

  const encoder = new TextEncoder();
  let fullText = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const delta of active.adapter.chatStream(chatMessages, system, { signal: request.signal })) {
          fullText += delta;
          controller.enqueue(encoder.encode(delta));
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : "The assistant hit an error mid-response.";
        controller.enqueue(encoder.encode(errorSentinel(msg)));
      } finally {
        if (fullText.trim()) {
          await db.aiMessage.create({ data: { conversationId: conversation.id, role: "assistant", content: fullText } });
          await db.aiConversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" },
  });
}
