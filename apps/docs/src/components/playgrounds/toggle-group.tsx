"use client";

import * as React from "react";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from "lucide-react";
import { isAgentChange } from "@/components/ui/agent";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const ALIGN = [
  { value: "left", label: "Align left", icon: AlignLeft, name: "AlignLeft" },
  { value: "center", label: "Align center", icon: AlignCenter, name: "AlignCenter" },
  { value: "right", label: "Align right", icon: AlignRight, name: "AlignRight" },
];
const FORMAT = [
  { value: "bold", label: "Toggle bold", icon: Bold, name: "Bold" },
  { value: "italic", label: "Toggle italic", icon: Italic, name: "Italic" },
  { value: "underline", label: "Toggle underline", icon: Underline, name: "Underline" },
];

type V = {
  multiple: boolean;
  orientation: string;
  variant: string;
  size: string;
  disabled: boolean;
};

// One choice at a time suits alignment; several at once suits text formatting.
const setOf = (multiple: boolean) =>
  multiple
    ? { items: FORMAT, label: "Formatting", start: "bold", fn: "Formatting" }
    : { items: ALIGN, label: "Alignment", start: "center", fn: "Alignment" };

function Demo({ values: v, refuse }: DemoProps<V>) {
  const set = setOf(v.multiple);
  return (
    <ToggleGroup
      key={String(v.multiple)}
      aria-label={set.label}
      defaultValue={[set.start]}
      multiple={v.multiple}
      orientation={v.orientation as "horizontal" | "vertical"}
      disabled={v.disabled}
      onValueChange={(_, details) => {
        if (refuse && isAgentChange(details)) details.cancel();
      }}
    >
      {set.items.map(({ value, label, icon: Icon }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          aria-label={label}
          variant={v.variant as "default" | "outline"}
          size={v.size as "sm" | "default" | "lg"}
        >
          <Icon className="h-4 w-4" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const set = setOf(v.multiple);
  const props = [`aria-label="${set.label}"`, `defaultValue={["${set.start}"]}`];
  if (v.multiple) props.push("multiple");
  if (v.orientation !== "horizontal") props.push(`orientation="${v.orientation}"`);
  if (v.disabled) props.push("disabled");
  const itemProps = [v.variant !== "outline" && ` variant="${v.variant}"`, v.size !== "sm" && ` size="${v.size}"`].filter(Boolean).join("");

  const L: string[] = [`import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { ${set.items.map((i) => i.name).sort().join(", ")} } from "lucide-react"`);
  L.push("", `export function ${set.fn}() {`, "  return (");
  if (refuse) {
    L.push("    <ToggleGroup");
    props.forEach((p) => L.push(`      ${p}`));
    L.push("      onValueChange={(value, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <ToggleGroup ${props.join(" ")}>`);
  }
  for (const i of set.items) {
    L.push(`      <ToggleGroupItem value="${i.value}" aria-label="${i.label}"${itemProps}>`);
    L.push(`        <${i.name} className="h-4 w-4" />`, "      </ToggleGroupItem>");
  }
  L.push("    </ToggleGroup>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "toolbar-toggles.tsx",
  refusable: true,
  controls: [
    { name: "multiple", type: "boolean", default: false },
    { name: "orientation", type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
    { name: "variant", type: "select", options: ["outline", "default"], default: "outline" },
    { name: "size", type: "select", options: ["sm", "default", "lg"], default: "sm" },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Pick Align right", action: "select", args: ["Align right"] },
    { label: "Pick Justify", action: "select", args: ["Justify"] },
  ],
  Demo,
  code,
});
