"use client";

import { ProgressRing } from "@/components/ui/progress-ring";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  value: string;
  size: string;
  showValue: boolean;
  label: string;
};

const num = (v: string) => (v === "undefined" ? undefined : Number(v));

function Demo({ values: v }: DemoProps<V>) {
  return (
    <ProgressRing
      value={num(v.value)}
      size={Number(v.size)}
      showValue={v.showValue}
      label={v.label || undefined}
    />
  );
}

function code(v: V): string {
  const props: string[] = [];
  if (v.value !== "undefined") props.push(`value={${v.value}}`);
  if (v.size !== "96") props.push(`size={${v.size}}`);
  if (!v.showValue) props.push("showValue={false}");
  if (v.label) props.push(v.label.includes('"') ? `label={${JSON.stringify(v.label)}}` : `label="${v.label}"`);
  return [
    `import { ProgressRing } from "@/components/ui/progress-ring"`,
    "",
    "export function Upload() {",
    `  return <ProgressRing${props.map((p) => ` ${p}`).join("")} />`,
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "upload.tsx",
  controls: [
    { name: "value", type: "select", options: ["24", "64", "100", "undefined"], default: "24" },
    { name: "size", type: "select", options: ["56", "96", "128"], default: "96" },
    { name: "showValue", type: "boolean", default: true },
    { name: "label", type: "text", default: "Upload" },
  ],
  Demo,
  code,
});
