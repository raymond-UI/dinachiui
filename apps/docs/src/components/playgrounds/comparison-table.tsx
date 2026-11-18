"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { ComparisonTable, type ComparisonBilling, type ComparisonChangeDetails } from "@/components/ui/comparison-table";
import { GROUPS, PLANS } from "@/components/examples/comparison-table-examples";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  highlighted: string;
  note: string;
  disabled: boolean;
};

const plansFor = (highlighted: string) => PLANS.map((p) => ({ ...p, highlighted: p.name === highlighted }));

function Demo({ values: v, refuse }: DemoProps<V>) {
  const [billing, setBilling] = React.useState<ComparisonBilling>("monthly");
  const [only, setOnly] = React.useState(false);
  const guard =
    <T,>(set: (next: T) => void) =>
    (next: T, details: ComparisonChangeDetails) => {
      if (refuse && isAgentChange(details)) return details.cancel();
      set(next);
    };
  return (
    <ComparisonTable
      plans={plansFor(v.highlighted)}
      groups={GROUPS}
      note={v.note || undefined}
      billing={billing}
      onBillingChange={guard(setBilling)}
      onlyDifferences={only}
      onOnlyDifferencesChange={guard(setOnly)}
      disabled={v.disabled}
      maxHeight={290}
      className="max-w-[820px] shadow-sm"
    />
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const L = [`import { useState } from "react"`, `import { ComparisonTable, type ComparisonBilling } from "@/components/ui/comparison-table"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { plans, groups } from "./plans"`, "");
  L.push("export function Pricing() {", `  const [billing, setBilling] = useState<ComparisonBilling>("monthly")`, "  const [only, setOnly] = useState(false)", "  return (", "    <ComparisonTable");
  L.push(
    v.highlighted === "none"
      ? "      plans={plans}"
      : `      plans={plans.map((p) => ({ ...p, highlighted: p.name === "${v.highlighted}" }))}`
  );
  L.push("      groups={groups}");
  if (v.note) L.push(`      note="${v.note}"`);
  if (refuse) {
    L.push(
      "      billing={billing}",
      "      onBillingChange={(next, details) => {",
      "        if (isAgentChange(details)) return details.cancel()",
      "        setBilling(next)",
      "      }}",
      "      onlyDifferences={only}",
      "      onOnlyDifferencesChange={(next, details) => {",
      "        if (isAgentChange(details)) return details.cancel()",
      "        setOnly(next)",
      "      }}"
    );
  } else {
    L.push("      billing={billing}", "      onBillingChange={setBilling}", "      onlyDifferences={only}", "      onOnlyDifferencesChange={setOnly}");
  }
  if (v.disabled) L.push("      disabled");
  L.push("      maxHeight={290}", "    />", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "pricing.tsx",
  refusable: true,
  tall: true,
  controls: [
    { name: "highlighted", type: "select", options: ["Team", "Business", "none"], default: "Team" },
    { name: "note", type: "text", default: "Prices per seat, ex. VAT" },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Yearly", action: "setValue", args: ["Yearly"], target: "Billing" },
    { label: "Only differences", action: "setChecked", args: [true], target: "Only differences" },
    { label: "Weekly", action: "setValue", args: ["Weekly"], target: "Billing" },
  ],
  Demo,
  code,
});
