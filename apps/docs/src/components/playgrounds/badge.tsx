"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type Size = "sm" | "default" | "lg";
type Rounded = "default" | "sm" | "md" | "lg" | "none";
type V = { size: Size; rounded: Rounded; dismissible: boolean };

const VARIANTS = ["default", "secondary", "destructive", "outline", "success", "warning", "info"] as const;
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Demo({ values: v }: DemoProps<V>) {
  const [shown, setShown] = React.useState<readonly string[]>(VARIANTS);
  const [dismissible, setDismissible] = React.useState(v.dismissible);
  if (v.dismissible !== dismissible) {
    setDismissible(v.dismissible);
    setShown(VARIANTS);
  }
  return (
    <div className="flex max-w-md flex-wrap justify-center gap-2">
      {shown.map((variant) => (
        <Badge
          key={variant}
          variant={variant as (typeof VARIANTS)[number]}
          size={v.size}
          rounded={v.rounded}
          dismissible={v.dismissible}
          onDismiss={() => setShown((s) => s.filter((x) => x !== variant))}
        >
          {title(variant)}
        </Badge>
      ))}
    </div>
  );
}

function code(v: V): string {
  const props = ["variant={variant}"];
  if (v.size !== "default") props.push(`size="${v.size}"`);
  if (v.rounded !== "default") props.push(`rounded="${v.rounded}"`);
  const L = [];
  if (v.dismissible) L.push(`import { useState } from "react"`);
  L.push(`import { Badge } from "@/components/ui/badge"`, "", "const variants = [");
  L.push(`  ${VARIANTS.map((x) => `"${x}"`).join(", ")},`, "] as const", "");
  L.push("export function StatusBadges() {");
  if (v.dismissible) {
    L.push("  const [shown, setShown] = useState<readonly string[]>(variants)");
    props.push("dismissible", "onDismiss={() => setShown((s) => s.filter((x) => x !== variant))}");
  }
  const list = v.dismissible ? "(shown as typeof variants)" : "variants";
  L.push(
    "  return (",
    '    <div className="flex flex-wrap gap-2">',
    `      {${list}.map((variant) => (`,
    `        <Badge key={variant} ${props.join(" ")}>`,
    "          {variant.charAt(0).toUpperCase() + variant.slice(1)}",
    "        </Badge>",
    "      ))}",
    "    </div>",
    "  )",
    "}",
  );
  return L.join("\n");
}

export default playground<V>({
  file: "status-badges.tsx",
  controls: [
    { name: "size", type: "select", options: ["sm", "default", "lg"], default: "default" },
    { name: "rounded", type: "select", options: ["default", "sm", "md", "lg", "none"], default: "default" },
    { name: "dismissible", type: "boolean", default: false },
  ],
  Demo,
  code,
});
