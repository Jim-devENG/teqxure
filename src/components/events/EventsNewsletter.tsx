"use client";

import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useWaitlist } from "@/components/waitlist/WaitlistProvider";

export function EventsNewsletter() {
  const { openWaitlist } = useWaitlist();

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-medium tracking-tight text-paper sm:text-3xl">Never miss an event</h2>
          <p className="mt-3 text-sm text-paper/60 sm:text-base">
            Join the waitlist and we'll let you know when new workshops and sessions go live.
          </p>
          <MagneticButton onClick={openWaitlist} className="mt-6">
            Join the waitlist
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
