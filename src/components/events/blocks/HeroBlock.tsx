import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { BlockContent } from "@/lib/blockSchemas";

export function HeroBlock({ content }: { content: BlockContent<"HERO"> }) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {content.backgroundImage && (
        <div className="absolute inset-0">
          <Image src={content.backgroundImage} alt="" fill sizes="100vw" className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-charcoal/70" />
        </div>
      )}
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="text-balance text-3xl font-medium tracking-tight text-paper sm:text-4xl">{content.title}</h2>
          {content.subtitle && <p className="mt-4 text-base leading-relaxed text-paper/60 sm:text-lg">{content.subtitle}</p>}
          {content.ctaText && content.ctaUrl && (
            <Link
              href={content.ctaUrl}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
            >
              {content.ctaText}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
