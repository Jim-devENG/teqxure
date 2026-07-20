import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { getHomepageSection } from "@/lib/content";

export async function AboutHero() {
  const section = await getHomepageSection("ABOUT_HERO");

  return (
    <section className="relative overflow-hidden bg-charcoal pb-24 pt-36 sm:pt-44">
      {section.backgroundImage ? (
        <div className="absolute inset-0">
          <Image src={section.backgroundImage} alt="" fill sizes="100vw" className="object-cover opacity-25" priority />
          <div className="absolute inset-0 bg-charcoal/70" />
        </div>
      ) : (
        <div
          aria-hidden
          className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)]"
        />
      )}

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">{section.pageTitle}</span>
        </Reveal>

        <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-paper sm:text-5xl md:text-6xl">
          <RevealText text={section.headline} />
        </h1>

        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-paper/60 sm:text-lg">
            {section.description}
          </p>
        </Reveal>

        {section.ctaText && section.ctaUrl && (
          <Reveal delay={0.45}>
            <Link
              href={section.ctaUrl}
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
            >
              {section.ctaText}
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
