"use client"

import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarGroup,
  ToolbarLink,
} from '@/components/ui/toolbar';
import { Bold, Italic, Underline, Link, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

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

export function ToolbarWithLabelsExample() {
  return (
    <Toolbar>
      <ToolbarButton>
        <Bold className="mr-1 h-4 w-4" />
        Bold
      </ToolbarButton>
      <ToolbarButton>
        <Italic className="mr-1 h-4 w-4" />
        Italic
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>Heading 1</ToolbarButton>
      <ToolbarButton>Heading 2</ToolbarButton>
    </Toolbar>
  );
}
