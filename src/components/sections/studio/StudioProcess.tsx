import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getHomepageSection } from "@/lib/content";

export async function StudioProcess() {
  const section = await getHomepageSection("STUDIO_PROCESS");

  return (
    <section className="bg-charcoal py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {section.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-charcoal-soft p-6">
                <span className="font-mono text-xs text-blue">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-base font-medium text-paper">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/60">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
