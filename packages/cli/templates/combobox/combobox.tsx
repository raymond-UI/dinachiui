"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

const Combobox = ComboboxPrimitive.Root
const ComboboxValue = ComboboxPrimitive.Value
const ComboboxCollection = ComboboxPrimitive.Collection
const ComboboxPortal = ComboboxPrimitive.Portal

const ComboboxInput = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Input>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm",
      "placeholder:text-muted-foreground",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
))
ComboboxInput.displayName = "ComboboxInput"

const ComboboxTrigger = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-3",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children ?? (
      <ComboboxPrimitive.Icon>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </ComboboxPrimitive.Icon>
    )}
  </ComboboxPrimitive.Trigger>
))
ComboboxTrigger.displayName = "ComboboxTrigger"

const ComboboxClear = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Clear>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Clear>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.Clear
    ref={ref}
    className={cn(
      "inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground",
      "hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children ?? <X className="h-4 w-4" />}
  </ComboboxPrimitive.Clear>
))
ComboboxClear.displayName = "ComboboxClear"

const ComboboxContent = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <ComboboxPortal>
    <ComboboxPrimitive.Positioner sideOffset={4}>
      <ComboboxPrimitive.Popup
        ref={ref}
        className={cn(
          "relative z-50 min-w-48 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
          "origin-(--transform-origin) outline-none",
          "data-starting-style:animate-in data-starting-style:fade-in-0 data-starting-style:zoom-in-95",
          "data-ending-style:animate-out data-ending-style:fade-out-0 data-ending-style:zoom-out-95",
          className
        )}
        {...props}
      />
    </ComboboxPrimitive.Positioner>
  </ComboboxPortal>
))
ComboboxContent.displayName = "ComboboxContent"

const ComboboxList = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.List>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.List
    ref={ref}
    className={cn("max-h-80 overflow-y-auto p-1", className)}
    {...props}
  />
))
ComboboxList.displayName = "ComboboxList"

const ComboboxItem = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, children, inset, ...props }, ref) => (
  <ComboboxPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      inset && "pl-10",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ComboboxPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ComboboxPrimitive.ItemIndicator>
    </span>
    {children}
  </ComboboxPrimitive.Item>
))
ComboboxItem.displayName = "ComboboxItem"

const ComboboxGroup = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Group>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Group ref={ref} className={cn(className)} {...props} />
))
ComboboxGroup.displayName = "ComboboxGroup"

const ComboboxGroupLabel = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.GroupLabel
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
    {...props}
  />
))
ComboboxGroupLabel.displayName = "ComboboxGroupLabel"

const ComboboxEmpty = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Empty
    ref={ref}
    className={cn("p-2 text-center text-sm text-muted-foreground", className)}
    {...props}
  />
))
ComboboxEmpty.displayName = "ComboboxEmpty"

const ComboboxStatus = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Status>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Status>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Status ref={ref} className={cn("sr-only", className)} {...props} />
))
ComboboxStatus.displayName = "ComboboxStatus"

const ComboboxSeparator = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
ComboboxSeparator.displayName = "ComboboxSeparator"

export {
  Combobox,
  ComboboxValue,
  ComboboxCollection,
  ComboboxPortal,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxEmpty,
  ComboboxStatus,
  ComboboxSeparator,
}
