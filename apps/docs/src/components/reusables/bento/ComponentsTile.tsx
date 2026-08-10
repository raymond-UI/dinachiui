"use client";

import { buttonVariants } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { NumberTicker } from "@/components/ui/number-ticker";
import { components } from "@/lib/component-metadata";
import { PRESSABLE } from "@/lib/motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Tile } from "./Tile";

const midpoint = Math.ceil(components.length / 2);
const rows = [
  { items: components.slice(0, midpoint), direction: "left", duration: 50 },
  { items: components.slice(midpoint), direction: "right", duration: 60 },
] as const;

export function ComponentsTile() {
  return (
    <Tile className="h-full">
      <div className="p-8 pb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-baseline gap-3 font-pixel mb-2">
              {/*
                The count is the claim this tile is making, so it lands rather than
                simply being printed. `once` keeps it to the first scroll past.
              */}
              <NumberTicker
                value={components.length}
                startOnView
                once
                className="text-lg font-medium"
              />
              <h3 className="text-lg font-medium">Components</h3>
            </div>
            <p className="text-sm text-muted-foreground text-pretty">
              From form inputs to overlays, everything you need to build
              complete interfaces.
            </p>
          </div>
          <Link
            href="/docs/components"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: `gap-2 ${PRESSABLE}`,
            })}
          >
            Browse all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/*
        Two strips reading in opposite directions, so the pair reads as a shelf of names
        rather than one long queue. Marquee handles the pause on hover and on focus, the
        stop while off screen, and the reduced-motion fallback to a plain scroller.
      */}
      <div className="space-y-2 pb-8">
        {rows.map((row) => (
          <Marquee
            key={row.direction}
            direction={row.direction}
            duration={row.duration}
          >
            {row.items.map((comp) => (
              <Link
                key={comp.slug}
                href={`/docs/components/${comp.slug}`}
                className="shrink-0 text-sm text-muted-foreground hover:text-foreground px-4 py-2 rounded-full border border-border/40 bg-muted/30 hover:bg-muted hover:border-border whitespace-nowrap transition-[color,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
              >
                {comp.name}
              </Link>
            ))}
          </Marquee>
        ))}
      </div>
    </Tile>
  );
}
