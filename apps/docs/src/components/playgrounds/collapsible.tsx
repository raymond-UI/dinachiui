"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { isAgentChange } from "@/components/ui/agent";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/ui/collapsible";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { CollapsibleTrigger: string; disabled: boolean };

const BODY =
  "This is the collapsible content. It can contain any elements you need, including text, images, or other components.";

function Demo({ values: v, anatomy, refuse }: DemoProps<V>) {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible
      className="w-full max-w-sm"
      disabled={v.disabled}
      open={anatomy || open}
      onOpenChange={(next, details) => {
        if (refuse && isAgentChange(details)) return details.cancel();
        if (!anatomy) setOpen(next);
      }}
    >
      <CollapsibleTrigger>
        <span>{v.CollapsibleTrigger}</span>
        <ChevronDown className="h-4 w-4 transition-transform" />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="px-4 pb-4 text-sm text-muted-foreground">{BODY}</div>
      </CollapsiblePanel>
    </Collapsible>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const L = [`import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/ui/collapsible"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { ChevronDown } from "lucide-react"`, "", "export function MoreDetails() {", "  return (");
  const props = ['className="w-full max-w-sm"'];
  if (v.disabled) props.push("disabled");
  if (refuse) {
    L.push("    <Collapsible");
    props.forEach((p) => L.push(`      ${p}`));
    L.push("      onOpenChange={(open, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <Collapsible ${props.join(" ")}>`);
  }
  L.push(
    "      <CollapsibleTrigger>",
    `        <span>${v.CollapsibleTrigger}</span>`,
    '        <ChevronDown className="h-4 w-4 transition-transform" />',
    "      </CollapsibleTrigger>",
    "      <CollapsiblePanel>",
    '        <div className="px-4 pb-4 text-sm text-muted-foreground">',
    "          This is the collapsible content. It can contain any elements you need,",
    "          including text, images, or other components.",
    "        </div>",
    "      </CollapsiblePanel>",
    "    </Collapsible>",
    "  )",
    "}",
  );
  return L.join("\n");
}

export default playground<V>({
  file: "more-details.tsx",
  refusable: true,
  controls: [
    { name: "CollapsibleTrigger", type: "text", default: "View more details" },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Open", action: "open", target: "View more details" },
    { label: "Close", action: "close", target: "View more details" },
  ],
  Demo,
  code,
});
