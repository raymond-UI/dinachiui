"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";
type V = { side: string; align: string; sideOffset: number; variant: string; showArrow: boolean };

function Demo({ values: v, anatomy }: DemoProps<V>) {
  const [openState, setOpen] = React.useState(false);
  return (
    <TooltipProvider>
      <Tooltip open={anatomy || openState} onOpenChange={(open) => !anatomy && setOpen(open)}>
        <TooltipTrigger aria-label="Add new item">
          <Plus className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent
          side={v.side as Side}
          align={v.align as Align}
          sideOffset={v.sideOffset}
          variant={v.variant as "default" | "inverse"}
          showArrow={v.showArrow}
        >
          Add new item
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function code(v: V): string {
  const props: string[] = [];
  if (v.side !== "top") props.push(`side="${v.side}"`);
  if (v.align !== "center") props.push(`align="${v.align}"`);
  if (v.sideOffset !== 4) props.push(`sideOffset={${v.sideOffset}}`);
  if (v.variant !== "default") props.push(`variant="${v.variant}"`);
  if (!v.showArrow) props.push("showArrow={false}");
  return [
    `import { Plus } from "lucide-react"`,
    `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"`,
    "",
    "export function AddItem() {",
    "  return (",
    "    <TooltipProvider>",
    "      <Tooltip>",
    '        <TooltipTrigger aria-label="Add new item">',
    '          <Plus className="h-4 w-4" />',
    "        </TooltipTrigger>",
    `        <TooltipContent${props.map((p) => " " + p).join("")}>Add new item</TooltipContent>`,
    "      </Tooltip>",
    "    </TooltipProvider>",
    "  )",
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "add-item.tsx",
  controls: [
    { name: "side", type: "select", options: ["top", "bottom", "left", "right"], default: "top" },
    { name: "align", type: "select", options: ["start", "center", "end"], default: "center" },
    { name: "sideOffset", type: "number", default: 4, min: 0, max: 24, step: 2 },
    { name: "variant", type: "select", options: ["default", "inverse"], default: "default" },
    { name: "showArrow", type: "boolean", default: true },
  ],
  Demo,
  code,
});
