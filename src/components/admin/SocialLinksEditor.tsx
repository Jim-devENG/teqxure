"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SOCIAL_PLATFORMS } from "@/lib/socialPlatforms";

interface SocialLink {
  platform: string;
  href: string;
}

interface SocialLinksEditorProps {
  defaultValues?: SocialLink[];
}

export function SocialLinksEditor({ defaultValues = [] }: SocialLinksEditorProps) {
  const [links, setLinks] = useState<SocialLink[]>(
    defaultValues.length > 0 ? defaultValues : [{ platform: "twitter", href: "" }],
  );

  function updateLink(index: number, patch: Partial<SocialLink>) {
    setLinks((prev) => prev.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  }

  return (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Social links</span>
      <input type="hidden" name="socialLinks__count" value={links.length} />

      <div className="mt-2 flex flex-col gap-3">
        {links.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              name={`socialLinks.${i}.platform`}
              value={link.platform}
              onChange={(e) => updateLink(i, { platform: e.target.value })}
              className="w-40 shrink-0 rounded-lg border border-light-gray bg-white px-2.5 py-2 text-sm text-graphite outline-none focus:border-blue"
            >
              {SOCIAL_PLATFORMS.map((platform) => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
            <input
              name={`socialLinks.${i}.href`}
              value={link.href}
              onChange={(e) => updateLink(i, { href: e.target.value })}
              placeholder="https://…"
              className="w-full rounded-lg border border-light-gray bg-white px-3 py-2 text-sm text-graphite outline-none focus:border-blue"
            />
            <button
              type="button"
              onClick={() => setLinks((prev) => prev.filter((_, idx) => idx !== i))}
              className="shrink-0 text-slate hover:text-red-500 cursor-pointer"
              aria-label="Remove social link"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setLinks((prev) => [...prev, { platform: "twitter", href: "" }])}
          className="flex w-fit items-center gap-1.5 text-xs text-blue cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
          Add social link
        </button>
      </div>
    </div>
  );
}
