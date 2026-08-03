"use client";

import * as React from "react";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const PARAGRAPHS = [
  "A progress bar earns its place on long-form content, where the scrollbar alone is not much of an answer to how much is left.",
  "It tracks the page by default. An app that scrolls an inner element rather than the document leaves the bar at zero until it is pointed at that element.",
  "The spring is short enough that the bar never visibly disagrees with the text on screen, and it never overshoots: claiming progress the reader has not made would be worse than lagging.",
  "Under a reduced-motion preference the spring is dropped and the bar tracks scroll one to one. It still moves, because that movement is the reader's own gesture.",
];

/**
 * The docs page is not the thing being measured, so each example scrolls its own
 * container and places the bar itself with `fixed={false}`.
 */
function Reader({
  children,
  scrollportRef,
}: {
  children: React.ReactNode;
  scrollportRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-border">
      {children}
      <div ref={scrollportRef} className="h-56 overflow-y-auto p-4">
        <div className="space-y-4 text-sm text-muted-foreground">
          {PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DefaultScrollProgressExample() {
  const scrollport = React.useRef<HTMLDivElement>(null);

  return (
    <Reader scrollportRef={scrollport}>
      <ScrollProgress containerRef={scrollport} fixed={false} />
    </Reader>
  );
}

/**
 * A mouse wheel arrives in discrete notches. The smoothed bar turns that staircase into
 * continuous motion; the 1:1 bar shows the staircase.
 */
export function ScrollProgressSmoothExample() {
  const scrollport = React.useRef<HTMLDivElement>(null);

  return (
    <Reader scrollportRef={scrollport}>
      <div className="space-y-1 border-b border-border p-3">
        <p className="text-xs font-medium text-muted-foreground">Smoothed</p>
        <ScrollProgress containerRef={scrollport} fixed={false} />
        <p className="pt-2 text-xs font-medium text-muted-foreground">1:1</p>
        <ScrollProgress
          containerRef={scrollport}
          fixed={false}
          smooth={false}
          className="bg-muted-foreground"
        />
      </div>
    </Reader>
  );
}

export function ScrollProgressStyledExample() {
  const scrollport = React.useRef<HTMLDivElement>(null);

  return (
    <Reader scrollportRef={scrollport}>
      <ScrollProgress
        containerRef={scrollport}
        fixed={false}
        className="h-1 bg-gradient-to-r from-primary to-primary/40"
      />
    </Reader>
  );
}
