"use client"

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export function DefaultToggleGroupExample() {
  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function SingleToggleGroupExample() {
  return (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function ToggleGroupSizesExample() {
  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold" size="sm" aria-label="Bold">
          <Bold className="h-3 w-3" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" size="sm" aria-label="Italic">
          <Italic className="h-3 w-3" />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold" size="default" aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" size="default" aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold" size="lg" aria-label="Bold">
          <Bold className="h-5 w-5" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" size="lg" aria-label="Italic">
          <Italic className="h-5 w-5" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
