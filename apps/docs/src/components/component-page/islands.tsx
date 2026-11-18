"use client";

import * as React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CopyButton, FoldedCode, useCopy } from "./shared";

/*
 * The interactive pieces of a component page. Each one takes what the server already
 * rendered (highlighted code, previews, prose) as props, so the page arrives as complete
 * HTML and these only add the taps.
 */

const indicator =
  "bottom-auto left-0 top-0 z-0 h-[var(--active-tab-height)] translate-y-[var(--active-tab-top)] rounded-md bg-muted";
const trigger =
  "relative z-10 h-full shrink-0 rounded-md px-3 text-[13px] focus-visible:ring-offset-0 data-[active]:bg-transparent data-[active]:shadow-none";

export function InstallBar({ command }: { command: string }) {
  const [copied, copy] = useCopy();
  return (
    <div className="flex h-11 min-w-0 items-center gap-2 rounded-lg border bg-card pl-3.5 pr-1.5 font-mono text-[13px] md:h-10">
      <span className="text-muted-foreground">$</span>
      <span tabIndex={0} className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-sm [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{command}</span>
      <Button size="sm" className="h-8 px-3 font-sans text-xs" onClick={() => copy("install", command)}>
        {copied === "install" ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}

export function ExampleTabs({ items }: { items: { id: string; title: string; panel: React.ReactNode }[] }) {
  return (
    <Tabs defaultValue={items[0]?.id}>
      <TabsList className="relative -mx-1 flex h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-1 [scrollbar-width:none]">
        <TabsIndicator className={indicator} />
        {items.map((ex) => (
          <TabsTrigger key={ex.id} value={ex.id} className={cn(trigger, "h-9")}>
            {ex.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((ex) => (
        <TabsContent key={ex.id} value={ex.id} keepMounted className="mt-3 data-[hidden]:hidden">
          {ex.panel}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function ExampleCode({ code, html, description }: { code: string; html: string; description: string }) {
  return (
    <div className="cp-code border-t">
      <div className="flex items-center justify-between gap-4 px-4 py-1.5">
        <span className="truncate text-[13px] text-muted-foreground">{description}</span>
        <CopyButton text={code} />
      </div>
      <FoldedCode code={code} html={html} fold={10} height="max-h-[200px]" />
    </div>
  );
}

export function CodeCard({ code, html, file }: { code: string; html: string; file?: string }) {
  return (
    <div className="cp-code overflow-hidden rounded-xl border bg-card">
      <div className={cn("flex items-center px-2 py-1", file ? "justify-between pl-4" : "justify-end")}>
        {file && <span className="font-mono text-xs text-muted-foreground">{file}</span>}
        <CopyButton text={code} />
      </div>
      <FoldedCode code={code} html={html} />
    </div>
  );
}

export function ApiAccordion({ parts }: { parts: { name: string; summary: React.ReactNode; body: React.ReactNode }[] }) {
  return (
    <Accordion defaultValue={[parts[0]?.name]}>
      {parts.map((part) => (
        <AccordionItem key={part.name} value={part.name}>
          <AccordionHeader>
            <AccordionTrigger className="gap-3 py-3.5 text-left hover:no-underline md:py-4">
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 md:flex-row md:items-baseline md:gap-3">
                <code className="font-mono text-sm">{part.name}</code>
                <span className="text-[13px] font-normal text-muted-foreground">{part.summary}</span>
              </span>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel hiddenUntilFound>{part.body}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** The key table: always shown on desktop, folded behind one row on phones. */
export function KeyboardBlock({ count, children }: { count: number; children: React.ReactNode }) {
  return (
    <>
      <div className="mt-8 hidden md:block">
        <h3 className="mb-1 text-sm font-medium">Keyboard</h3>
        {children}
      </div>
      <Collapsible className="mt-6 border-y md:hidden">
        <CollapsibleTrigger className="flex h-12 w-full items-center justify-between px-0 text-left text-sm font-medium">
          Keyboard
          <span className="text-xs font-normal text-muted-foreground">{count} keys</span>
        </CollapsibleTrigger>
        <CollapsiblePanel hiddenUntilFound>{children}</CollapsiblePanel>
      </Collapsible>
    </>
  );
}
