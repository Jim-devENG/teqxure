"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { uploadMediaAction } from "@/lib/actions/media";

interface ImageUploaderProps {
  name: string;
  label: string;
  defaultValue?: string | null;
}

export function ImageUploader({ name, label, defaultValue }: ImageUploaderProps) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadMediaAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setUrl(result.url);
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">{label}</span>
      <div className="mt-2 flex items-center gap-4">
        {url ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-light-gray bg-white">
            <Image src={url} alt="" fill sizes="64px" className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-light-gray text-slate">
            <Upload className="h-5 w-5" strokeWidth={1.5} />
          </div>
        )}
        <label className="cursor-pointer rounded-lg border border-light-gray px-3 py-2 text-xs text-graphite transition-colors hover:border-blue hover:text-blue">
          {isUploading ? "Uploading…" : url ? "Replace" : "Upload"}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      <input type="hidden" name={name} value={url} />
    </div>
  );
}
