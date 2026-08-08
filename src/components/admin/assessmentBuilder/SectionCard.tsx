"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import {
  deleteAssessmentSectionAction,
  toggleAssessmentSectionVisibleAction,
  deleteAssessmentQuestionAction,
} from "@/lib/actions/assessmentQuestions";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  label: string;
  fieldType: string;
  required: boolean;
  visible: boolean;
}

interface Section {
  id: string;
  title: string;
  description: string | null;
  visible: boolean;
  questions: Question[];
}

export function SectionCard({ section }: { section: Section }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={cn("rounded-xl border border-light-gray bg-white p-5", !section.visible && "opacity-60")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-graphite">{section.title}</h2>
          {section.description && <p className="mt-0.5 text-xs text-slate">{section.description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled={isPending}
            title={section.visible ? "Hide section" : "Show section"}
            onClick={() => startTransition(() => toggleAssessmentSectionVisibleAction(section.id, !section.visible))}
            className="rounded-md p-1.5 text-slate transition-colors hover:bg-soft-white cursor-pointer"
          >
            {section.visible ? <Eye className="h-4 w-4" strokeWidth={1.5} /> : <EyeOff className="h-4 w-4" strokeWidth={1.5} />}
          </button>
          <Link
            href={`/applications/assessment-builder/sections/${section.id}`}
            className="rounded-md p-1.5 text-slate transition-colors hover:bg-soft-white"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (confirm(`Delete "${section.title}" and all its questions?`)) {
                startTransition(() => deleteAssessmentSectionAction(section.id));
              }
            }}
            className="rounded-md p-1.5 text-slate transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        {section.questions.map((q) => (
          <div
            key={q.id}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg border border-light-gray px-3 py-2 text-sm",
              !q.visible && "opacity-50",
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="truncate text-graphite">{q.label}</span>
              {q.required && <span className="text-xs text-blue">*</span>}
              <span className="font-mono text-[10px] uppercase text-slate">{q.fieldType}</span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Link
                href={`/applications/assessment-builder/sections/${section.id}/questions/${q.id}`}
                className="rounded-md p-1 text-slate transition-colors hover:bg-soft-white"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Link>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  if (confirm(`Delete "${q.label}"?`)) {
                    startTransition(() => deleteAssessmentQuestionAction(q.id));
                  }
                }}
                className="rounded-md p-1 text-slate transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}

        <Link
          href={`/applications/assessment-builder/sections/${section.id}/questions/new`}
          className="mt-1 flex items-center gap-1.5 self-start text-xs text-blue hover:underline"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
          Add question
        </Link>
      </div>
    </div>
  );
}
