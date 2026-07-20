import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { RichTextContent } from "@/components/RichTextContent";
import { getHomepageSection } from "@/lib/content";

export async function CompanyStory() {
  const section = await getHomepageSection("ABOUT_STORY");

  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className={section.image ? "grid grid-cols-1 gap-16 lg:grid-cols-[0.85fr_1fr] lg:gap-12" : "mx-auto max-w-3xl"}>
          {section.image && (
            <Reveal className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-light-gray lg:aspect-[4/5]">
                <Image src={section.image} alt="" fill sizes="(min-width: 1024px) 480px, 90vw" className="object-cover" />
              </div>
            </Reveal>
          )}

          <div className={section.image ? "order-1 lg:order-2" : ""}>
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">Our Story</span>
              <h2 className="mt-4 text-balance text-3xl font-medium tracking-tight text-graphite sm:text-4xl">
                {section.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <RichTextContent html={section.content} className="mt-6 text-base leading-relaxed text-slate sm:text-lg" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
