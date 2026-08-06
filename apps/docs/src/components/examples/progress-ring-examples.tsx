"use client";

import * as React from "react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

export function DefaultProgressRingExample() {
  const [value, setValue] = React.useState(24);

  return (
    <>
      <PreviewAction>
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
      </PreviewAction>

      <ProgressRing value={value} label="Upload" />
    </>
  );
}

export function IndeterminateProgressRingExample() {
  return <ProgressRing label="Fetching" />;
}

export function ProgressRingSizesExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <ProgressRing value={68} size={128} label="Large" />
      <ProgressRing value={68} label="Default" />
      <ProgressRing value={68} size={56} label="Compact" />
      {/* Pinned stroke, so it stays hairline at any diameter. */}
      <ProgressRing
        value={68}
        size={56}
        thickness={3}
        showValue={false}
        label="Hairline"
      />
    </div>
  );
}
