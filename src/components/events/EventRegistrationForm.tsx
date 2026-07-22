"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  submitEventRegistrationAction,
  type SubmitEventRegistrationState,
} from "@/lib/actions/eventRegistrations";

export interface EventFieldData {
  id: string;
  label: string;
  fieldType: string;
  placeholder: string | null;
  required: boolean;
  options: unknown;
}

const initialState: SubmitEventRegistrationState = {};

export function EventRegistrationForm({ eventId, fields }: { eventId: string; fields: EventFieldData[] }) {
  const action = submitEventRegistrationAction.bind(null, eventId);
  const [state, formAction, isPending] = useActionState(action, initialState);

  if (state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4 py-10 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald" strokeWidth={1.5} />
        <div>
          <p className="text-lg font-medium text-paper">You&apos;re registered</p>
          <p className="mt-1 text-sm text-paper/60">Check your inbox — we just sent a confirmation email.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {fields.map((field) => (
        <DynamicField key={field.id} field={field} />
      ))}

      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <MagneticButton type="submit" variant="primary" disabled={isPending} className="mt-2 w-full disabled:opacity-60">
        {isPending ? "Registering…" : "Register"}
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
      </MagneticButton>
    </form>
  );
}

function DynamicField({ field }: { field: EventFieldData }) {
  const options = Array.isArray(field.options) ? (field.options as string[]) : [];
  const baseInputClasses =
    "mt-2 w-full border-0 border-b border-white/15 bg-transparent pb-2 text-base text-paper placeholder:text-paper/35 outline-none transition-colors focus:border-blue";

  if (field.fieldType === "CHECKBOX" && options.length === 0) {
    return (
      <label className="flex items-center gap-2.5 text-sm text-paper/70">
        <input type="checkbox" name={field.id} required={field.required} className="h-4 w-4 rounded border-white/20 bg-transparent text-blue" />
        {field.label}
      </label>
    );
  }

  return (
    <label htmlFor={field.id} className="group block">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-paper/50">{field.label}</span>

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
            <label key={option} className="flex items-center gap-2 text-sm text-paper/70">
              <input type="checkbox" name={field.id} value={option} className="h-4 w-4 rounded border-white/20 bg-transparent text-blue" />
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
