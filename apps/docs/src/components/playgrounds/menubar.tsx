"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarPortal, MenubarPositioner, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { modal: boolean; loopFocus: boolean; MenubarShortcut: boolean };

// Each menu is groups of [item, shortcut], with a separator between groups.
const MENUS: [string, [string, string | null][][]][] = [
  ["File", [[["New Tab", "⌘T"], ["New Window", "⌘N"]], [["Print", "⌘P"]]]],
  ["Edit", [[["Undo", "⌘Z"], ["Redo", "⌘⇧Z"]], [["Cut", "⌘X"], ["Copy", "⌘C"], ["Paste", "⌘V"]]]],
  ["View", [[["Zoom In", "⌘+"], ["Zoom Out", "⌘-"]], [["Toggle Fullscreen", null]]]],
];

function Demo({ values: v, anatomy, refuse }: DemoProps<V>) {
  const [fileOpen, setFileOpen] = React.useState(false);
  return (
    <Menubar modal={anatomy ? false : v.modal} loopFocus={v.loopFocus}>
      {MENUS.map(([menu, groups]) => {
        const file = menu === "File";
        return (
          <MenubarMenu
            key={menu}
            open={file ? anatomy || fileOpen : undefined}
            onOpenChange={(open, details) => {
              if (refuse && isAgentChange(details)) return details.cancel();
              if (file && !anatomy) setFileOpen(open);
            }}
          >
            <MenubarTrigger>{menu}</MenubarTrigger>
            <MenubarPortal>
              <MenubarPositioner>
                <MenubarContent>
                  {groups.map((items, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <MenubarSeparator />}
                      {items.map(([name, keys]) => (
                        <MenubarItem key={name}>
                          {name}
                          {keys && v.MenubarShortcut && <> <MenubarShortcut>{keys}</MenubarShortcut></>}
                        </MenubarItem>
                      ))}
                    </React.Fragment>
                  ))}
                </MenubarContent>
              </MenubarPositioner>
            </MenubarPortal>
          </MenubarMenu>
        );
      })}
    </Menubar>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = ["Menubar", "MenubarContent", "MenubarItem", "MenubarMenu", "MenubarPortal", "MenubarPositioner", "MenubarSeparator", "MenubarTrigger"];
  if (v.MenubarShortcut) parts.push("MenubarShortcut");
  parts.sort();

  const L: string[] = [];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { ${parts.join(", ")} } from "@/components/ui/menubar"`);
  L.push("", "export function AppMenubar() {", "  return (");
  const root: string[] = [];
  if (!v.modal) root.push("modal={false}");
  if (!v.loopFocus) root.push("loopFocus={false}");
  L.push(`    <Menubar${root.map((p) => " " + p).join("")}>`);
  for (const [menu, groups] of MENUS) {
    if (refuse) {
      L.push("      <MenubarMenu", "        onOpenChange={(open, details) => {", "          if (isAgentChange(details)) details.cancel()", "        }}", "      >");
    } else {
      L.push("      <MenubarMenu>");
    }
    L.push(`        <MenubarTrigger>${menu}</MenubarTrigger>`, "        <MenubarPortal>", "          <MenubarPositioner>", "            <MenubarContent>");
    groups.forEach((items, i) => {
      if (i > 0) L.push("              <MenubarSeparator />");
      for (const [name, keys] of items) {
        const tail = keys && v.MenubarShortcut ? ` <MenubarShortcut>${keys}</MenubarShortcut>` : "";
        L.push(`              <MenubarItem>${name}${tail}</MenubarItem>`);
      }
    });
    L.push("            </MenubarContent>", "          </MenubarPositioner>", "        </MenubarPortal>", "      </MenubarMenu>");
  }
  L.push("    </Menubar>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "app-menubar.tsx",
  tall: true,
  refusable: true,
  controls: [
    { name: "modal", type: "boolean", default: true },
    { name: "loopFocus", type: "boolean", default: true },
    { name: "MenubarShortcut", type: "boolean", default: true },
  ],
  tries: [
    { label: "Open File", action: "open", target: "File" },
    { label: "Open Edit", action: "open", target: "Edit" },
  ],
  Demo,
  code,
});
