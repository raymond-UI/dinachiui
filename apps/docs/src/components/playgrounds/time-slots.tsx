"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { Button } from "@/components/ui/button";
import { TimeSlots, type TimeSlot, type TimeSlotsChangeDetails } from "@/components/ui/time-slots";
import { roomBusy } from "@/components/examples/time-slots-examples";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  layout: "auto" | "horizontal" | "vertical";
  past: boolean;
  disabled: boolean;
};

function Demo({ values: v, refuse }: DemoProps<V>) {
  const [slot, setSlot] = React.useState<TimeSlot | null>({ start: 645, end: 720 });
  const change = (next: TimeSlot | null, details: TimeSlotsChangeDetails) => {
    if (refuse && isAgentChange(details)) return details.cancel();
    setSlot(next);
  };
  return (
    <TimeSlots
      aria-label="Room"
      layout={v.layout}
      className={v.layout === "vertical" ? "h-96 w-80" : "w-full max-w-3xl"}
      timeZone="GMT"
      busy={roomBusy}
      now={v.past ? 640 : undefined}
      disabled={v.disabled}
      value={slot}
      onValueChange={change}
    >
      <Button size="sm" disabled={!slot || v.disabled}>
        Book
      </Button>
    </TimeSlots>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = ['aria-label="Room"'];
  if (v.layout !== "auto") props.push(`layout="${v.layout}"`);
  props.push('timeZone="GMT"', "busy={busy}");
  if (v.past) props.push("now={minutesNow}");
  if (v.disabled) props.push("disabled");
  props.push("value={slot}");
  const L = [
    `import { useState } from "react"`,
    `import { Button } from "@/components/ui/button"`,
    `import { TimeSlots, type TimeSlot } from "@/components/ui/time-slots"`,
  ];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(
    "",
    `export function Room({ busy${v.past ? ", minutesNow" : ""} }: { busy: TimeSlot[]${v.past ? "; minutesNow: number" : ""} }) {`,
    "  const [slot, setSlot] = useState<TimeSlot | null>(null)",
    "  return (",
    "    <TimeSlots"
  );
  props.forEach((p) => L.push(`      ${p}`));
  if (refuse) {
    L.push("      onValueChange={(next, details) => {", "        if (isAgentChange(details)) return details.cancel()", "        setSlot(next)", "      }}");
  } else {
    L.push("      onValueChange={setSlot}");
  }
  L.push("    >", "      <Button size=\"sm\" disabled={!slot}>Book</Button>", "    </TimeSlots>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "room.tsx",
  refusable: true,
  controls: [
    { name: "layout", type: "select", options: ["auto", "horizontal", "vertical"], default: "auto" },
    { name: "past", type: "boolean", default: true },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Set 14:00 to 15:00", action: "setValue", args: [["14:00", "15:00"]], target: "Room" },
    { label: "Set 11am to 12:30", action: "setValue", args: ["11am to 12:30"], target: "Room" },
    { label: "Set 12:00 to 13:00", action: "setValue", args: ["12:00 to 13:00"], target: "Room" },
    { label: "Clear", action: "setValue", args: [null], target: "Room" },
  ],
  Demo,
  code,
});
