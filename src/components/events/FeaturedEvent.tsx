import Image from "next/image";
import Link from "next/link";
import { MapPin, Video, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { EventDateTime } from "@/components/events/EventDateTime";
import { Countdown } from "@/components/events/Countdown";

interface FeaturedEventData {
  slug: string;
  title: string;
  description: string;
  startsAt: Date;
  endsAt: Date | null;
  location: string | null;
  isVirtual: boolean;
  coverImageUrl: string | null;
}

export function FeaturedEvent({ event }: { event: FeaturedEventData }) {
  return (
    <section id="featured" className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">Next up</span>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-10 rounded-3xl border border-white/10 bg-charcoal-soft p-8 lg:grid-cols-[1fr_0.85fr] sm:p-10">
          <Reveal delay={0.05}>
            <div>
              <span className="rounded-full border border-emerald/30 bg-emerald/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald">
                Free
              </span>
              <h2 className="mt-4 text-balance text-2xl font-medium tracking-tight text-paper sm:text-3xl">{event.title}</h2>
              <p className="mt-3 text-sm text-paper/50">
                <EventDateTime startsAt={event.startsAt} endsAt={event.endsAt} />
              </p>
              {(event.location || event.isVirtual) && (
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-paper/50">
                  {event.isVirtual ? <Video className="h-4 w-4" strokeWidth={1.5} /> : <MapPin className="h-4 w-4" strokeWidth={1.5} />}
                  {event.isVirtual ? "Virtual event" : event.location}
                </span>
              )}
              <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/60">{event.description}</p>

              <div className="mt-6">
                <Countdown startsAt={event.startsAt} />
              </div>

              <Link
                href={`/${event.slug}`}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
              >
                Register
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </Reveal>

          {event.coverImageUrl && (
            <Reveal delay={0.15}>
              <div className="relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                <Image src={event.coverImageUrl} alt={event.title} fill sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" />
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
