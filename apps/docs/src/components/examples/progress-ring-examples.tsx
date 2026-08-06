"use client";

import * as React from "react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";

export function DefaultProgressRingExample() {
  const [value, setValue] = React.useState(24);

  return (
    <div className="flex flex-col items-center gap-5">
      <ProgressRing value={value} label="Upload" />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue((v) => Math.max(0, v - 20))}
        >
          &minus;20
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue((v) => Math.min(100, v + 20))}
        >
          +20
        </Button>
        <Button variant="outline" size="sm" onClick={() => setValue(100)}>
          Jump to 100
        </Button>
      </div>

      <p className="max-w-xs text-center text-xs text-muted-foreground">
        Press the buttons quickly. The spring re-targets from wherever the arc is, so a run
        of updates reads as one accelerating sweep.
      </p>
    </div>
  );
}

export function IndeterminateProgressRingExample() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ProgressRing label="Fetching" />
      <p className="max-w-xs text-center text-xs text-muted-foreground">
        No value, so no number and no claim about how far along it is. The arc sweeps its
        own length under the rotation, so the two clocks never line up twice.
      </p>
    </div>
  );
}

export function ProgressRingSizesExample() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-8">
        <ProgressRing value={68} size={128} label="Large" />
        <ProgressRing value={68} label="Default" />
        <ProgressRing value={68} size={56} label="Compact" />
        {/* Pinned stroke, so it stays hairline at any diameter. */}
        <ProgressRing value={68} size={56} thickness={3} showValue={false} label="Hairline" />
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground">
        The stroke scales with the ring unless you pin it — the same 8px on a ring twice the
        size reads as thinner, not bigger.
      </p>
    </div>
  );
}
