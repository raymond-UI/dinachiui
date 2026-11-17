"use client";

import * as React from "react";
import { X } from "lucide-react";
import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list";
import { Button } from "@/components/ui/button";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { from: string; duration: number; dismissed: boolean };
interface Row { id: string; title: string; detail: string; tone: "info" | "warn" | "ok" }

const TONE: Record<Row["tone"], string> = { info: "bg-primary", warn: "bg-amber-500", ok: "bg-emerald-500" };
const SEED: Row[] = [
  { id: "a", title: "Deploy finished", detail: "web · 2m 14s", tone: "ok" },
  { id: "b", title: "Rate limit at 80%", detail: "api · us-east-1", tone: "warn" },
  { id: "c", title: "3 new sign-ups", detail: "since 09:00", tone: "info" },
];
const POOL: Omit<Row, "id">[] = [
  { title: "Build queued", detail: "docs · main", tone: "info" },
  { title: "Certificate renewed", detail: "expires in 90d", tone: "ok" },
  { title: "Slow query detected", detail: "1.8s · orders", tone: "warn" },
  { title: "Invite accepted", detail: "sam@acme.co", tone: "ok" },
];

function Demo({ values: v }: DemoProps<V>) {
  const [rows, setRows] = React.useState(SEED);
  const [dismissed, setDismissed] = React.useState<string | null>(null);
  const next = React.useRef(0);
  const bottom = v.from === "bottom";

  const add = () => {
    const row = { ...POOL[next.current % POOL.length], id: `n${++next.current}` };
    // Four at most: the oldest leaves at the far end, which is the other exit.
    setRows((c) => (bottom ? [...c, row].slice(-4) : [row, ...c].slice(0, 4)));
  };
  const dismiss = (id: string) => {
    if (v.dismissed) setDismissed(id);
    setRows((c) => c.filter((r) => r.id !== id));
  };
  const reset = () => {
    setDismissed(null);
    setRows(SEED);
    next.current = 0;
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-3 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={add}>
          {bottom ? "Append" : "Add to top"}
        </Button>
        <Button variant="outline" size="sm" onClick={reset}>
          Reset
        </Button>
      </div>
      <AnimatedList
        from={v.from as "top" | "bottom"}
        duration={v.duration}
        dismissed={v.dismissed ? dismissed : null}
        className="space-y-2"
      >
        {rows.map((row) => (
          <AnimatedListItem key={row.id} itemKey={row.id}>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
              <span className={`h-2 w-2 shrink-0 rounded-full ${TONE[row.tone]}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{row.title}</p>
                <p className="truncate text-xs text-muted-foreground">{row.detail}</p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(row.id)}
                aria-label={`Dismiss ${row.title}`}
                className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </AnimatedListItem>
        ))}
      </AnimatedList>
      {rows.length === 0 && <p className="py-4 text-center text-xs text-muted-foreground">Nothing left.</p>}
    </div>
  );
}

function code(v: V): string {
  const L: string[] = [];
  if (v.dismissed) L.push(`import { useState } from "react"`);
  L.push(`import { X } from "lucide-react"`);
  L.push(`import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list"`, "");
  L.push("type Row = { id: string; title: string; detail: string }", "");
  L.push(`// Rows arrive from the ${v.from}, so ${v.from === "bottom" ? "append" : "prepend"} new ones to \`rows\`.`);
  L.push("export function ActivityFeed({ rows, onDismiss }: { rows: Row[]; onDismiss: (id: string) => void }) {");
  if (v.dismissed) L.push("  const [dismissed, setDismissed] = useState<string | null>(null)", "");
  const props = [
    v.from === "bottom" && 'from="bottom"',
    v.duration !== 0.3 && `duration={${v.duration}}`,
    v.dismissed && "dismissed={dismissed}",
    'className="space-y-2"',
  ].filter(Boolean);
  const close = v.dismissed ? "{() => {\n                setDismissed(row.id)\n                onDismiss(row.id)\n              }}" : "{() => onDismiss(row.id)}";
  L.push("  return (", `    <AnimatedList ${props.join(" ")}>`);
  L.push("      {rows.map((row) => (", `        <AnimatedListItem key={row.id}${v.dismissed ? " itemKey={row.id}" : ""}>`);
  L.push('          <div className="flex items-center gap-3 rounded-xl border px-4 py-3">');
  L.push('            <div className="min-w-0 flex-1">', '              <p className="text-sm font-medium">{row.title}</p>');
  L.push('              <p className="text-xs text-muted-foreground">{row.detail}</p>', "            </div>");
  L.push("            <button", '              type="button"', "              aria-label={`Dismiss ${row.title}`}", `              onClick=${close}`, "            >");
  L.push('              <X className="h-4 w-4" />', "            </button>", "          </div>");
  L.push("        </AnimatedListItem>", "      ))}", "    </AnimatedList>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "activity-feed.tsx",
  controls: [
    { name: "from", type: "select", options: ["top", "bottom"], default: "top" },
    { name: "duration", type: "number", default: 0.3, min: 0.1, max: 1.5, step: 0.1 },
    { name: "dismissed", type: "boolean", default: true },
  ],
  Demo,
  code,
});
