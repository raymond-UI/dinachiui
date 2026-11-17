"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { HoldToConfirm, type HoldToConfirmVariant } from "@/components/ui/hold-to-confirm";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { variant: string; duration: number; resetAfter: number; confirmedLabel: string; disabled: boolean; "data-agent-confirm": string };

function Demo({ values: v, refuse }: DemoProps<V>) {
  return (
    <HoldToConfirm
      variant={v.variant as HoldToConfirmVariant}
      duration={v.duration}
      resetAfter={v.resetAfter}
      confirmedLabel={v.confirmedLabel || undefined}
      disabled={v.disabled}
      data-agent-confirm={v["data-agent-confirm"] === "none" ? "none" : undefined}
      onConfirm={(details) => {
        if (refuse && isAgentChange(details)) details.cancel();
      }}
    >
      Hold to delete
    </HoldToConfirm>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = [
    v.variant !== "fill" && `variant="${v.variant}"`,
    v.duration !== 1600 && `duration={${v.duration}}`,
    v.resetAfter !== 1600 && `resetAfter={${v.resetAfter}}`,
    v.confirmedLabel && `confirmedLabel="${v.confirmedLabel}"`,
    v.disabled && "disabled",
    v["data-agent-confirm"] === "none" && 'data-agent-confirm="none"',
  ].filter(Boolean) as string[];
  const L: string[] = [];
  L.push(`import { HoldToConfirm } from "@/components/ui/hold-to-confirm"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function DeleteProject({ onDelete }: { onDelete: () => void }) {", "  return (", "    <HoldToConfirm");
  props.forEach((p) => L.push(`      ${p}`));
  if (refuse) {
    L.push("      onConfirm={(details) => {", "        if (isAgentChange(details)) return details.cancel()", "        onDelete()", "      }}");
  } else {
    L.push("      onConfirm={onDelete}");
  }
  L.push("    >", "      Hold to delete", "    </HoldToConfirm>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "delete-project.tsx",
  refusable: true,
  controls: [
    { name: "variant", type: "select", options: ["fill", "ring", "border"], default: "fill" },
    { name: "duration", type: "number", default: 1600, min: 200, max: 5000, step: 200 },
    { name: "resetAfter", type: "number", default: 1600, min: 0, max: 5000, step: 200 },
    { name: "confirmedLabel", type: "text", default: "Deleted" },
    { name: "disabled", type: "boolean", default: false },
    { name: "data-agent-confirm", type: "select", options: ["default", "none"], default: "default" },
  ],
  tries: [{ label: "Press", action: "press" }],
  Demo,
  code,
});
