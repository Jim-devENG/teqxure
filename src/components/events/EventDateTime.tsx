"use client";

export function EventDateTime({ startsAt, endsAt }: { startsAt: string | Date; endsAt?: string | Date | null }) {
  const start = new Date(startsAt);
  const end = endsAt ? new Date(endsAt) : null;

  const dateLabel = start.toLocaleDateString(undefined, { dateStyle: "long" });
  const timeLabel = start.toLocaleTimeString(undefined, { timeStyle: "short" });
  const tzLabel = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
    .formatToParts(start)
    .find((p) => p.type === "timeZoneName")?.value;

  let durationLabel: string | null = null;
  if (end) {
    const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
    if (minutes > 0) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      durationLabel = [hours ? `${hours}h` : "", mins ? `${mins}m` : ""].filter(Boolean).join(" ");
    }
  }

  return (
    <span>
      {dateLabel} · {timeLabel} {tzLabel}
      {durationLabel && ` · ${durationLabel}`}
    </span>
  );
}
