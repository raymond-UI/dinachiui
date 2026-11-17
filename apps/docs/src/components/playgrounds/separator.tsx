"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { orientation: "vertical" | "horizontal"; links: number };

const LINKS = ["Docs", "Source", "Blog", "Changelog", "Discord"];
const row: Record<V["orientation"], string> = {
  vertical: "flex h-5 items-center space-x-4 text-sm",
  horizontal: "flex flex-col text-sm",
};

function Demo({ values: v }: DemoProps<V>) {
  const links = LINKS.slice(0, Math.max(2, Math.min(5, v.links)));
  return (
    <div className="w-full max-w-sm">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Dinachi UI</h4>
        <p className="text-sm text-muted-foreground">An accessible component library.</p>
      </div>
      <Separator className="my-4" />
      <div className={row[v.orientation]}>
        {links.map((l, i) => (
          <React.Fragment key={l}>
            {i > 0 && <Separator orientation={v.orientation} className={v.orientation === "horizontal" ? "my-2" : undefined} />}
            <div>{l}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function code(v: V): string {
  const links = LINKS.slice(0, Math.max(2, Math.min(5, v.links)));
  const sep = v.orientation === "vertical" ? '<Separator orientation="vertical" />' : '<Separator className="my-2" />';
  const L = [
    `import { Separator } from "@/components/ui/separator"`,
    "",
    "export function ProjectLinks() {",
    "  return (",
    '    <div className="w-full max-w-sm">',
    '      <div className="space-y-1">',
    '        <h4 className="text-sm font-medium">Dinachi UI</h4>',
    '        <p className="text-sm text-muted-foreground">An accessible component library.</p>',
    "      </div>",
    '      <Separator className="my-4" />',
    `      <div className="${row[v.orientation]}">`,
  ];
  links.forEach((l, i) => {
    if (i > 0) L.push(`        ${sep}`);
    L.push(`        <div>${l}</div>`);
  });
  L.push("      </div>", "    </div>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "project-links.tsx",
  controls: [
    { name: "orientation", type: "select", options: ["vertical", "horizontal"], default: "vertical" },
    { name: "links", type: "number", default: 3, min: 2, max: 5 },
  ],
  Demo,
  code,
});
