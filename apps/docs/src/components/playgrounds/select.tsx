"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import {
  Select,
  SelectContent,
  SelectFieldLabel,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const REGIONS = [
  { value: "fra", label: "Frankfurt", group: "Europe" },
  { value: "lhr", label: "London", group: "Europe" },
  { value: "iad", label: "Virginia", group: "Americas" },
  { value: "pdx", label: "Oregon", group: "Americas" },
  { value: "sin", label: "Singapore", group: "Asia Pacific" },
  { value: "nrt", label: "Tokyo", group: "Asia Pacific" },
];
const GROUPS = ["Europe", "Americas", "Asia Pacific"];

type V = {
  placeholder: string;
  SelectFieldLabel: boolean;
  groups: boolean;
  showIndicator: boolean;
  alignItemWithTrigger: boolean;
  disabled: boolean;
};

function Demo({ values: v, anatomy, refuse }: DemoProps<V>) {
  const [value, setValue] = React.useState<string | null>(null);
  const [openState, setOpen] = React.useState(false);
  const items = (list: typeof REGIONS) =>
    list.map((r) => (
      <SelectItem key={r.value} value={r.value} showIndicator={v.showIndicator}>
        {r.label}
      </SelectItem>
    ));
  return (
    <div className="w-full max-w-[300px]">
      <Select
        items={REGIONS}
        value={value}
        onValueChange={(next, details) => {
          if (refuse && isAgentChange(details)) return details.cancel();
          setValue(next as string | null);
        }}
        open={anatomy || openState}
        onOpenChange={(o) => !anatomy && setOpen(o)}
        disabled={v.disabled}
        modal={false}
      >
        {v.SelectFieldLabel && <SelectFieldLabel className="mb-2">Region</SelectFieldLabel>}
        <SelectTrigger aria-label={v.SelectFieldLabel ? undefined : "Region"} className="bg-background">
          <SelectValue placeholder={v.placeholder} />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={v.alignItemWithTrigger}>
          {v.groups
            ? GROUPS.map((g, i) => (
                <SelectGroup key={g}>
                  {i > 0 && <SelectSeparator />}
                  <SelectLabel className="text-xs font-normal text-muted-foreground">{g}</SelectLabel>
                  {items(REGIONS.filter((r) => r.group === g))}
                </SelectGroup>
              ))
            : items(REGIONS)}
        </SelectContent>
      </Select>
    </div>
  );
}

/** A JSX string attribute, braced when the text holds a quote JSX can't escape. */
const attr = (text: string) => (text.includes('"') ? `{${JSON.stringify(text)}}` : `"${text}"`);

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = ["Select", "SelectContent", "SelectItem", "SelectTrigger", "SelectValue"];
  if (v.SelectFieldLabel) parts.push("SelectFieldLabel");
  if (v.groups) parts.push("SelectGroup", "SelectLabel", "SelectSeparator");
  parts.sort();

  const L: string[] = [];
  L.push(`import { ${parts.join(", ")} } from "@/components/ui/select"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "const regions = [");
  for (const r of REGIONS) L.push(`  { value: "${r.value}", label: "${r.label}"${v.groups ? `, group: "${r.group}"` : ""} },`);
  L.push("]", "", "export function RegionPicker() {", "  return (");
  const rootProps = ["items={regions}"];
  if (v.disabled) rootProps.push("disabled");
  if (refuse) {
    L.push("    <Select");
    rootProps.forEach((p) => L.push(`      ${p}`));
    L.push("      onValueChange={(value, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <Select ${rootProps.join(" ")}>`);
  }
  if (v.SelectFieldLabel) L.push("      <SelectFieldLabel>Region</SelectFieldLabel>");
  L.push(`      <SelectTrigger${v.SelectFieldLabel ? "" : ' aria-label="Region"'}>`);
  L.push(`        <SelectValue placeholder=${attr(v.placeholder)} />`, "      </SelectTrigger>");
  L.push(`      <SelectContent${v.alignItemWithTrigger ? " alignItemWithTrigger" : ""}>`);
  const item = (pad: string, list: string) => {
    L.push(`${pad}{${list}.map((r) => (`);
    L.push(`${pad}  <SelectItem key={r.value} value={r.value}${v.showIndicator ? " showIndicator" : ""}>`);
    L.push(`${pad}    {r.label}`, `${pad}  </SelectItem>`, `${pad}))}`);
  };
  if (v.groups) {
    L.push(`        {["Europe", "Americas", "Asia Pacific"].map((group, i) => (`, "          <SelectGroup key={group}>");
    L.push("            {i > 0 && <SelectSeparator />}", "            <SelectLabel>{group}</SelectLabel>");
    item("            ", "regions.filter((r) => r.group === group)");
    L.push("          </SelectGroup>", "        ))}");
  } else {
    item("        ", "regions");
  }
  L.push("      </SelectContent>", "    </Select>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "region-picker.tsx",
  tall: true,
  refusable: true,
  controls: [
    { name: "placeholder", type: "text", default: "Choose a region" },
    { name: "SelectFieldLabel", type: "boolean", default: true },
    { name: "groups", type: "boolean", default: false },
    { name: "showIndicator", type: "boolean", default: true },
    { name: "alignItemWithTrigger", type: "boolean", default: false },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Pick Tokyo", action: "select", args: ["Tokyo"] },
    { label: "Pick Mars", action: "select", args: ["Mars"] },
    { label: "Open", action: "open" },
  ],
  Demo,
  code,
});
