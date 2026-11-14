"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { agentChecked, changeAsAgent, useAgentControl, useAgentState, useMergedRef } from "@/components/ui/agent"

const toggleVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md text-sm font-medium",
    "ring-offset-background transition-colors duration-[var(--motion-duration-fast,150ms)]",
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

/**
 * Base UI's toggle, holding its own pressed state so an agent can press it the way a
 * parent would. Controlled use is unchanged, and `onPressedChange` sees the agent's
 * changes first and can cancel them. The agent reads pressed as `checked`.
 */
const Toggle = React.forwardRef<
  React.ComponentRef<typeof TogglePrimitive>,
  ToggleProps
>(({ className, variant, size, pressed: pressedProp, defaultPressed = false, onPressedChange, ...props }, ref) => {
  const [pressed, change] = useAgentState<boolean, TogglePrimitive.ChangeEventDetails>(
    pressedProp,
    defaultPressed,
    onPressedChange
  )
  const element = React.useRef<HTMLButtonElement | null>(null)
  const mergedRef = useMergedRef(ref, element)

  useAgentControl(() => {
    const set = (next: boolean) => (next === pressed ? undefined : changeAsAgent(change, next))
    return {
      kind: "toggle",
      element: element.current,
      checked: pressed,
      disabled: props.disabled,
      actions: {
        toggle: () => set(!pressed),
        setChecked: (value: unknown) => set(agentChecked(value)),
      },
    }
  })

  return (
    <TogglePrimitive
      ref={mergedRef}
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
      pressed={pressed}
      onPressedChange={change}
    />
  )
})

Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }
