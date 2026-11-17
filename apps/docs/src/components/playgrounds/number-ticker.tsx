"use client";

import * as React from "react";
import { NumberTicker, type NumberTickerVariant } from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { variant: string; duration: number; stagger: number; bounce: number; live: boolean };

function Demo({ values: v }: DemoProps<V>) {
  const [value, setValue] = React.useState(12480);
  return (
    <div className="flex flex-col items-center gap-6">
      <NumberTicker
        value={value}
        variant={v.variant as NumberTickerVariant}
        duration={v.duration}
        stagger={v.stagger}
        bounce={v.bounce}
        live={v.live}
        className="text-4xl font-semibold"
      />
      <Button variant="outline" size="sm" onClick={() => setValue(Math.floor(2000 + Math.random() * 90000))}>
        Recount
      </Button>
    </div>
  );
}

function code(v: V): string {
  const props = [
    "value={value}",
    v.variant !== "odometer" && `variant="${v.variant}"`,
    v.duration !== 0.4 && `duration={${v.duration}}`,
    v.variant !== "counter" && v.stagger !== 0.03 && `stagger={${v.stagger}}`,
    v.bounce !== 0 && `bounce={${v.bounce}}`,
    v.live && "live",
    'className="text-4xl font-semibold"',
  ].filter(Boolean);
  const L: string[] = [];
  L.push(`import { NumberTicker } from "@/components/ui/number-ticker"`, "");
  L.push("export function Visitors({ value }: { value: number }) {");
  L.push(`  return <NumberTicker ${props.join(" ")} />`, "}");
  return L.join("\n");
}

export default playground<V>({
  file: "visitors.tsx",
  controls: [
    { name: "variant", type: "select", options: ["odometer", "counter", "flip"], default: "odometer" },
    { name: "duration", type: "number", default: 0.4, min: 0.1, max: 2, step: 0.1 },
    { name: "stagger", type: "number", default: 0.03, min: 0, max: 0.2, step: 0.01 },
    { name: "bounce", type: "number", default: 0, min: 0, max: 1, step: 0.1 },
    { name: "live", type: "boolean", default: false },
  ],
  Demo,
  code,
});
