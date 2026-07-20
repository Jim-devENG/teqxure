import { Reveal } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { getHomepageSection } from "@/lib/content";

export async function AboutStats() {
  const section = await getHomepageSection("ABOUT_STATS");
  if (section.stats.length === 0) return null;

  return (
    <section className="bg-charcoal py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {section.eyebrow && (
          <Reveal>
            <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-blue">{section.eyebrow}</p>
          </Reveal>
        )}
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
          {section.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <div className="flex h-full flex-col items-center justify-center bg-charcoal px-6 py-8 text-center">
                <span className="font-mono text-3xl font-medium text-paper sm:text-4xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-2 text-xs text-paper/50 sm:text-sm">{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
