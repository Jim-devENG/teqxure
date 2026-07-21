import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";

export function EventsHero({ hasFeatured }: { hasFeatured: boolean }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 sm:pt-44">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)]"
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">Teqxure Events</span>
        </Reveal>
        <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-paper sm:text-5xl md:text-6xl">
          <RevealText text="Where serious engineers" className="block" />
          <RevealText text="show their work." delay={0.15} className="block text-blue" />
        </h1>
        <Reveal delay={0.35}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-paper/60 sm:text-lg">
            Workshops, masterclasses, and demo days from Teqxure — the Product Engineering Bootcamp.
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#browse"
              className="inline-flex items-center gap-2 rounded-full bg-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
            >
              Browse events
            </a>
            {hasFeatured && (
              <a
                href="#featured"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-paper transition-colors hover:border-blue hover:text-blue"
              >
                View upcoming event
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
