"use client";

import { TextMorph } from "@/components/ui/text-morph";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { children: string; blur: number; distance: number; duration: number };

function Demo({ values: v }: DemoProps<V>) {
  return (
    <TextMorph blur={v.blur} distance={v.distance} duration={v.duration} className="text-xl font-medium">
      {v.children}
    </TextMorph>
  );
}

function code(v: V): string {
  const props: string[] = [];
  if (v.blur !== 2) props.push(`blur={${v.blur}}`);
  if (v.distance !== 8) props.push(`distance={${v.distance}}`);
  if (v.duration !== 0.25) props.push(`duration={${v.duration}}`);
  return [
    `import { TextMorph } from "@/components/ui/text-morph"`,
    "",
    `type Status = "Deploying" | "Deployed" | "Deploy failed"`,
    "",
    "// Changing status runs the morph.",
    `export function DeployStatus({ status = "${v.children}" }: { status?: Status }) {`,
    `  return <TextMorph${props.map((p) => ` ${p}`).join("")}>{status}</TextMorph>`,
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "deploy-status.tsx",
  controls: [
    { name: "children", type: "select", options: ["Deploying", "Deployed", "Deploy failed"], default: "Deploying" },
    { name: "blur", type: "number", default: 2, min: 0, max: 12, step: 1 },
    { name: "distance", type: "number", default: 8, min: 0, max: 32, step: 2 },
    { name: "duration", type: "number", default: 0.25, min: 0.05, max: 1, step: 0.05 },
  ],
  Demo,
  code,
});
