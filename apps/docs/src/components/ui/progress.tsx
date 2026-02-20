"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Root ref={ref} className={cn("grid gap-2", className)} {...props} />
))
Progress.displayName = "Progress"

const ProgressTrack = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Track>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Track>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Track
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  />
))
ProgressTrack.displayName = "ProgressTrack"

const ProgressIndicator = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Indicator
    ref={ref}
    className={cn("h-full rounded-full bg-primary transition-[width] duration-200", className)}
    {...props}
  />
))
ProgressIndicator.displayName = "ProgressIndicator"

const ProgressLabel = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Label>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Label
    ref={ref}
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  />
))
ProgressLabel.displayName = "ProgressLabel"

const ProgressValue = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Value>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Value
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
))
ProgressValue.displayName = "ProgressValue"

export { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue }
