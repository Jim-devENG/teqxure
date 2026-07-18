"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "danger";
}

const variantClasses = {
  primary: "bg-blue text-white hover:bg-blue-dark",
  secondary: "border border-light-gray text-graphite hover:border-blue hover:text-blue",
  danger: "border border-light-gray text-red-500 hover:border-red-500",
};

export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  variant = "primary",
  className,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
