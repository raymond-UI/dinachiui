"use client";

import { COHORTS, CohortHeatTable, type CohortValues } from "@/components/examples/heat-table-examples";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  format: string;
  min: string;
  footer: boolean;
};

// Nine cohorts are taller than the stage, so it shows the first five.
const FIRST_FIVE = COHORTS.slice(0, 5);

function Demo({ values: v }: DemoProps<V>) {
  return (
    <CohortHeatTable
      values={v.format as CohortValues}
      min={v.min === "0" ? 0 : undefined}
      footer={v.footer}
      cohorts={FIRST_FIVE}
      className="px-1.5"
    />
  );
}

function code(v: V): string {
  const people = v.format === "people";
  const L = [`import { HeatTable } from "@/components/ui/heat-table"`, `import { cohorts, weeks, averages } from "./cohorts"`, ""];
  if (people) L.push("const people = (c) => Math.round((c.row.size * c.value) / 100)", "");
  L.push(
    "export function Retention() {",
    "  return (",
    "    <HeatTable",
    `      aria-label="Weekly return by cohort"`,
    "      columns={weeks}",
    "      phoneColumns={weeks.map((_, w) => String(w + 1))}",
    "      rows={cohorts}",
    `      rowHeader="Cohort"`,
    people ? `      format={(_, c) => people(c).toLocaleString("en-GB")}` : "      format={(v) => `${v}%`}",
    "      label={(c) => `${c.row.label} cohort, week ${c.columnIndex + 1}: ${c.value}%`}"
  );
  if (v.min === "0") L.push("      min={0}");
  if (v.footer) L.push('      footer={{ label: "Average", values: averages(cohorts).map((v) => `${v}%`) }}');
  L.push("    />", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "retention.tsx",
  tall: true,
  controls: [
    { name: "format", type: "select", options: ["percent", "people"], default: "percent" },
    { name: "min", type: "select", options: ["lowest", "0"], default: "lowest" },
    { name: "footer", type: "boolean", default: true },
  ],
  Demo,
  code,
});
