"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { Menu, MenuContent, MenuGroup, MenuItem, MenuLabel, MenuSeparator, MenuShortcut, MenuTrigger } from "@/components/ui/menu";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { MenuLabel: string; MenuShortcut: boolean; openOnHover: boolean; modal: boolean };

const ITEMS = [
  ["Profile", "⌘P"],
  ["Settings", "⌘S"],
  ["Keyboard Shortcuts", "⌘K"],
];

function Demo({ values: v, anatomy, refuse }: DemoProps<V>) {
  const [openState, setOpen] = React.useState(false);
  return (
    <Menu
      open={anatomy || openState}
      modal={anatomy ? false : v.modal}
      onOpenChange={(open, details) => {
        if (refuse && isAgentChange(details)) return details.cancel();
        if (!anatomy) setOpen(open);
      }}
    >
      <MenuTrigger openOnHover={v.openOnHover}>Open Menu</MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuLabel>{v.MenuLabel}</MenuLabel>
          {ITEMS.map(([name, keys]) => (
            <MenuItem key={name}>
              {name}
              {v.MenuShortcut && <MenuShortcut>{keys}</MenuShortcut>}
            </MenuItem>
          ))}
        </MenuGroup>
        <MenuSeparator />
        <MenuItem>Log out</MenuItem>
      </MenuContent>
    </Menu>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = ["Menu", "MenuContent", "MenuGroup", "MenuItem", "MenuLabel", "MenuSeparator", "MenuTrigger"];
  if (v.MenuShortcut) parts.push("MenuShortcut");
  parts.sort();

  const L: string[] = [];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { ${parts.join(", ")} } from "@/components/ui/menu"`);
  L.push("", "export function AccountMenu() {", "  return (");
  const root: string[] = [];
  if (!v.modal) root.push("modal={false}");
  if (refuse) {
    L.push("    <Menu");
    root.forEach((p) => L.push(`      ${p}`));
    L.push("      onOpenChange={(open, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <Menu${root.map((p) => " " + p).join("")}>`);
  }
  L.push(`      <MenuTrigger${v.openOnHover ? " openOnHover" : ""}>Open Menu</MenuTrigger>`, "      <MenuContent>", "        <MenuGroup>");
  L.push(`          <MenuLabel>${v.MenuLabel}</MenuLabel>`);
  for (const [name, keys] of ITEMS) {
    if (v.MenuShortcut) {
      L.push("          <MenuItem>", `            ${name}`, `            <MenuShortcut>${keys}</MenuShortcut>`, "          </MenuItem>");
    } else {
      L.push(`          <MenuItem>${name}</MenuItem>`);
    }
  }
  L.push("        </MenuGroup>", "        <MenuSeparator />", "        <MenuItem>Log out</MenuItem>");
  L.push("      </MenuContent>", "    </Menu>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "account-menu.tsx",
  tall: true,
  refusable: true,
  controls: [
    { name: "MenuLabel", type: "text", default: "My Account" },
    { name: "MenuShortcut", type: "boolean", default: true },
    { name: "openOnHover", type: "boolean", default: false },
    { name: "modal", type: "boolean", default: true },
  ],
  tries: [{ label: "Open", action: "open" }, { label: "Close", action: "close" }],
  Demo,
  code,
});
