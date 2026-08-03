"use client";

import * as React from "react";
import {
  AnimatedTabs,
  AnimatedTabsList,
  AnimatedTabsTrigger,
  AnimatedTabsContent,
} from "@/components/ui/animated-tabs";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

const TABS = [
  { value: "overview", label: "Overview", body: "Everything at a glance." },
  { value: "activity", label: "Activity", body: "Who changed what, and when." },
  { value: "settings", label: "Settings", body: "Names, keys, and members." },
];

/**
 * The triggers and panels, shared by the uncontrolled and controlled examples so the
 * two differ only in the one thing they are there to contrast.
 */
function Panels() {
  return (
    <>
      <AnimatedTabsList>
        {TABS.map((tab) => (
          <AnimatedTabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </AnimatedTabsTrigger>
        ))}
      </AnimatedTabsList>
      {TABS.map((tab) => (
        <AnimatedTabsContent key={tab.value} value={tab.value}>
          <p className="text-sm text-muted-foreground">{tab.body}</p>
        </AnimatedTabsContent>
      ))}
    </>
  );
}

export function DefaultAnimatedTabsExample() {
  return (
    <AnimatedTabs defaultValue="overview" className="w-full max-w-sm">
      <Panels />
    </AnimatedTabs>
  );
}

/** The pill takes a class of its own, so it can be themed without touching the tab. */
export function AnimatedTabsStyledExample() {
  return (
    <AnimatedTabs defaultValue="week" className="w-full max-w-sm">
      <AnimatedTabsList className="bg-transparent p-0">
        {["Day", "Week", "Month"].map((label) => (
          <AnimatedTabsTrigger
            key={label}
            value={label.toLowerCase()}
            indicatorClassName="rounded-md bg-primary"
            className="rounded-md data-[selected]:text-primary-foreground"
          >
            {label}
          </AnimatedTabsTrigger>
        ))}
      </AnimatedTabsList>
    </AnimatedTabs>
  );
}

/**
 * Controlled, so the selection can be driven from somewhere the tabs cannot see. The
 * pill travels either way — what moves it is the value changing, not the click.
 */
export function AnimatedTabsControlledExample() {
  const [value, setValue] = React.useState("overview");

  function next() {
    const index = TABS.findIndex((tab) => tab.value === value);
    setValue(TABS[(index + 1) % TABS.length].value);
  }

  return (
    <>
      <PreviewAction>
        <Button variant="outline" size="sm" onClick={next}>
          Next tab
        </Button>
      </PreviewAction>
      <AnimatedTabs
        value={value}
        onValueChange={(next) => setValue(next as string)}
        className="w-full max-w-sm"
      >
        <Panels />
      </AnimatedTabs>
    </>
  );
}
