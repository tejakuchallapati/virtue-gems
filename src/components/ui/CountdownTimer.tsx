"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const PLACEHOLDER: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getTimeLeft(end: Date): TimeLeft {
  const diff = Math.max(0, end.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function getSaleEndDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  d.setHours(23, 59, 59, 0);
  return d;
}

export function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft>(PLACEHOLDER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const end = getSaleEndDate();
    setMounted(true);
    setTime(getTimeLeft(end));

    const id = setInterval(() => setTime(getTimeLeft(end)), 1000);
    return () => clearInterval(id);
  }, []);

  const blocks = [
    { label: "Days", value: time.days },
    { label: "Hrs", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-3"
      aria-live="polite"
      aria-busy={!mounted}
    >
      {blocks.map((b) => (
        <div
          key={b.label}
          className="glass-dark flex min-w-[52px] flex-col items-center rounded-xl px-2 py-2 sm:min-w-[64px] sm:px-3 sm:py-3"
        >
          <span className="text-lg font-bold text-gold sm:text-2xl">
            {mounted ? String(b.value).padStart(2, "0") : "--"}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-light/60 sm:text-xs">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
