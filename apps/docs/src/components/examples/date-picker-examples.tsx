"use client";

import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { toISODate } from "@/components/ui/calendar";

export function DefaultDatePickerExample() {
  const [due, setDue] = useState<Date | null>(null);
  return (
    <div className="grid w-72 gap-1">
      <DatePicker aria-label="Due date" label="Due date" value={due} onValueChange={setDue} min={new Date()} />
      <p className="text-sm tabular-nums text-muted-foreground">{due ? toISODate(due) : "No date yet"}</p>
    </div>
  );
}

export function WeekdaysDatePickerExample() {
  return (
    <div className="w-72">
      <DatePicker
        aria-label="Delivery day"
        label="Delivery day"
        min={new Date()}
        isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
        placeholder="mon or 24 nov"
      />
    </div>
  );
}
