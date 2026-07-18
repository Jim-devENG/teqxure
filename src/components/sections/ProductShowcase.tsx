"use client";

import { motion } from "framer-motion";
import {
  Bot,
  GraduationCap,
  LayoutGrid,
  Rss,
  ShieldCheck,
  Store,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { SectionContent } from "@/lib/sectionSchemas";
import { cn } from "@/lib/utils";

const categoryIcon: Record<string, LucideIcon> = {
  "Enterprise SaaS": LayoutGrid,
  Marketplace: Store,
  "Education Technology": GraduationCap,
  Cybersecurity: ShieldCheck,
  "Creator Platform": Rss,
  "Artificial Intelligence": Bot,
};

const accentText: Record<string, string> = {
  blue: "text-blue",
  cyan: "text-cyan",
  emerald: "text-emerald",
};

const accentBorder: Record<string, string> = {
  blue: "border-blue/25",
  cyan: "border-cyan/25",
  emerald: "border-emerald/25",
};

const accentBg: Record<string, string> = {
  blue: "bg-blue/[0.06]",
  cyan: "bg-cyan/[0.06]",
  emerald: "bg-emerald/[0.06]",
};

interface ProductData {
  slug: string;
  name: string;
  category: string;
  description: string;
  builtWith: string[];
  accent: string;
  metricLabel: string;
  metricValue: string;
}

interface ProductShowcaseProps {
  section: SectionContent<"PRODUCT_SHOWCASE_INTRO">;
  products: ProductData[];
}

export function ProductShowcase({ section, products }: ProductShowcaseProps) {
  return (
    <section id="products" className="bg-charcoal py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => {
            const Icon = categoryIcon[product.category] ?? LayoutGrid;
            return (
              <Reveal key={product.slug} delay={i * 0.05}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-charcoal-soft"
                >
                  <div
                    className={cn(
                      "flex aspect-video items-center justify-center border-b border-white/10",
                      accentBg[product.accent] ?? accentBg.blue,
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-2xl border",
                        accentBorder[product.accent] ?? accentBorder.blue,
                      )}
                    >
                      <Icon className={cn("h-7 w-7", accentText[product.accent] ?? accentText.blue)} strokeWidth={1.4} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <span
                      className={cn(
                        "font-mono text-[11px] uppercase tracking-[0.15em]",
                        accentText[product.accent] ?? accentText.blue,
                      )}
                    >
                      {product.category}
                    </span>
                    <h3 className="mt-3 text-xl font-medium tracking-tight text-paper">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-paper/55">
                      {product.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {product.builtWith.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-paper/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-baseline gap-2 border-t border-white/10 pt-5 mt-6">
                      <span className="text-lg font-medium text-paper">{product.metricValue}</span>
                      <span className="text-xs text-paper/45">{product.metricLabel}</span>
                    </div>
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
