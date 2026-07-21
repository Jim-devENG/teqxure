"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, CalendarDays, MapPin, Video } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export interface BrowserEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  startsAt: string;
  location: string | null;
  isVirtual: boolean;
  coverImageUrl: string | null;
  categoryNames: string[];
}

interface EventsBrowserProps {
  upcoming: BrowserEvent[];
  past: BrowserEvent[];
  categories: { id: string; name: string }[];
}

export function EventsBrowser({ upcoming, past, categories }: EventsBrowserProps) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const source = tab === "upcoming" ? upcoming : past;

  const filtered = useMemo(() => {
    return source.filter((event) => {
      const matchesCategory = !activeCategory || event.categoryNames.includes(activeCategory);
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.categoryNames.some((c) => c.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [source, query, activeCategory]);

  return (
    <section id="browse" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 rounded-full border border-white/10 p-1">
            {(["upcoming", "past"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm capitalize transition-colors cursor-pointer",
                  tab === t ? "bg-blue text-white" : "text-paper/60 hover:text-paper",
                )}
              >
                {t} events
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-paper/40" strokeWidth={1.5} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, speaker, category…"
              className="w-full rounded-full border border-white/10 bg-charcoal-soft py-2 pl-10 pr-4 text-sm text-paper placeholder:text-paper/35 outline-none focus:border-blue"
            />
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors cursor-pointer",
                activeCategory === null ? "border-blue bg-blue/10 text-blue" : "border-white/10 text-paper/60 hover:text-paper",
              )}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.name)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors cursor-pointer",
                  activeCategory === c.name ? "border-blue bg-blue/10 text-blue" : "border-white/10 text-paper/60 hover:text-paper",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="mt-14 text-center text-sm text-paper/50">No events match yet — check back soon.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event, i) => (
              <Reveal key={event.id} delay={Math.min(i, 8) * 0.04}>
                <Link
                  href={`/${event.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-charcoal-soft transition-colors hover:border-blue/40"
                >
                  {event.coverImageUrl && (
                    <div className="relative aspect-video border-b border-white/10 bg-white/[0.02]">
                      <Image src={event.coverImageUrl} alt={event.title} fill sizes="(min-width: 640px) 360px, 90vw" className="object-contain p-4" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {event.categoryNames[0] && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-blue">{event.categoryNames[0]}</span>
                    )}
                    <span className="mt-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-paper/50">
                      <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {new Date(event.startsAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <h3 className="mt-3 text-xl font-medium tracking-tight text-paper transition-colors group-hover:text-blue">{event.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-paper/55">{event.description}</p>

                    {(event.location || event.isVirtual) && (
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-paper/45">
                        {event.isVirtual ? <Video className="h-3.5 w-3.5" strokeWidth={1.5} /> : <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />}
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
