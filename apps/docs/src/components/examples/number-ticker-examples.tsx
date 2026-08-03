"use client";

import * as React from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

/** A value that changes on demand, so a reader can watch the roll more than once. */
function useRecount(initial: number, next: () => number) {
  const [value, setValue] = React.useState(initial);
  // Changing the value rather than remounting is the honest demonstration: the spring
  // retargets from wherever it currently is, which is what happens in a real app.
  return [value, () => setValue(next())] as const;
}

/** Sits in the preview header so the figure below it is the only thing in the frame. */
function Recount({ onClick }: { onClick: () => void }) {
  return (
    <PreviewAction>
      <Button variant="outline" size="sm" onClick={onClick}>
        Recount
      </Button>
    </PreviewAction>
  );
}

export function DefaultNumberTickerExample() {
  const [value, recount] = useRecount(12480, () =>
    Math.floor(2000 + Math.random() * 90000)
  );

  return (
    <>
      <Recount onClick={recount} />
      <NumberTicker value={value} className="text-4xl font-semibold" />
    </>
  );
}

export function NumberTickerVariantsExample() {
  const [value, recount] = useRecount(1284, () =>
    Math.floor(1000 + Math.random() * 9000)
  );

  const variants = ["odometer", "counter", "flip"] as const;

  return (
    <>
      <Recount onClick={recount} />
      <div className="flex flex-col gap-3">
        {variants.map((variant) => (
          <div key={variant} className="flex items-baseline gap-4">
            <span className="w-20 shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
              {variant}
            </span>
            <NumberTicker
              variant={variant}
              value={value}
              className="text-3xl font-semibold"
            />
          </div>
        ))}
      </div>
    </>
  );
}

export function NumberTickerFormatExample() {
  const [value, recount] = useRecount(48291.5, () =>
    Math.round((10000 + Math.random() * 90000) * 10) / 10
  );

  return (
    <>
      <Recount onClick={recount} />
      <div className="grid gap-3 text-center">
        <NumberTicker
          value={value}
          decimals={2}
          locale="en-US"
          format={{ style: "currency", currency: "USD" }}
          className="text-3xl font-semibold"
        />
        <NumberTicker
          value={value}
          decimals={1}
          locale="de-DE"
          className="text-3xl font-semibold"
        />
        <NumberTicker
          value={value / 100000}
          decimals={1}
          format={{ style: "percent" }}
          className="text-3xl font-semibold"
        />
      </div>
    </>
  );
}

export function NumberTickerLiveExample() {
  const [requests, setRequests] = React.useState(1284);

  React.useEffect(() => {
    const timer = setInterval(
      () => setRequests((n) => n + Math.floor(Math.random() * 40)),
      1200
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <NumberTicker
        value={requests}
        live
        className="text-4xl font-semibold tabular-nums"
      />
      <p className="text-xs text-muted-foreground">
        requests / minute, updates every 1.2s
      </p>
    </div>
  );
}
