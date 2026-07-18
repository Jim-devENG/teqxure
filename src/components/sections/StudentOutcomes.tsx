import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { getHomepageSection } from "@/lib/content";

export async function StudentOutcomes() {
  const section = await getHomepageSection("STUDENT_OUTCOMES");

  return (
    <section id="outcomes" className="bg-charcoal py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
          {section.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <div className="flex h-full flex-col justify-center bg-charcoal px-6 py-8">
                <span className="font-mono text-3xl font-medium text-paper sm:text-4xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-2 text-xs text-paper/50 sm:text-sm">{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {section.outcomes.map((outcome, i) => (
            <Reveal key={outcome} delay={0.1 + i * 0.04}>
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-charcoal-soft px-5 py-4">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" strokeWidth={1.5} />
                <p className="text-sm text-paper/65 sm:text-base">{outcome}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
