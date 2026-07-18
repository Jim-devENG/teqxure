import Image from "next/image";
import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { curatedImages } from "@/content/images";
import { getHomepageSection } from "@/lib/content";

export async function WhatYoullBuild() {
  const section = await getHomepageSection("WHAT_YOULL_BUILD");

  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.85fr_1fr] lg:gap-12">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-light-gray lg:aspect-[4/5]">
              <Image
                src={curatedImages.overheadWorkspace.src}
                alt={curatedImages.overheadWorkspace.alt}
                fill
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <SectionHeading
              tone="light"
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
            />

            <ul className="mt-10 flex flex-col gap-4">
              {section.requirements.map((requirement, i) => (
                <Reveal key={requirement} delay={0.1 + i * 0.05}>
                  <li className="flex items-start gap-3 rounded-xl border border-light-gray bg-soft-white px-5 py-4 text-sm text-graphite/80 sm:text-base">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue" strokeWidth={1.5} />
                    {requirement}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
