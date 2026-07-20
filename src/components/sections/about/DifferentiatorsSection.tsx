import { Reveal } from "@/components/ui/Reveal";
import { getDifferentiators } from "@/lib/content";
import { getLucideIcon } from "@/lib/lucideIconMap";

export async function DifferentiatorsSection() {
  const differentiators = await getDifferentiators();
  if (differentiators.length === 0) return null;

  return (
    <section className="bg-charcoal py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">What Makes Teqxure Different</span>
          <h2 className="mt-4 max-w-xl text-balance text-3xl font-medium tracking-tight text-paper sm:text-4xl">
            Not another bootcamp
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((d, i) => {
            const Icon = getLucideIcon(d.icon);
            return (
              <Reveal key={d.id} delay={i * 0.05}>
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-charcoal-soft p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue/15 text-blue">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 text-base font-medium text-paper">{d.heading}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/60">{d.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
