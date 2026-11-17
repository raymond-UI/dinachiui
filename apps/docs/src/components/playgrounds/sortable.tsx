"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { Sortable, SortableHandle, SortableItem } from "@/components/ui/sortable";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const PAGES: Record<string, { title: string; path: string }> = {
  overview: { title: "Overview", path: "/docs" },
  install: { title: "Installation", path: "/docs/installation" },
  components: { title: "Components", path: "/docs/components" },
  cli: { title: "CLI", path: "/docs/cli" },
};
const INITIAL = ["overview", "install", "components", "cli"];

type V = { "aria-label": string; disabled: boolean };

function Demo({ values: v, refuse }: DemoProps<V>) {
  const [order, setOrder] = React.useState(INITIAL);
  return (
    <div className="w-full max-w-sm">
      <Sortable
        aria-label={v["aria-label"] || undefined}
        value={order}
        disabled={v.disabled}
        onValueChange={(next, details) => {
          if (refuse && isAgentChange(details)) return details.cancel();
          setOrder(next);
        }}
      >
        {order.map((id) => (
          <SortableItem key={id} id={id} label={PAGES[id].title}>
            <SortableHandle />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{PAGES[id].title}</p>
              <p className="truncate text-xs text-muted-foreground">{PAGES[id].path}</p>
            </div>
          </SortableItem>
        ))}
      </Sortable>
    </div>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const L: string[] = [];
  L.push(`import { useState } from "react"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { Sortable, SortableHandle, SortableItem } from "@/components/ui/sortable"`, "");
  L.push("const pages: Record<string, { title: string; path: string }> = {");
  for (const [id, p] of Object.entries(PAGES)) L.push(`  ${id}: { title: "${p.title}", path: "${p.path}" },`);
  L.push("}", "", "export function PageOrder() {");
  L.push(`  const [order, setOrder] = useState(${JSON.stringify(INITIAL).replace(/,/g, ", ")})`, "", "  return (");
  const props: string[] = [];
  if (v["aria-label"]) props.push(v["aria-label"].includes('"') ? `aria-label={${JSON.stringify(v["aria-label"])}}` : `aria-label="${v["aria-label"]}"`);
  props.push("value={order}");
  if (v.disabled) props.push("disabled");
  if (refuse) {
    L.push("    <Sortable");
    props.forEach((p) => L.push(`      ${p}`));
    L.push("      onValueChange={(next, details) => {", "        if (isAgentChange(details)) return details.cancel()", "        setOrder(next)", "      }}", "    >");
  } else {
    L.push(`    <Sortable ${props.join(" ")} onValueChange={setOrder}>`);
  }
  L.push(
    "      {order.map((id) => (",
    "        <SortableItem key={id} id={id} label={pages[id].title}>",
    "          <SortableHandle />",
    `          <div className="min-w-0 flex-1">`,
    `            <p className="text-sm font-medium">{pages[id].title}</p>`,
    `            <p className="text-xs text-muted-foreground">{pages[id].path}</p>`,
    "          </div>",
    "        </SortableItem>",
    "      ))}",
    "    </Sortable>",
    "  )",
    "}",
  );
  return L.join("\n");
}

export default playground<V>({
  file: "page-order.tsx",
  refusable: true,
  controls: [
    { name: "aria-label", type: "text", default: "Pages" },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Move CLI to 1", action: "move", args: ["CLI", 1] },
    { label: "Move Overview to 1", action: "move", args: ["Overview", 1] },
    { label: "Move Blog to 1", action: "move", args: ["Blog", 1] },
  ],
  Demo,
  code,
});
