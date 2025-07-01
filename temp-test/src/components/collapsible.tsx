"use client"

import * as React from "react"
import { Collapsible as BaseCollapsible } from "@base-ui-components/react/collapsible"
import { cn } from "@/lib/utils"

const Collapsible = React.forwardRef<
  React.ElementRef<typeof BaseCollapsible.Root>,
  React.ComponentPropsWithoutRef<typeof BaseCollapsible.Root>
>(({ className, ...props }, ref) => (
  <BaseCollapsible.Root ref={ref} className={cn("w-full", className)} {...props} />
))
Collapsible.displayName = "Collapsible"

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof BaseCollapsible.Trigger>,
  React.ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger>
>(({ className, ...props }, ref) => (
  <BaseCollapsible.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between rounded-md p-4 font-medium transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "[&[data-panel-open]>svg]:rotate-180",
      className
    )}
    {...props}
  />
))
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsiblePanel = React.forwardRef<
  React.ElementRef<typeof BaseCollapsible.Panel>,
  React.ComponentPropsWithoutRef<typeof BaseCollapsible.Panel>
>(({ className, ...props }, ref) => (
  <BaseCollapsible.Panel
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all",
      "data-[ending-style]:h-0 data-[starting-style]:h-0",
      "data-[open]:animate-in data-[open]:slide-down-from-top",
      "data-[closed]:animate-out data-[closed]:slide-up-to-top",
      className
    )}
    style={{
      "--collapsible-panel-height": "var(--collapsible-panel-height)",
      "--collapsible-panel-width": "var(--collapsible-panel-width)",
    } as React.CSSProperties}
    {...props}
  />
))
CollapsiblePanel.displayName = "CollapsiblePanel"

export type CollapsibleProps = React.ComponentPropsWithoutRef<typeof BaseCollapsible.Root>
export type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger>
export type CollapsiblePanelProps = React.ComponentPropsWithoutRef<typeof BaseCollapsible.Panel>

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsiblePanel,
}
