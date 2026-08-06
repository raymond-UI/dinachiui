"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  MotionConfigContext,
  useReducedMotion,
  type Transition,
} from "motion/react"
import { cn } from "@/lib/utils"

/** `useReducedMotion` reads the OS setting only, and only at mount. Also honour an
 *  app-level `<MotionConfig reducedMotion>`, so a user preference in the host app
 *  reaches this component. */
function useReducedMotionConfig() {
  const config = React.useContext(MotionConfigContext)
  const prefersReduced = useReducedMotion()
  if (config.reducedMotion === "always") return true
  if (config.reducedMotion === "never") return false
  return prefersReduced ?? false
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

interface ExpandableCardContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  /** Pairs an element in the card with its counterpart in the panel. */
  layoutId: (part: string) => string
  transition: Transition
  reducedMotion: boolean
}

const ExpandableCardContext =
  React.createContext<ExpandableCardContextValue | null>(null)

function useExpandableCard(component: string) {
  const context = React.useContext(ExpandableCardContext)
  if (!context) {
    throw new Error(`${component} must be used within an ExpandableCard`)
  }
  return context
}

export interface ExpandableCardProps extends React.ComponentProps<"div"> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * A card that opens into its own detail view.
 *
 * This is the one interaction in the tier where the motion does something a cut cannot: it
 * establishes that the panel you are now reading *is* the card you tapped. Two elements
 * sharing a `layoutId` are one object to the layout engine, so the card does not fade out
 * while a dialog fades in — it travels, and the reader never loses track of what they are
 * looking at.
 *
 * It is also the easiest thing here to overuse. A shared transition on a grid of twelve
 * cards is twelve chances to sit through half a second of animation to read a paragraph. It
 * earns its place on a hero item, or on a list short enough that opening one is a decision
 * rather than a habit.
 *
 * The panel is a real modal, which is a larger commitment than it looks: `aria-modal` is a
 * promise that the rest of the page is unreachable, and a dialog that says it and does not
 * honour it is worse than one that never claimed to be modal. So the whole set is here —
 * Escape, a focus trap, focus restored to the card that opened it, the card made inert, and
 * the page held still underneath.
 */
const ExpandableCard = React.forwardRef<HTMLDivElement, ExpandableCardProps>(
  ({ open: openProp, defaultOpen = false, onOpenChange, className, ...props }, ref) => {
    const reducedMotion = useReducedMotionConfig()
    const [uncontrolled, setUncontrolled] = React.useState(defaultOpen)
    const open = openProp ?? uncontrolled

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (openProp === undefined) setUncontrolled(next)
        onOpenChange?.(next)
      },
      [openProp, onOpenChange]
    )

    // Scopes the shared layout ids to this card, so a grid of them does not have every
    // card trying to travel to the same panel.
    const scope = React.useId()
    const layoutId = React.useCallback(
      (part: string) => `${scope}-${part}`,
      [scope]
    )

    // Longer than the tier's 300ms rule, deliberately: that rule is about elements moving a
    // short distance, and this object crosses most of the viewport. Land it too fast and
    // the travel reads as a cut.
    const transition = React.useMemo<Transition>(
      () =>
        reducedMotion
          ? { duration: 0 }
          : { type: "spring", bounce: 0.12, duration: 0.42 },
      [reducedMotion]
    )

    const context = React.useMemo(
      () => ({ open, setOpen, layoutId, transition, reducedMotion }),
      [open, setOpen, layoutId, transition, reducedMotion]
    )

    return (
      <ExpandableCardContext.Provider value={context}>
        <div ref={ref} className={cn("relative", className)} {...props} />
      </ExpandableCardContext.Provider>
    )
  }
)
ExpandableCard.displayName = "ExpandableCard"

export type ExpandableCardTriggerProps = React.ComponentProps<typeof motion.button>

/** The card itself. It is the thing that travels, so it is a button, not a wrapper. */
const ExpandableCardTrigger = React.forwardRef<
  HTMLButtonElement,
  ExpandableCardTriggerProps
>(({ className, onClick, ...props }, ref) => {
  const { open, setOpen, layoutId, transition } =
    useExpandableCard("ExpandableCardTrigger")

  return (
    <motion.button
      ref={ref}
      type="button"
      layoutId={layoutId("card")}
      transition={transition}
      aria-haspopup="dialog"
      aria-expanded={open}
      // Inert rather than merely covered. A dialog the reader can still tab into is not
      // modal, whatever the attribute says.
      inert={open || undefined}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        setOpen(true)
      }}
      className={cn(
        "block w-full overflow-hidden rounded-2xl border border-border bg-background text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  )
})
ExpandableCardTrigger.displayName = "ExpandableCardTrigger"

export interface ExpandableCardPanelProps
  extends Omit<React.ComponentProps<typeof motion.div>, "children"> {
  /** Accessible name for the dialog. It is the card's title, said once. */
  title: string
  /** Set false to supply your own close control inside the panel. */
  showClose?: boolean
  closeLabel?: string
  backdropClassName?: string
  children?: React.ReactNode
}

/** The opened card. Mounted only while open, so the shared layout has somewhere to land. */
const ExpandableCardPanel = React.forwardRef<HTMLDivElement, ExpandableCardPanelProps>(
  (
    {
      title,
      showClose = true,
      closeLabel = "Close",
      backdropClassName,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { open, setOpen, layoutId, transition } =
      useExpandableCard("ExpandableCardPanel")

    const panel = React.useRef<HTMLDivElement>(null)
    const close = React.useCallback(() => setOpen(false), [setOpen])

    useModalBehaviour(open, panel, close)

    return (
      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className={cn(
                "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm",
                backdropClassName
              )}
            />
            {/* The centring frame does not intercept the backdrop's clicks; only the panel
                inside it takes pointer events. */}
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                ref={mergeRefs(ref, panel)}
                layoutId={layoutId("card")}
                transition={transition}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={cn(
                  "pointer-events-auto relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl",
                  className
                )}
                {...props}
              >
                {children}
                {showClose ? (
                  <button
                    type="button"
                    onClick={close}
                    aria-label={closeLabel}
                    className="absolute right-3 top-3 rounded-full bg-background/70 p-1.5 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <CloseIcon />
                  </button>
                ) : null}
              </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>
    )
  }
)
ExpandableCardPanel.displayName = "ExpandableCardPanel"

export interface ExpandableCardSharedProps
  extends React.ComponentProps<typeof motion.div> {
  /** Names the pair. Use the same `part` on the card and in the panel, once each. */
  part: string
}

/**
 * An element that exists on both sides of the transition and should travel between them.
 *
 * Artwork, a title, a kicker. Pair them by `part`; a `part` used twice on the same side has
 * two elements claiming to be one object, and the layout engine picks one.
 */
const ExpandableCardShared = React.forwardRef<HTMLDivElement, ExpandableCardSharedProps>(
  ({ part, ...props }, ref) => {
    const { layoutId, transition } = useExpandableCard("ExpandableCardShared")

    return (
      <motion.div
        ref={ref}
        layoutId={layoutId(part)}
        transition={transition}
        {...props}
      />
    )
  }
)
ExpandableCardShared.displayName = "ExpandableCardShared"

export type ExpandableCardBodyProps = React.ComponentProps<typeof motion.div>

/**
 * Content that only exists in the panel.
 *
 * It has no counterpart on the card, so it arrives after the travel rather than trying to
 * share it. Anything that exists on only one side of a transition should wait for the
 * object to land.
 */
const ExpandableCardBody = React.forwardRef<HTMLDivElement, ExpandableCardBodyProps>(
  ({ className, ...props }, ref) => {
    const { reducedMotion } = useExpandableCard("ExpandableCardBody")

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reducedMotion ? 0 : 0.16, duration: 0.24 }}
        className={cn("text-sm leading-relaxed text-muted-foreground", className)}
        {...props}
      />
    )
  }
)
ExpandableCardBody.displayName = "ExpandableCardBody"

/**
 * Everything `aria-modal="true"` is claiming.
 *
 * Escape closes, focus moves in on open and returns to whatever opened it on close, Tab
 * cycles inside, and the page underneath cannot scroll. The scroll lock compensates for the
 * width of the scrollbar it removes, because otherwise the whole layout shifts sideways at
 * the exact moment the card is mid-flight, and the shared-layout animation gets the blame.
 */
function useModalBehaviour(
  active: boolean,
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void
) {
  const onCloseRef = React.useRef(onClose)
  React.useEffect(() => {
    onCloseRef.current = onClose
  })

  React.useEffect(() => {
    if (!active) return

    const opener = document.activeElement as HTMLElement | null
    const body = document.body
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = "hidden"
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    const focusable = () =>
      Array.from(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (node) => node.offsetParent !== null
      )

    // Focus the panel's own controls, not the page. `preventScroll` matters: the dialog is
    // mid-travel, and letting the browser scroll to the element it is focusing would move
    // the ground under the animation.
    focusable()[0]?.focus({ preventScroll: true })

    // Flagged on CRAP, which scores complexity against coverage that is estimated here
    // rather than measured — so the focus-trap tests cannot move the number.
    // fallow-ignore-next-line complexity
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== "Tab") return

      const nodes = focusable()
      if (nodes.length === 0) {
        event.preventDefault()
        return
      }

      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const inside = ref.current?.contains(document.activeElement)

      if (event.shiftKey && (!inside || document.activeElement === first)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
      // By the time this runs the card is no longer inert, so it can take focus back.
      opener?.focus({ preventScroll: true })
    }
  }, [active, ref])
}

function CloseIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="h-4 w-4"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

/** The panel needs its own node for the focus trap and the caller may want it too. */
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value)
      else if (ref) (ref as React.RefObject<T | null>).current = value
    }
  }
}

export {
  ExpandableCard,
  ExpandableCardTrigger,
  ExpandableCardPanel,
  ExpandableCardShared,
  ExpandableCardBody,
}
