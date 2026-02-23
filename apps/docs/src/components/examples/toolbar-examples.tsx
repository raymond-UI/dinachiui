"use client"

import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarGroup,
  ToolbarLink,
  ToolbarInput,
} from '@/components/ui/toolbar';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { Bold, Italic, Underline, Link, AlignLeft, AlignCenter, AlignRight, Search } from 'lucide-react';

export function DefaultToolbarExample() {
  return (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarButton aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Underline">
          <Underline className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Align right">
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarLink href="#">
        <Link className="mr-1 h-4 w-4" />
        Insert Link
      </ToolbarLink>
    </Toolbar>
  );
}

export function ToolbarWithTogglesExample() {
  return (
    <Toolbar>
      <ToggleGroup defaultValue={["bold"]} multiple>
        <ToolbarButton render={<Toggle value="bold" />} aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton render={<Toggle value="italic" />} aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton render={<Toggle value="underline" />} aria-label="Underline">
          <Underline className="h-4 w-4" />
        </ToolbarButton>
      </ToggleGroup>
      <ToolbarSeparator />
      <ToggleGroup defaultValue={["align-left"]}>
        <ToolbarButton render={<Toggle value="align-left" />} aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton render={<Toggle value="align-center" />} aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton render={<Toggle value="align-right" />} aria-label="Align right">
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
      </ToggleGroup>
    </Toolbar>
  );
}

export function ToolbarWithInputExample() {
  return (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarButton aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarLink href="#">
        <Link className="mr-1 h-4 w-4" />
        Insert Link
      </ToolbarLink>
      <ToolbarSeparator />
      <div className="relative flex items-center">
        <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
        <ToolbarInput placeholder="Search..." className="h-8 w-40 pl-7" />
      </div>
    </Toolbar>
  );
}

export function ToolbarVerticalExample() {
  return (
    <Toolbar orientation="vertical" className="inline-flex flex-col">
      <ToolbarButton aria-label="Bold">
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton aria-label="Italic">
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton aria-label="Underline">
        <Underline className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarSeparator orientation="horizontal" />
      <ToolbarButton aria-label="Align left">
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton aria-label="Align center">
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton aria-label="Align right">
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
    </Toolbar>
  );
}
