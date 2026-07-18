"use client";

import { useLenis } from "lenis/react";
import { Reveal } from "@/components/ui/Reveal";
import type { SectionContent } from "@/lib/sectionSchemas";
import { cn } from "@/lib/utils";

const accentText: Record<string, string> = {
  blue: "group-hover:text-blue",
  cyan: "group-hover:text-cyan",
  emerald: "group-hover:text-emerald",
};

const accentBg: Record<string, string> = {
  blue: "group-hover:bg-blue",
  cyan: "group-hover:bg-cyan",
  emerald: "group-hover:bg-emerald",
};

interface SocialProofProps {
  section: SectionContent<"SOCIAL_PROOF">;
  products: { slug: string; name: string; accent: string }[];
}

export function SocialProof({ section, products }: SocialProofProps) {
  const lenis = useLenis();

  return (
    <section className="border-y border-white/10 bg-charcoal py-14">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/35">
            {section.eyebrow}
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.04}>
              <button
                onClick={() => lenis?.scrollTo("#products")}
                className="group flex h-full w-full flex-col items-start justify-center gap-1 bg-charcoal px-5 py-6 text-left transition-colors hover:bg-charcoal-soft cursor-pointer"
              >
                <span
                  className={cn(
                    "h-[3px] w-6 rounded-full bg-paper/15 transition-colors",
                    accentBg[product.accent] ?? accentBg.blue,
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium text-paper/70 transition-colors",
                    accentText[product.accent] ?? accentText.blue,
                  )}
                >
                  {product.name}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
