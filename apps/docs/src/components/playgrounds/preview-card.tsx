"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from "@/components/ui/preview-card";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { delay: number; closeDelay: number };

const CARDS = [
  {
    name: "Base UI",
    text: "Unstyled React components and hooks from the creators of Material UI. Ship accessible interfaces without compromising creative freedom.",
  },
  {
    name: "Tailwind CSS",
    text: "A utility-first CSS framework for rapidly building custom designs without ever leaving your HTML.",
  },
];

function Card({ card, v, pinned, refuse }: { card: (typeof CARDS)[number]; v: V; pinned?: boolean; refuse: boolean }) {
  const [openState, setOpen] = React.useState(false);
  return (
    <PreviewCard
      open={pinned || openState}
      onOpenChange={(open, details) => {
        if (refuse && isAgentChange(details)) return details.cancel();
        if (!pinned) setOpen(open);
      }}
    >
      <PreviewCardTrigger href="#" delay={v.delay} closeDelay={v.closeDelay} onClick={(e) => e.preventDefault()}>
        {card.name}
      </PreviewCardTrigger>
      <PreviewCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{card.name}</h4>
          <p className="text-sm text-muted-foreground">{card.text}</p>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  );
}

function Demo({ values: v, anatomy, refuse }: DemoProps<V>) {
  return (
    <p className="max-w-md text-sm leading-relaxed text-foreground">
      Dinachi UI is heavily inspired by <Card card={CARDS[0]} v={v} pinned={anatomy} refuse={refuse} /> and
      provides accessible, composable components styled with <Card card={CARDS[1]} v={v} refuse={refuse} />.
    </p>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const L: string[] = [];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from "@/components/ui/preview-card"`, "");
  L.push("const cards = {");
  for (const c of CARDS) L.push(`  "${c.name}": "${c.text}",`);
  L.push("}", "");
  L.push("function Mention({ name }: { name: keyof typeof cards }) {", "  return (");
  if (refuse) {
    L.push("    <PreviewCard", "      onOpenChange={(open, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push("    <PreviewCard>");
  }
  const props = ['href="#"'];
  if (v.delay !== 600) props.push(`delay={${v.delay}}`);
  if (v.closeDelay !== 300) props.push(`closeDelay={${v.closeDelay}}`);
  L.push(`      <PreviewCardTrigger ${props.join(" ")}>{name}</PreviewCardTrigger>`);
  L.push("      <PreviewCardContent>", '        <div className="space-y-2">');
  L.push('          <h4 className="text-sm font-semibold">{name}</h4>');
  L.push('          <p className="text-sm text-muted-foreground">{cards[name]}</p>');
  L.push("        </div>", "      </PreviewCardContent>", "    </PreviewCard>", "  )", "}", "");
  L.push("export function Credits() {", "  return (");
  L.push('    <p className="max-w-md text-sm leading-relaxed">');
  L.push('      Dinachi UI is heavily inspired by <Mention name="Base UI" /> and provides accessible,');
  L.push('      composable components styled with <Mention name="Tailwind CSS" />.');
  L.push("    </p>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "credits.tsx",
  tall: true,
  refusable: true,
  controls: [
    { name: "delay", type: "number", default: 600, min: 0, max: 2000, step: 100 },
    { name: "closeDelay", type: "number", default: 300, min: 0, max: 2000, step: 100 },
  ],
  tries: [
    { label: "Open Base UI", action: "open", target: "Base UI" },
    { label: "Open Tailwind CSS", action: "open", target: "Tailwind CSS" },
  ],
  Demo,
  code,
});
