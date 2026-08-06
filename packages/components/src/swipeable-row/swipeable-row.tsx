"use client"

import * as React from "react"
import {
  animate,
  motion,
  MotionConfigContext,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
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

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

/**
 * Seconds of deceleration to project forward before deciding where the row belongs.
 *
 * UIScrollView's decay works out near this for a flick. Below about 0.1 the projection is
 * too weak to feel; above about 0.3 a light flick overshoots the whole row.
 */
const PROJECTION = 0.18

const SETTLE = { type: "spring", stiffness: 420, damping: 42, mass: 0.9 } as const

/** Width of one action button, in px. Wide enough for a 44px touch target with room. */
const DEFAULT_ACTION_WIDTH = 68

/**
 * Holds the close callback of whichever row is currently open.
 *
 * Two open rows is a state the reader never asked for: they swiped a second row, so they
 * are done with the first. Kept in a ref rather than state because closing a row is a side
 * effect on a motion value, and routing it through a render would put a frame between the
 * new row opening and the old one giving way.
 */
const SwipeableRowGroupContext =
  React.createContext<React.RefObject<(() => void) | null> | null>(null)

/** Wrap a list in this to keep at most one row open at a time. Optional; a row outside a
 *  group works, it just does not know about its neighbours. */
function SwipeableRowGroup({ children }: { children: React.ReactNode }) {
  const openRow = React.useRef<(() => void) | null>(null)
  return (
    <SwipeableRowGroupContext.Provider value={openRow}>
      {children}
    </SwipeableRowGroupContext.Provider>
  )
}

export interface SwipeableRowAction {
  /** Accessible name for the button. It has only an icon, so this is the only name. */
  label: string
  icon: React.ReactNode
  onSelect: () => void
  /** Styles the button as destructive, and lends its icon to the full-swipe layer. */
  destructive?: boolean
  className?: string
}

export interface SwipeableRowProps
  extends Omit<React.ComponentProps<"div">, "onDragEnd"> {
  /** Revealed under the row, right to left. Also the keyboard path: they are real
   *  buttons, and focusing one opens the row. */
  actions: SwipeableRowAction[]
  /**
   * Committing a full swipe. Omit it and the row only ever opens — there is no
   * threshold, and no destructive layer.
   */
  onDismiss?: () => void
  /** Fraction of the row's width past which releasing commits `onDismiss`. */
  dismissAt?: number
  /** Width of each action button in px. */
  actionWidth?: number
}

/**
 * A row that reveals actions under a swipe.
 *
 * The whole quality of this interaction lives in the release. Snapping to the nearest
 * position ignores that the finger was still moving, and the row stops dead under a hand
 * that was clearly throwing it. What makes it feel native is *projection*: where would
 * this row end up if it kept decelerating the way a flicked object does? That projected
 * point is what gets compared against the thresholds, so a short fast flick opens the row
 * and a long slow drag that stops short falls back — which is what the hand meant in both
 * cases.
 *
 * The spring that takes over is handed the pointer's exit velocity, so there is no seam
 * between the finger driving the row and the animation driving it.
 *
 * The projection is measured from where the row *is*, not from how far the finger moved.
 * Under drag elasticity those two disagree, and the eye is following the row.
 */
const SwipeableRow = React.forwardRef<HTMLDivElement, SwipeableRowProps>(
  // The gesture is already out in `useSwipeGesture`. What is left is four layers that
  // each exist only under some condition — actions, the committed wash, the armed icon,
  // the row itself — and reduced motion changes three of them.
  // fallow-ignore-next-line complexity
  (
    {
      actions,
      onDismiss,
      dismissAt = 0.5,
      actionWidth = DEFAULT_ACTION_WIDTH,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotionConfig()
    const x = useMotionValue(0)
    const rowRef = React.useRef<HTMLDivElement>(null)

    /** Where the row rests with its actions showing. Derived, so adding an action moves
     *  the resting point instead of leaving a button off the edge. */
    const openAt = -actionWidth * actions.length

    /**
     * Measured, not assumed. The dismiss threshold is a fraction of the row, and the drag
     * has to be free to travel the full width or the threshold sits somewhere the finger
     * cannot reach.
     */
    const [width, setWidth] = React.useState(0)
    React.useLayoutEffect(() => {
      const node = rowRef.current
      if (!node || typeof ResizeObserver === "undefined") return
      const observer = new ResizeObserver(([entry]) =>
        setWidth(entry.contentRect.width)
      )
      observer.observe(node)
      return () => observer.disconnect()
    }, [])

    // The actions are already in the DOM behind the row; they only need to look like they
    // are being uncovered rather than sitting there waiting. Scaling them off the row's
    // own position ties the two together exactly, with no second clock to drift.
    const actionScale = useTransform(x, [openAt, 0], [1, 0.8])
    const actionOpacity = useTransform(x, [openAt, openAt / 3, 0], [1, 0.6, 0])

    /**
     * Whether releasing now would commit.
     *
     * The reader cannot be asked to estimate a threshold from how far their own finger has
     * travelled, so the row states it: past the point of no return the destructive action
     * takes the whole width. It is a binary fact and it snaps rather than fading in
     * proportionally — a half-committed delete is not a thing.
     */
    const [armed, setArmed] = React.useState(false)
    useMotionValueEvent(x, "change", (value) => {
      if (!width || !onDismiss) return
      setArmed(value < -width * dismissAt)
    })

    const { settle, onDragEnd } = useSwipeGesture({
      x,
      openAt,
      width,
      dismissAt,
      onDismiss,
    })

    const destructive = actions.find((action) => action.destructive)
    const snap = reducedMotion
      ? { duration: 0 }
      : { duration: 0.16, ease: EASE_OUT }

    return (
      <div
        ref={mergeRefs(ref, rowRef)}
        className={cn("relative overflow-hidden rounded-xl", className)}
        {...props}
      >
        <div className="absolute inset-y-0 right-0 flex items-stretch">
          {actions.map((action) => (
            // Real buttons, always focusable. A swipe is not an accessible affordance on
            // its own, so the keyboard path is the same set of controls — focusing one
            // opens the row so the reader can see what they are on.
            <motion.button
              key={action.label}
              type="button"
              aria-label={action.label}
              onFocus={() => settle(openAt)}
              onBlur={() => settle(0)}
              onClick={action.onSelect}
              // Width inline rather than as a class, so `actionWidth` cannot drift out of
              // step with a Tailwind arbitrary value.
              style={{
                width: actionWidth,
                ...(reducedMotion
                  ? null
                  : { scale: actionScale, opacity: actionOpacity }),
              }}
              className={cn(
                "flex shrink-0 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                action.destructive
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-muted text-foreground",
                action.className
              )}
            >
              {action.icon}
            </motion.button>
          ))}
        </div>

        {onDismiss ? (
          <>
            {/* The committed layer, painted over the actions so it swallows them instead
                of having to fade each one out. Scaled from its right edge rather than
                widened, so the whole thing stays one composited transform. */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 origin-right bg-destructive"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: armed ? 1 : 0 }}
              transition={snap}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center text-destructive-foreground"
              style={{ width: actionWidth }}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: armed ? 1 : 0, scale: armed ? 1.15 : 1 }}
              transition={snap}
            >
              {destructive?.icon}
            </motion.div>
          </>
        ) : null}

        <motion.div
          drag={reducedMotion ? false : "x"}
          style={{ x }}
          // Free to travel the whole width. The open position is a resting point the
          // release decides on, not a wall the finger has to fight through — anything the
          // gesture must overcome to reach the dismiss threshold makes the threshold feel
          // like a bug.
          dragConstraints={{ left: width ? -width : openAt * 2, right: 0 }}
          // Past the constraints the row still moves, but under resistance. A hard wall
          // reads as a broken gesture; the give says there is nothing further left.
          dragElastic={{ left: 0.06, right: 0.08 }}
          // The projection here is ours. Motion's own momentum would fight it.
          dragMomentum={false}
          onDragEnd={onDragEnd}
          className={cn(
            // `rounded-[inherit]`, not a radius of its own: the container clips, and a
            // square border inside a rounded clip loses its four corners to it. Inheriting
            // means the border still follows whatever radius the caller set.
            "relative flex touch-pan-y items-center rounded-[inherit] border border-border bg-background",
            // The row is only draggable when it is allowed to move, so it only claims the
            // cursor then. `grabbing` on :active rather than on a drag state, so the change
            // lands on the press instead of on the first pixel of travel.
            !reducedMotion && "cursor-grab active:cursor-grabbing"
          )}
        >
          <div
            className="min-w-0 flex-1 px-4 py-3.5"
            // Under reduced motion the row never moves, so the actions have to be given
            // room rather than revealed.
            style={reducedMotion ? { paddingRight: -openAt + 16 } : undefined}
          >
            {children}
          </div>
        </motion.div>
      </div>
    )
  }
)
SwipeableRow.displayName = "SwipeableRow"

/**
 * Everything the release decides: where the row lands, and whether it lands at all.
 *
 * Kept apart from the render because it is the only part with a memory — of which row in
 * the group is currently open, and of the velocity the finger left behind.
 */
function useSwipeGesture({
  x,
  openAt,
  width,
  dismissAt,
  onDismiss,
}: {
  x: MotionValue<number>
  openAt: number
  width: number
  dismissAt: number
  onDismiss?: () => void
}) {
  const groupRef = React.useContext(SwipeableRowGroupContext)

  const close = React.useCallback(() => {
    animate(x, 0, SETTLE)
  }, [x])

  const claim = React.useCallback(() => {
    if (!groupRef) return
    if (groupRef.current && groupRef.current !== close) groupRef.current()
    groupRef.current = close
  }, [groupRef, close])

  const release = React.useCallback(() => {
    if (groupRef?.current === close) groupRef.current = null
  }, [groupRef, close])

  const settle = React.useCallback(
    (to: number, velocity = 0) => {
      if (to === 0) release()
      else claim()
      // Handing the pointer's velocity to the spring is the entire trick. Without it the
      // row restarts from rest and the gesture visibly ends twice.
      animate(x, to, { ...SETTLE, velocity })
    },
    [x, claim, release]
  )

  const onDragEnd = React.useCallback(
    (_: unknown, info: PanInfo) => {
      const projected = x.get() + info.velocity.x * PROJECTION

      if (onDismiss && width && projected < -width * dismissAt) {
        release()
        // Thrown far enough to mean "gone". Finish the travel rather than snapping back
        // and asking the reader to confirm what they already did.
        animate(x, -width, {
          type: "spring",
          velocity: info.velocity.x,
          stiffness: 420,
          damping: 46,
          onComplete: onDismiss,
        })
        return
      }

      settle(projected < openAt / 2 ? openAt : 0, info.velocity.x)
    },
    [x, openAt, width, dismissAt, onDismiss, release, settle]
  )

  return { settle, onDragEnd }
}

/** The row needs its own measurement and the caller may want the node too. */
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value)
      else if (ref) (ref as React.RefObject<T | null>).current = value
    }
  }
}

export { SwipeableRow, SwipeableRowGroup }
