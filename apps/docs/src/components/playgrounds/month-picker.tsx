"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import type { CalendarChangeDetails, DateRange } from "@/components/ui/calendar";
import { MonthPicker } from "@/components/ui/month-picker";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  mode: "single" | "range";
  noFuture: boolean;
  disabled: boolean;
};

function Demo({ values: v, refuse }: DemoProps<V>) {
  const [month, setMonth] = React.useState<Date | null>(null);
  const [span, setSpan] = React.useState<DateRange>({ from: null, to: null });
  const today = React.useMemo(() => new Date(), []);
  const guard = <T,>(set: (next: T) => void) => (next: T, details: CalendarChangeDetails) => {
    if (refuse && isAgentChange(details)) return details.cancel();
    set(next);
  };
  const common = { "aria-label": "Billing period", className: "w-72", max: v.noFuture ? today : undefined, disabled: v.disabled };
  return v.mode === "range" ? (
    <MonthPicker {...common} mode="range" value={span} onValueChange={guard(setSpan)} />
  ) : (
    <MonthPicker {...common} value={month} onValueChange={guard(setMonth)} />
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const range = v.mode === "range";
  const props = ['aria-label="Billing period"'];
  if (range) props.push('mode="range"');
  if (v.noFuture) props.push("max={new Date()}");
  if (v.disabled) props.push("disabled");
  props.push("value={period}");
  const L = [`import { useState } from "react"`];
  if (range) L.push(`import { type DateRange } from "@/components/ui/calendar"`);
  L.push(`import { MonthPicker } from "@/components/ui/month-picker"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(
    "",
    "export function BillingPeriod() {",
    range
      ? "  const [period, setPeriod] = useState<DateRange>({ from: null, to: null })"
      : "  const [period, setPeriod] = useState<Date | null>(null)",
    "  return (",
    "    <MonthPicker"
  );
  props.forEach((p) => L.push(`      ${p}`));
  if (refuse) {
    L.push("      onValueChange={(next, details) => {", "        if (isAgentChange(details)) return details.cancel()", "        setPeriod(next)", "      }}");
  } else {
    L.push("      onValueChange={setPeriod}");
  }
  L.push("    />", "  )", "}");
  return L.join("\n");
}

const year = new Date().getFullYear();

export default playground<V>({
  file: "billing-period.tsx",
  refusable: true,
  controls: [
    { name: "mode", type: "select", options: ["single", "range"], default: "range" },
    { name: "noFuture", type: "boolean", default: true },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Set Q1", action: "setValue", args: [[`${year}-01`, `${year}-03`]], target: "Billing period" },
    { label: "Set jun to sep", action: "setValue", args: [`jun to sep ${year}`], target: "Billing period" },
    { label: "Set next year", action: "setValue", args: [[`${year + 1}-01`, `${year + 1}-02`]], target: "Billing period" },
    { label: "Clear", action: "clear", target: "Billing period" },
  ],
  Demo,
  code,
});
