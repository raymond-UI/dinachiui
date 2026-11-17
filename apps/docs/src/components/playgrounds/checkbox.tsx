"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { Checkbox } from "@/components/ui/checkbox";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { label: string; indeterminate: boolean; disabled: boolean; readOnly: boolean };

function Demo({ values: v, refuse }: DemoProps<V>) {
  const id = React.useId();
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        indeterminate={v.indeterminate}
        disabled={v.disabled}
        readOnly={v.readOnly}
        onCheckedChange={(_, details) => {
          if (refuse && isAgentChange(details)) details.cancel();
        }}
      />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {v.label}
      </label>
    </div>
  );
}

const jsx = (s: string) => (/[{}<>]/.test(s) ? `{${JSON.stringify(s)}}` : s);

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = [`id="terms"`];
  if (v.indeterminate) props.push("indeterminate");
  if (v.disabled) props.push("disabled");
  if (v.readOnly) props.push("readOnly");
  const L: string[] = [];
  L.push(`import { Checkbox } from "@/components/ui/checkbox"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function TermsCheckbox() {", "  return (", `    <div className="flex items-center space-x-2">`);
  if (refuse) {
    L.push("      <Checkbox");
    props.forEach((p) => L.push(`        ${p}`));
    L.push("        onCheckedChange={(checked, details) => {", "          if (isAgentChange(details)) details.cancel()", "        }}", "      />");
  } else {
    L.push(`      <Checkbox ${props.join(" ")} />`);
  }
  L.push(
    "      <label",
    `        htmlFor="terms"`,
    `        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"`,
    "      >",
    `        ${jsx(v.label)}`,
    "      </label>",
    "    </div>",
    "  )",
    "}",
  );
  return L.join("\n");
}

export default playground<V>({
  file: "terms-checkbox.tsx",
  refusable: true,
  controls: [
    { name: "label", type: "text", default: "Accept terms and conditions" },
    { name: "indeterminate", type: "boolean", default: false },
    { name: "disabled", type: "boolean", default: false },
    { name: "readOnly", type: "boolean", default: false },
  ],
  tries: [
    { label: "Toggle", action: "toggle" },
    { label: "Tick", action: "setChecked", args: [true] },
  ],
  Demo,
  code,
});
