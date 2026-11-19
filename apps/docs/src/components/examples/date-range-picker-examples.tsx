"use client";

import { useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays, startOfDay, type DateRange } from "@/components/ui/calendar";

export function DefaultDateRangePickerExample() {
  const today = startOfDay(new Date());
  const [range, setRange] = useState<DateRange>({ from: addDays(today, -6), to: today });
  return <DateRangePicker aria-label="Period" value={range} onValueChange={setRange} max={today} />;
}

export function FutureDateRangePickerExample() {
  const today = startOfDay(new Date());
  const saturday = addDays(today, (6 - today.getDay() + 7) % 7);
  return (
    <DateRangePicker
      aria-label="Stay"
      label="Stay"
      placeholder="Check in, check out"
      min={today}
      presets={[
        { label: "This weekend", value: { from: saturday, to: addDays(saturday, 1) } },
        { label: "Next 7 nights", value: { from: today, to: addDays(today, 7) } },
      ]}
    />
  );
}
