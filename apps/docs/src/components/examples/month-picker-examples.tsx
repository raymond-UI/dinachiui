"use client";

import { useState } from "react";
import { MonthPicker } from "@/components/ui/month-picker";
import type { DateRange } from "@/components/ui/calendar";

export function DefaultMonthPickerExample() {
  const [month, setMonth] = useState<Date | null>(null);
  return <MonthPicker aria-label="Billing month" className="w-72" value={month} onValueChange={setMonth} max={new Date()} />;
}

export function RangeMonthPickerExample() {
  const [span, setSpan] = useState<DateRange>({ from: null, to: null });
  return <MonthPicker aria-label="Reporting period" mode="range" className="w-72" value={span} onValueChange={setSpan} max={new Date()} />;
}
