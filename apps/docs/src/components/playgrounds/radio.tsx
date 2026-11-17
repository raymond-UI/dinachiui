"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const OPTIONS = [
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

type V = {
  defaultValue: string;
  disabled: boolean;
  readOnly: boolean;
};

function Demo({ values: v, refuse }: DemoProps<V>) {
  return (
    <RadioGroup
      // defaultValue only applies on mount, so a new one starts a new group.
      key={v.defaultValue}
      aria-label="Density"
      defaultValue={v.defaultValue}
      disabled={v.disabled}
      readOnly={v.readOnly}
      onValueChange={(_, details) => {
        if (refuse && isAgentChange(details)) details.cancel();
      }}
    >
      {OPTIONS.map((o) => (
        <label key={o.value} className="flex items-center gap-2">
          <Radio value={o.value} />
          <span className="text-sm font-medium">{o.label}</span>
        </label>
      ))}
    </RadioGroup>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = ['aria-label="Density"', `defaultValue="${v.defaultValue}"`];
  if (v.disabled) props.push("disabled");
  if (v.readOnly) props.push("readOnly");

  const L: string[] = [`import { Radio, RadioGroup } from "@/components/ui/radio"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function DensityPicker() {", "  return (");
  if (refuse) {
    L.push("    <RadioGroup");
    props.forEach((p) => L.push(`      ${p}`));
    L.push("      onValueChange={(value, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <RadioGroup ${props.join(" ")}>`);
  }
  for (const o of OPTIONS) {
    L.push('      <label className="flex items-center gap-2">', `        <Radio value="${o.value}" />`, `        ${o.label}`, "      </label>");
  }
  L.push("    </RadioGroup>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "density-picker.tsx",
  refusable: true,
  controls: [
    { name: "defaultValue", type: "select", options: OPTIONS.map((o) => o.value), default: "comfortable" },
    { name: "disabled", type: "boolean", default: false },
    { name: "readOnly", type: "boolean", default: false },
  ],
  tries: [
    { label: "Pick Compact", action: "select", args: ["Compact"] },
    { label: "Pick Cozy", action: "select", args: ["Cozy"] },
  ],
  Demo,
  code,
});
