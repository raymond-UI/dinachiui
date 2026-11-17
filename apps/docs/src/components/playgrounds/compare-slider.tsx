"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { CompareSlider } from "@/components/ui/compare-slider";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { drag: string; defaultPosition: number; step: number; disabled: boolean };

function Layer({ tone, label }: { tone: string; label: string }) {
  return (
    <div className={`flex h-56 w-full flex-col justify-between p-4 ${tone}`}>
      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
    </div>
  );
}

function Demo({ values: v, refuse }: DemoProps<V>) {
  return (
    <div className="w-full max-w-md">
      <CompareSlider
        // defaultPosition is read once, so a new one remounts the slider.
        key={v.defaultPosition}
        label="Compare the two revisions"
        drag={v.drag as "handle" | "panel"}
        defaultPosition={v.defaultPosition}
        step={v.step}
        disabled={v.disabled}
        onPositionChange={(_, details) => {
          if (refuse && isAgentChange(details)) details.cancel();
        }}
        before={<Layer tone="bg-muted text-muted-foreground" label="Before" />}
        after={<Layer tone="bg-primary text-primary-foreground" label="After" />}
      />
    </div>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = [
    'label="Compare the two revisions"',
    v.drag !== "handle" && `drag="${v.drag}"`,
    v.defaultPosition !== 50 && `defaultPosition={${v.defaultPosition}}`,
    v.step !== 2 && `step={${v.step}}`,
    v.disabled && "disabled",
    'before={<div className="h-56 bg-muted p-4">Before</div>}',
    'after={<div className="h-56 bg-primary p-4 text-primary-foreground">After</div>}',
  ].filter(Boolean) as string[];
  const L: string[] = [];
  L.push(`import { CompareSlider } from "@/components/ui/compare-slider"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function Revisions() {", "  return (", "    <CompareSlider");
  props.forEach((p) => L.push(`      ${p}`));
  if (refuse) L.push("      onPositionChange={(_, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}");
  L.push("    />", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "revisions.tsx",
  refusable: true,
  controls: [
    { name: "drag", type: "select", options: ["handle", "panel"], default: "handle" },
    { name: "defaultPosition", type: "number", default: 50, min: 0, max: 100, step: 5 },
    { name: "step", type: "number", default: 2, min: 1, max: 20 },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Set to 70", action: "setValue", args: [70] },
    { label: "Set to 20", action: "setValue", args: [20] },
    { label: "Set to 150", action: "setValue", args: [150] },
  ],
  Demo,
  code,
});
