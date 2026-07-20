"use client";

import { useActionState } from "react";
import { submitSprintAction, type ActionState } from "@/lib/actions/sprints";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

interface SubmissionFormProps {
  sprintId: string;
  submission?: {
    content: string | null;
    submissionUrl: string | null;
    status: string;
    feedback: string | null;
  };
}

export function SubmissionForm({ sprintId, submission }: SubmissionFormProps) {
  const [state, formAction] = useActionState(submitSprintAction.bind(null, sprintId), initialState);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-5">
        <TextAreaField
          label="Notes on your submission"
          name="content"
          defaultValue={submission?.content ?? ""}
          hint="Anything your reviewer should know — decisions, trade-offs, known gaps."
        />
        <TextField
          label="Submission URL"
          name="submissionUrl"
          type="url"
          defaultValue={submission?.submissionUrl ?? ""}
          placeholder="https://github.com/you/project or a deployed link"
        />

        {state.error && <p className="text-sm text-red-500">{state.error}</p>}

        <div>
          <SubmitButton pendingLabel="Submitting…">
            {submission?.status === "SUBMITTED" || submission?.status === "UNDER_REVIEW" || submission?.status === "APPROVED"
              ? "Resubmit"
              : "Submit sprint"}
          </SubmitButton>
        </div>
      </form>

      {submission?.feedback && (
        <div className="rounded-2xl border border-light-gray bg-soft-white p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Mentor feedback</p>
          <p className="mt-2 whitespace-pre-line text-sm text-graphite">{submission.feedback}</p>
        </div>
      )}
    </div>
  );
}
