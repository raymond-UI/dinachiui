// @ts-nocheck
"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui-components/react/toggle"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  // Base styles with improved state handling
  [
    "inline-flex items-center justify-center rounded-md text-sm font-medium",
    "ring-offset-background transition-all duration-200 ease-in-out",
    // Focus styles
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    // Disabled styles
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    // Pressed/Active state styles using Base UI data attributes
    "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
    "data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-transparent",
          // Hover states
          "hover:bg-muted hover:text-muted-foreground",
          // Pressed hover states
          "data-[state=on]:hover:bg-accent/90",
          "data-[pressed]:hover:bg-accent/90",
          // Disabled pressed state
          "data-[state=on]:data-[disabled]:bg-accent/50",
          "data-[pressed]:data-[disabled]:bg-accent/50",
        ],
        outline: [
          "border border-input bg-transparent",
          // Hover states
          "hover:bg-accent hover:text-accent-foreground hover:border-accent",
          // Pressed states for outline variant
          "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:border-accent",
          "data-[pressed]:bg-accent data-[pressed]:text-accent-foreground data-[pressed]:border-accent",
          // Pressed hover states
          "data-[state=on]:hover:bg-accent/90",
          "data-[pressed]:hover:bg-accent/90",
          // Disabled states
          "data-[disabled]:border-input/50",
          "data-[state=on]:data-[disabled]:bg-accent/50 data-[state=on]:data-[disabled]:border-accent/50",
          "data-[pressed]:data-[disabled]:bg-accent/50 data-[pressed]:data-[disabled]:border-accent/50",
        ],
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5 text-xs",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive>,
    VariantProps<typeof toggleVariants> {}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
))

Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }
