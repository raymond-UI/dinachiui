"use client";

import * as React from "react";
import {
  AnimatedMenuIcon,
  AnimatedPlayIcon,
  AnimatedChevronIcon,
  AnimatedCheckIcon,
} from "@/components/ui/animated-icon";
import { cn } from "@/lib/utils";

function IconToggle({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      onClick={onClick}
      className="flex h-16 w-20 flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </button>
  );
}

export function DefaultAnimatedIconExample() {
  const [menu, setMenu] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [done, setDone] = React.useState(false);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <IconToggle label="Menu" pressed={menu} onClick={() => setMenu((v) => !v)}>
        <AnimatedMenuIcon open={menu} />
      </IconToggle>
      <IconToggle label="Play" pressed={playing} onClick={() => setPlaying((v) => !v)}>
        <AnimatedPlayIcon playing={playing} />
      </IconToggle>
      <IconToggle label="Expand" pressed={open} onClick={() => setOpen((v) => !v)}>
        <AnimatedChevronIcon open={open} />
      </IconToggle>
      <IconToggle label="Confirm" pressed={done} onClick={() => setDone((v) => !v)}>
        <AnimatedCheckIcon done={done} />
      </IconToggle>
    </div>
  );
}

export function AnimatedIconInPlaceExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border border-border">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Does the motion tier need a build step?
        <AnimatedChevronIcon open={open} className="h-4 w-4 text-muted-foreground" />
      </button>
      <div
        className={cn(
          "grid overflow-hidden px-4 text-sm text-muted-foreground transition-[grid-template-rows,padding] duration-200 ease-out",
          open ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]",
        )}
      >
        <p className="overflow-hidden">
          No. The chevron is the disclosure indicator, and turning it over is the whole
          reason it is animated: the reader sees one control change, not two icons swap.
        </p>
      </div>
    </div>
  );
}

export function AnimatedIconSizesExample() {
  const [playing, setPlaying] = React.useState(true);

  return (
    <div className="flex items-center justify-center gap-6">
      {[
        { size: "h-4 w-4", label: "16" },
        { size: "h-5 w-5", label: "20" },
        { size: "h-8 w-8", label: "32" },
      ].map(({ size, label }) => (
        <button
          key={label}
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying((v) => !v)}
          className="flex flex-col items-center gap-2 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <AnimatedPlayIcon playing={playing} className={cn(size, "text-foreground")} />
          <span className="text-[10px]">{label}px</span>
        </button>
      ))}
    </div>
  );
}
