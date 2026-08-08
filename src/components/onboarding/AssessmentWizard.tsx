"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { QuestionField } from "@/components/onboarding/QuestionField";
import { saveAssessmentResponseAction, completeAssessmentAction } from "@/lib/actions/assessment";
import type { AssessmentSectionData, AssessmentQuestionData } from "@/components/onboarding/types";

interface AssessmentWizardProps {
  token: string;
  sections: AssessmentSectionData[];
  initialResponses: Record<string, unknown>;
  onComplete: () => void;
}

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

function isQuestionVisible(question: AssessmentQuestionData, responses: Record<string, unknown>): boolean {
  if (!question.conditionalOn) return true;
  return responses[question.conditionalOn.questionKey] === question.conditionalOn.equals;
}

function findStartingSection(sections: AssessmentSectionData[], responses: Record<string, unknown>): number {
  for (let i = 0; i < sections.length; i++) {
    const incomplete = sections[i].questions.some(
      (q) => q.required && isQuestionVisible(q, responses) && isEmpty(responses[q.key]),
    );
    if (incomplete) return i;
  }
  return sections.length - 1;
}

export function AssessmentWizard({ token, sections, initialResponses, onComplete }: AssessmentWizardProps) {
  const [responses, setResponses] = useState<Record<string, unknown>>(initialResponses);
  const [sectionIndex, setSectionIndex] = useState(() => findStartingSection(sections, initialResponses));
  const [sectionError, setSectionError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const debounceRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const section = sections[sectionIndex];
  const isLastSection = sectionIndex === sections.length - 1;
  const visibleQuestions = useMemo(
    () => section.questions.filter((q) => isQuestionVisible(q, responses)),
    [section, responses],
  );

  function persist(questionKey: string, value: unknown) {
    setSavingKey(questionKey);
    void saveAssessmentResponseAction(token, questionKey, value).finally(() => {
      setSavingKey((current) => (current === questionKey ? null : current));
    });
  }

  function handleChange(question: AssessmentQuestionData, value: unknown) {
    setResponses((prev) => ({ ...prev, [question.key]: value }));

    // Uploads and discrete controls (select/radio/checkbox/rating) save
    // immediately; free-text fields debounce so we're not firing a request
    // on every keystroke.
    const immediate = ["SELECT", "RADIO", "CHECKBOX_GROUP", "RATING", "VIDEO", "FILE"].includes(question.fieldType);
    if (immediate) {
      clearTimeout(debounceRefs.current[question.key]);
      persist(question.key, value);
      return;
    }

    clearTimeout(debounceRefs.current[question.key]);
    debounceRefs.current[question.key] = setTimeout(() => persist(question.key, value), 600);
  }

  function goNext() {
    const missing = visibleQuestions.find((q) => q.required && isEmpty(responses[q.key]));
    if (missing) {
      setSectionError(`Please answer "${missing.label}" before continuing.`);
      return;
    }
    setSectionError("");
    setSectionIndex((i) => Math.min(i + 1, sections.length - 1));
  }

  function goBack() {
    setSectionError("");
    setSectionIndex((i) => Math.max(i - 1, 0));
  }

  async function handleSubmit() {
    const missing = visibleQuestions.find((q) => q.required && isEmpty(responses[q.key]));
    if (missing) {
      setSectionError(`Please answer "${missing.label}" before submitting.`);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    const result = await completeAssessmentAction(token);
    setSubmitting(false);

    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    onComplete();
  }

  const progressPercent = Math.round(((sectionIndex + 1) / sections.length) * 100);

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-12 sm:py-16">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs text-paper/40">
          <span className="font-mono uppercase tracking-[0.15em]">
            Section {sectionIndex + 1} of {sections.length}
          </span>
          <span className="flex items-center gap-1.5">
            {savingKey && <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />}
            {savingKey ? "Saving…" : "Saved"}
          </span>
        </div>
        <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-blue transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Section */}
      <div className="flex-1">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-paper sm:text-3xl">{section.title}</h1>
        {section.description && <p className="mt-2 text-sm leading-relaxed text-paper/50">{section.description}</p>}

        <div className="mt-9 flex flex-col gap-8">
          {visibleQuestions.map((question) => (
            <QuestionField
              key={question.id}
              token={token}
              question={question}
              value={responses[question.key]}
              onChange={(value) => handleChange(question, value)}
            />
          ))}
        </div>

        {sectionError && <p className="mt-6 text-sm text-red-400">{sectionError}</p>}
        {submitError && <p className="mt-6 text-sm text-red-400">{submitError}</p>}
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={goBack}
          disabled={sectionIndex === 0}
          className="flex items-center gap-1.5 text-sm text-paper/50 transition-colors hover:text-paper disabled:pointer-events-none disabled:opacity-30 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back
        </button>

        {isLastSection ? (
          <MagneticButton onClick={handleSubmit} variant="primary" disabled={submitting} className="disabled:opacity-60">
            {submitting ? "Submitting…" : "Submit Assessment"}
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </MagneticButton>
        ) : (
          <MagneticButton onClick={goNext} variant="primary">
            Continue
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </MagneticButton>
        )}
      </div>
    </div>
  );
}
