"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, Link2, Check, Mail } from "lucide-react";
import { FaXTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  url: string;
  className?: string;
}

export function ShareButton({ title, url, className }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleShareClick() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the native share sheet
      }
      return;
    }
    setOpen((v) => !v);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: "Share on X", icon: FaXTwitter, href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: "Share on LinkedIn", icon: FaLinkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Share on WhatsApp", icon: FaWhatsapp, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "Share by email", icon: Mail, href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleShareClick}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-paper/70 transition-colors hover:border-blue/40 hover:text-paper",
          className,
        )}
      >
        <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        Share
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-52 rounded-xl border border-white/10 bg-charcoal-soft p-1.5 shadow-xl">
          {links.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-paper/70 transition-colors hover:bg-white/5 hover:text-paper"
            >
              <Icon className="h-4 w-4" />
              {label.replace("Share on ", "").replace("Share by ", "")}
            </a>
          ))}
          <button
            type="button"
            onClick={handleCopy}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-paper/70 transition-colors hover:bg-white/5 hover:text-paper"
          >
            {copied ? <Check className="h-4 w-4 text-emerald" /> : <Link2 className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
