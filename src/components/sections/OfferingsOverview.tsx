import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SectionContent } from "@/lib/sectionSchemas";
import { cn } from "@/lib/utils";

const accentText: Record<string, string> = {
  Studio: "text-blue",
  Academy: "text-emerald",
  Community: "text-cyan",
  Research: "text-slate",
};

const accentBg: Record<string, string> = {
  Studio: "bg-blue/15",
  Academy: "bg-emerald/15",
  Community: "bg-cyan/15",
  Research: "bg-slate/15",
};

interface OfferingsOverviewProps {
  section: SectionContent<"OFFERINGS_OVERVIEW">;
}

export function OfferingsOverview({ section }: OfferingsOverviewProps) {
  return (
    <section id="offerings" className="bg-charcoal py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {section.tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-charcoal-soft p-6">
                <span
                  className={cn(
                    "font-mono text-xs uppercase tracking-[0.2em]",
                    accentText[tier.name] ?? accentText.Studio,
                  )}
                >
                  {tier.name}
                </span>
                <p className="mt-3 text-sm font-medium text-paper">{tier.tagline}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-paper/60">{tier.description}</p>
                <Link
                  href={tier.href}
                  className={cn(
                    "mt-6 inline-flex items-center gap-1.5 self-start rounded-full px-4 py-2 text-xs font-medium text-paper transition-colors hover:text-white",
                    accentBg[tier.name] ?? accentBg.Studio,
                  )}
                >
                  {tier.ctaText}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
