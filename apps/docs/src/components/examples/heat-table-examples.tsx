"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { HeatTable, type HeatCell, type HeatRow } from "@/components/ui/heat-table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface Cohort extends HeatRow {
  size: number;
}

const cohort = (label: string, size: number, values: number[]): Cohort => ({
  label,
  size,
  meta: size.toLocaleString("en-GB"),
  values,
});

export const COHORTS: Cohort[] = [
  cohort("14 Sep", 1334, [52, 45, 37, 36, 27, 26, 23, 18, 16]),
  cohort("21 Sep", 1370, [56, 48, 43, 35, 29, 24, 25, 19]),
  cohort("28 Sep", 1188, [52, 44, 42, 36, 28, 25, 22]),
  cohort("5 Oct", 1241, [56, 47, 43, 33, 34, 28]),
  cohort("12 Oct", 1256, [56, 49, 42, 38, 30]),
  cohort("19 Oct", 1392, [54, 51, 41, 35]),
  cohort("26 Oct", 1205, [59, 50, 41]),
  cohort("2 Nov", 1034, [57, 52]),
  cohort("9 Nov", 929, [61]),
];

export const WEEKS = Array.from({ length: 9 }, (_, w) => `W${w + 1}`);
export const PHONE_WEEKS = Array.from({ length: 9 }, (_, w) => String(w + 1));

/** Each week's share across the cohorts that have reached it, weighted by cohort size. */
export function averages(cohorts: Cohort[]) {
  return WEEKS.map((_, w) => {
    const reached = cohorts.filter((c) => c.values[w] != null);
    const size = reached.reduce((sum, c) => sum + c.size, 0);
    return Math.round(reached.reduce((sum, c) => sum + (c.values[w] as number) * c.size, 0) / size);
  });
}

const people = (c: HeatCell<Cohort>) => Math.round((c.row.size * c.value) / 100);
const n = (v: number) => v.toLocaleString("en-GB");

export type CohortValues = "percent" | "people";

export function CohortHeatTable({
  values = "percent",
  footer = true,
  cohorts = COHORTS,
  min,
  className,
}: {
  values?: CohortValues;
  footer?: boolean;
  cohorts?: Cohort[];
  min?: number;
  className?: string;
}) {
  const first = cohorts[0].values[0] ?? 0;
  const last = cohorts[cohorts.length - 1].values[0] ?? 0;
  return (
    <div
      className={cn(
        "w-full max-w-[720px] rounded-xl border bg-card px-5 pb-4 pt-5 text-card-foreground shadow-sm max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none",
        className
      )}
    >
      <div className="mx-1 mb-4 flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
        <h3 className="text-xl font-semibold tracking-[-0.015em]">Week 1 return {last >= first ? "rose" : "fell"} from {first}% to {last}%</h3>
        <p className="text-sm text-muted-foreground">Weekly cohorts since 14 Sep</p>
      </div>
      <HeatTable
        aria-label="Weekly return by cohort"
        columns={WEEKS}
        phoneColumns={PHONE_WEEKS}
        rows={cohorts}
        rowHeader="Cohort"
        min={min}
        defaultCell={{ row: Math.min(2, cohorts.length - 1), column: 0 }}
        format={(v, c) => (values === "people" ? n(people(c)) : `${v}%`)}
        label={(c) => `${c.row.label} cohort, week ${c.columnIndex + 1}: ${c.value}%, ${n(people(c))} people`}
        footer={footer ? { label: "Average", values: averages(cohorts).map((v) => `${v}%`) } : undefined}
        readout={(c) => (
          <>
            <div className="text-[30px] font-semibold tabular-nums tracking-[-0.02em]">{c.value}%</div>
            <div className="mt-0.5 text-[15px]">
              {n(people(c))} of {n(c.row.size)} came back in week {c.columnIndex + 1}
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">Joined the week of {c.row.label}</div>
          </>
        )}
      />
    </div>
  );
}

export function DefaultHeatTableExample() {
  return <CohortHeatTable />;
}

export function PeopleHeatTableExample() {
  const [values, setValues] = useState<CohortValues>("percent");
  return (
    <div className="grid w-full max-w-[720px] gap-3">
      <ToggleGroup
        aria-label="Values"
        value={[values]}
        onValueChange={(next) => next[0] && setValues(next[0] as CohortValues)}
        className="justify-self-start"
      >
        <ToggleGroupItem value="percent">Percent</ToggleGroupItem>
        <ToggleGroupItem value="people">People</ToggleGroupItem>
      </ToggleGroup>
      <CohortHeatTable values={values} />
    </div>
  );
}
