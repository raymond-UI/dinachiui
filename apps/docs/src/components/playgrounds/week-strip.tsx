"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { addDays, startOfDay, toISODate, type CalendarChangeDetails } from "@/components/ui/calendar";
import { WeekStrip } from "@/components/ui/week-strip";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  counts: boolean;
  disabled: boolean;
};

const visits = ["Haircut with Ada", "Beard trim with Tomi", "Colour with Ada"];

function Demo({ values: v, refuse }: DemoProps<V>) {
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [day, setDay] = React.useState(today);
  const bookings = React.useMemo(() => {
    const out: Record<string, string[]> = {};
    for (let i = -7; i < 28; i++) {
      const d = addDays(today, i);
      if (d.getDay() !== 0) out[toISODate(d)] = visits.slice(0, (i * 7 + 9) % 4);
    }
    return out;
  }, [today]);
  const counts = React.useMemo(() => Object.fromEntries(Object.entries(bookings).map(([k, b]) => [k, b.length])), [bookings]);
  const change = (next: Date, details: CalendarChangeDetails) => {
    if (refuse && isAgentChange(details)) return details.cancel();
    setDay(next);
  };
  const list = bookings[toISODate(day)] ?? [];
  return (
    <WeekStrip
      aria-label="Bookings"
      className="w-full max-w-xl"
      counts={v.counts ? counts : undefined}
      formatCount={(n) => `${n} ${n === 1 ? "booking" : "bookings"}`}
      disabled={v.disabled}
      value={day}
      onValueChange={change}
    >
      <ul className="grid gap-1 px-[1.125rem] pt-2 text-sm">
        {list.length ? list.map((b) => <li key={b}>{b}</li>) : <li className="text-muted-foreground">No bookings</li>}
      </ul>
    </WeekStrip>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = ['aria-label="Bookings"'];
  if (v.counts) props.push("counts={counts}", 'formatCount={(n) => `${n} ${n === 1 ? "booking" : "bookings"}`}');
  if (v.disabled) props.push("disabled");
  props.push("value={day}");
  const L = [`import { useState } from "react"`, `import { WeekStrip } from "@/components/ui/week-strip"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", `export function Bookings(${v.counts ? "{ counts }: { counts: Record<string, number> }" : ""}) {`, "  const [day, setDay] = useState(new Date())", "  return (", "    <WeekStrip");
  props.forEach((p) => L.push(`      ${p}`));
  if (refuse) {
    L.push("      onValueChange={(next, details) => {", "        if (isAgentChange(details)) return details.cancel()", "        setDay(next)", "      }}");
  } else {
    L.push("      onValueChange={setDay}");
  }
  L.push("    >", "      <Agenda day={day} />", "    </WeekStrip>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "bookings.tsx",
  refusable: true,
  controls: [
    { name: "counts", type: "boolean", default: true },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Set next fri", action: "setValue", args: ["next fri"], target: "Bookings" },
    { label: "Set tomorrow", action: "setValue", args: ["tomorrow"], target: "Bookings" },
    { label: "Set in 2 months", action: "setValue", args: ["in 2 months"], target: "Bookings" },
  ],
  Demo,
  code,
});
