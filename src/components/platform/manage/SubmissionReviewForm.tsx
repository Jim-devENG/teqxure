"use client";

import { useActionState } from "react";
import { reviewSubmissionAction, type ActionState } from "@/lib/actions/sprints";
import { TextAreaField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

interface SubmissionReviewFormProps {
  submission: {
    id: string;
    status: string;
    content: string | null;
    submissionUrl: string | null;
    feedback: string | null;
    submittedAt: Date | null;
    student: { name: string | null; email: string };
  };
}

export function SubmissionReviewForm({ submission }: SubmissionReviewFormProps) {
  const [state, formAction] = useActionState(reviewSubmissionAction.bind(null, submission.id), initialState);

  return (
    <div className="rounded-2xl border border-light-gray bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-graphite">{submission.student.name ?? submission.student.email}</p>
          <p className="text-xs text-slate">
            {submission.submittedAt ? `Submitted ${submission.submittedAt.toLocaleString()}` : "Not submitted yet"}
          </p>
        </div>
        <span className="rounded-full bg-soft-white px-2 py-0.5 text-xs text-slate">{submission.status}</span>
      </div>

      {submission.submissionUrl && (
        <a href={submission.submissionUrl} target="_blank" rel="noreferrer" className="mt-3 block text-sm text-blue hover:underline">
          {submission.submissionUrl}
        </a>
      )}
      {submission.content && <p className="mt-3 whitespace-pre-line text-sm text-slate">{submission.content}</p>}

      <form action={formAction} className="mt-5 flex flex-col gap-4 border-t border-light-gray pt-5">
        <TextAreaField label="Feedback" name="feedback" defaultValue={submission.feedback ?? ""} />
        <div className="flex flex-wrap items-center gap-3">
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Status</span>
            <select
              name="status"
              defaultValue="UNDER_REVIEW"
              className="mt-2 rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
            >
              <option value="UNDER_REVIEW">Mark under review</option>
              <option value="APPROVED">Approve</option>
              <option value="SUBMISSION_NEEDS_REVISION">Needs revision</option>
            </select>
          </label>
          <SubmitButton pendingLabel="Saving…">Send feedback</SubmitButton>
        </div>
        {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      </form>
    </div>
  );
}
