"use client"

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Trash2 } from 'lucide-react';

export function DefaultTooltipExample() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Plus className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          Add new item
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function TooltipPositionsExample() {
  return (
    <TooltipProvider>
      <div className="flex gap-4 flex-wrap">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>Top</TooltipTrigger>
          <TooltipContent side="top">Tooltip on top</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>Bottom</TooltipTrigger>
          <TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>Left</TooltipTrigger>
          <TooltipContent side="left">Tooltip on left</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>Right</TooltipTrigger>
          <TooltipContent side="right">Tooltip on right</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export function TooltipCloseOnClickExample() {
  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />} closeOnClick={true}>
            Dismisses on click
          </TooltipTrigger>
          <TooltipContent>This tooltip closes when you click the trigger (default)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />} closeOnClick={false}>
            Persists on click
          </TooltipTrigger>
          <TooltipContent>This tooltip stays open when you click the trigger</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export function TooltipVariantsExample() {
  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon" />}>
            <Settings className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent variant="default">Default tooltip</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon" />}>
            <Trash2 className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent variant="inverse">Inverse tooltip</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
