"use client";

import { useMemo, useState } from "react";
import { YearView } from "@/components/ui/year-view";
import { addDays, startOfDay, toISODate } from "@/components/ui/calendar";

/** A year of made-up deploys: busier midweek, quiet on weekends. */
export function useDeploys() {
  return useMemo(() => {
    const today = startOfDay(new Date());
    const counts: Record<string, number> = {};
    for (let i = 0; i < 371; i++) {
      const d = addDays(today, -i);
      const weekend = d.getDay() === 0 || d.getDay() === 6;
      const n = Math.floor(((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1 * (weekend ? 2 : 9));
      if (n > 0) counts[toISODate(d)] = n;
    }
    return counts;
  }, []);
}

const deploys = (n: number) => `${n.toLocaleString()} ${n === 1 ? "deploy" : "deploys"}`;

export function DefaultYearViewExample() {
  const counts = useDeploys();
  const [day, setDay] = useState<Date | null>(null);
  return <YearView aria-label="Deploys" counts={counts} value={day} onValueChange={setDay} formatCount={deploys} />;
}

export function MonthsYearViewExample() {
  const counts = useDeploys();
  return (
    <div className="h-96 w-80 overflow-y-auto">
      <YearView aria-label="Deploys" layout="months" counts={counts} formatCount={deploys} />
    </div>
  );
}
