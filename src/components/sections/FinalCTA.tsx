"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useWaitlist } from "@/components/waitlist/WaitlistProvider";
import { curatedImages } from "@/content/images";

export function FinalCTA() {
  const { openWaitlist } = useWaitlist();

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0">
        <Image
          src={curatedImages.engineeringFloor.src}
          alt={curatedImages.engineeringFloor.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/88" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-paper/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Applications open for the next cohort
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-6 text-balance text-3xl font-medium tracking-tight text-paper sm:text-4xl md:text-5xl">
            Stop building tutorials. Start building the product only you can
            build.
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-paper/60 sm:text-lg">
            Twelve weeks. One production system. Real users. Join the waitlist
            and we'll reach out when applications open for your cohort.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-9 flex justify-center">
            <MagneticButton onClick={openWaitlist} className="px-8 py-4 text-base">
              Join the waitlist
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
