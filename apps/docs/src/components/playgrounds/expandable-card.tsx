"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import {
  ExpandableCard,
  ExpandableCardBody,
  ExpandableCardPanel,
  ExpandableCardShared,
  ExpandableCardTrigger,
} from "@/components/ui/expandable-card";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const ITEMS = [
  {
    id: "travel",
    kicker: "Shared layout",
    title: "The card travels",
    gradient: "from-sky-500/70 to-sky-500/20",
    body: "Two elements with the same layoutId are one object to the layout engine. The card does not fade out while a dialog fades in, so the reader never has to work out whether the panel is the thing they tapped.",
  },
  {
    id: "modal",
    kicker: "Accessibility",
    title: "It is a real modal",
    gradient: "from-violet-500/70 to-violet-500/20",
    body: "aria-modal is a promise that the rest of the page is unreachable. Escape closes, focus moves in and comes back, Tab cycles inside, and the card underneath is inert rather than merely covered.",
  },
  {
    id: "restraint",
    kicker: "Restraint",
    title: "Not for forty cards",
    gradient: "from-amber-500/70 to-amber-500/20",
    body: "This is the effect most likely to end up on a dashboard grid, where it turns a glance into a wait. Reach for it where opening something is a decision rather than a habit.",
  },
];

const KICKER = "text-[11px] font-medium uppercase tracking-wide text-muted-foreground";

type V = { fullscreen: boolean; showClose: boolean; backdropClassName: string };

function Demo({ values: v, refuse }: DemoProps<V>) {
  // Portal inside the stage so Anatomy and the agent can reach the open panel.
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  return (
    <div className="grid w-full max-w-xl gap-3 sm:grid-cols-3">
      <div ref={setContainer} className="contents" />
      {ITEMS.map((item) => (
        <ExpandableCard
          key={item.id}
          onOpenChange={(_, details) => {
            if (refuse && isAgentChange(details)) details.cancel();
          }}
        >
          <ExpandableCardTrigger className="group">
            <ExpandableCardShared part="art" className={`h-24 bg-gradient-to-br ${item.gradient}`} />
            <div className="space-y-1 p-4">
              <ExpandableCardShared part="kicker" className={KICKER}>
                {item.kicker}
              </ExpandableCardShared>
              <ExpandableCardShared part="title" className="text-sm font-medium">
                {item.title}
              </ExpandableCardShared>
            </div>
          </ExpandableCardTrigger>

          <ExpandableCardPanel
            title={item.title}
            fullscreen={v.fullscreen}
            showClose={v.showClose}
            backdropClassName={v.backdropClassName === "default" ? undefined : v.backdropClassName}
            container={container}
          >
            <ExpandableCardShared
              part="art"
              className={`${v.fullscreen ? "h-64" : "h-40"} shrink-0 bg-gradient-to-br ${item.gradient}`}
            />
            <div className="space-y-1 p-5">
              <ExpandableCardShared part="kicker" className={KICKER}>
                {item.kicker}
              </ExpandableCardShared>
              <ExpandableCardShared part="title" className="text-lg font-medium">
                {item.title}
              </ExpandableCardShared>
              <ExpandableCardBody className="pt-2">{item.body}</ExpandableCardBody>
            </div>
          </ExpandableCardPanel>
        </ExpandableCard>
      ))}
    </div>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const panel = ["title={item.title}", v.fullscreen && "fullscreen", !v.showClose && "showClose={false}"];
  if (v.backdropClassName !== "default") panel.push(`backdropClassName="${v.backdropClassName}"`);
  const L: string[] = [];
  L.push("import {", "  ExpandableCard,", "  ExpandableCardBody,", "  ExpandableCardPanel,", "  ExpandableCardShared,", "  ExpandableCardTrigger,", '} from "@/components/ui/expandable-card"');
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "const items = [");
  for (const i of ITEMS) L.push(`  { id: "${i.id}", kicker: "${i.kicker}", title: "${i.title}", body: "${i.body}" },`);
  L.push("]", "", "export function Principles() {", "  return (", '    <div className="grid gap-3 sm:grid-cols-3">', "      {items.map((item) => (");
  if (refuse) {
    L.push("        <ExpandableCard", "          key={item.id}", "          onOpenChange={(_, details) => {", "            if (isAgentChange(details)) details.cancel()", "          }}", "        >");
  } else {
    L.push("        <ExpandableCard key={item.id}>");
  }
  L.push("          <ExpandableCardTrigger>", '            <ExpandableCardShared part="art" className="h-24 bg-muted" />', '            <div className="space-y-1 p-4">');
  L.push('              <ExpandableCardShared part="kicker" className="text-xs text-muted-foreground">', "                {item.kicker}", "              </ExpandableCardShared>");
  L.push('              <ExpandableCardShared part="title" className="text-sm font-medium">', "                {item.title}", "              </ExpandableCardShared>");
  L.push("            </div>", "          </ExpandableCardTrigger>", "");
  L.push(`          <ExpandableCardPanel ${panel.filter(Boolean).join(" ")}>`);
  L.push('            <ExpandableCardShared part="art" className="h-40 bg-muted" />', '            <div className="space-y-1 p-5">');
  L.push('              <ExpandableCardShared part="kicker" className="text-xs text-muted-foreground">', "                {item.kicker}", "              </ExpandableCardShared>");
  L.push('              <ExpandableCardShared part="title" className="text-lg font-medium">', "                {item.title}", "              </ExpandableCardShared>");
  L.push('              <ExpandableCardBody className="pt-2">{item.body}</ExpandableCardBody>', "            </div>", "          </ExpandableCardPanel>");
  L.push("        </ExpandableCard>", "      ))}", "    </div>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "principles.tsx",
  refusable: true,
  controls: [
    { name: "fullscreen", type: "boolean", default: false },
    { name: "showClose", type: "boolean", default: true },
    { name: "backdropClassName", type: "select", options: ["default", "bg-black/60"], default: "default" },
  ],
  tries: [
    { label: "Open The card travels", action: "open", target: "Shared layoutThe card travels" },
    { label: "Close", action: "close" },
  ],
  Demo,
  code,
});
