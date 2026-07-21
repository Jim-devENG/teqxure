import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { db } from "@/lib/db";
import { Reveal } from "@/components/ui/Reveal";
import type { BlockContent } from "@/lib/blockSchemas";

export async function RelatedEventsBlock({ content }: { content: BlockContent<"RELATED_EVENTS"> }) {
  if (content.eventIds.length === 0) return null;

  const events = await db.event.findMany({
    where: { id: { in: content.eventIds }, deletedAt: null, visible: true, status: "PUBLISHED" },
  });
  const ordered = content.eventIds.map((id) => events.find((e) => e.id === id)).filter((e) => e !== undefined);
  if (ordered.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <h2 className="text-xl font-medium tracking-tight text-paper sm:text-2xl">{content.title}</h2>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ordered.map((event, i) => (
            <Reveal key={event.id} delay={i * 0.05}>
              <Link
                href={`/${event.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-charcoal-soft p-4 transition-colors hover:border-blue/40"
              >
                {event.coverImageUrl && (
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
                    <Image src={event.coverImageUrl} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                )}
                <div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-blue">
                    <CalendarDays className="h-3 w-3" strokeWidth={1.5} />
                    {new Date(event.startsAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                  <p className="mt-1 text-sm font-medium text-paper transition-colors group-hover:text-blue">{event.title}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
