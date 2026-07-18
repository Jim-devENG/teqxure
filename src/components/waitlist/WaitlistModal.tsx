"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="waitlist-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md rounded-2xl border border-light-gray bg-paper p-8 shadow-2xl sm:p-10"
          >
            <button
              onClick={onClose}
              aria-label="Close waitlist form"
              className="absolute right-5 top-5 text-slate transition-colors hover:text-graphite cursor-pointer"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue">
              Cohort applications
            </span>
            <h2 id="waitlist-title" className="mt-3 text-2xl font-medium tracking-tight text-graphite">
              Join the waitlist
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              Leave your details and we&apos;ll reach out when the next cohort opens.
            </p>

            <div className="mt-8">
              <WaitlistForm />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
