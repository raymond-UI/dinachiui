"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { changeAsAgent, type AgentControl, useAgentControl, useAgentState, useHasAgent, useMergedRef } from "@/components/ui/agent"
import { Button } from "@/components/ui/button"

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
    "flex items-start gap-3 rounded-xl border px-3.5 py-3 text-sm text-foreground",
    // Without a title the message is one line, so it centres on the icon and buttons.
    "[&:not(:has([data-slot=alert-title]))]:items-center [&:not(:has([data-slot=alert-title]))]:py-2.5",
    "transition-[opacity,transform,translate] duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))]",
    "data-[starting-style]:translate-y-1 data-[starting-style]:opacity-0 motion-reduce:data-[starting-style]:translate-y-0",
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
    const hydrating = React.useSyncExternalStore(subscribeNothing, () => false, () => true)
    const animate = React.useRef(!hydrating)

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
      let live = true
      const done = () => {
        if (!live) return
        animate.current = true
        setPresent(false)
      }
      Promise.all((el.getAnimations?.() ?? []).map((a) => a.finished)).then(done, done)
      return () => {
        live = false
      }
    }, [ending])

    const context = React.useMemo<AlertContextValue>(
      () => ({
        variant: tone,
        title,
        description,
        dismiss,
        close: (event) => {
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
      if (!open) return null
      const heading = textOf(title.current)
      const body = textOf(description.current)
      const button = dismiss.current
      return {
        kind: "alert",
        element: root.current,
        label: heading ?? body,
        value: heading ? body : undefined,
        type: tone,
        disabled: button ? button.disabled || button.getAttribute("aria-disabled") === "true" : undefined,
        actions: button ? { dismiss: () => changeAsAgent(change, false) } : {},
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
        "mt-0.5 flex shrink-0 text-[color:var(--alert-tone)] [&_svg]:size-4",
        "[[data-slot=alert]:not(:has([data-slot=alert-title]))>&]:mt-0",
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
    <div ref={ref} data-slot="alert-content" className={cn("min-w-0 flex-1", className)} {...props} />
  )
)
AlertContent.displayName = "AlertContent"

const AlertTitle = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const { title } = useAlert("AlertTitle")
    const setRef = useMergedRef(ref, title)
    return <div ref={setRef} data-slot="alert-title" className={cn("font-semibold leading-snug", className)} {...props} />
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
        "[[data-slot=alert-content]_&]:mt-3",
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
