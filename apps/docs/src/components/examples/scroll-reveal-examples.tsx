"use client";

import * as React from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

/**
 * The effect needs somewhere to scroll, so each example brings its own scrollport and
 * points the reveals at it with `root`. Replaying remounts the blocks, which is the only
 * way to re-arm a reveal that is meant to run once.
 */
function Scrollport({
  children,
}: {
  children: (root: React.RefObject<HTMLDivElement | null>) => React.ReactNode;
}) {
  const scrollport = React.useRef<HTMLDivElement>(null);
  const [run, setRun] = React.useState(0);

  function replay() {
    scrollport.current?.scrollTo({ top: 0 });
    setRun((value) => value + 1);
  }

  return (
    <>
      <PreviewAction>
        <Button variant="outline" size="sm" onClick={replay}>
          Replay
        </Button>
      </PreviewAction>
      <div
        ref={scrollport}
        className="h-64 w-full max-w-md overflow-y-auto rounded-lg border border-border"
      >
        <div key={run} className="p-4">
          <p className="text-sm text-muted-foreground">Scroll down.</p>
          {/* Taller than the scrollport, so the first block starts genuinely out of
              view rather than already past the trigger. */}
          <div className="h-64" />
          {children(scrollport)}
        </div>
      </div>
    </>
  );
}

function Block({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
      {children}
    </div>
  );
}

export function DefaultScrollRevealExample() {
  return (
    <Scrollport>
      {(root) => (
        <ScrollReveal root={root} margin="0px">
          <Block>Uncovered edge-first as it arrives.</Block>
        </ScrollReveal>
      )}
    </Scrollport>
  );
}

export function ScrollRevealDirectionExample() {
  return (
    <Scrollport>
      {(root) => (
        <div className="space-y-40">
          {(["up", "down", "left", "right"] as const).map((direction) => (
            <ScrollReveal
              key={direction}
              root={root}
              margin="0px"
              direction={direction}
            >
              <Block>
                <span className="font-mono">{direction}</span>
              </Block>
            </ScrollReveal>
          ))}
        </div>
      )}
    </Scrollport>
  );
}

/**
 * A cascade wants 0.03–0.08s per step. Past that the last block is late enough to read as
 * a wait, and for an actual list StaggerList sequences it from one trigger instead.
 */
export function ScrollRevealCascadeExample() {
  return (
    <Scrollport>
      {(root) => (
        <div className="space-y-3">
          {["Deploys", "Incidents", "Costs"].map((label, index) => (
            <ScrollReveal
              key={label}
              root={root}
              margin="0px"
              delay={index * 0.06}
            >
              <Block>{label}</Block>
            </ScrollReveal>
          ))}
        </div>
      )}
    </Scrollport>
  );
}
