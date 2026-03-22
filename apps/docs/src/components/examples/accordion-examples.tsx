"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion";

export function DefaultAccordionExample() {
  return (
    <Accordion defaultValue={["item-1"]} className="w-full">
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Yes. It adheres to the WAI-ARIA design pattern and uses semantic HTML elements.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Is it styled?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Yes. It comes with default styles that matches the other components&apos; aesthetic.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionHeader>
          <AccordionTrigger>Is it animated?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Yes. It&apos;s animated by default, but you can disable it if you prefer.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export function MultipleAccordionExample() {
  return (
    <Accordion multiple className="w-full">
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>Getting Started</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <div className="space-y-2">
            <p>Start by installing the required dependencies:</p>
            <code className="block p-2 bg-muted rounded text-sm">
              npm install @dinachi/components
            </code>
          </div>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Configuration</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <div className="space-y-2">
            <p>Configure your project with the following steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Set up your CSS variables</li>
              <li>Configure your Tailwind config</li>
              <li>Add the provider to your app</li>
            </ol>
          </div>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionHeader>
          <AccordionTrigger>Advanced Usage</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Learn about advanced patterns including controlled state, custom styling, and integration with forms.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export function ControlledAccordionExample() {
  const [value, setValue] = React.useState<string[]>(["features"]);

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
        Controlled value: {value.length > 0 ? value.join(", ") : "none"}
      </div>

      <Accordion
        value={value}
        onValueChange={(nextValue) => setValue(nextValue as string[])}
      >
        <AccordionItem value="features">
          <AccordionHeader>
            <AccordionTrigger>Features</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            Our component library includes over 20 production-ready components with full TypeScript support.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="pricing">
          <AccordionHeader>
            <AccordionTrigger>Pricing</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            DinachiUI is completely free and open source. Use it in your personal and commercial projects.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="support">
          <AccordionHeader>
            <AccordionTrigger>Support</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            Get support through our GitHub issues, Discord community, or comprehensive documentation.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function DisabledAccordionExample() {
  return (
    <Accordion defaultValue={["available"]} className="w-full">
      <AccordionItem value="available">
        <AccordionHeader>
          <AccordionTrigger>Available Section</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          This item is interactive and behaves like a standard accordion section.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="disabled" disabled>
        <AccordionHeader>
          <AccordionTrigger>Disabled Section</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Disabled accordion items keep their structure but ignore pointer and keyboard interaction.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="notes">
        <AccordionHeader>
          <AccordionTrigger>Notes</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Use item-level <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">disabled</code> when only
          one section should be locked while the rest remain interactive.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export function PersistentAccordionExample() {
  const [draft, setDraft] = React.useState("Draft notes stay mounted between toggles.");
  const [events, setEvents] = React.useState<Array<{ id: number; message: string }>>([]);

  return (
    <div className="w-full space-y-4">
      <Accordion className="w-full">
        <AccordionItem
          value="draft"
          onOpenChange={(open) => {
            setEvents((current) => [
              {
                id: Date.now() + current.length,
                message: `${open ? "Opened" : "Closed"} draft section`,
              },
              ...current,
            ].slice(0, 3));
          }}
        >
          <AccordionHeader>
            <AccordionTrigger>Persistent Draft</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel keepMounted>
            <div className="space-y-3">
              <p className="text-muted-foreground">
                This panel uses <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">keepMounted</code>,
                so field state is preserved after collapse.
              </p>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="search">
          <AccordionHeader>
            <AccordionTrigger>Find-in-Page Friendly Content</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel hiddenUntilFound>
            Content inside this panel can be revealed by the browser&apos;s built-in find-in-page when
            <code className="ml-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">hiddenUntilFound</code> is enabled.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Recent item events</p>
        <ul className="mt-2 space-y-1">
          {events.length > 0 ? (
            events.map((event) => <li key={event.id}>{event.message}</li>)
          ) : (
            <li>Open or close the draft section to see item-level events.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
