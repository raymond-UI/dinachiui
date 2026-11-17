"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { NavigationMenu, NavigationMenuArrow, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuPopup, NavigationMenuPortal, NavigationMenuPositioner, NavigationMenuTrigger, NavigationMenuViewport } from "@/components/ui/navigation-menu";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { delay: number; closeDelay: number; NavigationMenuArrow: boolean };

const SECTIONS: { value: string; name: string; grid: string; links: [string, string][] }[] = [
  {
    value: "getting-started",
    name: "Getting Started",
    grid: "grid gap-3",
    links: [
      ["Introduction", "Learn the basics and get up and running quickly."],
      ["Installation", "Step-by-step guide to install and configure."],
      ["Typography", "Styles for headings, paragraphs, and lists."],
    ],
  },
  {
    value: "components",
    name: "Components",
    grid: "grid gap-3 md:grid-cols-2",
    links: [
      ["Button", "Trigger actions and events."],
      ["Dialog", "Modal overlays for focused tasks."],
      ["Tabs", "Organize content into panels."],
      ["Select", "Pick from a list of options."],
    ],
  },
];

const TOP_LINK =
  "inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground";

const stop = (e: React.MouseEvent) => e.preventDefault();

function Demo({ values: v, anatomy, refuse }: DemoProps<V>) {
  const [value, setValue] = React.useState<string | null>(null);
  return (
    <NavigationMenu
      value={anatomy ? "getting-started" : value}
      delay={v.delay}
      closeDelay={v.closeDelay}
      onValueChange={(next, details) => {
        if (refuse && isAgentChange(details)) return details.cancel();
        if (!anatomy) setValue(next as string | null);
      }}
    >
      <NavigationMenuList>
        {SECTIONS.map((s) => (
          <NavigationMenuItem key={s.value} value={s.value}>
            <NavigationMenuTrigger>{s.name}</NavigationMenuTrigger>
            <NavigationMenuContent className="p-4 md:w-[400px]">
              <ul className={s.grid}>
                {s.links.map(([title, text]) => (
                  <li key={title}>
                    <NavigationMenuLink href="#" onClick={stop}>
                      <div className="text-sm font-medium">{title}</div>
                      <p className="text-xs text-muted-foreground">{text}</p>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuLink href="#" onClick={stop} className={TOP_LINK}>
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup>
            {v.NavigationMenuArrow && <NavigationMenuArrow />}
            <NavigationMenuViewport />
          </NavigationMenuPopup>
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = [
    "NavigationMenu",
    "NavigationMenuContent",
    "NavigationMenuItem",
    "NavigationMenuLink",
    "NavigationMenuList",
    "NavigationMenuPopup",
    "NavigationMenuPortal",
    "NavigationMenuPositioner",
    "NavigationMenuTrigger",
    "NavigationMenuViewport",
  ];
  if (v.NavigationMenuArrow) parts.push("NavigationMenuArrow");
  parts.sort();

  const L: string[] = [];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { ${parts.join(", ")} } from "@/components/ui/navigation-menu"`);
  L.push("", "export function SiteNav() {", "  return (");
  const root: string[] = [];
  if (v.delay !== 50) root.push(`delay={${v.delay}}`);
  if (v.closeDelay !== 50) root.push(`closeDelay={${v.closeDelay}}`);
  if (refuse) {
    L.push("    <NavigationMenu");
    root.forEach((p) => L.push(`      ${p}`));
    L.push("      onValueChange={(value, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <NavigationMenu${root.map((p) => " " + p).join("")}>`);
  }
  L.push("      <NavigationMenuList>");
  for (const s of SECTIONS) {
    L.push("        <NavigationMenuItem>", `          <NavigationMenuTrigger>${s.name}</NavigationMenuTrigger>`);
    L.push('          <NavigationMenuContent className="p-4 md:w-[400px]">', `            <ul className="${s.grid}">`);
    for (const [title, text] of s.links) {
      L.push("              <li>", '                <NavigationMenuLink href="#">');
      L.push(`                  <div className="text-sm font-medium">${title}</div>`);
      L.push(`                  <p className="text-xs text-muted-foreground">${text}</p>`);
      L.push("                </NavigationMenuLink>", "              </li>");
    }
    L.push("            </ul>", "          </NavigationMenuContent>", "        </NavigationMenuItem>");
  }
  L.push("        <NavigationMenuItem>", `          <NavigationMenuLink href="#" className="${TOP_LINK}">`);
  L.push("            Documentation", "          </NavigationMenuLink>", "        </NavigationMenuItem>", "      </NavigationMenuList>");
  L.push("      <NavigationMenuPortal>", "        <NavigationMenuPositioner>", "          <NavigationMenuPopup>");
  if (v.NavigationMenuArrow) L.push("            <NavigationMenuArrow />");
  L.push("            <NavigationMenuViewport />", "          </NavigationMenuPopup>", "        </NavigationMenuPositioner>", "      </NavigationMenuPortal>");
  L.push("    </NavigationMenu>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "site-nav.tsx",
  tall: true,
  refusable: true,
  controls: [
    { name: "delay", type: "number", default: 50, min: 0, max: 1000, step: 50 },
    { name: "closeDelay", type: "number", default: 50, min: 0, max: 1000, step: 50 },
    { name: "NavigationMenuArrow", type: "boolean", default: false },
  ],
  tries: [
    { label: "Open Getting Started", action: "open", target: "Getting Started" },
    { label: "Press Documentation", action: "press", target: "Documentation" },
  ],
  Demo,
  code,
});
