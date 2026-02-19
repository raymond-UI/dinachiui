"use client"

import * as React from "react"
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset"
import { cn } from "@dinachi/core"

const Fieldset = React.forwardRef<
  React.ComponentRef<typeof FieldsetPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof FieldsetPrimitive.Root>
>(({ className, ...props }, ref) => (
  <FieldsetPrimitive.Root
    ref={ref}
    className={cn("space-y-3 rounded-lg border p-4", className)}
    {...props}
  />
))
Fieldset.displayName = "Fieldset"

const FieldsetLegend = React.forwardRef<
  React.ComponentRef<typeof FieldsetPrimitive.Legend>,
  React.ComponentPropsWithoutRef<typeof FieldsetPrimitive.Legend>
>(({ className, ...props }, ref) => (
  <FieldsetPrimitive.Legend
    ref={ref}
    className={cn("px-1 text-sm font-medium", className)}
    {...props}
  />
))
FieldsetLegend.displayName = "FieldsetLegend"

export { Fieldset, FieldsetLegend }
