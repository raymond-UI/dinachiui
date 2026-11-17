"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { startOfDay, toISODate, type CalendarChangeDetails, type DateRange } from "@/components/ui/calendar";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  presentation: "auto" | "popover" | "drawer";
  presets: boolean;
  noFuture: boolean;
  disabled: boolean;
};

function Demo({ values: v, refuse }: DemoProps<V>) {
  const [value, setValue] = React.useState<DateRange>({ from: null, to: null });
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const change = (next: DateRange, details: CalendarChangeDetails) => {
    if (refuse && isAgentChange(details)) return details.cancel();
    setValue(next);
  };
  return (
    <div className="grid justify-items-start gap-2">
      <DateRangePicker
        aria-label="Period"
        presentation={v.presentation}
        presets={v.presets ? undefined : []}
        max={v.noFuture ? today : undefined}
        disabled={v.disabled}
        value={value}
        onValueChange={change}
      />
      <p className="text-sm tabular-nums text-muted-foreground">
        {value.from && value.to ? `${toISODate(value.from)} to ${toISODate(value.to)}` : "No range yet"}
      </p>
    </div>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = ['aria-label="Period"'];
  if (v.presentation !== "auto") props.push(`presentation="${v.presentation}"`);
  if (!v.presets) props.push("presets={[]}");
  if (v.noFuture) props.push("max={new Date()}");
  if (v.disabled) props.push("disabled");
  props.push("value={range}");
  const L = [
    `import { useState } from "react"`,
    `import { type DateRange } from "@/components/ui/calendar"`,
    `import { DateRangePicker } from "@/components/ui/date-range-picker"`,
  ];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function Period() {", "  const [range, setRange] = useState<DateRange>({ from: null, to: null })", "  return (", "    <DateRangePicker");
  props.forEach((p) => L.push(`      ${p}`));
  if (refuse) {
    L.push("      onValueChange={(next, details) => {", "        if (isAgentChange(details)) return details.cancel()", "        setRange(next)", "      }}");
  } else {
    L.push("      onValueChange={setRange}");
  }
  L.push("    />", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "period.tsx",
  refusable: true,
  controls: [
    { name: "presentation", type: "select", options: ["auto", "popover", "drawer"], default: "auto" },
    { name: "presets", type: "boolean", default: true },
    { name: "noFuture", type: "boolean", default: true },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Set last 7 days", action: "setValue", args: ["Last 7 days"], target: "Period" },
    { label: "Set two dates", action: "setValue", args: [["1 nov", "14 nov"]], target: "Period" },
    { label: "Set backwards", action: "setValue", args: [["14 nov", "1 nov"]], target: "Period" },
    { label: "Clear", action: "clear", target: "Period" },
  ],
  Demo,
  code,
});
