"use client";

import { useEffect, useState } from "react";

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff <= 0,
  };
}

export function Countdown({ startsAt }: { startsAt: string | Date }) {
  const target = new Date(startsAt).getTime();
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (remaining.done) {
    return <p className="font-mono text-sm text-emerald">Happening now</p>;
  }

  const units = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Min", value: remaining.minutes },
    { label: "Sec", value: remaining.seconds },
  ];

  return (
    <div className="flex items-center gap-4">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <span className="font-mono text-2xl font-medium tabular-nums text-paper sm:text-3xl">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.15em] text-paper/40">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
