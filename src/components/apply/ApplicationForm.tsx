"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { submitApplicationAction, type SubmitApplicationState } from "@/lib/actions/applications";

const initialState: SubmitApplicationState = {};

const inputClasses =
  "mt-2 w-full border-0 border-b border-white/15 bg-transparent pb-2 text-base text-paper placeholder:text-paper/30 outline-none transition-colors focus:border-blue";

const labelClasses = "font-mono text-[11px] uppercase tracking-[0.15em] text-paper/50";

export function ApplicationForm() {
  const [state, formAction, isPending] = useActionState(submitApplicationAction, initialState);

  if (state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4 py-6 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald" strokeWidth={1.5} />
        <div>
          <p className="text-lg font-medium text-paper">Check your email</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-paper/60">
            We've sent you a link to begin your onboarding assessment — it takes about 10–15 minutes and helps us
            understand where you're starting from.
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-paper/50">
          <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
          Didn't get it? Check your spam folder — it can take a few minutes.
        </div>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <label className="block">
        <span className={labelClasses}>Full Name</span>
        <input name="fullName" type="text" required className={inputClasses} />
      </label>

      <label className="block">
        <span className={labelClasses}>Email Address</span>
        <input name="email" type="email" required className={inputClasses} />
      </label>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={labelClasses}>Phone Number</span>
          <input name="phone" type="tel" required className={inputClasses} />
        </label>
        <label className="block">
          <span className={labelClasses}>Country</span>
          <input name="country" type="text" required className={inputClasses} />
        </label>
      </div>

      <label className="block">
        <span className={labelClasses}>Current Occupation</span>
        <input name="occupation" type="text" required className={inputClasses} />
      </label>

      <label className="block">
        <span className={labelClasses}>LinkedIn (Optional)</span>
        <input name="linkedin" type="url" placeholder="https://linkedin.com/in/…" className={inputClasses} />
      </label>

      <label className="block">
        <span className={labelClasses}>GitHub (Optional)</span>
        <input name="github" type="url" placeholder="https://github.com/…" className={inputClasses} />
      </label>

      <label className="block">
        <span className={labelClasses}>Portfolio Website (Optional)</span>
        <input name="portfolio" type="url" placeholder="https://…" className={inputClasses} />
      </label>

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <MagneticButton type="submit" variant="primary" disabled={isPending} className="mt-2 w-full disabled:opacity-60">
        {isPending ? "Submitting…" : "Continue"}
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
      </MagneticButton>
    </form>
  );
}
