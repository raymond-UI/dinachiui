"use client";

import * as React from "react";
import { StaggerList, StaggerListItem } from "@/components/ui/stagger-list";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

const ITEMS = ["Deploys", "Incidents", "Costs", "Latency", "Error rate"];

/**
 * The sequence only runs on arrival, so replaying means remounting. The header button
 * bumps a key rather than reaching for a replay API the component deliberately lacks.
 */
function useReplay() {
  const [run, setRun] = React.useState(0);
  const button = (
    <PreviewAction>
      <Button variant="outline" size="sm" onClick={() => setRun((n) => n + 1)}>
        Replay
      </Button>
    </PreviewAction>
  );
  return { run, button };
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
      {children}
    </div>
  );
}

export function DefaultStaggerListExample() {
  const { run, button } = useReplay();

  return (
    <>
      {button}
      <StaggerList key={run} startOnView={false} className="w-56 space-y-2">
        {ITEMS.map((item) => (
          <StaggerListItem key={item}>
            <Row>{item}</Row>
          </StaggerListItem>
        ))}
      </StaggerList>
    </>
  );
}

export function StaggerListVariantsExample() {
  const { run, button } = useReplay();

  return (
    <>
      {button}
      <div key={run} className="flex flex-wrap justify-center gap-8">
        {(["rise", "scale", "blur"] as const).map((variant) => (
          <div key={variant} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {variant}
            </p>
            <StaggerList
              variant={variant}
              startOnView={false}
              className="w-32 space-y-2"
            >
              {ITEMS.slice(0, 3).map((item) => (
                <StaggerListItem key={item}>
                  <Row>{item}</Row>
                </StaggerListItem>
              ))}
            </StaggerList>
          </div>
        ))}
      </div>
    </>
  );
}

/** A grid has no single reading direction, so `scale` reads better than a rise. */
export function StaggerListGridExample() {
  const { run, button } = useReplay();

  return (
    <>
      {button}
      <StaggerList
        key={run}
        variant="scale"
        startOnView={false}
        stagger={0.04}
        className="grid w-64 grid-cols-2 gap-2"
      >
        {ITEMS.slice(0, 4).map((item) => (
          <StaggerListItem key={item}>
            <Row>{item}</Row>
          </StaggerListItem>
        ))}
      </StaggerList>
    </>
  );
}
