"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { toISODate, type CalendarChangeDetails } from "@/components/ui/calendar";
import { DatePicker } from "@/components/ui/date-picker";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  presentation: "auto" | "popover" | "drawer";
  noPast: boolean;
  weekdaysOnly: boolean;
  dropdown: boolean;
  disabled: boolean;
};

const weekday = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

function Demo({ values: v, refuse }: DemoProps<V>) {
  const [value, setValue] = React.useState<Date | null>(null);
  const today = React.useMemo(() => new Date(), []);
  const change = (next: Date | null, details: CalendarChangeDetails) => {
    if (refuse && isAgentChange(details)) return details.cancel();
    setValue(next);
  };
  return (
    <div className="grid w-72 gap-1">
      <DatePicker
        aria-label="Due date"
        label="Due date"
        confirmLabel="Set due date"
        presentation={v.presentation}
        min={v.noPast ? today : undefined}
        isDateDisabled={v.weekdaysOnly ? weekday : undefined}
        captionLayout={v.dropdown ? "dropdown" : "label"}
        disabled={v.disabled}
        value={value}
        onValueChange={change}
      />
      <p className="text-sm tabular-nums text-muted-foreground">{value ? toISODate(value) : "No date yet"}</p>
    </div>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = ['aria-label="Due date"', 'label="Due date"'];
  if (v.presentation !== "auto") props.push(`presentation="${v.presentation}"`);
  if (v.noPast) props.push("min={new Date()}");
  if (v.weekdaysOnly) props.push("isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}");
  if (v.dropdown) props.push('captionLayout="dropdown"');
  if (v.disabled) props.push("disabled");
  props.push("value={due}");
  const L = [`import { useState } from "react"`, `import { DatePicker } from "@/components/ui/date-picker"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function DueDate() {", "  const [due, setDue] = useState<Date | null>(null)", "  return (", "    <DatePicker");
  props.forEach((p) => L.push(`      ${p}`));
  if (refuse) {
    L.push("      onValueChange={(next, details) => {", "        if (isAgentChange(details)) return details.cancel()", "        setDue(next)", "      }}");
  } else {
    L.push("      onValueChange={setDue}");
  }
  L.push("    />", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "due-date.tsx",
  refusable: true,
  controls: [
    { name: "presentation", type: "select", options: ["auto", "popover", "drawer"], default: "auto" },
    { name: "noPast", type: "boolean", default: true },
    { name: "weekdaysOnly", type: "boolean", default: false },
    { name: "dropdown", type: "boolean", default: false },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Set next fri", action: "setValue", args: ["next fri"], target: "Due date" },
    { label: "Set in 2 weeks", action: "setValue", args: ["in 2 weeks"], target: "Due date" },
    { label: "Set yesterday", action: "setValue", args: ["yesterday"], target: "Due date" },
    { label: "Clear", action: "clear", target: "Due date" },
  ],
  Demo,
  code,
});
