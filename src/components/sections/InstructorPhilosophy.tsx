import Image from "next/image";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { curatedImages } from "@/content/images";

export function InstructorPhilosophy() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_0.8fr] lg:gap-12">
          <div>
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">
                Instructor Philosophy
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <Quote className="mt-6 h-8 w-8 text-graphite/20" strokeWidth={1.5} />
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-4 text-balance text-2xl font-medium leading-snug tracking-tight text-graphite sm:text-3xl md:text-4xl">
                Software development asks how to build it. Product Engineering asks
                whether it should exist, who it's for, and how you'll know it's
                working.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-slate sm:text-lg">
                Most engineering education optimizes for correctness — does the
                function return the right value. Product Engineering optimizes for
                consequence — does the decision behind that function hold up when a
                stranger relies on it. That distinction is the entire curriculum.
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate sm:text-lg">
                We teach engineers to sit with ambiguity long enough to make it
                someone else's clarity — then to build fast enough, with AI as
                leverage, that the clarity ships before it goes stale.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-light-gray">
              <Image
                src={curatedImages.pairReview.src}
                alt={curatedImages.pairReview.alt}
                fill
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
