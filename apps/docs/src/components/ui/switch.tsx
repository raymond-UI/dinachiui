"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[checked]:bg-primary data-[unchecked]:bg-input",
      className
    )}
    {...props}
  />
))
Switch.displayName = "Switch"

const SwitchThumb = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Thumb
    ref={ref}
    className={cn(
      "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
      "data-[checked]:translate-x-5 data-[unchecked]:translate-x-0",
      className
    )}
    {...props}
  />
))
SwitchThumb.displayName = "SwitchThumb"

export { Switch, SwitchThumb }
