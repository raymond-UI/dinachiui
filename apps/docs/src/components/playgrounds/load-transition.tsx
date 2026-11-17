"use client";

import * as React from "react";
import { Check, Rocket } from "lucide-react";
import { LoadTransition } from "@/components/ui/load-transition";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { loading: boolean; delay: number; minimum: number; radius: number };

const STATS = [
  { value: "14", label: "files" },
  { value: "41s", label: "build" },
  { value: "3", label: "packages" },
];

function DeploySkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="space-y-1.5">
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="h-12 animate-pulse rounded-lg bg-muted" />
        <div className="h-12 animate-pulse rounded-lg bg-muted" />
        <div className="h-12 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}

function DeployCard() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Rocket className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">main &rarr; production</p>
          <p className="truncate text-xs text-muted-foreground">41 seconds ago</p>
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          Passed
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-muted/60 px-3 py-2">
            <p className="text-lg font-semibold leading-tight tabular-nums text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        All 6 checks passed
      </div>
    </div>
  );
}

function Demo({ values: v }: DemoProps<V>) {
  return (
    <div className="w-full max-w-md">
      <LoadTransition
        loading={v.loading}
        delay={v.delay}
        minimum={v.minimum}
        radius={v.radius}
        skeleton={<DeploySkeleton />}
      >
        <DeployCard />
      </LoadTransition>
    </div>
  );
}

function code(v: V): string {
  const props = [
    "loading={loading}",
    v.delay !== 180 && `delay={${v.delay}}`,
    v.minimum !== 420 && `minimum={${v.minimum}}`,
    v.radius !== 12 && `radius={${v.radius}}`,
    "skeleton={<DeploySkeleton />}",
  ].filter(Boolean) as string[];
  const L: string[] = [];
  L.push(`import { LoadTransition } from "@/components/ui/load-transition"`, "");
  L.push("function DeploySkeleton() {", "  return (", '    <div className="space-y-3">');
  L.push('      <div className="h-9 w-48 animate-pulse rounded bg-muted" />');
  L.push('      <div className="h-12 animate-pulse rounded-lg bg-muted" />', "    </div>", "  )", "}", "");
  L.push("export function DeployStatus({ loading }: { loading: boolean }) {", "  return (", "    <LoadTransition");
  props.forEach((p) => L.push(`      ${p}`));
  L.push("    >", '      <div className="space-y-3">', '        <p className="text-sm font-medium">main → production</p>');
  L.push('        <p className="text-xs text-muted-foreground">All 6 checks passed</p>', "      </div>");
  L.push("    </LoadTransition>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "deploy-status.tsx",
  controls: [
    { name: "loading", type: "boolean", default: true },
    { name: "delay", type: "number", default: 180, min: 0, max: 2000, step: 60 },
    { name: "minimum", type: "number", default: 420, min: 0, max: 3000, step: 60 },
    { name: "radius", type: "number", default: 12, min: 0, max: 32 },
  ],
  Demo,
  code,
});
