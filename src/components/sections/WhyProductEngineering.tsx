import Image from "next/image";
import { Check, X } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { curatedImages } from "@/content/images";

const TUTORIAL_TRAITS = [
  "Follows a script someone else already solved",
  "Ends the moment the video ends",
  "No real user ever touches it",
  "Success means \"it compiled\"",
];

const PRODUCT_TRAITS = [
  "Starts from a problem no one has solved for this user yet",
  "Continues as long as people rely on it",
  "Strangers use it without you standing behind them",
  "Success means someone came back a second time",
];

export function WhyProductEngineering() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-12">
          <div>
            <SectionHeading
              tone="light"
              eyebrow="Why Product Engineering"
              title="Tutorials teach syntax. Products teach judgment."
              description="Following a tutorial proves you can type. Shipping a product proves you can decide — what to build, for whom, and when it's actually ready for a stranger to depend on."
            />

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Reveal delay={0.15}>
                <div className="rounded-2xl border border-light-gray bg-soft-white p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">
                    Tutorials
                  </p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {TUTORIAL_TRAITS.map((trait) => (
                      <li key={trait} className="flex items-start gap-2.5 text-sm text-slate">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-slate/70" strokeWidth={1.5} />
                        {trait}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <div className="rounded-2xl border border-blue/20 bg-blue/[0.03] p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-blue">
                    Product Engineering
                  </p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {PRODUCT_TRAITS.map((trait) => (
                      <li key={trait} className="flex items-start gap-2.5 text-sm text-graphite/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue" strokeWidth={1.5} />
                        {trait}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.2} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-light-gray">
              <Image
                src={curatedImages.collaboration.src}
                alt={curatedImages.collaboration.alt}
                fill
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
              />
            </div>
            <div className="panel-glass-light absolute -bottom-6 -right-6 max-w-[220px] rounded-xl px-5 py-4 shadow-xl">
              <p className="text-sm font-medium text-graphite">Built in cohort teams</p>
              <p className="mt-1 text-xs leading-relaxed text-slate">
                Engineers reviewing real architecture decisions, not toy exercises.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
