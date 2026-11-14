"use client"

import * as React from "react"
import { Tabs as BaseTabs } from "@base-ui/react/tabs"
import {
  motion,
  MotionConfigContext,
  useReducedMotion,
  type Transition,
} from "motion/react"
import { cn } from "@dinachi/core"
import {
  agentChoicesOf,
  changeAsAgent,
  matchAgentChoice,
  useAgentControl,
  useAgentItem,
  useHasAgent,
  useMergedRef,
  type AgentItems,
} from "../agent"

/** `useReducedMotion` reads the OS setting only, and only at mount. Also honour an
 *  app-level `<MotionConfig reducedMotion>`, so a user preference in the host app
 *  reaches this component. */
function useReducedMotionConfig() {
  const config = React.useContext(MotionConfigContext)
  const prefersReduced = useReducedMotion()
  if (config.reducedMotion === "always") return true
  if (config.reducedMotion === "never") return false
  return prefersReduced
}

type BaseRootProps = React.ComponentProps<typeof BaseTabs.Root>

/** Critically damped: a click carries no momentum, so an overshoot on arrival is
 *  motion the gesture never asked for. 0.3s is the short end of the response range
 *  for a reposition, which is where a control this frequently used belongs. */
const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.3,
}

const INSTANT_TRANSITION: Transition = { duration: 0 }

/** Enter and Space on a focused tab reach Base UI as a synthesized click — no pointer
 *  type, no click count — while arrow keys under `activateOnFocus` arrive as a real key
 *  event. Both are keyboard, and keyboard-driven tab changes cut rather than travel:
 *  they repeat far more often than pointer changes and animating them puts the pill
 *  between the keypress and the answer. */
function isKeyboardActivation(event: Event | undefined) {
  if (!event) return false
  if (event.type.startsWith("key")) return true
  if (event.type !== "click") return false
  const { pointerType } = event as PointerEvent
  return pointerType === "" || (event as MouseEvent).detail === 0
}

interface AnimatedTabsContextValue {
  value: unknown
  layoutId: string
  transition: Transition
  /** Set inside an `AgentProvider`: the triggers, which the agent selects by name. */
  items: AgentItems | null
}

type Details = BaseTabs.Root.ChangeEventDetails

/**
 * The agent clicks the tab, so Base UI decides as it does for a person. Returns a reader
 * for the agent's details, which the change handler takes in place of Base UI's.
 */
function useTabsAgent(items: AgentItems, element: React.RefObject<HTMLElement | null>) {
  const pending = React.useRef<Details | null>(null)
  useAgentControl(() => {
    const choices = agentChoicesOf(items)
    const tabs = [...items]
    const active = tabs.find(([el]) => el.getAttribute("aria-selected") === "true")?.[1]
    return {
      kind: "tabs",
      element: choices.length ? element.current : null,
      value: choices.find((c) => c.value === active)?.label ?? "",
      items: choices.map((c) => c.label),
      disabled: choices.length > 0 && choices.every((c) => c.disabled),
      actions: {
        select(wanted: unknown) {
          const match = matchAgentChoice(choices, wanted)
          if (typeof match === "string") return match
          return changeAsAgent<unknown, Details>((_, details) => {
            pending.current = details
            tabs.find(([, v]) => v === match.value)?.[0].click()
            pending.current = null
          }, match.value)
        },
      },
    }
  })
  return React.useCallback(() => {
    const details = pending.current
    pending.current = null
    return details
  }, [])
}

const AnimatedTabsContext = React.createContext<AnimatedTabsContextValue | null>(
  null
)

function useAnimatedTabsContext(component: string) {
  const context = React.useContext(AnimatedTabsContext)
  if (!context) {
    throw new Error(`${component} must be used within an AnimatedTabs`)
  }
  return context
}

export interface AnimatedTabsProps extends BaseRootProps {
  /** Overrides the indicator spring. */
  transition?: Transition
}

/**
 * Tabs whose active pill travels between triggers instead of cutting.
 *
 * Built on Base UI's Tabs for roving focus, arrow-key navigation and panel wiring.
 * The indicator is a single `layoutId` element, so motion measures both positions
 * and interpolates — no width or offset maths, and it stays correct when the tab
 * labels are a different width on every render.
 *
 * The travel is for the pointer only. Keyboard-driven changes, and anyone who has
 * asked for reduced motion, get the pill in its new position immediately.
 */
const AnimatedTabs = React.forwardRef<
  React.ComponentRef<typeof BaseTabs.Root>,
  AnimatedTabsProps
>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      transition = DEFAULT_TRANSITION,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const layoutId = React.useId()
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const [instant, setInstant] = React.useState(false)
    const isControlled = valueProp !== undefined
    const value = isControlled ? valueProp : internalValue
    const reducedMotion = useReducedMotionConfig()
    const element = React.useRef<HTMLDivElement | null>(null)
    const [agentItems] = React.useState<AgentItems>(() => new Map())
    const items = useHasAgent() ? agentItems : null
    const takeAgentDetails = useTabsAgent(agentItems, element)

    const handleValueChange = React.useCallback<
      NonNullable<BaseRootProps["onValueChange"]>
    >(
      (next, eventDetails) => {
        const details = takeAgentDetails() ?? eventDetails
        onValueChange?.(next, details)
        if (details.isCanceled) return eventDetails.cancel()
        // Batched with the value change, so the render that moves the pill is
        // already the one that knows whether it should move at all.
        setInstant(isKeyboardActivation(eventDetails?.event))
        if (!isControlled) setInternalValue(next)
      },
      [isControlled, onValueChange, takeAgentDetails]
    )

    const contextValue = React.useMemo<AnimatedTabsContextValue>(
      () => ({
        value,
        layoutId,
        transition: reducedMotion || instant ? INSTANT_TRANSITION : transition,
        items,
      }),
      [value, layoutId, transition, reducedMotion, instant, items]
    )

    return (
      <AnimatedTabsContext.Provider value={contextValue}>
        <BaseTabs.Root
          ref={useMergedRef(ref, element)}
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          className={cn("w-full", className)}
          {...props}
        >
          {children}
        </BaseTabs.Root>
      </AnimatedTabsContext.Provider>
    )
  }
)
AnimatedTabs.displayName = "AnimatedTabs"

export type AnimatedTabsListProps = React.ComponentProps<typeof BaseTabs.List>

const AnimatedTabsList = React.forwardRef<
  React.ComponentRef<typeof BaseTabs.List>,
  AnimatedTabsListProps
>(({ className, ...props }, ref) => (
  <BaseTabs.List
    ref={ref}
    className={cn(
      "relative inline-flex items-center gap-0.5 rounded-full bg-muted p-1",
      className
    )}
    {...props}
  />
))
AnimatedTabsList.displayName = "AnimatedTabsList"

export interface AnimatedTabsTriggerProps
  extends React.ComponentProps<typeof BaseTabs.Tab> {
  /** Class applied to the travelling indicator. */
  indicatorClassName?: string
}

const AnimatedTabsTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseTabs.Tab>,
  AnimatedTabsTriggerProps
>(({ className, indicatorClassName, children, value, ...props }, ref) => {
  const context = useAnimatedTabsContext("AnimatedTabsTrigger")
  const isActive = context.value === value
  const element = React.useRef<HTMLButtonElement | null>(null)
  useAgentItem(context.items, element, value)

  return (
    <BaseTabs.Tab
      ref={useMergedRef(ref, element)}
      data-agent-part={context.items ? "" : undefined}
      value={value}
      className={cn(
        "relative isolate inline-flex select-none items-center justify-center whitespace-nowrap",
        "rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground",
        // Paced to land with the pill rather than ahead of it — a label that darkens
        // while the pill is still in transit reads as two things moving, not one.
        "transition-colors duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[active]:text-foreground",
        // Only the tabs you could move to. Hovering the selected one has nothing to
        // offer, and a bare `hover:` would also outrank the colour it was given.
        "[&:not([data-active])]:hover:text-foreground",
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.span
          aria-hidden
          layoutId={context.layoutId}
          transition={context.transition}
          className={cn(
            "absolute inset-0 -z-10 rounded-full bg-background shadow-sm",
            indicatorClassName
          )}
        />
      )}
      {children}
    </BaseTabs.Tab>
  )
})
AnimatedTabsTrigger.displayName = "AnimatedTabsTrigger"

export type AnimatedTabsContentProps = React.ComponentProps<
  typeof BaseTabs.Panel
>

/**
 * The panel cuts. The pill already carries the state change, and a second animation
 * behind it only delays the content the user switched tabs to read.
 */
const AnimatedTabsContent = React.forwardRef<
  React.ComponentRef<typeof BaseTabs.Panel>,
  AnimatedTabsContentProps
>(({ className, children, ...props }, ref) => (
  <BaseTabs.Panel
    ref={ref}
    className={cn(
      "mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  >
    {children}
  </BaseTabs.Panel>
))
AnimatedTabsContent.displayName = "AnimatedTabsContent"

export {
  AnimatedTabs,
  AnimatedTabsList,
  AnimatedTabsTrigger,
  AnimatedTabsContent,
}
