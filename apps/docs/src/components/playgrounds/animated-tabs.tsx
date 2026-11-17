"use client";

import * as React from "react";
import type { Transition } from "motion/react";
import { isAgentChange } from "@/components/ui/agent";
import {
  AnimatedTabs,
  AnimatedTabsContent,
  AnimatedTabsList,
  AnimatedTabsTrigger,
} from "@/components/ui/animated-tabs";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const TABS = [
  { value: "overview", label: "Overview", body: "Everything at a glance." },
  { value: "activity", label: "Activity", body: "Who changed what, and when." },
  { value: "settings", label: "Settings", body: "Names, keys, and members." },
];

const TRANSITIONS: Record<string, { value?: Transition; code?: string }> = {
  default: {},
  slow: { value: { type: "spring", bounce: 0, duration: 0.8 }, code: '{ type: "spring", bounce: 0, duration: 0.8 }' },
  bouncy: { value: { type: "spring", bounce: 0.35, duration: 0.5 }, code: '{ type: "spring", bounce: 0.35, duration: 0.5 }' },
};

const PILL = "rounded-full bg-primary";
const PILL_TEXT = "data-[active]:text-primary-foreground";

type V = { transition: string; indicatorClassName: string; disabled: boolean };

function Demo({ values: v, refuse }: DemoProps<V>) {
  const [value, setValue] = React.useState<unknown>("overview");
  const primary = v.indicatorClassName === "primary";
  return (
    <AnimatedTabs
      aria-label="Project"
      value={value}
      onValueChange={(next, details) => {
        if (refuse && isAgentChange(details)) return details.cancel();
        setValue(next);
      }}
      transition={TRANSITIONS[v.transition].value}
      className="w-full max-w-sm"
    >
      <AnimatedTabsList>
        {TABS.map((tab) => (
          <AnimatedTabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={v.disabled && tab.value === "settings"}
            indicatorClassName={primary ? PILL : undefined}
            className={primary ? PILL_TEXT : undefined}
          >
            {tab.label}
          </AnimatedTabsTrigger>
        ))}
      </AnimatedTabsList>
      {TABS.map((tab) => (
        <AnimatedTabsContent key={tab.value} value={tab.value}>
          <p className="text-sm text-muted-foreground">{tab.body}</p>
        </AnimatedTabsContent>
      ))}
    </AnimatedTabs>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const t = TRANSITIONS[v.transition].code;
  const primary = v.indicatorClassName === "primary";
  const L: string[] = [];
  L.push(`import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from "@/components/ui/animated-tabs"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "const tabs = [");
  for (const tab of TABS) L.push(`  { value: "${tab.value}", label: "${tab.label}", body: "${tab.body}" },`);
  L.push("]", "", "export function ProjectTabs() {", "  return (", "    <AnimatedTabs");
  L.push('      aria-label="Project"', '      defaultValue="overview"');
  if (t) L.push(`      transition={${t}}`);
  if (refuse) L.push("      onValueChange={(value, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}");
  L.push("    >", "      <AnimatedTabsList>", "        {tabs.map((tab) => (");
  const trig = ["key={tab.value}", "value={tab.value}"];
  if (v.disabled) trig.push('disabled={tab.value === "settings"}');
  if (primary) trig.push(`indicatorClassName="${PILL}"`, `className="${PILL_TEXT}"`);
  if (trig.length > 3) {
    L.push("          <AnimatedTabsTrigger");
    trig.forEach((p) => L.push(`            ${p}`));
    L.push("          >");
  } else {
    L.push(`          <AnimatedTabsTrigger ${trig.join(" ")}>`);
  }
  L.push("            {tab.label}", "          </AnimatedTabsTrigger>", "        ))}", "      </AnimatedTabsList>");
  L.push("      {tabs.map((tab) => (", "        <AnimatedTabsContent key={tab.value} value={tab.value}>");
  L.push("          {tab.body}", "        </AnimatedTabsContent>", "      ))}", "    </AnimatedTabs>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "project-tabs.tsx",
  refusable: true,
  controls: [
    { name: "transition", type: "select", options: ["default", "slow", "bouncy"], default: "default" },
    { name: "indicatorClassName", type: "select", options: ["default", "primary"], default: "default" },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Select Activity", action: "select", args: ["Activity"] },
    { label: "Select Settings", action: "select", args: ["Settings"] },
    { label: "Select Billing", action: "select", args: ["Billing"] },
  ],
  Demo,
  code,
});
