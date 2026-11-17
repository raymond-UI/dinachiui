"use client";

import * as React from "react";
import { Bold } from "lucide-react";
import { isAgentChange } from "@/components/ui/agent";
import { Toggle } from "@/components/ui/toggle";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  variant: string;
  size: string;
  defaultPressed: boolean;
  disabled: boolean;
};

const ICON = { sm: "h-3.5 w-3.5", default: "h-4 w-4", lg: "h-5 w-5" } as Record<string, string>;

function Demo({ values: v, refuse }: DemoProps<V>) {
  return (
    <Toggle
      // defaultPressed only applies on mount.
      key={String(v.defaultPressed)}
      aria-label="Toggle bold"
      variant={v.variant as "default" | "outline"}
      size={v.size as "sm" | "default" | "lg"}
      defaultPressed={v.defaultPressed}
      disabled={v.disabled}
      onPressedChange={(_, details) => {
        if (refuse && isAgentChange(details)) details.cancel();
      }}
    >
      <Bold className={ICON[v.size]} />
    </Toggle>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = ['aria-label="Toggle bold"'];
  if (v.variant !== "default") props.push(`variant="${v.variant}"`);
  if (v.size !== "default") props.push(`size="${v.size}"`);
  if (v.defaultPressed) props.push("defaultPressed");
  if (v.disabled) props.push("disabled");

  const L: string[] = [`import { Toggle } from "@/components/ui/toggle"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { Bold } from "lucide-react"`, "", "export function BoldToggle() {", "  return (");
  if (refuse) {
    L.push("    <Toggle");
    props.forEach((p) => L.push(`      ${p}`));
    L.push("      onPressedChange={(pressed, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <Toggle ${props.join(" ")}>`);
  }
  L.push(`      <Bold className="${ICON[v.size]}" />`, "    </Toggle>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "bold-toggle.tsx",
  refusable: true,
  controls: [
    { name: "variant", type: "select", options: ["default", "outline"], default: "default" },
    { name: "size", type: "select", options: ["sm", "default", "lg"], default: "default" },
    { name: "defaultPressed", type: "boolean", default: false },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Toggle", action: "toggle" },
    { label: "Press it", action: "setChecked", args: [true] },
  ],
  Demo,
  code,
});
