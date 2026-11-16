"use client";

import * as React from "react";
import { Bold, Italic, Underline } from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider, SliderControl, SliderRange, SliderThumb, SliderTrack } from "@/components/ui/slider";
import { Switch, SwitchThumb } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useInView, useReducedMotion, Words } from "./primitives";

type ThemeName = "lime" | "ocean" | "ember" | "mono";

const THEMES: Record<ThemeName, { c: number; h: number; swatch: string }> = {
  lime: { c: 0.17, h: 132, swatch: "oklch(0.8 0.17 132)" },
  ocean: { c: 0.14, h: 235, swatch: "oklch(0.72 0.14 235)" },
  ember: { c: 0.16, h: 45, swatch: "oklch(0.72 0.17 45)" },
  mono: { c: 0, h: 0, swatch: "var(--foreground)" },
};
const NAMES = Object.keys(THEMES) as ThemeName[];
const RADII = [
  { px: 2, label: "Sharp corners", corner: "0" },
  { px: 12, label: "Soft corners", corner: "0 0 0 5px" },
  { px: 20, label: "Round corners", corner: "0 0 0 10px" },
];
const ORDER: ThemeName[] = ["ocean", "ember", "mono", "lime"];
const R_ORDER = [20, 2, 12];

const GLYPHS = "0123456789.abcdef";
const KEEP = new Set([" ", "(", ")"]);

/** Swaps in random glyphs that settle left to right whenever `text` changes. */
function Scramble({ text, reduced }: { text: string; reduced: boolean }) {
  const [shown, setShown] = React.useState(text);
  const first = React.useRef(true);

  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced) return;
    const frames = 9;
    let f = 0;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      setShown(
        Array.from(text, (ch, i) =>
          i < (f / frames) * text.length || KEEP.has(ch) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0],
        ).join(""),
      );
      if (f++ < frames) t = setTimeout(step, 28);
    };
    t = setTimeout(step, 0);
    return () => clearTimeout(t);
  }, [text, reduced]);

  return <b>{reduced ? text : shown}</b>;
}

const subscribe = () => () => {};

const REGIONS = [
  { value: "fra", label: "Frankfurt" },
  { value: "iad", label: "Virginia" },
  { value: "sin", label: "Singapore" },
];

export function ThemingSection() {
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(subscribe, () => true, () => false);
  const dark = !mounted || resolvedTheme !== "light";

  const [theme, setTheme] = React.useState<ThemeName>("lime");
  const [radius, setRadius] = React.useState(12);
  const [touched, setTouched] = React.useState(false);
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  React.useEffect(() => {
    if (reduced || touched || !inView) return;
    let tick = 0;
    const t = setInterval(() => {
      setTheme(ORDER[tick % ORDER.length]);
      if (tick % 2 === 1) setRadius(R_ORDER[((tick - 1) / 2) % R_ORDER.length]);
      tick++;
    }, 2600);
    return () => clearInterval(t);
  }, [reduced, touched, inView]);

  const { c, h } = THEMES[theme];
  const l = theme === "mono" ? (dark ? 0.96 : 0.16) : dark ? 0.87 : 0.52;
  const primary = `oklch(${l} ${c} ${h})`;
  const onPrimary = theme === "mono" ? (dark ? "oklch(0.15 0 0)" : "oklch(0.98 0 0)") : dark ? "oklch(0.17 0.03 135)" : "oklch(0.98 0.01 135)";
  const rem = `${+(radius / 16).toFixed(3)}rem`;
  const rIndex = RADII.findIndex((r) => r.px === radius);

  const tokens = {
    "--primary": primary,
    "--primary-foreground": onPrimary,
    "--ring": primary,
    "--radius": rem,
  } as React.CSSProperties;

  return (
    <section className="sec blk center">
      <Words parts={[["Your tokens."], ["Every component.", "pixel"]]} />

      <div className="tbar" role="toolbar" aria-label="Theme">
        <div className="sws">
          {NAMES.map((name) => (
            <button
              key={name}
              type="button"
              className="swb"
              aria-pressed={theme === name}
              aria-label={name[0].toUpperCase() + name.slice(1)}
              style={{ "--c": THEMES[name].swatch } as React.CSSProperties}
              onClick={() => {
                setTouched(true);
                setTheme(name);
              }}
            >
              <i />
            </button>
          ))}
        </div>
        <span className="sep" aria-hidden />
        <div className="rads">
          <span className="ind" aria-hidden style={{ left: rIndex * 36, width: 34 }} />
          {RADII.map((r) => (
            <button
              key={r.px}
              type="button"
              aria-pressed={radius === r.px}
              aria-label={r.label}
              onClick={() => {
                setTouched(true);
                setRadius(r.px);
              }}
            >
              <i style={{ borderRadius: r.corner }} />
            </button>
          ))}
        </div>
      </div>

      <div ref={ref} className="tp" style={tokens}>
        <div className="tc">
          <div className="ti">New project</div>
          <Input defaultValue="acme-web" aria-label="Project name" />
          <Select items={REGIONS} defaultValue="fra">
            <SelectTrigger aria-label="Region">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label className="trow">
            Private
            <Switch defaultChecked>
              <SwitchThumb />
            </Switch>
          </label>
          <div className="tbtns">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button size="sm">Create</Button>
          </div>
        </div>

        <div className="tc">
          <Tabs defaultValue="tasks">
            <TabsList className="w-full bg-muted">
              <TabsTrigger value="tasks" className="flex-1">
                Tasks
              </TabsTrigger>
              <TabsTrigger value="files" className="flex-1">
                Files
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">
                Activity
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {[
            ["Design review", true],
            ["Write the docs", true],
            ["Ship 1.0", false],
          ].map(([task, done]) => (
            <label key={String(task)} className="tchk">
              <Checkbox defaultChecked={Boolean(done)} />
              <span>{task}</span>
            </label>
          ))}
          <Progress value={66} className="tprog" aria-label="Sprint">
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
        </div>

        <div className="tc">
          <div className="trow">
            <div className="tav">
              {[
                ["GH", "oklch(0.8 0.1 70)"],
                ["AT", "oklch(0.78 0.09 250)"],
                ["AL", "oklch(0.82 0.12 140)"],
              ].map(([who, bg]) => (
                <Avatar key={who} size="sm">
                  <AvatarFallback style={{ background: bg, color: "oklch(0.2 0.02 140)" }}>{who}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Badge>3 online</Badge>
          </div>
          <Slider defaultValue={40} aria-label="Volume">
            <div className="trow">Volume</div>
            <SliderControl>
              <SliderTrack>
                <SliderRange />
                <SliderThumb aria-label="Volume" />
              </SliderTrack>
            </SliderControl>
          </Slider>
          <ToggleGroup multiple defaultValue={["bold"]} className="self-start">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="tbtns">
            <Button className="w-full">Share link</Button>
          </div>
        </div>
      </div>

      <div className="tokens">
        <span>
          --primary <Scramble text={primary} reduced={reduced} />
        </span>
        <span>
          --radius <Scramble text={rem} reduced={reduced} />
        </span>
      </div>
    </section>
  );
}
