"use client";

import * as React from "react";
import { Settings, X } from "lucide-react";
import { isAgentChange } from "@/components/ui/agent";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";
type V = {
  side: string;
  align: string;
  sideOffset: number;
  PopoverClose: boolean;
};

function Demo({ values: v, anatomy, refuse }: DemoProps<V>) {
  const [openState, setOpen] = React.useState(false);
  return (
    <Popover
      open={anatomy || openState}
      onOpenChange={(open, details) => {
        if (refuse && isAgentChange(details)) return details.cancel();
        if (!anatomy) setOpen(open);
      }}
    >
      <PopoverTrigger render={<Button variant="outline" />}>
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </PopoverTrigger>
      <PopoverContent side={v.side as Side} align={v.align as Align} sideOffset={v.sideOffset} className="w-72">
        <div className="mb-2 flex items-start justify-between">
          <PopoverTitle>Settings</PopoverTitle>
          {v.PopoverClose && (
            <PopoverClose aria-label="Close" render={<button className="rounded-sm opacity-70 hover:opacity-100" />}>
              <X className="h-4 w-4" />
            </PopoverClose>
          )}
        </div>
        <PopoverDescription>Configure your application settings here.</PopoverDescription>
        <div className="mt-4 space-y-2">
          <label className="flex items-center justify-between text-sm">
            Enable notifications
            <input type="checkbox" className="rounded" />
          </label>
          <label className="flex items-center justify-between text-sm">
            Auto-save
            <input type="checkbox" className="rounded" defaultChecked />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = ["Popover", "PopoverContent", "PopoverDescription", "PopoverTitle", "PopoverTrigger"];
  if (v.PopoverClose) parts.push("PopoverClose");
  parts.sort();

  const L: string[] = [];
  L.push(`import { ${v.PopoverClose ? "Settings, X" : "Settings"} } from "lucide-react"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { Button } from "@/components/ui/button"`);
  L.push(`import { ${parts.join(", ")} } from "@/components/ui/popover"`);
  L.push("", "export function SettingsPopover() {", "  return (");
  if (refuse) {
    L.push("    <Popover", "      onOpenChange={(open, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push("    <Popover>");
  }
  L.push('      <PopoverTrigger render={<Button variant="outline" />}>');
  L.push('        <Settings className="mr-2 h-4 w-4" />', "        Settings", "      </PopoverTrigger>");
  const props: string[] = [];
  if (v.side !== "bottom") props.push(`side="${v.side}"`);
  if (v.align !== "center") props.push(`align="${v.align}"`);
  if (v.sideOffset !== 8) props.push(`sideOffset={${v.sideOffset}}`);
  props.push('className="w-72"');
  L.push(`      <PopoverContent ${props.join(" ")}>`);
  L.push('        <div className="mb-2 flex items-start justify-between">', "          <PopoverTitle>Settings</PopoverTitle>");
  if (v.PopoverClose) {
    L.push('          <PopoverClose aria-label="Close" render={<button className="rounded-sm opacity-70 hover:opacity-100" />}>');
    L.push('            <X className="h-4 w-4" />', "          </PopoverClose>");
  }
  L.push("        </div>", "        <PopoverDescription>Configure your application settings here.</PopoverDescription>");
  L.push('        <div className="mt-4 space-y-2">');
  L.push('          <label className="flex items-center justify-between text-sm">', "            Enable notifications");
  L.push('            <input type="checkbox" className="rounded" />', "          </label>");
  L.push('          <label className="flex items-center justify-between text-sm">', "            Auto-save");
  L.push('            <input type="checkbox" className="rounded" defaultChecked />', "          </label>");
  L.push("        </div>", "      </PopoverContent>", "    </Popover>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "settings-popover.tsx",
  tall: true,
  refusable: true,
  controls: [
    { name: "side", type: "select", options: ["bottom", "top", "left", "right"], default: "bottom" },
    { name: "align", type: "select", options: ["start", "center", "end"], default: "center" },
    { name: "sideOffset", type: "number", default: 8, min: 0, max: 32, step: 2 },
    { name: "PopoverClose", type: "boolean", default: true },
  ],
  tries: [{ label: "Open", action: "open" }, { label: "Close", action: "close" }],
  Demo,
  code,
});
