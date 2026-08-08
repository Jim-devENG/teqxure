"use client";

import { useState } from "react";
import { Star, UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { requestVideoUploadUrlAction } from "@/lib/actions/assessment";
import type { AssessmentQuestionData } from "@/components/onboarding/types";

const inputClasses =
  "mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-base text-paper placeholder:text-paper/30 outline-none transition-colors focus:border-blue";

const labelClasses = "font-mono text-[11px] uppercase tracking-[0.15em] text-paper/50";

interface QuestionFieldProps {
  token: string;
  question: AssessmentQuestionData;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function QuestionField({ token, question, value, onChange }: QuestionFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={question.key} className={labelClasses}>
        {question.label}
        {question.required && <span className="ml-1 text-blue">*</span>}
      </label>
      {question.helpText && <p className="text-xs text-paper/40">{question.helpText}</p>}

      <FieldControl question={question} value={value} onChange={onChange} token={token} />
    </div>
  );
}

function FieldControl({ question, value, onChange, token }: QuestionFieldProps) {
  switch (question.fieldType) {
    case "TEXTAREA":
      return (
        <textarea
          id={question.key}
          rows={4}
          className={inputClasses}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "EMAIL":
    case "PHONE":
    case "NUMBER":
    case "TEXT":
      return (
        <input
          id={question.key}
          type={question.fieldType === "EMAIL" ? "email" : question.fieldType === "PHONE" ? "tel" : question.fieldType === "NUMBER" ? "number" : "text"}
          className={inputClasses}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "SELECT":
      return (
        <select
          id={question.key}
          className={inputClasses}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select…</option>
          {question.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case "RADIO":
      return (
        <div className="mt-1 flex flex-col gap-2">
          {question.options.map((option) => (
            <label
              key={option}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition-colors",
                value === option ? "border-blue bg-blue/10 text-paper" : "border-white/10 text-paper/70 hover:border-white/25",
              )}
            >
              <input
                type="radio"
                name={question.key}
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
                className="h-3.5 w-3.5 accent-blue"
              />
              {option}
            </label>
          ))}
        </div>
      );

    case "CHECKBOX_GROUP": {
      const selected = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="mt-1 flex flex-col gap-2">
          {question.options.map((option) => {
            const checked = selected.includes(option);
            return (
              <label
                key={option}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition-colors",
                  checked ? "border-blue bg-blue/10 text-paper" : "border-white/10 text-paper/70 hover:border-white/25",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onChange(checked ? selected.filter((o) => o !== option) : [...selected, option])}
                  className="h-3.5 w-3.5 accent-blue"
                />
                {option}
              </label>
            );
          })}
        </div>
      );
    }

    case "RATING": {
      const rating = Number(value) || 0;
      return (
        <div className="mt-1 flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`${n} out of 5`}
              className="cursor-pointer p-0.5"
            >
              <Star
                className={cn("h-6 w-6 transition-colors", n <= rating ? "fill-blue text-blue" : "text-white/20")}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
      );
    }

    case "VIDEO":
    case "FILE":
      return <UploadField question={question} value={value} onChange={onChange} token={token} />;

    default:
      return null;
  }
}

interface UploadedValue {
  key: string;
  url: string;
  fileName: string;
}

function UploadField({ question, value, onChange, token }: QuestionFieldProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");
  const uploaded = value as UploadedValue | undefined;

  async function handleFile(file: File) {
    setStatus("uploading");
    setError("");

    const result = await requestVideoUploadUrlAction(token, file.name, file.type, file.size);
    if (result.error || !result.uploadUrl || !result.key || !result.url) {
      setStatus("error");
      setError(result.error ?? "Something went wrong preparing the upload.");
      return;
    }

    try {
      const res = await fetch(result.uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      if (!res.ok) throw new Error("Upload failed");
      onChange({ key: result.key, url: result.url, fileName: file.name } satisfies UploadedValue);
      setStatus("idle");
    } catch {
      setStatus("error");
      setError("The upload didn't complete. Please try again.");
    }
  }

  return (
    <div className="mt-1">
      {uploaded ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald/30 bg-emerald/5 px-4 py-3">
          <div className="flex items-center gap-2.5 text-sm text-paper/80">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald" strokeWidth={1.5} />
            <span className="truncate">{uploaded.fileName}</span>
          </div>
          <label className="shrink-0 cursor-pointer text-xs text-paper/50 underline-offset-2 hover:text-blue hover:underline">
            Replace
            <input
              type="file"
              accept={question.fieldType === "VIDEO" ? "video/mp4,video/webm,video/quicktime" : undefined}
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        </div>
      ) : (
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center transition-colors",
            status === "error" ? "border-red-400/40" : "border-white/15 hover:border-blue/50",
          )}
        >
          {status === "uploading" ? (
            <Loader2 className="h-6 w-6 animate-spin text-blue" strokeWidth={1.5} />
          ) : (
            <UploadCloud className="h-6 w-6 text-paper/40" strokeWidth={1.5} />
          )}
          <span className="text-sm text-paper/70">
            {status === "uploading" ? "Uploading…" : "Click to upload, or drag a file here"}
          </span>
          {question.fieldType === "VIDEO" && (
            <span className="text-xs text-paper/40">MP4, WebM, or MOV — up to 150MB</span>
          )}
          <input
            type="file"
            accept={question.fieldType === "VIDEO" ? "video/mp4,video/webm,video/quicktime" : undefined}
            className="hidden"
            disabled={status === "uploading"}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
      )}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
