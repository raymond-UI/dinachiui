"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Archive, Trash2 } from "lucide-react";
import { isAgentChange } from "@/components/ui/agent";
import { Button } from "@/components/ui/button";
import { SwipeableRow, SwipeableRowGroup, type SwipeableRowChangeDetails } from "@/components/ui/swipeable-row";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const ROWS = [
  { id: "1", title: "Weekly digest", detail: "product@dinachi.dev · 09:04" },
  { id: "2", title: "Your invoice is ready", detail: "billing · yesterday" },
  { id: "3", title: "Re: motion tier scope", detail: "sam · Tuesday" },
];

type V = { onDismiss: boolean; dismissAt: number; actionWidth: number };

function Demo({ values: v, refuse }: DemoProps<V>) {
  const [rows, setRows] = React.useState(ROWS);
  const remove = (id: string) => (details: SwipeableRowChangeDetails) => {
    if (refuse && isAgentChange(details)) return details.cancel();
    setRows((c) => c.filter((r) => r.id !== id));
  };

  return (
    <div className="w-full max-w-sm">
      <SwipeableRowGroup>
        <ul className="list-none space-y-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {rows.map((row) => (
              <motion.li
                key={row.id}
                layout
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              >
                <SwipeableRow
                  actions={[
                    { label: `Archive ${row.title}`, icon: <Archive className="h-4 w-4" />, onSelect: remove(row.id) },
                    { label: `Delete ${row.title}`, icon: <Trash2 className="h-4 w-4" />, onSelect: remove(row.id), destructive: true },
                  ]}
                  onDismiss={v.onDismiss ? remove(row.id) : undefined}
                  dismissAt={v.dismissAt}
                  actionWidth={v.actionWidth}
                >
                  <p className="truncate text-sm font-medium text-foreground">{row.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{row.detail}</p>
                </SwipeableRow>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </SwipeableRowGroup>
      <div className="mt-3 flex justify-center">
        <Button variant="ghost" size="sm" disabled={rows.length === ROWS.length} onClick={() => setRows(ROWS)}>
          Bring them back
        </Button>
      </div>
    </div>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const L: string[] = [];
  L.push(`import { useState } from "react"`, `import { Archive, Trash2 } from "lucide-react"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { SwipeableRow, SwipeableRowGroup${refuse ? ", type SwipeableRowChangeDetails" : ""} } from "@/components/ui/swipeable-row"`, "");
  L.push("const inbox = [");
  for (const r of ROWS) L.push(`  { id: "${r.id}", title: "${r.title}", detail: "${r.detail}" },`);
  L.push("]", "", "export function Inbox() {", "  const [rows, setRows] = useState(inbox)");
  if (refuse) {
    L.push("  const remove = (id: string) => (details: SwipeableRowChangeDetails) => {");
    L.push("    if (isAgentChange(details)) return details.cancel()");
  } else {
    L.push("  const remove = (id: string) => () => {");
  }
  L.push("    setRows((rows) => rows.filter((r) => r.id !== id))", "  }", "", "  return (", "    <SwipeableRowGroup>");
  L.push(`      <ul className="space-y-2">`, "        {rows.map((row) => (", "          <li key={row.id}>", "            <SwipeableRow");
  L.push("              actions={[");
  L.push("                { label: `Archive ${row.title}`, icon: <Archive className=\"h-4 w-4\" />, onSelect: remove(row.id) },");
  L.push("                { label: `Delete ${row.title}`, icon: <Trash2 className=\"h-4 w-4\" />, onSelect: remove(row.id), destructive: true },");
  L.push("              ]}");
  if (v.onDismiss) L.push("              onDismiss={remove(row.id)}");
  if (v.onDismiss && v.dismissAt !== 0.5) L.push(`              dismissAt={${v.dismissAt}}`);
  if (v.actionWidth !== 68) L.push(`              actionWidth={${v.actionWidth}}`);
  L.push("            >");
  L.push(`              <p className="text-sm font-medium">{row.title}</p>`);
  L.push(`              <p className="text-xs text-muted-foreground">{row.detail}</p>`);
  L.push("            </SwipeableRow>", "          </li>", "        ))}", "      </ul>", "    </SwipeableRowGroup>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "inbox.tsx",
  refusable: true,
  controls: [
    { name: "onDismiss", type: "boolean", default: true },
    { name: "dismissAt", type: "number", default: 0.5, min: 0.2, max: 0.9, step: 0.1 },
    { name: "actionWidth", type: "number", default: 68, min: 44, max: 120, step: 4 },
  ],
  tries: [
    { label: "Archive Weekly digest", action: "press", target: "Archive Weekly digest" },
    { label: "Dismiss the top row", action: "dismiss" },
    { label: "Delete Re: motion tier scope", action: "press", target: "Delete Re: motion tier scope" },
  ],
  Demo,
  code,
});
