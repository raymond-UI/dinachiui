"use client";

import * as React from "react";
import {
  Bell,
  BellOff,
  Check,
  Copy,
  Heart,
  Menu,
  Moon,
  Pause,
  Play,
  Sun,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AnimatedIcon, type AnimatedIconMode } from "@/components/ui/animated-icon";
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
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [liked, setLiked] = React.useState(false);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <IconToggle label="Play" pressed={playing} onClick={() => setPlaying((v) => !v)}>
        <AnimatedIcon active={playing} from={<Play />} to={<Pause />} />
      </IconToggle>
      <IconToggle label="Mute" pressed={muted} onClick={() => setMuted((v) => !v)}>
        <AnimatedIcon active={muted} from={<Volume2 />} to={<VolumeX />} />
      </IconToggle>
      <IconToggle label="Copy" pressed={copied} onClick={() => setCopied((v) => !v)}>
        <AnimatedIcon active={copied} from={<Copy />} to={<Check />} />
      </IconToggle>
      <IconToggle label="Like" pressed={liked} onClick={() => setLiked((v) => !v)}>
        <AnimatedIcon
          active={liked}
          from={<Heart />}
          to={<Heart className="fill-current text-rose-500" />}
        />
      </IconToggle>
    </div>
  );
}

const MODES: { mode: AnimatedIconMode; note: string }[] = [
  { mode: "scale", note: "Default" },
  { mode: "rotate", note: "Turns over" },
  { mode: "flip", note: "About the horizontal" },
  { mode: "fade", note: "Opacity only" },
];

export function AnimatedIconModesExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap items-stretch justify-center gap-3">
        {MODES.map(({ mode, note }) => (
          <div
            key={mode}
            className="flex w-24 flex-col items-center gap-1.5 rounded-xl border border-border px-2 py-3"
          >
            <AnimatedIcon
              active={open}
              mode={mode}
              from={<Menu />}
              to={<X />}
              className="size-6"
            />
            <span className="font-mono text-[11px] text-foreground">{mode}</span>
            <span className="text-center text-[10px] leading-tight text-muted-foreground">
              {note}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Toggle all four
      </button>
    </div>
  );
}

export function AnimatedIconSizesExample() {
  const [dark, setDark] = React.useState(true);

  return (
    <div className="flex items-end justify-center gap-6">
      {[
        { size: "size-4", label: "16" },
        { size: "size-5", label: "20" },
        { size: "size-8", label: "32" },
      ].map(({ size, label }) => (
        <button
          key={label}
          type="button"
          aria-label={dark ? "Switch to light" : "Switch to dark"}
          onClick={() => setDark((v) => !v)}
          className="flex flex-col items-center gap-2 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <AnimatedIcon
            active={dark}
            mode="rotate"
            from={<Sun />}
            to={<Moon />}
            className={cn(size, "text-foreground")}
          />
          <span className="text-[10px]">{label}px</span>
        </button>
      ))}

      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        {/* The class lands on the shell, and both icons fill it. Sizing them individually
            is what leaves an icon squashed on one axis. */}
        <AnimatedIcon active={dark} from={<Bell />} to={<BellOff />} className="size-12" />
        <span className="text-[10px]">48px</span>
      </div>
    </div>
  );
}
