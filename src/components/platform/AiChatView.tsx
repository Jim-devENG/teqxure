"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ERROR_SENTINEL = "[[TEQXURE_AI_ERROR]]";

export function AiChatView({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    setError(null);
    setInput("");
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: text },
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setIsSending(true);

    try {
      const response = await fetch("/api/platform/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Please try again.");
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const sentinelIndex = chunk.indexOf(ERROR_SENTINEL);
        if (sentinelIndex !== -1) {
          accumulated += chunk.slice(0, sentinelIndex);
          const rest = chunk.slice(sentinelIndex + ERROR_SENTINEL.length).trim();
          try {
            setError(JSON.parse(rest).message ?? "The assistant hit an error.");
          } catch {
            setError("The assistant hit an error mid-response.");
          }
        } else {
          accumulated += chunk;
        }

        const snapshot = accumulated;
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: snapshot } : m)));
      }
    } catch {
      setError("Connection lost. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-220px)] flex-col rounded-2xl border border-light-gray bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-4">
          {messages.length === 0 && (
            <p className="text-sm text-slate">
              Ask Teqxure AI anything about the curriculum, your current sprint, or where you're stuck.
            </p>
          )}
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "self-end text-right" : ""}>
              <p className="text-xs text-slate">{m.role === "user" ? "You" : "Teqxure AI"}</p>
              <p className="mt-0.5 inline-block max-w-lg whitespace-pre-wrap rounded-2xl bg-soft-white px-4 py-2 text-left text-sm text-graphite">
                {m.content || (m.role === "assistant" && isSending ? "…" : "")}
              </p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-3 border-t border-light-gray p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
          placeholder="Ask Teqxure AI…"
          className="flex-1 rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        />
        <button
          type="submit"
          disabled={isSending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-dark disabled:opacity-60 cursor-pointer"
        >
          {isSending ? "Sending…" : "Send"}
        </button>
      </form>
      {error && <p className="px-4 pb-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
