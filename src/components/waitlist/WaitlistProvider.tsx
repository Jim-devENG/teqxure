"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { WaitlistModal } from "@/components/waitlist/WaitlistModal";
import type { WaitlistFieldData } from "@/components/waitlist/WaitlistForm";

interface WaitlistContextValue {
  isOpen: boolean;
  openWaitlist: () => void;
  closeWaitlist: () => void;
}

const WaitlistContext = createContext<WaitlistContextValue | null>(null);

export function WaitlistProvider({
  children,
  fields,
}: {
  children: ReactNode;
  fields: WaitlistFieldData[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openWaitlist = useCallback(() => setIsOpen(true), []);
  const closeWaitlist = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openWaitlist, closeWaitlist }),
    [isOpen, openWaitlist, closeWaitlist],
  );

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      <WaitlistModal isOpen={isOpen} onClose={closeWaitlist} fields={fields} />
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error("useWaitlist must be used within a WaitlistProvider");
  return ctx;
}
