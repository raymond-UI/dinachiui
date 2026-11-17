"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import {
  Carousel,
  CarouselDots,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselViewport,
} from "@/components/ui/carousel";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const SLIDES = [
  { id: "1", title: "Projection", detail: "Where the flick was aimed", gradient: "from-primary/70 to-primary/20" },
  { id: "2", title: "Velocity handoff", detail: "No seam on release", gradient: "from-emerald-500/70 to-emerald-500/20" },
  { id: "3", title: "Elastic edges", detail: "The end of the set, felt", gradient: "from-amber-500/70 to-amber-500/20" },
  { id: "4", title: "Reduced motion", detail: "Becomes a scroll-snap strip", gradient: "from-sky-500/70 to-sky-500/20" },
];

const DEFAULT_WIDTH = "w-[72%]";

type V = { className: string; CarouselDots: boolean; CarouselPrevious: boolean; disabled: boolean };

function Demo({ values: v, refuse }: DemoProps<V>) {
  const [index, setIndex] = React.useState(0);
  const arrows = v.CarouselPrevious;
  return (
    <div className="w-full max-w-md">
      <Carousel
        label="Gesture techniques"
        index={index}
        onIndexChange={(next, details) => {
          if (refuse && isAgentChange(details)) return details.cancel();
          setIndex(next);
        }}
        disabled={v.disabled}
      >
        <CarouselViewport>
          {SLIDES.map((slide) => (
            <CarouselSlide key={slide.id} label={slide.title} className={v.className === DEFAULT_WIDTH ? undefined : v.className}>
              <div className="overflow-hidden rounded-xl border border-border bg-background">
                <div className={`h-24 bg-gradient-to-br ${slide.gradient}`} />
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground">{slide.title}</p>
                  <p className="text-xs text-muted-foreground">{slide.detail}</p>
                </div>
              </div>
            </CarouselSlide>
          ))}
        </CarouselViewport>
        {(v.CarouselDots || arrows) && (
          <div className="flex items-center justify-between">
            {v.CarouselDots && <CarouselDots labels={SLIDES.map((s) => s.title)} />}
            {arrows && (
              <div className="ml-auto flex gap-1.5">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            )}
          </div>
        )}
      </Carousel>
    </div>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = ["Carousel", "CarouselSlide", "CarouselViewport"];
  if (v.CarouselDots) parts.push("CarouselDots");
  if (v.CarouselPrevious) parts.push("CarouselNext", "CarouselPrevious");
  parts.sort();
  const width = v.className === DEFAULT_WIDTH ? "" : v.className;
  const L: string[] = [];
  L.push(`import { ${parts.join(", ")} } from "@/components/ui/carousel"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "const slides = [");
  for (const s of SLIDES) L.push(`  { id: "${s.id}", title: "${s.title}", detail: "${s.detail}" },`);
  L.push("]", "", "export function Techniques() {", "  return (");
  const root = ['label="Gesture techniques"', v.disabled && "disabled"].filter(Boolean) as string[];
  if (refuse) {
    L.push("    <Carousel", ...root.map((p) => `      ${p}`));
    L.push("      onIndexChange={(index, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <Carousel ${root.join(" ")}>`);
  }
  L.push("      <CarouselViewport>", "        {slides.map((slide) => (");
  L.push(`          <CarouselSlide key={slide.id} label={slide.title}${width ? ` className="${width}"` : ""}>`);
  L.push('            <div className="rounded-xl border p-3">');
  L.push('              <p className="text-sm font-medium">{slide.title}</p>');
  L.push('              <p className="text-xs text-muted-foreground">{slide.detail}</p>');
  L.push("            </div>", "          </CarouselSlide>", "        ))}", "      </CarouselViewport>");
  if (v.CarouselDots || v.CarouselPrevious) {
    L.push('      <div className="flex items-center justify-between">');
    if (v.CarouselDots) L.push("        <CarouselDots labels={slides.map((s) => s.title)} />");
    if (v.CarouselPrevious) L.push('        <div className="ml-auto flex gap-1.5">', "          <CarouselPrevious />", "          <CarouselNext />", "        </div>");
    L.push("      </div>");
  }
  L.push("    </Carousel>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "techniques.tsx",
  refusable: true,
  controls: [
    { name: "className", type: "select", options: ["w-[72%]", "w-1/2", "w-full"], default: "w-[72%]" },
    { name: "CarouselDots", type: "boolean", default: true },
    { name: "CarouselPrevious", type: "boolean", default: true },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Go to Velocity handoff", action: "goTo", args: ["Velocity handoff"] },
    { label: "Go to 4", action: "goTo", args: [4] },
    { label: "Go to Inertia", action: "goTo", args: ["Inertia"] },
  ],
  Demo,
  code,
});
