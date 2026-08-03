"use client";

import * as React from "react";
import { CompareSlider } from "@/components/ui/compare-slider";
import { Button } from "@/components/ui/button";

/**
 * Both layers are drawn rather than loaded, so the examples stay registered by
 * construction: same size, same padding, same type. A pair of images that differ by a
 * pixel makes the divider look broken in a way that has nothing to do with the component.
 */
function Layer({
  tone,
  label,
  align = "items-start",
  children,
}: {
  tone: string;
  label: string;
  /** Which side of the panel the content sits on. */
  align?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`flex h-56 w-full flex-col justify-between p-4 ${align} ${tone}`}
    >
      <span className="text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
      {children}
    </div>
  );
}

const BEFORE = "bg-muted text-muted-foreground";
const AFTER = "bg-primary text-primary-foreground";

export function DefaultCompareSliderExample() {
  return (
    <div className="w-full max-w-md">
      <CompareSlider
        label="Compare the two revisions"
        before={<Layer tone={BEFORE} label="Before" />}
        after={<Layer tone={AFTER} label="After" />}
      />
    </div>
  );
}

/**
 * Both sides are flat colour here, so there is nothing to click and a 2px handle is a
 * needlessly small target. That is the case `panel` exists for.
 */
export function CompareSliderPanelExample() {
  return (
    <div className="w-full max-w-md">
      <CompareSlider
        drag="panel"
        label="Compare the two revisions"
        before={<Layer tone={BEFORE} label="Before" />}
        after={<Layer tone={AFTER} label="After" />}
      />
    </div>
  );
}

/**
 * The default mode limits dragging to the divider, which is what leaves the layers live.
 * Under `drag="panel"` this button would not take a click.
 *
 * Each layer's content sits on the side that layer is exposed on. The clipped `before`
 * layer covers the whole panel and is trimmed to the divider, so anything the `after`
 * layer wants clicked has to be to the right of it.
 */
export function CompareSliderLiveExample() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="w-full max-w-md">
      <CompareSlider
        label="Compare the two plans"
        before={
          <Layer tone={BEFORE} label="Current plan">
            <p className="text-sm">Deploys are queued.</p>
          </Layer>
        }
        after={
          <Layer tone={AFTER} label="Proposed plan" align="items-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCount((n) => n + 1)}
            >
              Clicked {count}×
            </Button>
          </Layer>
        }
      />
    </div>
  );
}
