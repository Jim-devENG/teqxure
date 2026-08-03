import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getHomepageSection } from "@/lib/content";
import { getLucideIcon } from "@/lib/lucideIconMap";

export async function ResearchAreas() {
  const section = await getHomepageSection("RESEARCH_AREAS");

  return (
    <section className="bg-charcoal py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {section.areas.map((area, i) => {
            const Icon = getLucideIcon(area.icon);
            return (
              <Reveal key={area.name} delay={i * 0.05}>
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-charcoal-soft p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate/15 text-slate">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 text-base font-medium text-paper">{area.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/60">{area.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.3}>
          <p className="mt-14 text-center text-sm text-paper/50">
            Today, the work is AI.{" "}
            <Link href="/academy" className="text-slate underline underline-offset-4 hover:text-paper">
              Start with the Academy
            </Link>{" "}
            — or{" "}
            <Link href="/community" className="text-slate underline underline-offset-4 hover:text-paper">
              join the Community
            </Link>{" "}
            to stay ahead of what's next.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
