"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import type { CommandItem } from "@/components/ui/omnibar";
import { DESK, DeskOmnibar, RECENT, SCOPES, SUGGESTED } from "@/components/examples/omnibar-examples";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  label: string;
  OmnibarScopes: boolean;
  recent: boolean;
  shortcut: string;
  disabled: boolean;
};

// Stays closed in Anatomy: on a phone it fills the screen. The panel lays itself over the
// field, so the stage only needs room for the field.
function Demo({ values: v, refuse }: DemoProps<V>) {
  const [ran, setRan] = React.useState<string>();
  return (
    <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:items-end">
      <DeskOmnibar
        label={v.label}
        scopes={v.OmnibarScopes}
        recent={v.recent ? RECENT : undefined}
        shortcut={v.shortcut || false}
        disabled={v.disabled}
        onOpenChange={(_, details) => {
          if (refuse && isAgentChange(details)) details.cancel();
        }}
        onRun={(_, __, details) => {
          if (refuse && isAgentChange(details)) details.cancel();
        }}
        onRan={setRan}
      />
      <p className="text-sm text-muted-foreground sm:text-right" aria-live="polite">
        {ran && `Ran ${ran}`}
      </p>
    </div>
  );
}

const ICONS: Record<string, string> = { Page: "FileText", Action: "Zap", Guest: "User", Room: "BedDouble", Booking: "Receipt" };

const str = (s: string) => JSON.stringify(s);

function itemLine(item: CommandItem, L: string[]) {
  const f = [`id: ${str(item.id)}`, `label: ${str(item.label)}`];
  if (item.description) f.push(`description: ${str(item.description)}`);
  if (item.group) f.push(`group: ${str(item.group)}`);
  f.push(`icon: <${ICONS[item.kind ?? ""]} />`);
  if (item.shortcut) f.push(`shortcut: ${str(item.shortcut)}`);
  if (item.actions) f.push(`actions: [${item.actions.map((a) => `{ id: ${str(a.id)}, label: ${str(a.label)} }`).join(", ")}]`);
  L.push(`  { ${f.join(", ")} },`);
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = ["Omnibar", "OmnibarContent", "OmnibarInput", "OmnibarList", "OmnibarTrigger"];
  if (v.OmnibarScopes) parts.push("OmnibarScopes");
  parts.sort();
  const types = v.OmnibarScopes ? ", type CommandItem, type OmnibarScope" : ", type CommandItem";
  const L: string[] = [];
  L.push(`import { BedDouble, FileText, Receipt, User, Zap } from "lucide-react"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { ${parts.join(", ")}${types} } from "@/components/ui/omnibar"`, "");
  L.push("const commands: CommandItem[] = [");
  DESK.forEach((item) => itemLine(item, L));
  L.push("]", "");
  if (v.OmnibarScopes) {
    L.push("const scopes: OmnibarScope[] = [");
    SCOPES.forEach((s) => L.push(`  { id: ${str(s.id)}, label: ${str(s.label)}${s.prefix ? `, prefix: ${str(s.prefix)}` : ""} },`));
    L.push("]", "");
  }
  L.push("export function DeskSearch() {", "  return (", "    <Omnibar", "      items={commands}");
  if (v.OmnibarScopes) L.push("      scopes={scopes}");
  if (v.recent) L.push(`      recent={${JSON.stringify(RECENT)}}`);
  L.push(`      suggested={${JSON.stringify(SUGGESTED)}}`);
  L.push(`      label=${str(v.label)}`);
  if (v.shortcut !== "/") L.push(v.shortcut ? `      shortcut=${str(v.shortcut)}` : "      shortcut={false}");
  if (v.disabled) L.push("      disabled");
  if (refuse) {
    L.push("      onOpenChange={(open, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}");
    L.push("      onRun={(item, action, details) => {", "        if (isAgentChange(details)) return details.cancel()", "        // run it", "      }}");
  } else {
    L.push("      onRun={(item, action) => {", "        // run it", "      }}");
  }
  L.push("    >", `      <OmnibarTrigger placeholder="Search guests, rooms, bookings" />`, "      <OmnibarContent>");
  L.push(`        <OmnibarInput placeholder="Search guests, rooms, bookings or type > for actions" />`);
  if (v.OmnibarScopes) L.push("        <OmnibarScopes />");
  L.push("        <OmnibarList />", "      </OmnibarContent>", "    </Omnibar>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "desk-search.tsx",
  refusable: true,
  controls: [
    { name: "label", type: "text", default: "Search the desk" },
    { name: "OmnibarScopes", type: "boolean", default: true },
    { name: "recent", type: "boolean", default: true },
    { name: "shortcut", type: "text", default: "/" },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Open", action: "open" },
    { label: "Search @tom", action: "search", args: ["@tom"] },
    { label: "Search rooms for 108", action: "search", args: ["108", "Rooms"] },
    { label: "Search late", action: "search", args: ["late"] },
    { label: "Check in Tomás", action: "select", args: ["Tomás Herrera", "Check in"] },
  ],
  Demo,
  code,
});
