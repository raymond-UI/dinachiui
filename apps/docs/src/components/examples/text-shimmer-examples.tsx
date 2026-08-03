"use client";

import * as React from "react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

export function DefaultTextShimmerExample() {
  return <TextShimmer className="text-lg">Thinking…</TextShimmer>;
}

export function TextShimmerVariantsExample() {
  return (
    <div className="flex flex-col items-center gap-4 text-lg">
      <TextShimmer variant="sweep">Sweeping a band across</TextShimmer>
      <TextShimmer variant="pulse">Breathing dim to lit</TextShimmer>
    </div>
  );
}

export function TextShimmerDimExample() {
  return (
    <div className="flex flex-col items-center gap-4 text-lg">
      <TextShimmer dim={0.85}>Barely dimmed</TextShimmer>
      <TextShimmer dim={0.7}>Default</TextShimmer>
      <TextShimmer dim={0.4}>Deeply dimmed</TextShimmer>
    </div>
  );
}

/**
 * The shimmer is only correct while work is in flight, so the honest demo mounts and
 * unmounts it rather than leaving it looping over a settled answer.
 */
export function TextShimmerPendingExample() {
  const [state, setState] = React.useState<"idle" | "pending" | "done">("idle");

  React.useEffect(() => {
    if (state !== "pending") return;
    const timer = setTimeout(() => setState("done"), 2600);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <>
      <PreviewAction>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setState("pending")}
          disabled={state === "pending"}
        >
          {state === "done" ? "Ask again" : "Ask"}
        </Button>
      </PreviewAction>
      <div className="flex min-h-8 items-center text-lg">
        {state === "idle" && (
          <span className="text-muted-foreground">Waiting for a question</span>
        )}
        {state === "pending" && <TextShimmer>Generating a reply…</TextShimmer>}
        {state === "done" && <span>Here is the reply.</span>}
      </div>
    </>
  );
}
