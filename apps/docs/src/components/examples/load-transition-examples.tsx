"use client";

import * as React from "react";
import { Check, Rocket } from "lucide-react";
import { LoadTransition, useSkeletonVisibility } from "@/components/ui/load-transition";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

/** Mirrors the shape of the card, not its height. The gap between the two is the point. */
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

const STATS = [
  { value: "14", label: "files" },
  { value: "41s", label: "build" },
  { value: "3", label: "packages" },
];

function DeployCard() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Rocket className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            main &rarr; production
          </p>
          <p className="truncate text-xs text-muted-foreground">41 seconds ago</p>
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          Passed
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-muted/60 px-3 py-2">
            <p className="text-lg font-semibold leading-tight tabular-nums text-foreground">
              {stat.value}
            </p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* The row the skeleton has no counterpart for. Content taller than its placeholder
          is the ordinary case, and the jump it causes is what the component absorbs. */}
      <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        All 6 checks passed
      </div>
    </div>
  );
}

export function DefaultLoadTransitionExample() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-md space-y-3">
      <PreviewAction>
        <Button variant="outline" size="sm" onClick={() => setLoading((v) => !v)}>
          {loading ? "Finish loading" : "Back to skeleton"}
        </Button>
      </PreviewAction>

      <LoadTransition loading={loading} skeleton={<DeploySkeleton />}>
        <DeployCard />
      </LoadTransition>

      {/* Something below the panel, so the resize has a visible consequence rather than
          only a measurable one. */}
      <div className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
        Everything below rides the resize
      </div>
    </div>
  );
}

/**
 * One panel, one request duration.
 *
 * It reports whether a skeleton appeared, because on the fast path the answer is no and a
 * demo that shows nothing is indistinguishable from a demo that is broken.
 */
function ThresholdCase({
  label,
  ms,
  run,
}: {
  label: string;
  ms: number;
  run: number;
}) {
  const [loading, setLoading] = React.useState(false);
  const skeleton = useSkeletonVisibility(loading);
  const [appeared, setAppeared] = React.useState(false);

  React.useEffect(() => {
    if (run === 0) return;
    setAppeared(false);
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(timer);
  }, [run, ms]);

  React.useEffect(() => {
    if (skeleton) setAppeared(true);
  }, [skeleton]);

  const verdict = loading
    ? { text: "loading", tone: "bg-muted text-muted-foreground" }
    : run === 0
      ? { text: "idle", tone: "bg-muted text-muted-foreground" }
      : appeared
        ? { text: "skeleton shown", tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400" }
        : { text: "no skeleton", tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" };

  return (
    <div className="min-w-0 flex-1 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${verdict.tone}`}>
          {verdict.text}
        </span>
      </div>

      <LoadTransition
        loading={loading}
        skeleton={
          <div className="space-y-2">
            <div className="h-7 w-24 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
          </div>
        }
      >
        <div>
          <p className="text-2xl font-semibold leading-tight tabular-nums text-foreground">
            {(1284 + run * 37).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">requests / min</p>
        </div>
      </LoadTransition>
    </div>
  );
}

export function LoadTransitionThresholdsExample() {
  const [run, setRun] = React.useState(0);

  return (
    <div className="w-full max-w-md">
      <PreviewAction>
        <Button variant="outline" size="sm" onClick={() => setRun((v) => v + 1)}>
          Refetch both
        </Button>
      </PreviewAction>

      {/* Side by side and driven by one button, so the two paths are compared rather than
          remembered. */}
      <div className="flex gap-3">
        <ThresholdCase label="120ms" ms={120} run={run} />
        <ThresholdCase label="1200ms" ms={1200} run={run} />
      </div>
    </div>
  );
}

export function LoadTransitionBareExample() {
  const [loading, setLoading] = React.useState(true);

  return (
    <div className="w-full max-w-md space-y-3">
      <PreviewAction>
        <Button variant="outline" size="sm" onClick={() => setLoading((v) => !v)}>
          {loading ? "Finish loading" : "Back to skeleton"}
        </Button>
      </PreviewAction>

      <LoadTransition
        loading={loading}
        skeleton={<div className="h-6 w-28 animate-pulse rounded bg-muted" />}
        className="border-0 bg-transparent p-0"
        radius={0}
      >
        <p className="text-xl font-semibold tabular-nums text-foreground">94 deploys</p>
      </LoadTransition>

      <div className="h-px bg-border" />
      <span className="text-xs text-muted-foreground">this month</span>
    </div>
  );
}
