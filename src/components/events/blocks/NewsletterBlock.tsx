"use client";

import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useWaitlist } from "@/components/waitlist/WaitlistProvider";
import type { BlockContent } from "@/lib/blockSchemas";

export function NewsletterBlock({ content }: { content: BlockContent<"NEWSLETTER"> }) {
  const { openWaitlist } = useWaitlist();

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <h2 className="text-xl font-medium tracking-tight text-paper sm:text-2xl">{content.title}</h2>
          {content.description && <p className="mt-3 text-sm text-paper/60 sm:text-base">{content.description}</p>}
          <MagneticButton onClick={openWaitlist} className="mt-6">
            Join the waitlist
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
