"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, ClipboardCheck, PhoneCall } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { submitWaitlistAction, type SubmitWaitlistState } from "@/lib/actions/waitlistSubmissions";

const NEXT_STEPS = [
  { icon: Mail, text: "Check your inbox — we just sent a confirmation email." },
  { icon: ClipboardCheck, text: "We review every application by hand, no automated filtering." },
  { icon: PhoneCall, text: "If it's a fit, we'll invite you to a short onboarding call before the cohort starts." },
];

export interface WaitlistFieldData {
  id: string;
  label: string;
  fieldType: string;
  placeholder: string | null;
  required: boolean;
  options: unknown;
}

const initialState: SubmitWaitlistState = {};

export function WaitlistForm({ fields }: { fields: WaitlistFieldData[] }) {
  const [state, formAction, isPending] = useActionState(submitWaitlistAction, initialState);

  if (state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-5 py-6 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald" strokeWidth={1.5} />
        <div>
          <p className="text-lg font-medium text-graphite">You&apos;re registered</p>
          <p className="mt-1 text-sm text-slate">Here&apos;s what happens next.</p>
        </div>

        <ul className="flex w-full flex-col gap-3 text-left">
          {NEXT_STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border border-light-gray bg-soft-white px-4 py-3">
              <step.icon className="mt-0.5 h-4 w-4 shrink-0 text-blue" strokeWidth={1.5} />
              <span className="text-sm text-graphite/80">{step.text}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {fields.map((field) => (
        <DynamicField key={field.id} field={field} />
      ))}

      {/* Honeypot: hidden from real users, tabIndex/aria-hidden'd out, but a
          plain form field bots tend to auto-fill. Never rendered visibly. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <MagneticButton
        type="submit"
        variant="primary"
        disabled={isPending}
        className="mt-2 w-full disabled:opacity-60"
      >
        {isPending ? "Joining…" : "Join the waitlist"}
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
      </MagneticButton>
    </form>
  );
}

function DynamicField({ field }: { field: WaitlistFieldData }) {
  const options = Array.isArray(field.options) ? (field.options as string[]) : [];
  const baseInputClasses =
    "mt-2 w-full border-0 border-b border-light-gray bg-transparent pb-2 text-base text-graphite placeholder:text-slate/50 outline-none transition-colors focus:border-blue";

  if (field.fieldType === "CHECKBOX" && options.length === 0) {
    return (
      <label className="flex items-center gap-2.5 text-sm text-graphite">
        <input type="checkbox" name={field.id} required={field.required} className="h-4 w-4 rounded border-light-gray text-blue" />
        {field.label}
      </label>
    );
  }

  return (
    <label htmlFor={field.id} className="group block">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">
        {field.label}
      </span>

      {field.fieldType === "TEXTAREA" && (
        <textarea
          id={field.id}
          name={field.id}
          required={field.required}
          placeholder={field.placeholder ?? undefined}
          rows={3}
          className={baseInputClasses}
        />
      )}

      {field.fieldType === "SELECT" && (
        <select id={field.id} name={field.id} required={field.required} className={baseInputClasses}>
          <option value="">Select…</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {field.fieldType === "CHECKBOX" && options.length > 0 && (
        <div className="mt-2 flex flex-col gap-2">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-graphite">
              <input type="checkbox" name={field.id} value={option} className="h-4 w-4 rounded border-light-gray text-blue" />
              {option}
            </label>
          ))}
        </div>
      )}

      {!["TEXTAREA", "SELECT", "CHECKBOX"].includes(field.fieldType) && (
        <input
          id={field.id}
          name={field.id}
          type={fieldTypeToInputType(field.fieldType)}
          required={field.required}
          placeholder={field.placeholder ?? undefined}
          className={baseInputClasses}
        />
      )}
    </label>
  );
}

function fieldTypeToInputType(fieldType: string): string {
  switch (fieldType) {
    case "EMAIL":
      return "email";
    case "PHONE":
      return "tel";
    case "URL":
      return "url";
    case "FILE":
      return "file";
    default:
      return "text";
  }
}
