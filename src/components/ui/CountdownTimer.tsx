"use client";

import { useEffect, useState } from "react";

function getTimeLeft(end: Date) {
  const diff = Math.max(0, end.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer() {
  const [end] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(23, 59, 59, 0);
    return d;
  });
  const [time, setTime] = useState(getTimeLeft(end));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(end)), 1000);
    return () => clearInterval(id);
  }, [end]);

  const blocks = [
    { label: "Days", value: time.days },
    { label: "Hrs", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {blocks.map((b) => (
        <div
          key={b.label}
          className="glass-dark flex min-w-[52px] flex-col items-center rounded-xl px-2 py-2 sm:min-w-[64px] sm:px-3 sm:py-3"
        >
          <span className="text-lg font-bold text-gold sm:text-2xl">
            {String(b.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-light/60 sm:text-xs">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
