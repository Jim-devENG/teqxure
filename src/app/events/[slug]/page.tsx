import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Video, ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { Reveal } from "@/components/ui/Reveal";
import { Panel } from "@/components/ui/Panel";
import { EventRegistrationForm } from "@/components/events/EventRegistrationForm";
import { EventDateTime } from "@/components/events/EventDateTime";
import { Countdown } from "@/components/events/Countdown";
import { BlockRenderer } from "@/components/events/blocks/BlockRenderer";
import { ShareButton } from "@/components/events/ShareButton";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await db.event.findUnique({ where: { slug } });
  if (!event) return { title: "Event" };
  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.coverImageUrl ? [{ url: event.coverImageUrl }] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await db.event.findUnique({ where: { slug }, include: { blocks: { where: { visible: true }, orderBy: { order: "asc" } } } });

  if (!event || event.deletedAt || !event.visible || event.status !== "PUBLISHED") {
    notFound();
  }

  const [fields, registrationCount] = await Promise.all([
    event.registrationMode === "INTERNAL"
      ? db.eventFormField.findMany({ where: { eventId: event.id, deletedAt: null, visible: true }, orderBy: { order: "asc" } })
      : Promise.resolve([]),
    db.eventRegistration.count({ where: { eventId: event.id } }),
  ]);

  const now = new Date();
  const isUpcoming = event.startsAt > now;
  const isPast = (event.endsAt ?? new Date(event.startsAt.getTime() + 3 * 60 * 60 * 1000)) < now;
  const seatsRemaining = event.capacity ? Math.max(0, event.capacity - registrationCount) : null;
  const isFull = seatsRemaining !== null && seatsRemaining <= 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startsAt.toISOString(),
    endDate: event.endsAt?.toISOString(),
    eventAttendanceMode: event.isVirtual
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: event.isVirtual
      ? { "@type": "VirtualLocation", url: `https://events.teqxure.xyz/${event.slug}` }
      : { "@type": "Place", name: event.location ?? "Teqxure" },
    image: event.coverImageUrl ? [event.coverImageUrl] : undefined,
    organizer: { "@type": "Organization", name: "Teqxure Global", url: "https://www.teqxure.xyz" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="py-32 sm:py-40">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Reveal>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">
                      {isPast ? "Past event" : "Teqxure Event"}
                    </span>
                    <span className="rounded-full border border-emerald/30 bg-emerald/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald">
                      Free
                    </span>
                    {isFull && (
                      <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-paper/60">
                        Sold out
                      </span>
                    )}
                  </div>
                  <ShareButton title={event.title} url={`https://events.teqxure.xyz/${event.slug}`} />
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="mt-4 text-balance text-3xl font-medium tracking-tight text-paper sm:text-4xl md:text-5xl">
                  {event.title}
                </h1>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mt-4 text-sm text-paper/50">
                  <EventDateTime startsAt={event.startsAt} endsAt={event.endsAt} />
                </p>
              </Reveal>

              {(event.location || event.isVirtual) && (
                <Reveal delay={0.18}>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-paper/50">
                    {event.isVirtual ? <Video className="h-4 w-4" strokeWidth={1.5} /> : <MapPin className="h-4 w-4" strokeWidth={1.5} />}
                    {event.isVirtual ? "Virtual event" : event.location}
                  </span>
                </Reveal>
              )}

              {isUpcoming && (
                <Reveal delay={0.22}>
                  <div className="mt-8">
                    <Countdown startsAt={event.startsAt} />
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.25}>
                <p className="mt-8 max-w-xl whitespace-pre-line text-base leading-relaxed text-paper/60 sm:text-lg">
                  {event.description}
                </p>
              </Reveal>

              {event.coverImageUrl && (
                <Reveal delay={0.3}>
                  <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                    <Image
                      src={event.coverImageUrl}
                      alt={event.title}
                      fill
                      sizes="(min-width: 1024px) 560px, 90vw"
                      className="object-contain p-4"
                    />
                  </div>
                </Reveal>
              )}
            </div>

            <Reveal delay={0.2}>
              <Panel className="p-8 sm:p-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-paper">Register</h2>
                  {seatsRemaining !== null && !isFull && (
                    <span className="text-xs text-paper/45">{seatsRemaining} seats left</span>
                  )}
                </div>

                {isPast ? (
                  <p className="mt-4 text-sm text-paper/55">This event has already happened.</p>
                ) : isFull ? (
                  <p className="mt-4 text-sm text-paper/55">This event is at capacity — check back for future sessions.</p>
                ) : event.registrationMode === "EXTERNAL" && event.externalUrl ? (
                  <>
                    <p className="mt-2 text-sm text-paper/55">Registration for this event happens on an external page.</p>
                    <Link
                      href={event.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
                    >
                      Continue to registration
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                  </>
                ) : (
                  <div className="mt-6">
                    <EventRegistrationForm eventId={event.id} fields={fields} />
                  </div>
                )}
              </Panel>
            </Reveal>
          </div>
        </div>
      </section>

      {event.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </>
  );
}
