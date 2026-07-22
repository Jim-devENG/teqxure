/**
 * All events are scheduled in West Africa Time (UTC+1, no DST) regardless of
 * where an admin happens to be browsing from or where the server runs —
 * without this, a `datetime-local` input gets silently reinterpreted using
 * whatever timezone the server process runs in (UTC on Vercel), shifting
 * every event's advertised time by the difference between that and WAT.
 */
const WAT_OFFSET_MINUTES = 60;

/** Parses a `datetime-local` input value (e.g. "2026-07-24T22:00") as WAT and returns the equivalent UTC Date. */
export function watInputToUtc(value: string): Date {
  return new Date(`${value}:00+01:00`);
}

/** Formats a UTC Date back into a `datetime-local` input value, in WAT. */
export function utcToWatInputValue(date: Date): string {
  const wat = new Date(date.getTime() + WAT_OFFSET_MINUTES * 60000);
  return wat.toISOString().slice(0, 16);
}
