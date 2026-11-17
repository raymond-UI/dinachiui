"use client";

import * as React from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  direction: string;
  distance: number;
  duration: number;
  repeat: boolean;
};

function Demo({ values: v, anatomy }: DemoProps<V>) {
  const scrollport = React.useRef<HTMLDivElement>(null);
  // A reveal meant to run once only re-arms by remounting, so every change replays it.
  const run = JSON.stringify(v);

  React.useEffect(() => {
    scrollport.current?.scrollTo({ top: 0 });
  }, [run]);

  // The block sits below the fold; Anatomy brings it into view so it can be outlined.
  React.useEffect(() => {
    const el = scrollport.current;
    if (anatomy && el) el.scrollTo({ top: el.scrollHeight });
  }, [anatomy]);

  return (
    <div
      ref={scrollport}
      className="h-60 w-full max-w-md overflow-y-auto rounded-lg border border-border bg-background"
    >
      <div key={run} className="p-4">
        <p className="text-sm text-muted-foreground">Scroll down.</p>
        <div className="h-64" />
        <ScrollReveal
          root={scrollport}
          margin="0px"
          direction={v.direction as "up" | "down" | "left" | "right"}
          distance={v.distance}
          duration={v.duration}
          repeat={v.repeat}
        >
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
            Uncovered edge-first as it arrives.
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

function code(v: V): string {
  const props = ["root={scrollport}", `margin="0px"`];
  if (v.direction !== "up") props.push(`direction="${v.direction}"`);
  if (v.distance !== 8) props.push(`distance={${v.distance}}`);
  if (v.duration !== 0.3) props.push(`duration={${v.duration}}`);
  if (v.repeat) props.push("repeat");
  return [
    `import { useRef } from "react"`,
    `import { ScrollReveal } from "@/components/ui/scroll-reveal"`,
    "",
    "export function Feature() {",
    "  const scrollport = useRef<HTMLDivElement>(null)",
    "",
    "  return (",
    `    <div ref={scrollport} className="h-60 overflow-y-auto">`,
    `      <div className="h-64" />`,
    `      <ScrollReveal ${props.join(" ")}>`,
    `        <div className="rounded-lg border p-4">Uncovered edge-first as it arrives.</div>`,
    "      </ScrollReveal>",
    "    </div>",
    "  )",
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "feature.tsx",
  controls: [
    { name: "direction", type: "select", options: ["up", "down", "left", "right"], default: "up" },
    { name: "distance", type: "number", default: 8, min: 0, max: 48, step: 4 },
    { name: "duration", type: "number", default: 0.3, min: 0.1, max: 1.5, step: 0.1 },
    { name: "repeat", type: "boolean", default: false },
  ],
  Demo,
  code,
});
