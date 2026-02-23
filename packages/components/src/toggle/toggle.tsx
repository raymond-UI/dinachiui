"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "@dinachi/core"

const toggleVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md text-sm font-medium",
    "ring-offset-background transition-all duration-200 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-transparent",
          "hover:bg-muted hover:text-muted-foreground",
          "data-[pressed]:hover:bg-accent/90",
          "data-[pressed]:data-[disabled]:bg-accent/50",
        ],
        outline: [
          "border border-input bg-transparent",
          "hover:bg-accent hover:text-accent-foreground hover:border-accent",
          "data-[pressed]:bg-accent data-[pressed]:text-accent-foreground data-[pressed]:border-accent",
          "data-[pressed]:hover:bg-accent/90",
          "data-[disabled]:border-input/50",
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
  React.ComponentRef<typeof TogglePrimitive>,
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
