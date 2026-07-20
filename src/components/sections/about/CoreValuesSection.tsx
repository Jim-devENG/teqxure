import { Reveal } from "@/components/ui/Reveal";
import { getCoreValues } from "@/lib/content";
import { getLucideIcon } from "@/lib/lucideIconMap";

export async function CoreValuesSection() {
  const coreValues = await getCoreValues();
  if (coreValues.length === 0) return null;

  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">Core Values</span>
          <h2 className="mt-4 max-w-xl text-balance text-3xl font-medium tracking-tight text-graphite sm:text-4xl">
            What Teqxure stands for
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value, i) => {
            const Icon = getLucideIcon(value.icon);
            return (
              <Reveal key={value.id} delay={i * 0.05}>
                <div className="flex h-full flex-col rounded-2xl border border-light-gray bg-white p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue/10 text-blue">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 text-base font-medium text-graphite">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{value.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
