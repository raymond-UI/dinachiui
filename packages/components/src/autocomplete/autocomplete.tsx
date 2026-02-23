"use client"

import * as React from "react"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@dinachi/core"

const Autocomplete = AutocompletePrimitive.Root
const AutocompleteValue = AutocompletePrimitive.Value
const AutocompleteCollection = AutocompletePrimitive.Collection
const AutocompletePortal = AutocompletePrimitive.Portal

const AutocompleteInput = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Input>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.Input
    ref={ref}
    className={cn(
      "flex h-10 w-full bg-transparent px-3 py-2 text-sm",
      "placeholder:text-muted-foreground",
      "focus:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
))
AutocompleteInput.displayName = "AutocompleteInput"

const AutocompleteTrigger = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AutocompletePrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center px-3",
      "focus-visible:outline-none",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children ?? (
      <AutocompletePrimitive.Icon>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </AutocompletePrimitive.Icon>
    )}
  </AutocompletePrimitive.Trigger>
))
AutocompleteTrigger.displayName = "AutocompleteTrigger"

const AutocompleteClear = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Clear>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Clear>
>(({ className, children, ...props }, ref) => (
  <AutocompletePrimitive.Clear
    ref={ref}
    className={cn(
      "inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground",
      "hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children ?? <X className="h-4 w-4" />}
  </AutocompletePrimitive.Clear>
))
AutocompleteClear.displayName = "AutocompleteClear"

const AutocompleteContent = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Popup> & {
    readonly portal?: boolean
  }
>(({ className, portal = true, ...props }, ref) => {
  const content = (
    <AutocompletePrimitive.Positioner sideOffset={4}>
      <AutocompletePrimitive.Popup
        ref={ref}
        className={cn(
          "relative z-50 min-w-(--anchor-width) overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
          "origin-(--transform-origin) outline-none",
          "data-starting-style:animate-in data-starting-style:fade-in-0 data-starting-style:zoom-in-95",
          "data-ending-style:animate-out data-ending-style:fade-out-0 data-ending-style:zoom-out-95",
          className
        )}
        {...props}
      />
    </AutocompletePrimitive.Positioner>
  )

  if (!portal) return content

  return <AutocompletePortal>{content}</AutocompletePortal>
})
AutocompleteContent.displayName = "AutocompleteContent"

const AutocompleteList = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.List>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.List>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.List
    ref={ref}
    className={cn("max-h-80 overflow-y-auto p-1", className)}
    {...props}
  />
))
AutocompleteList.displayName = "AutocompleteList"

const AutocompleteItem = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Item> & {
    inset?: boolean
  }
>(({ className, children, inset, ...props }, ref) => (
  <AutocompletePrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm lg:text-base outline-none",
      "data-highlighted:bg-accent font-normal data-highlighted:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
  </AutocompletePrimitive.Item>
))
AutocompleteItem.displayName = "AutocompleteItem"

const AutocompleteGroup = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Group>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.Group ref={ref} className={cn(className)} {...props} />
))
AutocompleteGroup.displayName = "AutocompleteGroup"

const AutocompleteGroupLabel = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.GroupLabel
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
    {...props}
  />
))
AutocompleteGroupLabel.displayName = "AutocompleteGroupLabel"

const AutocompleteEmpty = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Empty>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.Empty
    ref={ref}
    className={cn("p-2 text-center text-sm text-muted-foreground", className)}
    {...props}
  />
))
AutocompleteEmpty.displayName = "AutocompleteEmpty"

const AutocompleteStatus = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Status>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Status>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.Status ref={ref} className={cn("sr-only", className)} {...props} />
))
AutocompleteStatus.displayName = "AutocompleteStatus"

const AutocompleteSeparator = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Separator>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
AutocompleteSeparator.displayName = "AutocompleteSeparator"

export {
  Autocomplete,
  AutocompleteValue,
  AutocompleteCollection,
  AutocompletePortal,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteEmpty,
  AutocompleteStatus,
  AutocompleteSeparator,
}
