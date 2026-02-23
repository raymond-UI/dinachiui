"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "@dinachi/core"

const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive ref={ref} className={cn("grid gap-2", className)} {...props} />
))
RadioGroup.displayName = "RadioGroup"

const RadioIndicator = React.forwardRef<
  React.ComponentRef<typeof RadioPrimitive.Indicator>,
  React.ComponentProps<typeof RadioPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <RadioPrimitive.Indicator
    ref={ref}
    className={cn(
      "flex items-center justify-center",
      "after:h-2.5 after:w-2.5 after:rounded-full after:bg-current",
      className
    )}
    {...props}
  />
))
RadioIndicator.displayName = "RadioIndicator"

const Radio = React.forwardRef<
  React.ComponentRef<typeof RadioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioPrimitive.Root>
>(({ className, ...props }, ref) => (
  <span className="relative inline-flex [&>input]:!absolute">
    <RadioPrimitive.Root
      ref={ref}
      className={cn(
        "flex items-center justify-center aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        "data-[checked]:border-primary data-[unchecked]:border-muted-foreground",
        className
      )}
      {...props}
    >
      <RadioIndicator />
    </RadioPrimitive.Root>
  </span>
))
Radio.displayName = "Radio"

export { Radio, RadioGroup, RadioIndicator }
