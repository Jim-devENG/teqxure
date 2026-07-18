import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Video, ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { Reveal } from "@/components/ui/Reveal";
import { Panel } from "@/components/ui/Panel";
import { EventRegistrationForm } from "@/components/events/EventRegistrationForm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await db.event.findUnique({ where: { slug } });
  if (!event) return { title: "Event" };
  return { title: event.title, description: event.description };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await db.event.findUnique({ where: { slug } });

  if (!event || event.deletedAt || !event.visible || event.status !== "PUBLISHED") {
    notFound();
  }

  const fields =
    event.registrationMode === "INTERNAL"
      ? await db.eventFormField.findMany({
          where: { eventId: event.id, deletedAt: null, visible: true },
          orderBy: { order: "asc" },
        })
      : [];

  return (
    <section className="bg-charcoal py-32 sm:py-40">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-blue">
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
                {new Date(event.startsAt).toLocaleString(undefined, {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="mt-4 text-balance text-3xl font-medium tracking-tight text-paper sm:text-4xl md:text-5xl">
                {event.title}
              </h1>
            </Reveal>

            {(event.location || event.isVirtual) && (
              <Reveal delay={0.15}>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-paper/50">
                  {event.isVirtual ? (
                    <Video className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <MapPin className="h-4 w-4" strokeWidth={1.5} />
                  )}
                  {event.isVirtual ? "Virtual event" : event.location}
                </span>
              </Reveal>
            )}

            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-relaxed text-paper/60 sm:text-lg">
                {event.description}
              </p>
            </Reveal>

            {event.coverImageUrl && (
              <Reveal delay={0.25}>
                <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                  <Image
                    src={event.coverImageUrl}
                    alt={event.title}
                    fill
                    sizes="(min-width: 1024px) 560px, 90vw"
                    className="object-contain p-4"
                    unoptimized
                  />
                </div>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.2}>
            <Panel className="p-8 sm:p-10">
              <h2 className="text-lg font-medium text-paper">Register</h2>

              {event.registrationMode === "EXTERNAL" && event.externalUrl ? (
                <>
                  <p className="mt-2 text-sm text-paper/55">
                    Registration for this event happens on an external page.
                  </p>
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
  );
}
