import { Reveal } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { BlockContent } from "@/lib/blockSchemas";

export function StatisticsBlock({ content }: { content: BlockContent<"STATISTICS"> }) {
  if (content.items.length === 0) return null;
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
          {content.items.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <div className="flex h-full flex-col items-center justify-center bg-charcoal px-6 py-8 text-center">
                <span className="font-mono text-2xl font-medium text-paper sm:text-3xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-2 text-xs text-paper/50">{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
