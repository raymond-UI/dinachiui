"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const VARIANTS = ["default", "secondary", "outline", "ghost", "link", "destructive"] as const;
const SIZES = ["sm", "default", "lg", "icon"] as const;

type V = {
  variant: (typeof VARIANTS)[number];
  size: (typeof SIZES)[number];
  children: string;
  disabled: boolean;
};

function Demo({ values: v }: DemoProps<V>) {
  const icon = v.size === "icon";
  return (
    <Button variant={v.variant} size={v.size} disabled={v.disabled} aria-label={icon ? v.children : undefined}>
      {icon ? <Save className="h-4 w-4" /> : v.children}
    </Button>
  );
}

const quote = (s: string) => JSON.stringify(s);
const jsx = (s: string) => (/[{}<>]/.test(s) ? `{${quote(s)}}` : s);

function code(v: V): string {
  const icon = v.size === "icon";
  const props: string[] = [];
  if (v.variant !== "default") props.push(`variant="${v.variant}"`);
  if (v.size !== "default") props.push(`size="${v.size}"`);
  if (v.disabled) props.push("disabled");
  if (icon) props.push(`aria-label=${quote(v.children)}`);
  const open = `<Button${props.map((p) => ` ${p}`).join("")}>`;
  const L = [];
  if (icon) L.push(`import { Save } from "lucide-react"`);
  L.push(`import { Button } from "@/components/ui/button"`, "", "export function SaveButton() {", "  return (");
  if (icon) L.push(`    ${open}`, `      <Save className="h-4 w-4" />`, "    </Button>");
  else L.push(`    ${open}${jsx(v.children)}</Button>`);
  L.push("  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "save-button.tsx",
  controls: [
    { name: "variant", type: "select", options: VARIANTS, default: "default" },
    { name: "size", type: "select", options: SIZES, default: "default" },
    { name: "children", type: "text", default: "Save changes" },
    { name: "disabled", type: "boolean", default: false },
  ],
  Demo,
  code,
});
