"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useUploadStatus } from "@/components/admin/UploadStatusContext";

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
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const uploadStatus = useUploadStatus();
  const waitingForUploads = Boolean(uploadStatus?.isAnyUploading);

  return (
    <button
      type="submit"
      disabled={pending || waitingForUploads || disabled}
      title={waitingForUploads ? "Waiting for image uploads to finish…" : undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {pending ? pendingLabel : waitingForUploads ? "Waiting for upload…" : children}
    </button>
  );
}
