"use client";

import { useRef, useState, useTransition } from "react";
import { MessageCircleQuestion, Send, Loader2 } from "lucide-react";
import { askAboutApplicantAction } from "@/lib/actions/aiAnalysis";

interface Turn {
  question: string;
  answer: string;
}

const SUGGESTIONS = [
  "What are the biggest concerns with this applicant?",
  "What should I clarify during an interview?",
  "What preparation would help this applicant?",
  "Which responses should I review manually?",
];

export function AskAboutApplicantPanel({ applicationId }: { applicationId: string }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;
    setError("");
    startTransition(async () => {
      const result = await askAboutApplicantAction(applicationId, trimmed, turns);
      if (result.error) {
        setError(result.error);
        return;
      }
      setTurns((prev) => [...prev, { question: trimmed, answer: result.answer ?? "" }]);
      formRef.current?.reset();
    });
  }

  return (
    <div className="rounded-xl border border-light-gray bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <MessageCircleQuestion className="h-4 w-4 text-blue" strokeWidth={1.5} />
        <h2 className="text-sm font-medium text-graphite">Ask Teqxure AI</h2>
      </div>

      {turns.length === 0 && !isPending && (
        <div className="mb-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="rounded-full border border-light-gray px-3 py-1.5 text-xs text-slate transition-colors hover:border-blue hover:text-blue cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {turns.length > 0 && (
        <div className="mb-4 flex flex-col gap-3">
          {turns.map((turn, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-graphite">{turn.question}</p>
              <p className="whitespace-pre-wrap rounded-lg bg-soft-white p-3 text-sm text-slate">{turn.answer}</p>
            </div>
          ))}
        </div>
      )}

      {isPending && (
        <p className="mb-4 flex items-center gap-2 text-sm text-slate">
          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
          Thinking…
        </p>
      )}

      <form
        ref={formRef}
        action={(formData) => ask(String(formData.get("question") ?? ""))}
        className="flex items-center gap-2"
      >
        <input
          name="question"
          type="text"
          placeholder="Ask about this applicant's readiness, evidence, or what to clarify…"
          disabled={isPending}
          className="flex-1 rounded-lg border border-light-gray bg-white px-3 py-2 text-sm text-graphite outline-none focus:border-blue disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isPending}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-graphite text-white transition-colors hover:bg-graphite/90 disabled:opacity-50 cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </form>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      <p className="mt-3 text-[11px] text-slate/60">
        Answers are grounded in this applicant's actual application and assessment data only.
      </p>
    </div>
  );
}
