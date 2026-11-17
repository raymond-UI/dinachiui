"use client";

import { StaggerList, StaggerListItem, type StaggerListVariant } from "@/components/ui/stagger-list";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const ITEMS = ["Deploys", "Incidents", "Costs", "Latency", "Error rate"];

type V = {
  variant: string;
  stagger: number;
  duration: number;
  distance: number;
  key: number;
};

function Demo({ values: v }: DemoProps<V>) {
  // The sequence only runs on arrival, so any change remounts the list to replay it.
  return (
    <StaggerList
      key={JSON.stringify(v)}
      startOnView={false}
      variant={v.variant as StaggerListVariant}
      stagger={v.stagger}
      duration={v.duration}
      distance={v.distance}
      className="w-56 space-y-2"
    >
      {ITEMS.map((item) => (
        <StaggerListItem key={item}>
          <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">{item}</div>
        </StaggerListItem>
      ))}
    </StaggerList>
  );
}

function code(v: V): string {
  const props = ["key={run}", "startOnView={false}"];
  if (v.variant !== "rise") props.push(`variant="${v.variant}"`);
  if (v.stagger !== 0.05) props.push(`stagger={${v.stagger}}`);
  if (v.duration !== 0.3) props.push(`duration={${v.duration}}`);
  if (v.distance !== 8) props.push(`distance={${v.distance}}`);
  return [
    `import { StaggerList, StaggerListItem } from "@/components/ui/stagger-list"`,
    "",
    `const items = ${JSON.stringify(ITEMS).replace(/,/g, ", ")}`,
    "",
    "// Bump run to replay: the sequence only runs on mount.",
    "export function Metrics({ run }: { run: number }) {",
    "  return (",
    `    <StaggerList ${props.join(" ")} className="space-y-2">`,
    "      {items.map((item) => (",
    "        <StaggerListItem key={item}>",
    `          <div className="rounded-md border px-3 py-2 text-sm">{item}</div>`,
    "        </StaggerListItem>",
    "      ))}",
    "    </StaggerList>",
    "  )",
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "metrics.tsx",
  controls: [
    { name: "variant", type: "select", options: ["rise", "scale", "blur"], default: "rise" },
    { name: "stagger", type: "number", default: 0.05, min: 0, max: 0.3, step: 0.01 },
    { name: "duration", type: "number", default: 0.3, min: 0.1, max: 1.5, step: 0.1 },
    { name: "distance", type: "number", default: 8, min: 0, max: 48, step: 4 },
    { name: "key", type: "number", default: 0, min: 0, step: 1 },
  ],
  Demo,
  code,
});
