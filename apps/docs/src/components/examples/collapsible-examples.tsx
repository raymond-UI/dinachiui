"use client"

import React from 'react';
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export function DefaultCollapsibleExample() {
  return (
    <Collapsible className="w-full max-w-sm">
      <CollapsibleTrigger>
        <span>View more details</span>
        <ChevronDown className="h-4 w-4 transition-transform" />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="px-4 pb-4 text-sm text-muted-foreground">
          This is the collapsible content. It can contain any elements you need,
          including text, images, or other components.
        </div>
      </CollapsiblePanel>
    </Collapsible>
  );
}

export function ControlledCollapsibleExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="w-full max-w-sm space-y-2">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>
          <span>{open ? 'Hide' : 'Show'} settings</span>
          <ChevronDown className="h-4 w-4 transition-transform" />
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <div className="space-y-2 px-4 pb-4">
            <div className="rounded-md border px-4 py-3 text-sm">Setting 1</div>
            <div className="rounded-md border px-4 py-3 text-sm">Setting 2</div>
            <div className="rounded-md border px-4 py-3 text-sm">Setting 3</div>
          </div>
        </CollapsiblePanel>
      </Collapsible>
      <p className="text-xs text-muted-foreground px-4">
        State: {open ? 'Open' : 'Closed'}
      </p>
    </div>
  );
}
