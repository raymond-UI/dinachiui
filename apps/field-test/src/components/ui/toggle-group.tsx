"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
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
  type AgentChoice,
  type AgentItems,
} from "@/components/ui/agent"

type ToggleItems = AgentItems<string>

const ToggleAgentContext = React.createContext<ToggleItems | null>(null)

function matchAll(choices: AgentChoice[], wanted: unknown): string[] | string {
  const values: string[] = []
  for (const one of Array.isArray(wanted) ? wanted : [wanted]) {
    const match = matchAgentChoice(choices, one)
    if (typeof match === "string") return match
    values.push(match.value as string)
  }
  return values
}

type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof TogglePrimitive> & {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
}

const toggleGroupItemVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md text-sm font-medium",
    "ring-offset-background transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted hover:text-muted-foreground",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[pressed]:border-accent",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5 text-xs",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "sm",
    },
  }
)

const ToggleGroup = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive>
>(({ className, value: valueProp, defaultValue, onValueChange, ...props }, ref) => {
  const [value, change] = useAgentState<readonly string[], ToggleGroupPrimitive.ChangeEventDetails>(
    valueProp,
    defaultValue ?? [],
    onValueChange as ((value: readonly string[], details: ToggleGroupPrimitive.ChangeEventDetails) => void) | undefined
  )
  const element = React.useRef<HTMLDivElement | null>(null)
  const mergedRef = useMergedRef(ref, element)
  const [items] = React.useState<ToggleItems>(() => new Map())

  const pick = (wanted: unknown, add: boolean) => {
    const values = matchAll(agentChoicesOf(items), wanted)
    if (typeof values === "string") return values
    const fresh = values.filter((v) => !value.some((w) => sameAgentValue(v, w)))
    if (!fresh.length && (add || values.length === value.length)) return undefined
    return changeAsAgent(change, add ? [...value, ...fresh] : values)
  }

  const add = (wanted: unknown) => pick(wanted, true)
  const replace = (wanted: unknown) => pick(wanted, false)
  const actions: Record<string, typeof add> = props.multiple ? { select: add, setValue: replace } : { select: replace }

  useAgentControl(() => {
    const choices = agentChoicesOf(items)
    const labels = value.map((v) => choices.find((c) => sameAgentValue(c.value, v))?.label ?? String(v))
    return {
      kind: "toggle-group",
      element: choices.length ? element.current : null,
      value: props.multiple ? labels : (labels[0] ?? ""),
      items: choices.map((c) => c.label),
      multiple: props.multiple || undefined,
      disabled: props.disabled,
      actions,
    }
  })

  return (
    <ToggleAgentContext.Provider value={useHasAgent() ? items : null}>
      <ToggleGroupPrimitive
        ref={mergedRef}
        data-slot="toggle-group"
        className={cn(
          "inline-flex items-center justify-center gap-1",
          "data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
        value={value}
        onValueChange={change}
      />
    </ToggleAgentContext.Provider>
  )
})
ToggleGroup.displayName = "ToggleGroup"

const ToggleGroupItem = React.forwardRef<
  React.ComponentRef<typeof TogglePrimitive>,
  ToggleGroupItemProps
>(({ className, variant = "outline", size = "sm", ...props }, ref) => {
  const items = React.useContext(ToggleAgentContext)
  const element = React.useRef<HTMLButtonElement | null>(null)
  const mergedRef = useMergedRef(ref, element)
  useAgentItem(items, element, props.value as string | undefined)

  // Inside AgentProvider the group reports its items, so the buttons stay out of the
  // snapshot rather than appearing twice.
  return (
    <TogglePrimitive
      ref={mergedRef}
      data-slot="toggle-group-item"
      data-agent-part={items ? "" : undefined}
      className={cn(toggleGroupItemVariants({ variant, size }), className)}
      {...props}
    />
  )
})
ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }
