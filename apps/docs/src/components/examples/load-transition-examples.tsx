"use client";

import * as React from "react";
import { LoadTransition } from "@/components/ui/load-transition";
import { Button } from "@/components/ui/button";

function Placeholder() {
  return (
    <div className="space-y-2.5">
      <div className="h-3.5 w-1/3 animate-pulse rounded bg-muted" />
      <div className="h-3 w-full animate-pulse rounded bg-muted" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
    </div>
  );
}

function Summary() {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">Deployment summary</p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Fourteen files changed across three packages. The docs site rebuilt in 41 seconds
        and every check passed, including the two guards that read the CLI registry against
        the templates it describes.
      </p>
      <p className="text-xs text-muted-foreground">
        Note the height difference: this content is taller than the placeholder that stood
        in for it, which is exactly the jump this component exists to absorb.
      </p>
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
    <div className="w-full space-y-3">
      <LoadTransition loading={loading} skeleton={<Placeholder />}>
        <Summary />
      </LoadTransition>

      <Button variant="outline" size="sm" onClick={() => setLoading((v) => !v)}>
        {loading ? "Finish loading" : "Back to skeleton"}
      </Button>
    </div>
  );
}

export function LoadTransitionThresholdsExample() {
  const [loading, setLoading] = React.useState(false);

  const run = (ms: number) => {
    setLoading(true);
    setTimeout(() => setLoading(false), ms);
  };

  return (
    <div className="w-full space-y-3">
      <LoadTransition loading={loading} skeleton={<Placeholder />}>
        <Summary />
      </LoadTransition>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => run(120)}>
          Fast load (120ms)
        </Button>
        <Button variant="outline" size="sm" onClick={() => run(1200)}>
          Slow load (1200ms)
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        The fast load never shows a skeleton at all — it resolves inside the 180ms the
        placeholder waits before appearing. A slow one holds the skeleton for at least
        420ms so it cannot flash.
      </p>
    </div>
  );
}

export function LoadTransitionBareExample() {
  const [loading, setLoading] = React.useState(true);

  return (
    <div className="w-full space-y-3">
      <LoadTransition
        loading={loading}
        skeleton={<div className="h-3 w-24 animate-pulse rounded bg-muted" />}
        className="border-0 bg-transparent p-0"
        radius={0}
      >
        <p className="text-sm text-foreground">Ninety-four deploys this month.</p>
      </LoadTransition>

      <Button variant="outline" size="sm" onClick={() => setLoading((v) => !v)}>
        {loading ? "Finish loading" : "Back to skeleton"}
      </Button>

      <p className="text-xs text-muted-foreground">
        The panel chrome is a default, not a requirement. Strip it and the height animation
        is still what stops the line below from jumping.
      </p>
    </div>
  );
}
