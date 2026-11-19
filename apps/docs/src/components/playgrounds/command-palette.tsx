"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import type { CommandItem } from "@/components/ui/command-palette";
import { HOTEL, HotelPalette, ORDERS, RECENT, SUGGESTED } from "@/components/examples/command-palette-examples";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  label: string;
  recent: boolean;
  CommandPalettePreview: boolean;
  disabled: boolean;
};

// Stays closed in Anatomy: open, it would cover the page and trap focus. The site's own
// search holds Cmd+K, so the stage opens from the button.
function Demo({ values: v, refuse }: DemoProps<V>) {
  const [ran, setRan] = React.useState<string>();
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <HotelPalette
        label={v.label}
        recent={v.recent ? RECENT : undefined}
        preview={v.CommandPalettePreview}
        disabled={v.disabled}
        shortcut={false}
        onOpenChange={(_, details) => {
          if (refuse && isAgentChange(details)) details.cancel();
        }}
        onRun={(_, __, details) => {
          if (refuse && isAgentChange(details)) details.cancel();
        }}
        onRan={setRan}
      />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {ran && `Ran ${ran}`}
      </p>
    </div>
  );
}

const ICONS: Record<string, string> = { Page: "FileText", Action: "Zap", Order: "Receipt", Guest: "User", Room: "BedDouble" };

const str = (s: string) => JSON.stringify(s);

function itemLine(item: CommandItem, pad: string, L: string[]) {
  const f = [`id: ${str(item.id)}`, `label: ${str(item.label)}`];
  if (item.description) f.push(`description: ${str(item.description)}`);
  if (item.group) f.push(`group: ${str(item.group)}`);
  if (item.kind) f.push(`kind: ${str(item.kind)}`);
  f.push(`icon: <${ICONS[item.kind ?? ""] ?? "Building2"} />`);
  if (item.shortcut) f.push(`shortcut: ${str(item.shortcut)}`);
  if (item.meta) f.push(`meta: ${str(String(item.meta))}`);
  if (item.actions) f.push(`actions: [${item.actions.map((a) => `{ id: ${str(a.id)}, label: ${str(a.label)} }`).join(", ")}]`);
  if (item.items) {
    L.push(`${pad}{ ${f.join(", ")}, items: [`);
    item.items.forEach((child) => itemLine(child, pad + "  ", L));
    L.push(`${pad}] },`);
  } else {
    L.push(`${pad}{ ${f.join(", ")} },`);
  }
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = ["CommandPalette", "CommandPaletteBody", "CommandPaletteContent", "CommandPaletteInput", "CommandPaletteList", "CommandPaletteTrigger"];
  if (v.CommandPalettePreview) parts.push("CommandPalettePreview");
  parts.sort();
  const L: string[] = [];
  if (v.CommandPalettePreview) L.push(`import { Fragment } from "react"`);
  L.push(`import { BedDouble, Building2, FileText, Receipt, User, Zap } from "lucide-react"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { ${parts.join(", ")}, type CommandItem } from "@/components/ui/command-palette"`, "");
  L.push("const commands: CommandItem[] = [");
  HOTEL.forEach((item) => itemLine(item, "  ", L));
  L.push("]", "");
  if (v.CommandPalettePreview) {
    L.push("// Your own fields for a record. The palette lays out its name and actions.");
    L.push("const fields: Record<string, [string, string][]> = {");
    for (const [id, rows] of Object.entries(ORDERS)) L.push(`  ${str(id)}: ${JSON.stringify(rows).replace(/,/g, ", ")},`);
    L.push("}", "");
    L.push("function Fields(item: CommandItem) {", "  const rows = fields[item.id]", "  if (!rows) {");
    L.push('    return <p className="text-[15px] text-muted-foreground sm:text-[12.5px]">{item.description ?? `Go to ${item.label}.`}</p>');
    L.push("  }", "  return (");
    L.push('    <dl className="grid grid-cols-[90px_1fr] gap-x-2 gap-y-2 text-[15px] sm:grid-cols-[80px_1fr] sm:gap-y-1.5 sm:text-[12.5px]">');
    L.push('      {[["Amount", String(item.meta)], ...rows].map(([term, value]) => (');
    L.push("        <Fragment key={term}>", '          <dt className="text-muted-foreground">{term}</dt>', '          <dd className="tabular-nums">{value}</dd>', "        </Fragment>");
    L.push("      ))}", "    </dl>", "  )", "}", "");
  }
  L.push("export function Search() {", "  return (", "    <CommandPalette");
  L.push("      items={commands}");
  if (v.recent) L.push(`      recent={${JSON.stringify(RECENT)}}`);
  L.push(`      suggested={${JSON.stringify(SUGGESTED)}}`);
  L.push(`      label=${str(v.label)}`);
  if (v.disabled) L.push("      disabled");
  if (refuse) {
    L.push("      onOpenChange={(open, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}");
    L.push("      onRun={(item, action, details) => {", "        if (isAgentChange(details)) return details.cancel()", "        // run it", "      }}");
  } else {
    L.push("      onRun={(item, action) => {", "        // run it", "      }}");
  }
  L.push("    >", "      <CommandPaletteTrigger />", "      <CommandPaletteContent>");
  L.push(`        <CommandPaletteInput placeholder="Search pages, actions, orders, guests, rooms" />`);
  L.push("        <CommandPaletteBody>", "          <CommandPaletteList />");
  if (v.CommandPalettePreview) {
    L.push(`          <CommandPalettePreview placeholder="Type to search pages, actions, orders, guests and rooms.">`);
    L.push("            {Fields}", "          </CommandPalettePreview>");
  }
  L.push("        </CommandPaletteBody>", "      </CommandPaletteContent>", "    </CommandPalette>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "search.tsx",
  refusable: true,
  controls: [
    { name: "label", type: "text", default: "Search Saltmarsh" },
    { name: "recent", type: "boolean", default: true },
    { name: "CommandPalettePreview", type: "boolean", default: true },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Open", action: "open" },
    { label: "Search refund", action: "search", args: ["refund"] },
    { label: "Refund #4821", action: "select", args: ["Order #4821", "Refund"] },
    { label: "Switch property", action: "select", args: ["Switch property"] },
    { label: "Run Mars", action: "select", args: ["Mars"] },
  ],
  Demo,
  code,
});
