"use client"

import * as React from "react"
import { Meter as MeterPrimitive } from "@base-ui/react/meter"
import { cn } from "@/lib/utils"

const Meter = React.forwardRef<
  React.ComponentRef<typeof MeterPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MeterPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MeterPrimitive.Root ref={ref} className={cn("grid gap-2", className)} {...props} />
))
Meter.displayName = "Meter"

const MeterTrack = React.forwardRef<
  React.ComponentRef<typeof MeterPrimitive.Track>,
  React.ComponentPropsWithoutRef<typeof MeterPrimitive.Track>
>(({ className, ...props }, ref) => (
  <MeterPrimitive.Track
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  />
))
MeterTrack.displayName = "MeterTrack"

const MeterIndicator = React.forwardRef<
  React.ComponentRef<typeof MeterPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof MeterPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <MeterPrimitive.Indicator
    ref={ref}
    className={cn("h-full rounded-full bg-primary transition-[width] duration-200", className)}
    {...props}
  />
))
MeterIndicator.displayName = "MeterIndicator"

const MeterLabel = React.forwardRef<
  React.ComponentRef<typeof MeterPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MeterPrimitive.Label>
>(({ className, ...props }, ref) => (
  <MeterPrimitive.Label
    ref={ref}
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  />
))
MeterLabel.displayName = "MeterLabel"

const MeterValue = React.forwardRef<
  React.ComponentRef<typeof MeterPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof MeterPrimitive.Value>
>(({ className, ...props }, ref) => (
  <MeterPrimitive.Value
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
))
MeterValue.displayName = "MeterValue"

export { Meter, MeterTrack, MeterIndicator, MeterLabel, MeterValue }
