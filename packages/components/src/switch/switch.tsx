"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@dinachi/core"
import { agentChecked, changeAsAgent, useAgentControl, useAgentState, useMergedRef } from "../agent"

type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>

/**
 * Base UI's switch, holding its own checked state so an agent can flip it the way a parent
 * would. Controlled use is unchanged, and `onCheckedChange` sees the agent's changes first
 * and can cancel them.
 */
const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, checked: checkedProp, defaultChecked = false, onCheckedChange, ...props }, ref) => {
  const [checked, change] = useAgentState<boolean, SwitchPrimitive.Root.ChangeEventDetails>(
    checkedProp,
    defaultChecked,
    onCheckedChange
  )
  const element = React.useRef<HTMLElement | null>(null)
  const mergedRef = useMergedRef(ref, element)

  useAgentControl(() => {
    const set = (next: boolean) => {
      if (props.readOnly) return "The switch is read-only."
      return next === checked ? undefined : changeAsAgent(change, next)
    }
    return {
      kind: "switch",
      element: element.current,
      checked,
      disabled: props.disabled,
      actions: {
        toggle: () => set(!checked),
        setChecked: (value: unknown) => set(agentChecked(value)),
      },
    }
  })

  return (
  <span className="relative inline-flex [&>input]:!absolute">
    <SwitchPrimitive.Root
      ref={mergedRef}
      data-slot="switch"
      className={cn(
        "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-[var(--motion-duration-fast,150ms)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        "data-[checked]:bg-primary data-[unchecked]:bg-input",
        className
      )}
      {...props}
      checked={checked}
      onCheckedChange={change}
    />
  </span>
  )
})
Switch.displayName = "Switch"

const SwitchThumb = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Thumb
    ref={ref}
    data-slot="switch-thumb"
    className={cn(
      "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0",
      "transition-transform duration-[var(--motion-duration-fast,150ms)] ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))]",
      "motion-reduce:transition-none",
      "data-[checked]:translate-x-5 data-[unchecked]:translate-x-0",
      "data-[disabled]:opacity-80",
      className
    )}
    {...props}
  />
))
SwitchThumb.displayName = "SwitchThumb"

export { Switch, SwitchThumb }
