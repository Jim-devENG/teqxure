"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

type Status = "idle" | "submitting" | "success";

interface Errors {
  name?: string;
  email?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function validate(): boolean {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Enter your full name";
    if (!EMAIL_PATTERN.test(email)) next.email = "Enter a valid email address";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    window.setTimeout(() => setStatus("success"), 700);
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4 py-10 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald" strokeWidth={1.5} />
        <div>
          <p className="text-lg font-medium text-charcoal">You&apos;re on the list</p>
          <p className="mt-1 text-sm text-charcoal/60">
            We&apos;ll email {email} when the next cohort opens applications.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field
        label="Full name"
        name="name"
        type="text"
        value={name}
        onChange={setName}
        placeholder="Ada Lovelace"
        error={errors.name}
        autoComplete="name"
      />
      <Field
        label="Email address"
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@domain.com"
        error={errors.email}
        autoComplete="email"
      />
      <Field
        label="What are you building? (optional)"
        name="role"
        type="text"
        value={role}
        onChange={setRole}
        placeholder="SaaS, marketplace, AI product…"
      />

      <MagneticButton
        type="submit"
        variant="primary"
        disabled={status === "submitting"}
        className="mt-2 w-full bg-charcoal text-paper hover:bg-charcoal-soft disabled:opacity-60"
      >
        {status === "submitting" ? "Joining…" : "Join the waitlist"}
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
      </MagneticButton>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
}

function Field({ label, name, type, value, onChange, placeholder, error, autoComplete }: FieldProps) {
  return (
    <label htmlFor={name} className="group block">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-charcoal/45">
        {label}
      </span>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-0 border-b border-charcoal/15 bg-transparent pb-2 text-base text-charcoal placeholder:text-charcoal/30 outline-none transition-colors focus:border-blue"
      />
      {error && <span className="mt-1.5 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
