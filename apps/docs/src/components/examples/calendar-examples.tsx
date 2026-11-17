"use client";

import { useState } from "react";
import { Calendar, toISODate, type DateRange } from "@/components/ui/calendar";

export function DefaultCalendarExample() {
  const [day, setDay] = useState<Date | null>(null);
  return (
    <div className="grid justify-items-center gap-3">
      <Calendar aria-label="Due date" value={day} onValueChange={setDay} className="rounded-lg border" />
      <p className="text-sm text-muted-foreground tabular-nums">{day ? toISODate(day) : "No day picked"}</p>
    </div>
  );
}

export function RangeCalendarExample() {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  return (
    <Calendar
      mode="range"
      layout="paged"
      numberOfMonths={2}
      aria-label="Stay"
      value={range}
      onValueChange={setRange}
      min={new Date()}
      className="rounded-lg border p-3"
    />
  );
}

export function MultipleCalendarExample() {
  return (
    <Calendar
      mode="multiple"
      aria-label="Rota days"
      weekNumbers
      isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
      className="rounded-lg border"
    />
  );
}
