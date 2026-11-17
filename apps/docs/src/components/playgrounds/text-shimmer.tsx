"use client";

import { TextShimmer, type TextShimmerVariant } from "@/components/ui/text-shimmer";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

/** The component's own per-variant cycle lengths, so the code only writes a real override. */
const CYCLE: Record<string, number> = { sweep: 1.6, pulse: 1.8 };

type V = { children: string; variant: string; duration: number; dim: number };

function Demo({ values: v }: DemoProps<V>) {
  return (
    <TextShimmer variant={v.variant as TextShimmerVariant} duration={v.duration} dim={v.dim} className="text-lg">
      {v.children}
    </TextShimmer>
  );
}

function code(v: V): string {
  const props: string[] = [];
  if (v.variant !== "sweep") props.push(`variant="${v.variant}"`);
  if (v.duration !== CYCLE[v.variant]) props.push(`duration={${v.duration}}`);
  if (v.dim !== 0.7) props.push(`dim={${v.dim}}`);
  const text = /[{}<>]/.test(v.children) ? `{${JSON.stringify(v.children)}}` : v.children;
  return [
    `import { TextShimmer } from "@/components/ui/text-shimmer"`,
    "",
    "export function Thinking({ pending }: { pending: boolean }) {",
    `  return pending ? <TextShimmer${props.map((p) => ` ${p}`).join("")}>${text}</TextShimmer> : null`,
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "thinking.tsx",
  controls: [
    { name: "children", type: "text", default: "Thinking…" },
    { name: "variant", type: "select", options: ["sweep", "pulse"], default: "sweep" },
    { name: "duration", type: "number", default: 1.6, min: 0.4, max: 6, step: 0.2 },
    { name: "dim", type: "number", default: 0.7, min: 0, max: 1, step: 0.05 },
  ],
  Demo,
  code,
});
