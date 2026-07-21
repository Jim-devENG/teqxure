import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Video } from "lucide-react";
import { db } from "@/lib/db";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Events",
  description: "Upcoming Teqxure events, workshops, and cohort info sessions.",
};

export default async function EventsPage() {
  const events = await db.event.findMany({
    where: { deletedAt: null, visible: true, status: "PUBLISHED" },
    orderBy: { startsAt: "asc" },
  });

  return (
    <section className="bg-charcoal py-32 sm:py-40">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Events"
          title="Workshops, info sessions, and demo days"
          description="Everything happening around the Teqxure builder community."
          className="mx-auto max-w-2xl"
        />

        {events.length === 0 ? (
          <p className="mt-14 text-center text-sm text-paper/50">No events scheduled right now — check back soon.</p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={i * 0.05}>
                <Link
                  href={`/${event.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-charcoal-soft transition-colors hover:border-blue/40"
                >
                  {event.coverImageUrl && (
                    <div className="relative aspect-video border-b border-white/10 bg-white/[0.02]">
                      <Image
                        src={event.coverImageUrl}
                        alt={event.title}
                        fill
                        sizes="(min-width: 640px) 400px, 90vw"
                        className="object-contain p-4"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-blue">
                      <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {new Date(event.startsAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <h3 className="mt-3 text-xl font-medium tracking-tight text-paper transition-colors group-hover:text-blue">
                      {event.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-paper/55">{event.description}</p>

                    {(event.location || event.isVirtual) && (
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-paper/45">
                        {event.isVirtual ? (
                          <Video className="h-3.5 w-3.5" strokeWidth={1.5} />
                        ) : (
                          <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                        )}
                        {event.isVirtual ? "Virtual" : event.location}
                      </span>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
