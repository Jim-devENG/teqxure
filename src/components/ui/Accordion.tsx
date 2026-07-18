"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  isOpen: boolean;
  onToggle: () => void;
  header: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({ isOpen, onToggle, header, children, className }: AccordionItemProps) {
  return (
    <div className={className}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        {header}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className={cn("pb-6")}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
