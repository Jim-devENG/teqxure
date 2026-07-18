import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

function FieldWrapper({ label, hint, children, className }: FieldWrapperProps) {
  return (
    <label className={cn("block", className)}>
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-1.5 block text-xs text-slate">{hint}</span>}
    </label>
  );
}

const inputClasses =
  "w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-blue";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  wrapperClassName?: string;
}

export function TextField({ label, hint, wrapperClassName, className, ...props }: TextFieldProps) {
  return (
    <FieldWrapper label={label} hint={hint} className={wrapperClassName}>
      <input className={cn(inputClasses, className)} {...props} />
    </FieldWrapper>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  wrapperClassName?: string;
}

export function TextAreaField({ label, hint, wrapperClassName, className, ...props }: TextAreaFieldProps) {
  return (
    <FieldWrapper label={label} hint={hint} className={wrapperClassName}>
      <textarea rows={4} className={cn(inputClasses, "resize-y", className)} {...props} />
    </FieldWrapper>
  );
}

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function CheckboxField({ label, className, ...props }: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-graphite">
      <input type="checkbox" className={cn("h-4 w-4 rounded border-light-gray text-blue", className)} {...props} />
      {label}
    </label>
  );
}
