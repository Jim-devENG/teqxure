import "server-only";
import { createEvent, type DateArray } from "ics";

function toDateArray(date: Date): DateArray {
  return [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()];
}

interface EventForInvite {
  title: string;
  description: string;
  startsAt: Date;
  endsAt: Date | null;
  location: string | null;
  isVirtual: boolean;
  slug: string;
}

/** Returns a base64-encoded .ics file for the given event, or null if generation fails. */
export function generateEventIcs(event: EventForInvite): string | null {
  const { error, value } = createEvent({
    title: event.title,
    description: event.description,
    location: event.isVirtual ? "Online" : (event.location ?? undefined),
    start: toDateArray(event.startsAt),
    startInputType: "utc",
    ...(event.endsAt
      ? { end: toDateArray(event.endsAt), endInputType: "utc" as const }
      : { duration: { hours: 1 } }),
    url: `https://events.teqxure.xyz/${event.slug}`,
    productId: "Teqxure",
  });

  if (error || !value) return null;
  return Buffer.from(value).toString("base64");
}
