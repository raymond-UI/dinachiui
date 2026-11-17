"use client";

import * as React from "react";
import { Check, Copy, Heart, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { AnimatedIcon, type AnimatedIconMode } from "@/components/ui/animated-icon";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";
import { cn } from "@/lib/utils";

type V = { active: boolean; mode: string; className: string };

const BUTTON =
  "flex h-16 w-20 flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const ICONS = [
  { label: "Play", from: <Play />, to: <Pause />, fromCode: "<Play />", toCode: "<Pause />" },
  { label: "Mute", from: <Volume2 />, to: <VolumeX />, fromCode: "<Volume2 />", toCode: "<VolumeX />" },
  { label: "Copy", from: <Copy />, to: <Check />, fromCode: "<Copy />", toCode: "<Check />" },
  {
    label: "Like",
    from: <Heart />,
    to: <Heart className="fill-current text-rose-500" />,
    fromCode: "<Heart />",
    toCode: '<Heart className="fill-current text-rose-500" />',
  },
];

function Demo({ values: v }: DemoProps<V>) {
  const [on, setOn] = React.useState(() => ICONS.map(() => v.active));
  // The control sets all four at once; each button still toggles its own.
  React.useEffect(() => setOn(ICONS.map(() => v.active)), [v.active]);
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {ICONS.map((icon, i) => (
        <button
          key={icon.label}
          type="button"
          aria-pressed={on[i]}
          aria-label={icon.label}
          onClick={() => setOn((s) => s.map((x, j) => (j === i ? !x : x)))}
          className={BUTTON}
        >
          <AnimatedIcon
            active={on[i]}
            from={icon.from}
            to={icon.to}
            mode={v.mode as AnimatedIconMode}
            className={cn(v.className !== "size-5" && v.className)}
          />
          <span className="text-[10px] text-muted-foreground">{icon.label}</span>
        </button>
      ))}
    </div>
  );
}

function code(v: V): string {
  const extra = [v.mode !== "scale" && `mode="${v.mode}"`, v.className !== "size-5" && `className="${v.className}"`]
    .filter(Boolean)
    .map((p) => ` ${p}`)
    .join("");
  const names = ["Play", "Mute", "Copy", "Like"];
  const states = ["playing", "muted", "copied", "liked"];
  const L: string[] = [];
  L.push(`import { useState } from "react"`);
  L.push(`import { Check, Copy, Heart, Pause, Play, Volume2, VolumeX } from "lucide-react"`);
  L.push(`import { AnimatedIcon } from "@/components/ui/animated-icon"`, "");
  L.push("export function MediaControls() {");
  states.forEach((s) => L.push(`  const [${s}, set${s[0].toUpperCase()}${s.slice(1)}] = useState(${v.active})`));
  L.push("", "  return (", '    <div className="flex gap-3">');
  ICONS.forEach((icon, i) => {
    const s = states[i];
    const set = `set${s[0].toUpperCase()}${s.slice(1)}`;
    L.push(`      <button type="button" aria-label="${names[i]}" aria-pressed={${s}} onClick={() => ${set}((v) => !v)}>`);
    L.push(`        <AnimatedIcon active={${s}} from={${icon.fromCode}} to={${icon.toCode}}${extra} />`);
    L.push("      </button>");
  });
  L.push("    </div>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "media-controls.tsx",
  controls: [
    { name: "active", type: "boolean", default: false },
    { name: "mode", type: "select", options: ["scale", "rotate", "flip", "fade"], default: "scale" },
    { name: "className", type: "select", options: ["size-4", "size-5", "size-8"], default: "size-5" },
  ],
  Demo,
  code,
});
