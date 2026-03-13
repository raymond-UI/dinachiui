"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "@dinachi/core"
import { Check, ChevronDown } from "lucide-react"

// Direct re-exports
const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    readonly children?: React.ReactNode
  }
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Popup> & {
    readonly alignItemWithTrigger?: boolean
    readonly sideOffset?: number
    readonly portal?: boolean
  }
>(({ className, children, alignItemWithTrigger = false, sideOffset = 4, portal = true, ...props }, ref) => {
  const content = (
    <SelectPrimitive.Positioner
      sideOffset={sideOffset}
      alignItemWithTrigger={alignItemWithTrigger}
    >
      <SelectPrimitive.Popup
        ref={ref}
        className={cn(
          "relative z-50 max-h-96 min-w-[var(--anchor-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
          "data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          !alignItemWithTrigger &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        {...props}
      >
        <SelectScrollUpArrow />
        <SelectPrimitive.List className="overflow-y-auto p-1">
          {children}
        </SelectPrimitive.List>
        <SelectScrollDownArrow />
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  )

  if (!portal) return content

  return <SelectPrimitive.Portal>{content}</SelectPrimitive.Portal>
})
SelectContent.displayName = "SelectContent"

const SelectBackdrop = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Backdrop
    ref={ref}
    className={cn("fixed inset-0 z-40", className)}
    {...props}
  />
))
SelectBackdrop.displayName = "SelectBackdrop"

const SelectScrollUpArrow = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollUpArrow>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpArrow>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpArrow
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4 rotate-180" />
  </SelectPrimitive.ScrollUpArrow>
))
SelectScrollUpArrow.displayName = "SelectScrollUpArrow"

const SelectScrollDownArrow = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollDownArrow>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownArrow>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownArrow
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownArrow>
))
SelectScrollDownArrow.displayName = "SelectScrollDownArrow"

const SelectFieldLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
))
SelectFieldLabel.displayName = "SelectFieldLabel"

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.GroupLabel
    ref={ref}
    className={cn("py-1.5 pl-2 pr-2 text-sm font-medium", className)}
    {...props}
  />
))
SelectLabel.displayName = "SelectLabel"

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    readonly showIndicator?: boolean
  }
>(({ className, children, showIndicator = false, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      showIndicator ? "pl-8 pr-2" : "px-2",
      className
    )}
    {...props}
  >
    {showIndicator && (
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    )}
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = "SelectItem"

const SelectItemIndicator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ItemIndicator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ItemIndicator>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.ItemIndicator
    ref={ref}
    className={cn("flex h-3.5 w-3.5 items-center justify-center", className)}
    {...props}
  >
    {children ?? <Check className="h-4 w-4" />}
  </SelectPrimitive.ItemIndicator>
))
SelectItemIndicator.displayName = "SelectItemIndicator"

const SelectArrow = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Arrow
    ref={ref}
    className={cn("fill-popover stroke-border", className)}
    {...props}
  />
))
SelectArrow.displayName = "SelectArrow"

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectBackdrop,
  SelectFieldLabel,
  SelectLabel,
  SelectItem,
  SelectItemIndicator,
  SelectArrow,
  SelectScrollUpArrow,
  SelectScrollDownArrow,
  SelectSeparator,
}
