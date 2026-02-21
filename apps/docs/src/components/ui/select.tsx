"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"

// Re-export root components for better tree-shaking
const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

// Optimized SelectTrigger with better type safety and performance
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

// Optimized SelectContent with better positioning and performance
const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Popup> & {
    readonly position?: "item-aligned" | "popper"
    readonly sideOffset?: number
    readonly portal?: boolean
  }
>(({ className, children, position = "popper", sideOffset = 4, portal = true, ...props }, ref) => {
  const content = (
    <SelectPrimitive.Positioner
      sideOffset={sideOffset}
      alignItemWithTrigger={position === "item-aligned"}
    >
      <SelectPrimitive.Popup
        ref={ref}
        className={cn(
          "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        {...props}
      >
        <SelectScrollUpArrow />
        <div className="overflow-y-auto p-1">
          {children}
        </div>
        <SelectScrollDownArrow />
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  )

  if (!portal) return content

  return <SelectPrimitive.Portal>{content}</SelectPrimitive.Portal>
})
SelectContent.displayName = "SelectContent"

// Add scroll arrows for better UX with large lists
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

// Optimized SelectLabel with better accessibility
const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.GroupLabel
    ref={ref}
    className={cn("py-1.5 pl-2 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = "SelectLabel"

// Optimized SelectItem with conditional indicator and better type safety
const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    readonly inset?: boolean
    readonly showIndicator?: boolean
    readonly indicatorIcon?: React.ReactNode
    readonly indicatorPosition?: "left" | "right"
  }
>(({ 
  className, 
  children, 
  inset, 
  showIndicator = false, 
  indicatorIcon = <Check className="h-4 w-4" />,
  indicatorPosition = "left",
  ...props 
}, ref) => {
  const isLeftIndicator = indicatorPosition === "left"
  const isRightIndicator = indicatorPosition === "right"
  
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        // Dynamic padding based on indicator presence and position
        showIndicator && isLeftIndicator && "pl-8",
        showIndicator && isRightIndicator && "pr-8",
        !showIndicator && "px-2",
        inset && !showIndicator && "pl-8",
        inset && showIndicator && isLeftIndicator && "pl-8",
        !inset && !showIndicator && "pl-2",
        className
      )}
      {...props}
    >
      {/* Left indicator */}
      {showIndicator && isLeftIndicator && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            {indicatorIcon}
          </SelectPrimitive.ItemIndicator>
        </span>
      )}
      
      <SelectPrimitive.ItemText className="flex-1">
        {children}
      </SelectPrimitive.ItemText>
      
      {/* Right indicator */}
      {showIndicator && isRightIndicator && (
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            {indicatorIcon}
          </SelectPrimitive.ItemIndicator>
        </span>
      )}
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = "SelectItem"

// Optimized SelectSeparator
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
  SelectLabel,
  SelectItem,
  SelectSeparator,
}