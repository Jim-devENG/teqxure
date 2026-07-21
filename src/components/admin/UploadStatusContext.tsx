"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

interface UploadStatusContextValue {
  registerUploading: (id: string, uploading: boolean) => void;
  isAnyUploading: boolean;
}

const UploadStatusContext = createContext<UploadStatusContextValue | null>(null);

/**
 * Tracks whether any ImageUploader/MultiImageUploader anywhere below it is
 * mid-upload. Wrapping the whole admin at the root means every form gets
 * "don't let me save while an image hasn't finished uploading" for free,
 * instead of each form having to wire it up individually.
 */
export function UploadStatusProvider({ children }: { children: ReactNode }) {
  const uploadingIds = useRef<Set<string>>(new Set());
  const [isAnyUploading, setIsAnyUploading] = useState(false);

  const registerUploading = useCallback((id: string, uploading: boolean) => {
    if (uploading) uploadingIds.current.add(id);
    else uploadingIds.current.delete(id);
    setIsAnyUploading(uploadingIds.current.size > 0);
  }, []);

  return (
    <UploadStatusContext.Provider value={{ registerUploading, isAnyUploading }}>
      {children}
    </UploadStatusContext.Provider>
  );
}

export function useUploadStatus() {
  return useContext(UploadStatusContext);
}
