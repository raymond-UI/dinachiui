"use client"

import * as React from "react"
import { Toast as BaseToast } from "@base-ui/react/toast"
import {
  AnimatePresence,
  motion,
  MotionConfigContext,
  useReducedMotion,
  type PanInfo,
} from "motion/react"
import { cn } from "@dinachi/core"

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

/** How far back each toast sits while the stack is collapsed, in px. */
const STACK_OFFSET = 14
/** How much smaller each toast is than the one in front of it. */
const STACK_SCALE = 0.05
/** Past this the stack is just a shadow — more depth stops reading as more items. */
const VISIBLE_DEPTH = 3
/** Space between toasts once the stack is open, in px. */
const GAP = 10
/** Seconds of deceleration to project a flick forward by, and the distance that commits. */
const PROJECTION = 0.18
const SWIPE_AT = 90
/** Used before a toast has been measured. Only ever wrong for one frame. */
const ASSUMED_HEIGHT = 64
/** Joins keys into one dependency string. NUL because no key can contain it. */
const SEPARATOR = "\u0000"

/** Base UI's swipe and this component's drag would both claim the pointer. */
const NO_BASE_SWIPE: never[] = []

interface ToastStackContextValue {
  expanded: boolean
  reducedMotion: boolean
}

const ToastStackContext = React.createContext<ToastStackContextValue | null>(null)

interface ToastStackItemContextValue {
  depth: number
  /** Where this toast sits once the stack is open, measured off the toasts in front. */
  openY: number
  zIndex: number
  /** Rendered, but past the point where more depth stops reading as more items. */
  beyondDepth: boolean
  /** The front toast's height, which the ones behind it are cut to while collapsed. */
  collapsedHeight: number
  /** This toast's own height, once it has been measured. */
  height?: number
  onHeight: (height: number) => void
}

const ToastStackItemContext =
  React.createContext<ToastStackItemContextValue | null>(null)

export interface ToastStackProps
  extends React.ComponentProps<typeof BaseToast.Viewport> {
  /** How many toasts the stack draws. One more is rendered invisibly behind them, so the
   *  toast moving into view fades in rather than appearing. */
  visibleDepth?: number
  /** Space between toasts once the stack is open, in px. */
  gap?: number
}

/**
 * A stack of toasts that collapses into itself.
 *
 * This is a viewport, not a notification system. It renders Base UI's toast viewport, so
 * the queue, the timers, the live region and the keyboard handling are the same ones
 * [Toast](/docs/components/toast) uses; what it replaces is only how the toasts are
 * arranged and how they move. Fire toasts the way you already do.
 *
 * Three notifications should cost the same screen area as one until the reader shows
 * interest. Collapsed, the toasts behind the front one are pushed back with a scale and a
 * small vertical offset, so the stack reads as depth rather than as a list that has been
 * cropped. Hovering or focusing it expands it into the real column.
 *
 * Position here is `scale` and `y`, never margin. The stack has to be able to expand and
 * collapse while a toast is entering or leaving, and layout properties cannot be
 * interrupted mid-flight without jumping. The one exception is the height a collapsed
 * toast is cut to, which has nothing to interrupt: each toast is absolutely positioned, so
 * its height moves nothing but itself.
 *
 * The open positions are measured, not assumed. Toasts are not all one height — a two-line
 * body pushes the next one down — and multiplying a constant by the index is right exactly
 * until the first toast wraps, after which every toast under it overlaps.
 *
 * Placement and width are yours. The toasts are absolutely positioned inside this element,
 * so give it the corner and the size you want the stack to occupy.
 */
const ToastStack = React.forwardRef<HTMLDivElement, ToastStackProps>(
  (
    {
      visibleDepth = VISIBLE_DEPTH,
      gap = GAP,
      className,
      children,
      onPointerEnter,
      onPointerLeave,
      onFocusCapture,
      onBlurCapture,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotionConfig()
    const [expanded, setExpanded] = React.useState(false)
    const [heights, setHeights] = React.useState<Record<string, number>>({})

    const items = React.Children.toArray(children).filter(React.isValidElement)
    const visible = items.slice(0, visibleDepth + 1)

    const reportHeight = React.useCallback((key: string, height: number) => {
      setHeights((current) =>
        current[key] === height ? current : { ...current, [key]: height }
      )
    }, [])

    // A toast that has left is never measured again, and a long-lived viewport would
    // otherwise accumulate a row per notification ever shown.
    const liveKeys = items.map((item) => String(item.key)).join(SEPARATOR)
    React.useEffect(() => {
      const live = new Set(liveKeys.split(SEPARATOR))
      setHeights((current) => {
        const next = Object.fromEntries(
          Object.entries(current).filter(([key]) => live.has(key))
        )
        return Object.keys(next).length === Object.keys(current).length
          ? current
          : next
      })
    }, [liveKeys])

    /** Accumulated offsets for the open stack, front to back. */
    const offsets: number[] = []
    visible.reduce((total, item, index) => {
      offsets[index] = total
      return total + (heights[String(item.key)] ?? ASSUMED_HEIGHT) + gap
    }, 0)

    const collapsedHeight = visible.length
      ? (heights[String(visible[0].key)] ?? ASSUMED_HEIGHT)
      : ASSUMED_HEIGHT

    const stack = React.useMemo(
      () => ({ expanded, reducedMotion }),
      [expanded, reducedMotion]
    )

    return (
      <ToastStackContext.Provider value={stack}>
        <BaseToast.Viewport
          ref={ref}
          // Base UI's viewport already pauses the timers on hover and focus. This is the
          // same signal read a second time, because the arrangement is animated in JS and
          // cannot be driven by the data attribute the CSS version uses.
          onPointerEnter={(event) => {
            onPointerEnter?.(event)
            setExpanded(true)
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event)
            setExpanded(false)
          }}
          onFocusCapture={(event) => {
            onFocusCapture?.(event)
            setExpanded(true)
          }}
          onBlurCapture={(event) => {
            onBlurCapture?.(event)
            setExpanded(false)
          }}
          className={cn("relative w-full", className)}
          {...props}
        >
          <AnimatePresence initial={false}>
            {visible.map((item, depth) => (
              <ToastStackItemContext.Provider
                // The key rides the provider because that is what `AnimatePresence`
                // reads. The toast inside picks up the presence context either way.
                key={item.key}
                value={{
                  depth,
                  openY: offsets[depth],
                  zIndex: visible.length - depth,
                  beyondDepth: depth >= visibleDepth,
                  collapsedHeight,
                  height: heights[String(item.key)],
                  onHeight: (height) => reportHeight(String(item.key), height),
                }}
              >
                {item}
              </ToastStackItemContext.Provider>
            ))}
          </AnimatePresence>
        </BaseToast.Viewport>
      </ToastStackContext.Provider>
    )
  }
)
ToastStack.displayName = "ToastStack"

export interface ToastStackItemProps
  extends Omit<React.ComponentProps<typeof motion.div>, "onDragEnd" | "children"> {
  /** The toast to render, from `useToastManager()`. */
  toast: React.ComponentProps<typeof BaseToast.Root>["toast"]
  children?: React.ReactNode
}

/**
 * One toast. Its contents are yours; the card and the physics are not.
 *
 * The element is a Base UI toast root, so it is a labelled dialog the viewport's live
 * region announces, it can be reached with F6, and it closes itself on the provider's
 * timeout. Use `ToastTitle` and `ToastDescription` inside it: they are what the root names
 * itself after.
 *
 * It can also be flicked away sideways, and the flick is projected the same way a swipeable
 * row projects: what the gesture meant, not where the finger happened to stop.
 */
const ToastStackItem = React.forwardRef<HTMLDivElement, ToastStackItemProps>(
  ({ toast, className, children, ...props }, ref) => {
    const stack = React.useContext(ToastStackContext)
    const slot = React.useContext(ToastStackItemContext)

    if (!stack || !slot) {
      throw new Error("ToastStackItem must be used within a ToastStack")
    }

    const { expanded, reducedMotion } = stack
    const { depth, openY, zIndex, beyondDepth, collapsedHeight, height, onHeight } =
      slot
    const { close } = BaseToast.useToastManager()

    // Collapsed, a toast behind the front one is cut to the front one's height. Toasts are
    // not all one height, and a two-line body behind a one-line toast otherwise sticks out
    // from under it as a loose strip of text.
    const clamped = !expanded && depth > 0

    const node = React.useRef<HTMLDivElement>(null)
    const content = React.useRef<HTMLDivElement>(null)
    React.useLayoutEffect(() => {
      const card = node.current
      const element = content.current
      if (!card || !element || typeof ResizeObserver === "undefined") return
      const observer = new ResizeObserver(([entry]) => {
        // The card's own border, read rather than assumed: `clientHeight` leaves it out
        // and `offsetHeight` does not, and the difference holds whatever the card's height
        // has been set to. The open column is spaced by whole cards, so a measurement
        // short by the border puts each toast a hairline inside the one in front.
        const border = card.offsetHeight - card.clientHeight
        onHeight(
          (entry.borderBoxSize?.[0]?.blockSize ?? element.offsetHeight) + border
        )
      })
      observer.observe(element)
      return () => observer.disconnect()
    }, [onHeight])

    return (
      <BaseToast.Root
        toast={toast}
        // Base UI's swipe and this component's drag would both claim the pointer, and
        // Base UI's is a threshold where this one projects the flick forward.
        swipeDirection={NO_BASE_SWIPE}
        // The root is the position and the accessible name. Nothing about it is animated,
        // which is what lets Motion own the transform on the card inside it without the
        // two writing over each other every frame.
        style={{ zIndex }}
        className="absolute inset-x-0 top-0 focus-visible:outline-none"
      >
        <motion.div
          ref={mergeRefs(ref, node)}
          // No `layout` here on purpose. Every toast is pinned to the same top edge and
          // placed by `y`, so there is no layout change to measure — a layout animation
          // would only give the projection something to fight the animated `y` over.
          // Same keys in every branch: a property `animate` sets and `initial` omits is
          // animated from `undefined` rather than skipped.
          initial={
            reducedMotion
              ? { opacity: 0, y: 0, scale: 1 }
              : { opacity: 0, y: 32, scale: 0.9 }
          }
          animate={{
            // The one past the visible depth is rendered but invisible, so the toast
            // moving up into the stack fades in rather than appearing whole.
            opacity: beyondDepth ? 0 : 1,
            // Open, the toasts sit in a real column measured off their own heights.
            // Collapsed, they fall back into each other. Both are the same two properties.
            y: expanded ? openY : depth * STACK_OFFSET,
            scale: expanded ? 1 : 1 - depth * STACK_SCALE,
            height: clamped ? collapsedHeight : (height ?? "auto"),
          }}
          exit={
            reducedMotion
              ? { opacity: 0, y: 0, scale: 1 }
              : { opacity: 0, y: -16, scale: 0.94 }
          }
          transition={{ type: "spring", bounce: 0.18, duration: 0.4 }}
          drag={reducedMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_: unknown, info: PanInfo) => {
            if (Math.abs(info.offset.x + info.velocity.x * PROJECTION) > SWIPE_AT) {
              close(toast.id)
            }
          }}
          className={cn(
            "overflow-hidden rounded-xl border border-border bg-background shadow-lg",
            !reducedMotion && "cursor-grab active:cursor-grabbing",
            className
          )}
          {...props}
        >
          {/* The row is its own element because the card's height is animated, and a card
              cannot also be what reports how tall its contents want to be — it would
              measure the animation and settle wherever it happened to look. */}
          <motion.div
            ref={content}
            // Collapsed, a toast behind the front one is a card edge and nothing else. The
            // strip of it that shows below the front toast is a few pixels tall, and a few
            // pixels of a sentence read as a rendering fault rather than as depth.
            // `initial={false}`: a toast that arrives behind another starts hidden rather
            // than fading out of view it never had.
            initial={false}
            animate={{ opacity: clamped ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-3 px-4 py-3"
          >
            {children}
          </motion.div>
        </motion.div>
      </BaseToast.Root>
    )
  }
)
ToastStackItem.displayName = "ToastStackItem"

/** The toast measures itself and the caller may want the node too. */
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value)
      else if (ref) (ref as React.RefObject<T | null>).current = value
    }
  }
}

export { ToastStack, ToastStackItem }
