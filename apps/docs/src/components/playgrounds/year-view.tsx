"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { addDays, startOfDay, toISODate, type CalendarChangeDetails } from "@/components/ui/calendar";
import { YearView } from "@/components/ui/year-view";
import { useDeploys } from "@/components/examples/year-view-examples";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  layout: "auto" | "weeks" | "months";
  disabled: boolean;
};

const deploys = (n: number) => `${n.toLocaleString("en-US")} ${n === 1 ? "deploy" : "deploys"}`;

function Demo({ values: v, refuse }: DemoProps<V>) {
  const counts = useDeploys();
  const [day, setDay] = React.useState<Date | null>(null);
  const change = (next: Date | null, details: CalendarChangeDetails) => {
    if (refuse && isAgentChange(details)) return details.cancel();
    setDay(next);
  };
  return (
    <div className={v.layout === "months" ? "h-96 w-80 overflow-y-auto" : "w-full max-w-3xl"}>
      <YearView
        aria-label="Deploys"
        layout={v.layout}
        counts={counts}
        formatCount={deploys}
        disabled={v.disabled}
        value={day}
        onValueChange={change}
      />
    </div>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = ['aria-label="Deploys"', "counts={counts}", 'formatCount={(n) => `${n.toLocaleString("en-US")} ${n === 1 ? "deploy" : "deploys"}`}'];
  if (v.layout !== "auto") props.push(`layout="${v.layout}"`);
  if (v.disabled) props.push("disabled");
  props.push("value={day}");
  const L = [`import { useState } from "react"`, `import { YearView } from "@/components/ui/year-view"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function Deploys({ counts }: { counts: Record<string, number> }) {", "  const [day, setDay] = useState<Date | null>(null)", "  return (", "    <YearView");
  props.forEach((p) => L.push(`      ${p}`));
  if (refuse) {
    L.push("      onValueChange={(next, details) => {", "        if (isAgentChange(details)) return details.cancel()", "        setDay(next)", "      }}");
  } else {
    L.push("      onValueChange={setDay}");
  }
  L.push("    />", "  )", "}");
  return L.join("\n");
}

const today = startOfDay(new Date());

export default playground<V>({
  file: "deploys.tsx",
  refusable: true,
  controls: [
    { name: "layout", type: "select", options: ["auto", "weeks", "months"], default: "auto" },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Set yesterday", action: "setValue", args: ["yesterday"], target: "Deploys" },
    { label: "Set 2 years ago", action: "setValue", args: [toISODate(addDays(today, -730))], target: "Deploys" },
    { label: "Set tomorrow", action: "setValue", args: [toISODate(addDays(today, 1))], target: "Deploys" },
    { label: "Clear", action: "clear", target: "Deploys" },
  ],
  Demo,
  code,
});
