import Image from "next/image";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { curatedImages } from "@/content/images";
import { getHomepageSection } from "@/lib/content";

export async function InstructorPhilosophy() {
  const section = await getHomepageSection("INSTRUCTOR_PHILOSOPHY");

  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_0.8fr] lg:gap-12">
          <div>
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">
                {section.eyebrow}
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <Quote className="mt-6 h-8 w-8 text-graphite/20" strokeWidth={1.5} />
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-4 text-balance text-2xl font-medium leading-snug tracking-tight text-graphite sm:text-3xl md:text-4xl">
                {section.quote}
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-slate sm:text-lg">
                {section.paragraph1}
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate sm:text-lg">
                {section.paragraph2}
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
