"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { disabled: boolean; ContextMenuShortcut: boolean; ContextMenuSeparator: boolean };

// [name, shortcut, disabled, separator before]
const ITEMS: [string, string | null, boolean, boolean][] = [
  ["Back", "⌘[", false, false],
  ["Forward", "⌘]", true, false],
  ["Reload", "⌘R", false, false],
  ["More Tools", null, false, true],
  ["Developer Tools", "F12", false, true],
];

const AREA =
  "flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm bg-card hover:bg-accent/50 transition-colors";

function Demo({ values: v, anatomy, refuse }: DemoProps<V>) {
  const [openState, setOpen] = React.useState(false);
  return (
    <ContextMenu
      open={anatomy || openState}
      disabled={v.disabled}
      onOpenChange={(open, details) => {
        if (refuse && isAgentChange(details)) return details.cancel();
        if (!anatomy) setOpen(open);
      }}
    >
      {/* Held open for Anatomy, the menu's click-catching backdrop would swallow every click on the page. */}
      {anatomy && <style>{"[data-slot=context-menu-portal] > [data-base-ui-inert] { pointer-events: none }"}</style>}
      <ContextMenuTrigger className={AREA}>Right click here</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {ITEMS.map(([name, keys, disabled, sep]) => (
          <React.Fragment key={name}>
            {sep && v.ContextMenuSeparator && <ContextMenuSeparator />}
            <ContextMenuItem disabled={disabled}>
              {name}
              {keys && v.ContextMenuShortcut && <ContextMenuShortcut>{keys}</ContextMenuShortcut>}
            </ContextMenuItem>
          </React.Fragment>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = ["ContextMenu", "ContextMenuContent", "ContextMenuItem", "ContextMenuTrigger"];
  if (v.ContextMenuSeparator) parts.push("ContextMenuSeparator");
  if (v.ContextMenuShortcut) parts.push("ContextMenuShortcut");
  parts.sort();

  const L: string[] = [];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { ${parts.join(", ")} } from "@/components/ui/context-menu"`);
  L.push("", "export function PageMenu() {", "  return (");
  if (refuse) {
    L.push("    <ContextMenu");
    if (v.disabled) L.push("      disabled");
    L.push("      onOpenChange={(open, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <ContextMenu${v.disabled ? " disabled" : ""}>`);
  }
  L.push(`      <ContextMenuTrigger className="${AREA}">`, "        Right click here", "      </ContextMenuTrigger>");
  L.push('      <ContextMenuContent className="w-64">');
  for (const [name, keys, disabled, sep] of ITEMS) {
    if (sep && v.ContextMenuSeparator) L.push("        <ContextMenuSeparator />");
    const open = `<ContextMenuItem${disabled ? " disabled" : ""}>`;
    if (keys && v.ContextMenuShortcut) {
      L.push(`        ${open}`, `          ${name}`, `          <ContextMenuShortcut>${keys}</ContextMenuShortcut>`, "        </ContextMenuItem>");
    } else {
      L.push(`        ${open}${name}</ContextMenuItem>`);
    }
  }
  L.push("      </ContextMenuContent>", "    </ContextMenu>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "page-menu.tsx",
  tall: true,
  refusable: true,
  controls: [
    { name: "disabled", type: "boolean", default: false },
    { name: "ContextMenuShortcut", type: "boolean", default: true },
    { name: "ContextMenuSeparator", type: "boolean", default: true },
  ],
  tries: [{ label: "Open", action: "open", target: "Right click here" }, { label: "Close", action: "close" }],
  Demo,
  code,
});
