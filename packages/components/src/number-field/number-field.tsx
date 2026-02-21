"use client"

import * as React from "react"
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { Minus, Plus } from "lucide-react"
import { cn } from "@dinachi/core"

const NumberField = NumberFieldPrimitive.Root

const NumberFieldGroup = React.forwardRef<
  React.ComponentRef<typeof NumberFieldPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Group>
>(({ className, ...props }, ref) => (
  <NumberFieldPrimitive.Group
    ref={ref}
    className={cn(
      "inline-flex h-10 w-full items-stretch overflow-hidden rounded-md border border-input bg-background",
      className
    )}
    {...props}
  />
))
NumberFieldGroup.displayName = "NumberFieldGroup"

const NumberFieldInput = React.forwardRef<
  React.ComponentRef<typeof NumberFieldPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Input>
>(({ className, ...props }, ref) => (
  <NumberFieldPrimitive.Input
    ref={ref}
    className={cn(
      "w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
))
NumberFieldInput.displayName = "NumberFieldInput"

const NumberFieldIncrement = React.forwardRef<
  React.ComponentRef<typeof NumberFieldPrimitive.Increment>,
  React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Increment>
>(({ className, children, ...props }, ref) => (
  <NumberFieldPrimitive.Increment
    ref={ref}
    className={cn(
      "inline-flex h-full items-center justify-center border-l border-input px-3 text-muted-foreground transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children ?? <Plus className="h-4 w-4" />}
  </NumberFieldPrimitive.Increment>
))
NumberFieldIncrement.displayName = "NumberFieldIncrement"

const NumberFieldDecrement = React.forwardRef<
  React.ComponentRef<typeof NumberFieldPrimitive.Decrement>,
  React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Decrement>
>(({ className, children, ...props }, ref) => (
  <NumberFieldPrimitive.Decrement
    ref={ref}
    className={cn(
      "inline-flex h-full items-center justify-center border-r border-input px-3 text-muted-foreground transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children ?? <Minus className="h-4 w-4" />}
  </NumberFieldPrimitive.Decrement>
))
NumberFieldDecrement.displayName = "NumberFieldDecrement"

const NumberFieldScrubArea = React.forwardRef<
  React.ComponentRef<typeof NumberFieldPrimitive.ScrubArea>,
  React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.ScrubArea>
>(({ className, ...props }, ref) => (
  <NumberFieldPrimitive.ScrubArea
    ref={ref}
    className={cn("cursor-ew-resize", className)}
    {...props}
  />
))
NumberFieldScrubArea.displayName = "NumberFieldScrubArea"

const NumberFieldScrubAreaCursor = React.forwardRef<
  React.ComponentRef<typeof NumberFieldPrimitive.ScrubAreaCursor>,
  React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.ScrubAreaCursor>
>(({ className, ...props }, ref) => (
  <NumberFieldPrimitive.ScrubAreaCursor
    ref={ref}
    className={cn("text-muted-foreground", className)}
    {...props}
  />
))
NumberFieldScrubAreaCursor.displayName = "NumberFieldScrubAreaCursor"

export {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
}
