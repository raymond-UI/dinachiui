"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react"
import { cn } from "@dinachi/core"
import { changeAsAgent, type AgentControl, useAgentControl, useAgentState, useHasAgent, useMergedRef } from "../agent"
import { Button } from "../button"

export type AlertVariant = "default" | "info" | "success" | "warning" | "destructive"

export interface AlertChangeDetails {
  reason: string
  event: Event | undefined
  isCanceled: boolean
  cancel(): void
}

const tinted =
  "bg-[color:color-mix(in_oklab,var(--alert-tone)_7%,var(--background))] border-[color:color-mix(in_oklab,var(--alert-tone)_16%,var(--border))]"

const alertVariants = cva(
  [
    "flex items-start gap-3 rounded-xl border px-3.5 py-[var(--alert-py,0.75rem)] text-sm text-foreground",
    // On a phone an action beside the text drops under it, so the text keeps the width.
    "max-sm:grid max-sm:grid-cols-[auto_minmax(0,1fr)_auto] max-sm:gap-0",
    // A one-line message, with no title and no action under it, centres on the icon and buttons.
    "[&:not(:has([data-slot=alert-title])):not(:has([data-slot=alert-content]_[data-slot=alert-action]))]:items-center",
    "[&:not(:has([data-slot=alert-title])):not(:has([data-slot=alert-content]_[data-slot=alert-action]))]:[--alert-py:0.625rem]",
    "transition-[opacity,transform,translate] duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))]",
    "data-[starting-style]:-translate-y-1 data-[starting-style]:opacity-0 motion-reduce:data-[starting-style]:translate-y-0",
    "data-[ending-style]:opacity-0 data-[ending-style]:duration-[var(--motion-duration-fast,150ms)]",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-card [--alert-tone:var(--muted-foreground)]",
        info: cn(tinted, "[--alert-tone:var(--info)]"),
        success: cn(tinted, "[--alert-tone:var(--success)]"),
        warning: cn(tinted, "[--alert-tone:var(--warning)]"),
        destructive: cn(tinted, "[--alert-tone:var(--destructive)]"),
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const ICONS: Record<AlertVariant, React.ComponentType<{ className?: string }>> = {
  default: Info,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  destructive: CircleAlert,
}

interface AlertContextValue {
  variant: AlertVariant
  title: React.MutableRefObject<HTMLElement | null>
  description: React.MutableRefObject<HTMLElement | null>
  dismiss: React.MutableRefObject<HTMLButtonElement | null>
  close: (event?: Event) => void
}

const AlertContext = React.createContext<AlertContextValue | null>(null)

function useAlert(part: string): AlertContextValue {
  const context = React.useContext(AlertContext)
  if (!context) throw new Error(`${part} must be used inside Alert.`)
  return context
}

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect
const subscribeNothing = () => () => {}

const textOf = (el: Element | null) => el?.textContent?.replace(/\s+/g, " ").trim() || undefined

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

/** Moves focus out of a closing alert: to the next focusable after it, else the one before. */
function focusNeighbour(el: HTMLElement) {
  const all = Array.from(el.ownerDocument.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (node) => !el.contains(node) && !node.closest("[hidden], [inert]")
  )
  const next = all.find((node) => el.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING)
  ;(next ?? all.filter((node) => el.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_PRECEDING).pop())?.focus()
}

export interface AlertProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof alertVariants> {
  /** Shown or dismissed, when the parent holds it. */
  open?: boolean
  /** Whether it starts shown. Defaults to true. */
  defaultOpen?: boolean
  /** Runs when AlertDismiss or the agent dismisses it. `details.cancel()` keeps it. */
  onOpenChange?: (open: boolean, details: AlertChangeDetails) => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, open: openProp, defaultOpen = true, onOpenChange, role, children, ...props }, ref) => {
    const tone: AlertVariant = variant ?? "default"
    const [open, change] = useAgentState<boolean, AlertChangeDetails>(openProp, defaultOpen, onOpenChange)
    const [present, setPresent] = React.useState(open)
    if (open && !present) setPresent(true)
    const ending = present && !open

    const root = React.useRef<HTMLDivElement | null>(null)
    const setRef = useMergedRef(ref, root)
    const title = React.useRef<HTMLElement | null>(null)
    const description = React.useRef<HTMLElement | null>(null)
    const dismiss = React.useRef<HTMLButtonElement | null>(null)

    // A server-rendered alert is part of the page as it loads, not a change to it.
    // Only that first commit skips the entrance.
    const hydrating = React.useSyncExternalStore(subscribeNothing, () => false, () => true)
    const animate = React.useRef(!hydrating)
    React.useEffect(() => {
      animate.current = true
    }, [])

    const openRef = React.useRef(open)
    openRef.current = open

    useIsomorphicLayoutEffect(() => {
      const el = root.current
      if (!present || !el || !animate.current) return
      el.setAttribute("data-starting-style", "")
      // Read the starting style now, so removing the attribute next frame transitions.
      el.getBoundingClientRect()
      const frame = requestAnimationFrame(() => el.removeAttribute("data-starting-style"))
      return () => {
        cancelAnimationFrame(frame)
        el.removeAttribute("data-starting-style")
      }
    }, [present])

    React.useEffect(() => {
      const el = root.current
      if (!ending || !el) return
      if (el.contains(el.ownerDocument.activeElement)) focusNeighbour(el)
      let live = true
      const done = () => {
        if (!live) return
        live = false
        setPresent(false)
      }
      const transitions = (el.getAnimations?.() ?? []).filter(
        (a) => typeof CSSTransition === "undefined" || a instanceof CSSTransition
      )
      Promise.all(transitions.map((a) => a.finished)).then(done, done)
      // A transition that never finishes must not keep the alert mounted.
      const timer = setTimeout(done, (parseFloat(getComputedStyle(el).transitionDuration) || 0) * 1000 + 100)
      return () => {
        live = false
        clearTimeout(timer)
      }
    }, [ending])

    const context = React.useMemo<AlertContextValue>(
      () => ({
        variant: tone,
        title,
        description,
        dismiss,
        close: (event) => {
          if (!openRef.current) return
          const details: AlertChangeDetails = {
            reason: "close-press",
            event,
            isCanceled: false,
            cancel: () => void (details.isCanceled = true),
          }
          change(false, details)
        },
      }),
      [tone, change]
    )

    useAgentControl((): AgentControl | null => {
      const el = root.current
      if (!open || !el) return null
      const heading = textOf(title.current)
      const body = textOf(description.current)
      const label = heading ?? body
      // Names the alert as the container its action sits in.
      if (label) el.setAttribute("data-agent-in", label)
      const button = dismiss.current
      const canDismiss = button && !button.disabled && button.getAttribute("aria-disabled") !== "true"
      return {
        kind: "toast",
        element: el,
        label,
        value: heading ? body : undefined,
        type: tone,
        actions: canDismiss ? { dismiss: () => changeAsAgent(change, false) } : {},
      }
    })

    if (!present) return null

    return (
      <AlertContext.Provider value={context}>
        <div
          ref={setRef}
          data-slot="alert"
          data-variant={tone}
          role={role ?? (tone === "warning" || tone === "destructive" ? "alert" : "status")}
          data-ending-style={ending ? "" : undefined}
          className={cn(alertVariants({ variant: tone }), className)}
          {...props}
        >
          {children}
        </div>
      </AlertContext.Provider>
    )
  }
)
Alert.displayName = "Alert"

export interface AlertIconProps extends React.ComponentPropsWithoutRef<"span"> {
  /** Replaces the variant's icon. */
  children?: React.ReactNode
}

const AlertIcon = React.forwardRef<HTMLSpanElement, AlertIconProps>(({ className, children, ...props }, ref) => {
  const { variant } = useAlert("AlertIcon")
  const Icon = ICONS[variant]
  return (
    <span
      ref={ref}
      data-slot="alert-icon"
      aria-hidden="true"
      className={cn(
        "mt-0.5 flex shrink-0 text-[color:var(--alert-tone)] max-sm:mr-3 [&_svg]:size-4",
        "[[data-slot=alert]:not(:has([data-slot=alert-title])):not(:has([data-slot=alert-content]_[data-slot=alert-action]))>&]:mt-0",
        className
      )}
      {...props}
    >
      {children ?? <Icon />}
    </span>
  )
})
AlertIcon.displayName = "AlertIcon"

const AlertContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="alert-content" className={cn("min-w-0 flex-1 max-sm:col-start-2", className)} {...props} />
  )
)
AlertContent.displayName = "AlertContent"

const AlertTitle = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const { title } = useAlert("AlertTitle")
    const setRef = useMergedRef(ref, title)
    return <div ref={setRef} data-slot="alert-title" className={cn("font-semibold leading-snug max-sm:text-[15px]", className)} {...props} />
  }
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const { description } = useAlert("AlertDescription")
    const setRef = useMergedRef(ref, description)
    return (
      <div
        ref={setRef}
        data-slot="alert-description"
        // With no title above it, the description is the message, so it reads at full strength.
        className={cn("mt-0.5 leading-normal text-muted-foreground first:mt-0 first:text-foreground", className)}
        {...props}
      />
    )
  }
)
AlertDescription.displayName = "AlertDescription"

export interface AlertActionProps extends Omit<React.ComponentPropsWithoutRef<typeof Button>, "variant" | "size"> {
  /** `sm` sits beside the text; `default` is 40px tall, for a phone. */
  size?: "sm" | "default"
}

const AlertAction = React.forwardRef<HTMLElement, AlertActionProps>(({ className, size = "sm", ...props }, ref) => {
  const { variant } = useAlert("AlertAction")
  return (
    <Button
      ref={ref}
      data-slot="alert-action"
      variant={variant === "destructive" ? "destructive" : "outline"}
      size={size === "sm" ? "sm" : "default"}
      className={cn(
        "shrink-0",
        size === "sm" && "h-7 px-2.5 text-[13px]",
        variant !== "destructive" && "border-[color:color-mix(in_oklab,var(--alert-tone)_22%,var(--border))]",
        // Placed under the text instead of beside it.
        "mt-[var(--alert-action-mt,0)] [[data-slot=alert-content]_&]:[--alert-action-mt:0.75rem]",
        "max-sm:col-start-2 max-sm:row-start-2 max-sm:mt-3 max-sm:h-10 max-sm:justify-self-start max-sm:px-4 max-sm:text-[15px]",
        className
      )}
      {...props}
    />
  )
})
AlertAction.displayName = "AlertAction"

export type AlertDismissProps = Omit<React.ComponentPropsWithoutRef<typeof Button>, "variant" | "size">

const AlertDismiss = React.forwardRef<HTMLElement, AlertDismissProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const { dismiss, close } = useAlert("AlertDismiss")
    const setRef = useMergedRef(ref, dismiss as React.MutableRefObject<HTMLElement | null>)
    const hasAgent = useHasAgent()
    return (
      <Button
        ref={setRef}
        data-slot="alert-dismiss"
        data-agent-part={hasAgent ? "" : undefined}
        variant="ghost"
        size="icon"
        aria-label="Dismiss"
        className={cn(
          "-my-1 -mr-1.5 h-7 w-7 shrink-0 rounded-md text-muted-foreground hover:text-foreground [&_svg]:size-4",
          "[[data-slot=alert-action]+&]:-ml-2",
          "max-sm:col-start-3 max-sm:row-start-1 max-sm:-mt-[7px] max-sm:mb-0 max-sm:-mr-[9px] max-sm:ml-2 max-sm:h-9 max-sm:w-9 max-sm:[[data-slot=alert-action]+&]:ml-2",
          className
        )}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) close(event.nativeEvent)
        }}
        {...props}
      >
        {children ?? <X />}
      </Button>
    )
  }
)
AlertDismiss.displayName = "AlertDismiss"

export { Alert, AlertIcon, AlertContent, AlertTitle, AlertDescription, AlertAction, AlertDismiss, alertVariants }
