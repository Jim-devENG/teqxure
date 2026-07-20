"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { postCommunityMessageAction, type ActionState } from "@/lib/actions/community";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface Message {
  id: string;
  body: string;
  createdAt: string;
  author: { id: string; name: string | null; email: string };
}

const initialState: ActionState = {};

export function ChannelView({
  channelId,
  currentUserId,
  initialMessages,
}: {
  channelId: string;
  currentUserId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [state, formAction] = useActionState(postCommunityMessageAction.bind(null, channelId), initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/platform/community/${channelId}/messages`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages);
    }, 4000);
    return () => clearInterval(interval);
  }, [channelId]);

  useEffect(() => {
    if (!state.error) formRef.current?.reset();
  }, [state]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  return (
    <div className="flex h-[calc(100vh-220px)] flex-col rounded-2xl border border-light-gray bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-4">
          {messages.length === 0 && <p className="text-sm text-slate">No messages yet — say hello.</p>}
          {messages.map((m) => (
            <div key={m.id} className={m.author.id === currentUserId ? "self-end text-right" : ""}>
              <p className="text-xs text-slate">{m.author.name ?? m.author.email}</p>
              <p className="mt-0.5 inline-block max-w-md rounded-2xl bg-soft-white px-4 py-2 text-sm text-graphite">{m.body}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <form ref={formRef} action={formAction} className="flex items-center gap-3 border-t border-light-gray p-4">
        <input
          name="body"
          required
          placeholder="Message this channel…"
          className="flex-1 rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        />
        <SubmitButton pendingLabel="Sending…">Send</SubmitButton>
      </form>
      {state.error && <p className="px-4 pb-3 text-sm text-red-500">{state.error}</p>}
    </div>
  );
}
