"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { Calendar, toISODate, type CalendarChangeDetails, type DateRange } from "@/components/ui/calendar";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  mode: "single" | "multiple" | "range";
  layout: "scroll" | "paged";
  weekNumbers: boolean;
  disabled: boolean;
};

const LABEL = { single: "Due date", multiple: "Rota days", range: "Stay" } as const;

function readout(value: Date | Date[] | DateRange | null): string {
  if (!value) return "Nothing picked";
  if (value instanceof Date) return toISODate(value);
  if (Array.isArray(value)) return value.length ? `${value.length} day${value.length > 1 ? "s" : ""}` : "Nothing picked";
  return value.from ? `${toISODate(value.from)} to ${value.to ? toISODate(value.to) : "…"}` : "Nothing picked";
}

function Demo({ values: v, refuse }: DemoProps<V>) {
  const [value, setValue] = React.useState<Date | Date[] | DateRange | null>(null);
  const change = (next: Date | Date[] | DateRange | null, details: CalendarChangeDetails) => {
    if (refuse && isAgentChange(details)) return details.cancel();
    setValue(next);
  };
  const common = {
    "aria-label": LABEL[v.mode],
    layout: v.layout,
    weekNumbers: v.weekNumbers,
    disabled: v.disabled,
    className: "rounded-lg border bg-popover p-1 [--calendar-height:16.5rem]",
  };
  return (
    <div className="grid justify-items-center gap-3" key={v.mode}>
      {v.mode === "range" ? (
        <Calendar {...common} mode="range" onValueChange={change} />
      ) : v.mode === "multiple" ? (
        <Calendar {...common} mode="multiple" onValueChange={change} />
      ) : (
        <Calendar {...common} onValueChange={change} />
      )}
      <p className="text-sm tabular-nums text-muted-foreground">{readout(value)}</p>
    </div>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const type = v.mode === "range" ? "DateRange" : v.mode === "multiple" ? "Date[]" : "Date | null";
  const initial = v.mode === "range" ? "{ from: null, to: null }" : v.mode === "multiple" ? "[]" : "null";
  const props = [`aria-label="${LABEL[v.mode]}"`];
  if (v.mode !== "single") props.unshift(`mode="${v.mode}"`);
  if (v.layout !== "scroll") props.push(`layout="${v.layout}"`);
  if (v.weekNumbers) props.push("weekNumbers");
  if (v.disabled) props.push("disabled");
  props.push("value={value}");

  const imports = ["Calendar", ...(v.mode === "range" ? ["type DateRange"] : [])];
  const L = [`import { useState } from "react"`, `import { ${imports.join(", ")} } from "@/components/ui/calendar"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function DatePanel() {", `  const [value, setValue] = useState<${type}>(${initial})`, "  return (", "    <Calendar");
  props.forEach((p) => L.push(`      ${p}`));
  if (refuse) {
    L.push("      onValueChange={(next, details) => {", "        if (isAgentChange(details)) return details.cancel()", "        setValue(next)", "      }}");
  } else {
    L.push("      onValueChange={setValue}");
  }
  L.push("    />", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "date-panel.tsx",
  refusable: true,
  tall: true,
  controls: [
    { name: "mode", type: "select", options: ["single", "multiple", "range"], default: "single" },
    { name: "layout", type: "select", options: ["scroll", "paged"], default: "scroll" },
    { name: "weekNumbers", type: "boolean", default: false },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Set next fri", action: "setValue", args: ["next fri"] },
    { label: "Set a range", action: "setValue", args: [["in 3 days", "in 10 days"]] },
    { label: "Set 31 feb", action: "setValue", args: ["31 feb"] },
    { label: "Clear", action: "clear" },
  ],
  Demo,
  code,
});
