"use client"

import * as React from "react"
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { Minus, Plus } from "lucide-react"
import { cn } from "@dinachi/core"
import { changeAsAgent, useAgentControl, useAgentState, useHasAgent, useMergedRef } from "../agent"

type NumberFieldProps = React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Root>

const NumberFieldAgentContext = React.createContext<React.MutableRefObject<HTMLInputElement | null> | null>(null)

const clamp = (n: number, min = -Infinity, max = Infinity) => Math.min(max, Math.max(min, n))

function toNumber(value: unknown): number | string {
  const n = typeof value === "number" ? value : Number(String(value ?? "").trim() || NaN)
  return Number.isFinite(n) ? n : `"${String(value)}" is not a number.`
}

// Base UI also takes "any", which has no size to step by, so the agent steps by 1.
const stepOf = ({ step }: NumberFieldProps) => (typeof step === "number" ? step : 1)

/** The agent's actions, each clamped to min and max the way Base UI clamps a person's. */
function numberActions(props: NumberFieldProps, value: number | null, set: (next: number) => string | undefined) {
  const { min, max, readOnly } = props
  const step = stepOf(props)
  const to = (next: unknown, from = 0, scale = 1) => {
    if (readOnly) return "The number field is read-only."
    const n = toNumber(next)
    return typeof n === "string" ? n : set(clamp(from + n * scale, min, max))
  }
  const from = value ?? min ?? 0
  return {
    setValue: (next: unknown) => to(next),
    increment: (steps: unknown = 1) => to(steps, from, step),
    decrement: (steps: unknown = 1) => to(steps, from, -step),
  }
}

/**
 * Base UI's root, holding its own value so an agent can set it the way a parent would.
 * `onValueChange` sees the agent's changes first and can cancel them.
 */
const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  ({ value: valueProp, defaultValue = null, onValueChange, ...props }, ref) => {
    type Details = NumberFieldPrimitive.Root.ChangeEventDetails
    const [value, changeValue] = useAgentState<number | null, Details>(valueProp, defaultValue, onValueChange)
    const input = React.useRef<HTMLInputElement | null>(null)

    useAgentControl(() => ({
      kind: "number" as const,
      element: input.current,
      value: value ?? undefined,
      min: props.min,
      max: props.max,
      step: stepOf(props),
      disabled: props.disabled,
      actions: numberActions(props, value, (next) => changeAsAgent(changeValue, next)),
    }))

    return (
      <NumberFieldAgentContext.Provider value={useHasAgent() ? input : null}>
        <NumberFieldPrimitive.Root ref={ref} {...props} value={value} onValueChange={changeValue} />
      </NumberFieldAgentContext.Provider>
    )
  }
)
NumberField.displayName = "NumberField"

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
    ref={useMergedRef(ref, React.useContext(NumberFieldAgentContext))}
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

export type { NumberFieldProps }

export {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
}
