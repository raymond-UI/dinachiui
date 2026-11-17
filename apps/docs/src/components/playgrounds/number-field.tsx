"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/components/ui/number-field";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  min: number;
  max: number;
  step: number;
  NumberFieldScrubArea: boolean;
  disabled: boolean;
};

function Demo({ values: v, refuse }: DemoProps<V>) {
  const id = React.useId();
  return (
    <NumberField
      defaultValue={5}
      min={v.min}
      max={v.max}
      step={v.step}
      disabled={v.disabled}
      onValueChange={(_, details) => {
        if (refuse && isAgentChange(details)) details.cancel();
      }}
      className="w-[180px] space-y-2"
    >
      {v.NumberFieldScrubArea && (
        <NumberFieldScrubArea className="w-fit">
          <label htmlFor={id} className="cursor-ew-resize text-sm font-medium">
            Quantity
          </label>
        </NumberFieldScrubArea>
      )}
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput id={id} aria-label={v.NumberFieldScrubArea ? undefined : "Quantity"} />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = ["NumberField", "NumberFieldDecrement", "NumberFieldGroup", "NumberFieldIncrement", "NumberFieldInput"];
  if (v.NumberFieldScrubArea) parts.push("NumberFieldScrubArea");
  parts.sort();

  const props = ["defaultValue={5}", `min={${v.min}}`, `max={${v.max}}`];
  if (v.step !== 1) props.push(`step={${v.step}}`);
  if (v.disabled) props.push("disabled");

  const L: string[] = [`import { ${parts.join(", ")} } from "@/components/ui/number-field"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function Quantity() {", "  return (");
  if (refuse) {
    L.push("    <NumberField");
    props.forEach((p) => L.push(`      ${p}`));
    L.push("      onValueChange={(value, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <NumberField ${props.join(" ")}>`);
  }
  if (v.NumberFieldScrubArea) {
    L.push("      <NumberFieldScrubArea>", '        <label htmlFor="quantity">Quantity</label>', "      </NumberFieldScrubArea>");
  }
  L.push("      <NumberFieldGroup>", "        <NumberFieldDecrement />");
  L.push(v.NumberFieldScrubArea ? '        <NumberFieldInput id="quantity" />' : '        <NumberFieldInput aria-label="Quantity" />');
  L.push("        <NumberFieldIncrement />", "      </NumberFieldGroup>", "    </NumberField>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "quantity.tsx",
  refusable: true,
  controls: [
    { name: "min", type: "number", default: 0 },
    { name: "max", type: "number", default: 10 },
    { name: "step", type: "number", default: 1, min: 0.5, step: 0.5 },
    { name: "NumberFieldScrubArea", type: "boolean", default: true },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Increment 3", action: "increment", args: [3] },
    { label: "Set 42", action: "setValue", args: [42] },
    { label: "Set \"lots\"", action: "setValue", args: ["lots"] },
  ],
  Demo,
  code,
});
