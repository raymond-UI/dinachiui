"use client";

import * as React from "react";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Link, Search, Underline } from "lucide-react";
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarInput, ToolbarLink, ToolbarSeparator } from "@/components/ui/toolbar";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { orientation: "horizontal" | "vertical"; disabled: boolean; ToolbarLink: boolean; ToolbarInput: boolean };

const GROUPS = [
  [["Bold", Bold], ["Italic", Italic], ["Underline", Underline]],
  [["Align left", AlignLeft], ["Align center", AlignCenter], ["Align right", AlignRight]],
] as const;

function Demo({ values: v }: DemoProps<V>) {
  const vertical = v.orientation === "vertical";
  const sep = <ToolbarSeparator orientation={vertical ? "horizontal" : "vertical"} />;
  return (
    <Toolbar
      orientation={v.orientation}
      disabled={v.disabled}
      className={vertical ? "inline-flex flex-col" : undefined}
    >
      {GROUPS.map((g, i) => (
        <React.Fragment key={i}>
          {i > 0 && sep}
          <ToolbarGroup className={vertical ? "flex-col" : undefined}>
            {g.map(([label, Icon]) => (
              <ToolbarButton key={label} aria-label={label}>
                <Icon className="h-4 w-4" />
              </ToolbarButton>
            ))}
          </ToolbarGroup>
        </React.Fragment>
      ))}
      {v.ToolbarLink && (
        <>
          {sep}
          <ToolbarLink href="#" onClick={(e) => e.preventDefault()}>
            <Link className="mr-1 h-4 w-4" />
            Insert Link
          </ToolbarLink>
        </>
      )}
      {v.ToolbarInput && (
        <>
          {sep}
          <div className="relative flex items-center">
            <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
            <ToolbarInput placeholder="Search..." className="h-8 w-40 pl-7" />
          </div>
        </>
      )}
    </Toolbar>
  );
}

function code(v: V): string {
  const vertical = v.orientation === "vertical";
  const parts = ["Toolbar", "ToolbarButton", "ToolbarGroup", "ToolbarSeparator"];
  if (v.ToolbarLink) parts.push("ToolbarLink");
  if (v.ToolbarInput) parts.push("ToolbarInput");
  parts.sort();
  const icons = ["AlignCenter", "AlignLeft", "AlignRight", "Bold", "Italic", ...(v.ToolbarLink ? ["Link"] : []), ...(v.ToolbarInput ? ["Search"] : []), "Underline"];
  const props: string[] = [];
  if (vertical) props.push('orientation="vertical"');
  if (v.disabled) props.push("disabled");
  if (vertical) props.push('className="inline-flex flex-col"');
  const group = vertical ? ' className="flex-col"' : "";
  const sep = vertical ? '      <ToolbarSeparator orientation="horizontal" />' : "      <ToolbarSeparator />";
  const L = [
    `import { ${parts.join(", ")} } from "@/components/ui/toolbar"`,
    `import { ${icons.join(", ")} } from "lucide-react"`,
    "",
    "export function FormatBar() {",
    "  return (",
    `    <Toolbar${props.length ? " " + props.join(" ") : ""}>`,
  ];
  const names = [["Bold", "Bold"], ["Italic", "Italic"], ["Underline", "Underline"], ["Align left", "AlignLeft"], ["Align center", "AlignCenter"], ["Align right", "AlignRight"]];
  [names.slice(0, 3), names.slice(3)].forEach((g, i) => {
    if (i > 0) L.push(sep);
    L.push(`      <ToolbarGroup${group}>`);
    for (const [label, icon] of g)
      L.push(`        <ToolbarButton aria-label="${label}">`, `          <${icon} className="h-4 w-4" />`, "        </ToolbarButton>");
    L.push("      </ToolbarGroup>");
  });
  if (v.ToolbarLink)
    L.push(sep, '      <ToolbarLink href="#">', '        <Link className="mr-1 h-4 w-4" />', "        Insert Link", "      </ToolbarLink>");
  if (v.ToolbarInput)
    L.push(
      sep,
      '      <div className="relative flex items-center">',
      '        <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground" />',
      '        <ToolbarInput placeholder="Search..." className="h-8 w-40 pl-7" />',
      "      </div>",
    );
  L.push("    </Toolbar>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "format-bar.tsx",
  controls: [
    { name: "orientation", type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
    { name: "disabled", type: "boolean", default: false },
    { name: "ToolbarLink", type: "boolean", default: true },
    { name: "ToolbarInput", type: "boolean", default: false },
  ],
  Demo,
  code,
});
