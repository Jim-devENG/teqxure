import { db } from "@/lib/db";
import { EventsHero } from "@/components/events/EventsHero";
import { FeaturedEvent } from "@/components/events/FeaturedEvent";
import { EventsBrowser, type BrowserEvent } from "@/components/events/EventsBrowser";
import { EventsNewsletter } from "@/components/events/EventsNewsletter";

export const metadata = {
  title: "Events",
  description: "Upcoming Teqxure events, workshops, and cohort info sessions.",
};

export const revalidate = 0;

export default async function EventsHomePage() {
  const now = new Date();

  const [events, categories] = await Promise.all([
    db.event.findMany({
      where: { deletedAt: null, visible: true, status: "PUBLISHED" },
      orderBy: { startsAt: "asc" },
      include: { categories: true },
    }),
    db.category.findMany({ where: { deletedAt: null, visible: true }, orderBy: { order: "asc" } }),
  ]);

  const upcomingRaw = events.filter((e) => e.startsAt > now);
  const pastRaw = events.filter((e) => e.startsAt <= now).sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime());
  const featured = upcomingRaw[0];

  const toBrowserEvent = (e: (typeof events)[number]): BrowserEvent => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    description: e.description,
    startsAt: e.startsAt.toISOString(),
    location: e.location,
    isVirtual: e.isVirtual,
    coverImageUrl: e.coverImageUrl,
    categoryNames: e.categories.map((c) => c.name),
  });

  return (
    <>
      <EventsHero hasFeatured={Boolean(featured)} />
      {featured && <FeaturedEvent event={featured} />}
      <EventsBrowser
        upcoming={upcomingRaw.slice(featured ? 1 : 0).map(toBrowserEvent)}
        past={pastRaw.map(toBrowserEvent)}
        categories={categories}
      />
      <EventsNewsletter />
    </>
  );
}
