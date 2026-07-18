import Image from "next/image";
import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { curatedImages } from "@/content/images";

const REQUIREMENTS = [
  "A real authentication and billing flow, not a mocked login screen",
  "A production database with a schema that survives real usage",
  "Deployed to a live URL — no localhost demos on demo day",
  "Monitoring, error tracking, and analytics wired in from day one",
  "A responsive, accessible interface tested on real devices",
  "Critical paths covered by tests you'd defend in a code review",
];

export function WhatYoullBuild() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.85fr_1fr] lg:gap-12">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-charcoal/10 lg:aspect-[4/5]">
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
              eyebrow="What You'll Build"
              title="Production-ready applications. Not toy projects."
              description="Every project shipped in the program has to survive contact with a real user — which means it has to meet the same bar production software is held to at a real company."
            />

            <ul className="mt-10 flex flex-col gap-4">
              {REQUIREMENTS.map((requirement, i) => (
                <Reveal key={requirement} delay={0.1 + i * 0.05}>
                  <li className="flex items-start gap-3 rounded-xl border border-charcoal/10 bg-charcoal/[0.02] px-5 py-4 text-sm text-charcoal/70 sm:text-base">
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
