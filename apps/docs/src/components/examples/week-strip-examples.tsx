"use client";

import { useState } from "react";
import { WeekStrip } from "@/components/ui/week-strip";
import { addDays, startOfDay, toISODate } from "@/components/ui/calendar";

export function DefaultWeekStripExample() {
  const [day, setDay] = useState(() => startOfDay(new Date()));
  return <WeekStrip aria-label="Schedule" className="max-w-xl" value={day} onValueChange={setDay} />;
}

const visits = ["Haircut with Ada", "Beard trim with Tomi", "Colour with Ada"];

export function BookingsWeekStripExample() {
  const today = startOfDay(new Date());
  const [day, setDay] = useState(today);
  const bookings: Record<string, string[]> = {};
  for (let i = -7; i < 28; i++) {
    const d = addDays(today, i);
    if (d.getDay() === 0) continue;
    bookings[toISODate(d)] = visits.slice(0, (i * 7 + 9) % 4);
  }
  const counts = Object.fromEntries(Object.entries(bookings).map(([k, v]) => [k, v.length]));
  const list = bookings[toISODate(day)] ?? [];
  return (
    <WeekStrip
      aria-label="Bookings"
      className="max-w-xl"
      value={day}
      onValueChange={setDay}
      counts={counts}
      formatCount={(n) => `${n} ${n === 1 ? "booking" : "bookings"}`}
    >
      <ul className="grid gap-1 px-[1.125rem] pt-2 text-sm">
        {list.length ? list.map((v) => <li key={v}>{v}</li>) : <li className="text-muted-foreground">No bookings</li>}
      </ul>
    </WeekStrip>
  );
}
