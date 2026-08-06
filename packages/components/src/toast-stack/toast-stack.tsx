"use client"

import * as React from "react"
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
/** Long enough to read two lines, short enough not to sit on the corner of the screen. */
const DISMISS_AFTER = 4500
/** Seconds of deceleration to project a flick forward by, and the distance that commits. */
const PROJECTION = 0.18
const SWIPE_AT = 90
/** Used before a toast has been measured. Only ever wrong for one frame. */
const ASSUMED_HEIGHT = 64
/** Joins keys into one dependency string. NUL because no key can contain it. */
const SEPARATOR = "\u0000"

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
  onHeight: (height: number) => void
}

const ToastStackItemContext =
  React.createContext<ToastStackItemContextValue | null>(null)

export interface ToastStackProps extends React.ComponentProps<"div"> {
  /** How many toasts the stack draws. One more is rendered invisibly behind them, so the
   *  toast moving into view fades in rather than appearing. */
  visibleDepth?: number
  /** Space between toasts once the stack is open, in px. */
  gap?: number
}

/**
 * A stack of toasts that collapses into itself.
 *
 * Three notifications should cost the same screen area as one until the reader shows
 * interest. Collapsed, the toasts behind the front one are pushed back with a scale and a
 * small vertical offset, so the stack reads as depth rather than as a list that has been
 * cropped. Hovering or focusing it expands it into the real column.
 *
 * Depth here is `scale` and `y`, never height or margin. The stack has to be able to expand
 * and collapse while a toast is entering or leaving, and layout properties cannot be
 * interrupted mid-flight without jumping.
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

    const stack = React.useMemo(
      () => ({ expanded, reducedMotion }),
      [expanded, reducedMotion]
    )

    return (
      <ToastStackContext.Provider value={stack}>
        <div
          ref={ref}
          // Focus expands it too. A keyboard reader reaching the dismiss button of the
          // second toast cannot be asked to hover first.
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
                  onHeight: (height) => reportHeight(String(item.key), height),
                }}
              >
                {item}
              </ToastStackItemContext.Provider>
            ))}
          </AnimatePresence>
        </div>
      </ToastStackContext.Provider>
    )
  }
)
ToastStack.displayName = "ToastStack"

export interface ToastStackItemProps
  extends Omit<React.ComponentProps<typeof motion.div>, "onDragEnd"> {
  /** Called when the toast is swiped away, or when its time runs out. */
  onDismiss?: () => void
  /** Milliseconds before the toast dismisses itself. `Infinity` keeps it until it is
   *  dismissed by hand. */
  duration?: number
}

/**
 * One toast. Its contents are yours; the card and the physics are not.
 *
 * It can be flicked away sideways, and the flick is projected the same way a swipeable row
 * projects: what the gesture meant, not where the finger happened to stop.
 */
const ToastStackItem = React.forwardRef<HTMLDivElement, ToastStackItemProps>(
  (
    { onDismiss, duration = DISMISS_AFTER, className, children, ...props },
    ref
  ) => {
    const stack = React.useContext(ToastStackContext)
    const slot = React.useContext(ToastStackItemContext)

    if (!stack || !slot) {
      throw new Error("ToastStackItem must be used within a ToastStack")
    }

    const { expanded, reducedMotion } = stack
    const { depth, openY, zIndex, beyondDepth, onHeight } = slot

    const node = React.useRef<HTMLDivElement>(null)
    React.useLayoutEffect(() => {
      const element = node.current
      if (!element || typeof ResizeObserver === "undefined") return
      const observer = new ResizeObserver(([entry]) =>
        onHeight(entry.contentRect.height)
      )
      observer.observe(element)
      return () => observer.disconnect()
    }, [onHeight])

    // Expanding means the reader is reading it. A countdown that keeps running while they
    // are looking at it is the toast pattern's oldest bug.
    useAutoDismiss(expanded, duration, onDismiss)

    return (
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
          // The one past the visible depth is rendered but invisible, so the toast moving
          // up into the stack fades in rather than appearing whole.
          opacity: beyondDepth ? 0 : 1,
          // Open, the toasts sit in a real column measured off their own heights.
          // Collapsed, they fall back into each other. Both are the same two properties.
          y: expanded ? openY : depth * STACK_OFFSET,
          scale: expanded ? 1 : 1 - depth * STACK_SCALE,
        }}
        exit={
          reducedMotion
            ? { opacity: 0, y: 0, scale: 1 }
            : { opacity: 0, y: -16, scale: 0.94 }
        }
        transition={{ type: "spring", bounce: 0.18, duration: 0.4 }}
        // A toast that arrived later must not paint over the one in front of it.
        style={{ zIndex }}
        drag={reducedMotion || !onDismiss ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={(_: unknown, info: PanInfo) => {
          if (Math.abs(info.offset.x + info.velocity.x * PROJECTION) > SWIPE_AT) {
            onDismiss?.()
          }
        }}
        className={cn(
          "absolute inset-x-0 top-0 flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-lg",
          onDismiss && !reducedMotion && "cursor-grab active:cursor-grabbing",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
ToastStackItem.displayName = "ToastStackItem"

/**
 * A countdown that survives being paused.
 *
 * Clearing and restarting a timeout on every hover would hand the reader a fresh five
 * seconds each time the pointer crossed the stack, which is not a pause — it is a reset.
 * The time already spent is banked on the way out, so resuming picks up the remainder.
 */
function useAutoDismiss(paused: boolean, ms: number, onExpire?: () => void) {
  const remaining = React.useRef(ms)
  const onExpireRef = React.useRef(onExpire)

  React.useEffect(() => {
    onExpireRef.current = onExpire
  })

  React.useEffect(() => {
    if (paused || !onExpireRef.current || !Number.isFinite(ms)) return

    const started = Date.now()
    const timer = setTimeout(() => onExpireRef.current?.(), remaining.current)

    return () => {
      clearTimeout(timer)
      remaining.current = Math.max(0, remaining.current - (Date.now() - started))
    }
  }, [paused, ms])
}

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
