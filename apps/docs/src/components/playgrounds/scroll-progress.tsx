"use client";

import * as React from "react";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const PARAGRAPHS = [
  "A progress bar earns its place on long-form content, where the scrollbar alone is not much of an answer to how much is left.",
  "It tracks the page by default. An app that scrolls an inner element rather than the document leaves the bar at zero until it is pointed at that element.",
  "The spring is short enough that the bar never visibly disagrees with the text on screen, and it never overshoots: claiming progress the reader has not made would be worse than lagging.",
  "Under a reduced-motion preference the spring is dropped and the bar tracks scroll one to one. It still moves, because that movement is the reader's own gesture.",
];

type V = { smooth: boolean; className: string };

const BAR: Record<string, string | undefined> = {
  "h-0.5": undefined,
  "h-1": "h-1",
  gradient: "h-1 bg-gradient-to-r from-primary to-primary/40",
};

function Demo({ values: v, anatomy }: DemoProps<V>) {
  const scrollport = React.useRef<HTMLDivElement>(null);

  // A bar at zero has no width to outline, so Anatomy scrolls the reader halfway.
  React.useEffect(() => {
    const el = scrollport.current;
    if (anatomy && el && el.scrollTop === 0) el.scrollTo({ top: (el.scrollHeight - el.clientHeight) / 2 });
  }, [anatomy]);

  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-background">
      <ScrollProgress containerRef={scrollport} fixed={false} smooth={v.smooth} className={BAR[v.className]} />
      <div ref={scrollport} className="h-56 overflow-y-auto p-4">
        <div className="space-y-4 text-sm text-muted-foreground">
          {PARAGRAPHS.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function code(v: V): string {
  const props = ["containerRef={scrollport}", "fixed={false}"];
  if (!v.smooth) props.push("smooth={false}");
  const cls = BAR[v.className];
  if (cls) props.push(`className="${cls}"`);
  return [
    `import { useRef, type ReactNode } from "react"`,
    `import { ScrollProgress } from "@/components/ui/scroll-progress"`,
    "",
    "export function Reader({ children }: { children: ReactNode }) {",
    "  const scrollport = useRef<HTMLDivElement>(null)",
    "",
    "  return (",
    `    <div className="overflow-hidden rounded-lg border">`,
    `      <ScrollProgress ${props.join(" ")} />`,
    `      <div ref={scrollport} className="h-56 overflow-y-auto p-4">`,
    "        {children}",
    "      </div>",
    "    </div>",
    "  )",
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "reader.tsx",
  controls: [
    { name: "smooth", type: "boolean", default: true },
    { name: "className", type: "select", options: ["h-0.5", "h-1", "gradient"], default: "h-0.5" },
  ],
  Demo,
  code,
});
