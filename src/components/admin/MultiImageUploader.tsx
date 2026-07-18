"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { uploadMediaAction } from "@/lib/actions/media";

interface MultiImageUploaderProps {
  name: string;
  label: string;
  defaultValues?: string[];
}

export function MultiImageUploader({ name, label, defaultValues = [] }: MultiImageUploaderProps) {
  const [urls, setUrls] = useState<string[]>(defaultValues);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setIsUploading(true);
    setError("");

    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadMediaAction(formData);
        if (result.error) {
          setError(result.error);
        } else {
          uploaded.push(result.url);
        }
      }
      setUrls((prev) => [...prev, ...uploaded]);
    } catch {
      setError("Upload failed.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">{label}</span>

      <div className="mt-2 flex flex-wrap gap-3">
        {urls.map((url, i) => (
          <div key={url + i} className="relative h-20 w-28 overflow-hidden rounded-lg border border-light-gray bg-soft-white">
            <Image src={url} alt="" fill sizes="112px" className="object-contain" />
            <input type="hidden" name={name} value={url} />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Remove screenshot"
              className="absolute right-1 top-1 rounded-full bg-charcoal/70 p-1 text-white cursor-pointer"
            >
              <X className="h-3 w-3" strokeWidth={2} />
            </button>
          </div>
        ))}

        <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-light-gray text-slate transition-colors hover:border-blue hover:text-blue">
          <Upload className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-[11px]">{isUploading ? "Uploading…" : "Add"}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      <p className="mt-1.5 text-xs text-slate">
        Any image dimension works — screenshots are never cropped, only scaled to fit.
      </p>
    </div>
  );
}
