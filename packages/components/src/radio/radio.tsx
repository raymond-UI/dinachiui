"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "@dinachi/core"
import {
  agentChoicesOf,
  changeAsAgent,
  matchAgentChoice,
  sameAgentValue,
  useAgentControl,
  useAgentItem,
  useAgentState,
  useHasAgent,
  useMergedRef,
  type AgentItems,
} from "../agent"

type RadioItems = AgentItems

const RadioAgentContext = React.createContext<RadioItems | null>(null)

/**
 * Base UI's group, holding its own value so an agent can choose a radio the way a parent
 * would. Controlled use is unchanged, and `onValueChange` sees the agent's choice first
 * and can cancel it.
 */
const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive>
>(({ className, value: valueProp, defaultValue, onValueChange, ...props }, ref) => {
  const [value, change] = useAgentState<unknown, RadioGroupPrimitive.ChangeEventDetails>(
    valueProp,
    defaultValue ?? null,
    onValueChange
  )
  const element = React.useRef<HTMLDivElement | null>(null)
  const mergedRef = useMergedRef(ref, element)
  const [items] = React.useState<RadioItems>(() => new Map())

  const choose = (wanted: unknown) => {
    if (props.readOnly) return "The radio group is read-only."
    const match = matchAgentChoice(agentChoicesOf(items), wanted)
    return typeof match === "string" ? match : changeAsAgent(change, match.value)
  }

  useAgentControl(() => {
    const choices = agentChoicesOf(items)
    return {
      kind: "radio-group",
      element: element.current,
      value: choices.find((c) => sameAgentValue(c.value, value))?.label ?? "",
      items: choices.map((c) => c.label),
      disabled: props.disabled,
      actions: { select: choose },
    }
  })

  return (
    <RadioAgentContext.Provider value={useHasAgent() ? items : null}>
      <RadioGroupPrimitive
        ref={mergedRef}
        className={cn("grid gap-2", className)}
        {...props}
        value={value}
        onValueChange={change}
      />
    </RadioAgentContext.Provider>
  )
})
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
>(({ className, ...props }, ref) => {
  const items = React.useContext(RadioAgentContext)
  const element = React.useRef<React.ComponentRef<typeof RadioPrimitive.Root> | null>(null)
  const mergedRef = useMergedRef(ref, element)
  useAgentItem(items, element, props.value)

  return (
  <span className="relative inline-flex [&>input]:!absolute">
    <RadioPrimitive.Root
      ref={mergedRef}
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
  )
})
Radio.displayName = "Radio"

export { Radio, RadioGroup, RadioIndicator }
