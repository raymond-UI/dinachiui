"use client";

import { isAgentChange } from "@/components/ui/agent";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type Side = "top" | "right" | "bottom" | "left";
type V = {
  side: string;
  DrawerTitle: string;
  DrawerDescription: boolean;
  modal: boolean;
};

const field = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

// The drawer stays closed in Anatomy: open, it would cover the page and trap focus.
function Demo({ values: v, refuse }: DemoProps<V>) {
  return (
    <Drawer
      modal={v.modal}
      onOpenChange={(_, details) => {
        if (refuse && isAgentChange(details)) details.cancel();
      }}
    >
      <DrawerTrigger render={<Button variant="outline" />}>Open Drawer</DrawerTrigger>
      <DrawerContent side={v.side as Side}>
        <DrawerHeader>
          <DrawerTitle>{v.DrawerTitle}</DrawerTitle>
          {v.DrawerDescription && <DrawerDescription>Make changes to your profile settings.</DrawerDescription>}
        </DrawerHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="pg-drawer-name" className="text-sm font-medium">Name</label>
            <input id="pg-drawer-name" defaultValue="John Doe" className={field} />
          </div>
          <div className="space-y-2">
            <label htmlFor="pg-drawer-email" className="text-sm font-medium">Email</label>
            <input id="pg-drawer-email" type="email" defaultValue="john@example.com" className={field} />
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = ["Drawer", "DrawerClose", "DrawerContent", "DrawerFooter", "DrawerHeader", "DrawerTitle", "DrawerTrigger"];
  if (v.DrawerDescription) parts.push("DrawerDescription");
  parts.sort();

  const L: string[] = [];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { Button } from "@/components/ui/button"`);
  L.push(`import { ${parts.join(", ")} } from "@/components/ui/drawer"`);
  L.push("", "export function EditProfile() {", "  return (");
  const rootProps = v.modal ? [] : ["modal={false}"];
  if (refuse) {
    L.push("    <Drawer");
    rootProps.forEach((p) => L.push(`      ${p}`));
    L.push("      onOpenChange={(open, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <Drawer${rootProps.map((p) => " " + p).join("")}>`);
  }
  L.push('      <DrawerTrigger render={<Button variant="outline" />}>Open Drawer</DrawerTrigger>');
  L.push(`      <DrawerContent${v.side === "right" ? "" : ` side="${v.side}"`}>`);
  L.push("        <DrawerHeader>", `          <DrawerTitle>${v.DrawerTitle}</DrawerTitle>`);
  if (v.DrawerDescription) L.push("          <DrawerDescription>Make changes to your profile settings.</DrawerDescription>");
  L.push("        </DrawerHeader>", '        <div className="space-y-4 py-4">');
  for (const [label, input] of [
    ["Name", '<input id="name" defaultValue="John Doe"'],
    ["Email", '<input id="email" type="email" defaultValue="john@example.com"'],
  ]) {
    const id = label.toLowerCase();
    L.push('          <div className="space-y-2">');
    L.push(`            <label htmlFor="${id}" className="text-sm font-medium">${label}</label>`);
    L.push(`            ${input} className="${field}" />`);
    L.push("          </div>");
  }
  L.push("        </div>", "        <DrawerFooter>");
  L.push('          <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>');
  L.push("          <Button>Save</Button>", "        </DrawerFooter>", "      </DrawerContent>", "    </Drawer>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "edit-profile.tsx",
  refusable: true,
  controls: [
    { name: "side", type: "select", options: ["right", "left", "top", "bottom"], default: "right" },
    { name: "DrawerTitle", type: "text", default: "Edit Profile" },
    { name: "DrawerDescription", type: "boolean", default: true },
    { name: "modal", type: "boolean", default: true },
  ],
  tries: [{ label: "Open", action: "open" }],
  Demo,
  code,
});
