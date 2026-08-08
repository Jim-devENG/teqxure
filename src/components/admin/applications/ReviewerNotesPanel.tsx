"use client";

import { useRef, useState, useTransition } from "react";
import { addReviewerNoteAction } from "@/lib/actions/applications";

interface Note {
  id: string;
  body: string;
  createdAt: string;
  authorName: string;
}

export function ReviewerNotesPanel({ applicationId, notes }: { applicationId: string; notes: Note[] }) {
  const [localNotes, setLocalNotes] = useState(notes);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    const body = String(formData.get("body") ?? "");
    setError("");
    startTransition(async () => {
      const result = await addReviewerNoteAction(applicationId, body);
      if (result.error) {
        setError(result.error);
        return;
      }
      setLocalNotes((prev) => [
        { id: crypto.randomUUID(), body: body.trim(), createdAt: new Date().toISOString(), authorName: "You" },
        ...prev,
      ]);
      formRef.current?.reset();
    });
  }

  return (
    <div className="rounded-xl border border-light-gray bg-white p-5">
      <h2 className="mb-4 text-sm font-medium text-graphite">Reviewer notes</h2>

      <form ref={formRef} action={handleSubmit} className="mb-5 flex flex-col gap-2">
        <textarea
          name="body"
          rows={3}
          placeholder="Leave a note for other reviewers…"
          className="w-full rounded-lg border border-light-gray bg-white px-3 py-2 text-sm text-graphite outline-none focus:border-blue"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="self-start rounded-lg bg-graphite px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-graphite/90 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Adding…" : "Add note"}
        </button>
      </form>

      {localNotes.length === 0 ? (
        <p className="text-sm text-slate">No notes yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {localNotes.map((note) => (
            <li key={note.id} className="rounded-lg border border-light-gray bg-soft-white p-3">
              <p className="text-sm text-graphite">{note.body}</p>
              <p className="mt-1.5 text-xs text-slate">
                {note.authorName} · {new Date(note.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
