"use client"

import * as React from "react"
import {
  animate,
  motion,
  MotionConfigContext,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
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
  return prefersReduced
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

/** Runs a consumer's handler ahead of the component's own, so passing one adds
 *  behaviour instead of replacing it. */
function compose<E>(
  theirs: ((event: E) => void) | undefined,
  ours: (event: E) => void
) {
  return (event: E) => {
    theirs?.(event)
    ours(event)
  }
}

const clamp = (n: number) => Math.min(100, Math.max(0, n))

export interface CompareSliderProps
  extends Omit<React.ComponentProps<"div">, "children" | "onChange"> {
  /** Content shown on the left of the divider. */
  before: React.ReactNode
  /** Content shown on the right of the divider. */
  after: React.ReactNode
  /** Starting divider position, 0–100. */
  defaultPosition?: number
  /** Percentage points moved per arrow key press. */
  step?: number
  /** What starts a drag.
   *
   *  `"handle"` — the default — limits dragging to the divider, leaving both layers
   *  live: buttons take clicks, text takes selection, links take focus.
   *
   *  `"panel"` treats the whole surface as the control, so pressing anywhere jumps
   *  the divider there. Reach for it when the panes are images, where there is
   *  nothing to click and a thin handle is a needlessly small target — but note that
   *  it makes both layers inert, which reads as a bug on anything interactive. */
  drag?: "panel" | "handle"
  /** Accessible name for the divider handle. */
  label?: string
  /** Keep the knob at the vertical middle of the viewport instead of the middle of
   *  the panel. Set this when the panel is taller than the screen, or the knob spends
   *  most of the page off-screen. */
  stickyHandle?: boolean
  /** Fired on release and on each keyboard step. */
  onPositionChange?: (position: number) => void
}

/**
 * Drag a divider to compare two layers.
 *
 * A pointer drag tracks 1:1 with no easing — that is direct manipulation, and any
 * smoothing there reads as lag. A keyboard step is the opposite case: one press moves
 * the divider a fixed slice of the panel in a single frame, which strobes rather than
 * moves, so each step is carried over 100ms instead. The tween retargets from wherever
 * the divider currently is, so a held arrow key composes into one continuous travel
 * rather than a queue of restarts.
 *
 * Position lives in a motion value, so dragging never triggers a React render.
 * Component state is synced on release and on each keyboard step, where it feeds
 * `aria-valuenow` — that sync is deliberately immediate on a key press, so the
 * announced value is never waiting on the pixels to arrive.
 */
const CompareSlider = React.forwardRef<HTMLDivElement, CompareSliderProps>(
  (
    {
      before,
      after,
      defaultPosition = 50,
      step = 2,
      drag = "handle",
      label = "Compare position",
      stickyHandle = false,
      onPositionChange,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    const reducedMotion = useReducedMotionConfig()
    const position = useMotionValue(clamp(defaultPosition))
    const [announced, setAnnounced] = React.useState(clamp(defaultPosition))
    // Where the divider is headed. Stepping off the motion value instead would sample
    // a step still in flight, so each key repeat would advance by less than a full step.
    const settled = React.useRef(clamp(defaultPosition))
    const stepAnimation = React.useRef<ReturnType<typeof animate> | null>(null)
    // The pointer that owns the gesture. A second finger arriving mid-drag would
    // measure its own grab offset and jump the divider under the first one, so every
    // other pointer is ignored until this one lifts.
    const activePointer = React.useRef<number | null>(null)
    // How far the pointer sat from the divider when the drag began. Grabbing a handle
    // should not teleport it under your finger; pressing the panel should.
    const grabOffset = React.useRef(0)

    React.useEffect(() => () => stepAnimation.current?.stop(), [])

    const remainder = useTransform(position, (p) => 100 - p)
    const clipPath = useMotionTemplate`inset(0% ${remainder}% 0% 0%)`
    // A percentage translate resolves against the element's own width, so a track the
    // full width of the panel converts the position straight into a transform. `left`
    // would say the same thing as a layout property recomputed on every frame of a
    // drag, where this is composited.
    const track = useMotionTemplate`translateX(${position}%)`

    const setFromClientX = React.useCallback(
      (clientX: number) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect || rect.width === 0) return
        const x = clientX - grabOffset.current - rect.left
        const next = clamp((x / rect.width) * 100)
        settled.current = next
        position.set(next)
      },
      [position]
    )

    const commit = React.useCallback(() => {
      const next = Math.round(position.get())
      setAnnounced(next)
      onPositionChange?.(next)
    }, [position, onPositionChange])

    const stepBy = React.useCallback(
      (delta: number) => {
        stepAnimation.current?.stop()
        const next = clamp(settled.current + delta)
        settled.current = next
        const rounded = Math.round(next)
        setAnnounced(rounded)
        onPositionChange?.(rounded)
        if (reducedMotion) {
          position.set(next)
          return
        }
        stepAnimation.current = animate(position, next, {
          duration: 0.1,
          ease: EASE_OUT,
        })
      },
      [position, onPositionChange, reducedMotion]
    )

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const large = event.shiftKey ? 5 : 1
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowDown":
          event.preventDefault()
          stepBy(-step * large)
          break
        case "ArrowRight":
        case "ArrowUp":
          event.preventDefault()
          stepBy(step * large)
          break
        case "Home":
          event.preventDefault()
          stepBy(-100)
          break
        case "End":
          event.preventDefault()
          stepBy(100)
          break
        default:
          break
      }
    }

    const onHandle = drag === "handle"
    // A panel taller than the screen still has to scroll vertically, so only the
    // horizontal axis is claimed there.
    const touch = stickyHandle ? "touch-pan-y" : "touch-none"

    const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerId !== activePointer.current) return
      activePointer.current = null
      grabOffset.current = 0
      commit()
    }

    const dragHandlers = {
      onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
        if (activePointer.current !== null) return
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect || rect.width === 0) return
        // A step still in flight has to be dropped here rather than left to finish,
        // or it would keep writing over the pointer for the rest of its 100ms. The
        // grab offset is then measured against where the divider actually is on
        // screen, not where that step was headed.
        stepAnimation.current?.stop()
        grabOffset.current = onHandle
          ? event.clientX - (rect.left + (rect.width * position.get()) / 100)
          : 0
        activePointer.current = event.pointerId
        event.currentTarget.setPointerCapture(event.pointerId)
        setFromClientX(event.clientX)
      },
      onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerId === activePointer.current) setFromClientX(event.clientX)
      },
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      // Capture can be lost without a `pointerup` — the drag has to end there too, or
      // the divider stays bound to a pointer that is no longer down.
      onLostPointerCapture: endDrag,
    }

    // Spread after the consumer's props, and composed rather than assigned: their
    // handler still runs, but it cannot take the drag's place. A slider whose pointer
    // handlers were quietly overwritten still looks interactive and is not.
    const panelHandlers = onHandle
      ? {}
      : {
          onPointerDown: compose(props.onPointerDown, dragHandlers.onPointerDown),
          onPointerMove: compose(props.onPointerMove, dragHandlers.onPointerMove),
          onPointerUp: compose(props.onPointerUp, dragHandlers.onPointerUp),
          onPointerCancel: compose(
            props.onPointerCancel,
            dragHandlers.onPointerCancel
          ),
          onLostPointerCapture: compose(
            props.onLostPointerCapture,
            dragHandlers.onLostPointerCapture
          ),
        }

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative isolate w-full rounded-lg",
          // Only claim selection and touch gestures where the drag actually starts.
          // In handle mode the layers stay live, so taking either off the container
          // would break selecting text and scrolling the page under it.
          onHandle ? "select-auto" : cn("select-none", touch),
          // `overflow: clip` still trims to the radius but does not open a scrollport,
          // which `overflow: hidden` does — and a sticky knob resolves against the
          // nearest scrollport, so `hidden` would pin it to a box that never scrolls.
          stickyHandle ? "overflow-clip" : "overflow-hidden",
          className
        )}
        {...props}
        {...panelHandlers}
      >
        {/* `after` is the base layer and `before` is clipped over it, because the clip
            runs from the left edge to the divider — so whichever layer is clipped is
            the one on the left.

            Both layers isolate. Without it neither one owns a stacking context, so a
            `z-10` anywhere inside the base layer competes directly with the clipped
            layer above it and paints straight through the clip — invisible with two
            images, immediately obvious the moment either side is real UI. */}
        <div className="relative isolate">{after}</div>

        <motion.div style={{ clipPath }} className="absolute inset-0 isolate">
          {before}
        </motion.div>

        {/* The track spans the panel and carries the transform; it stays inert so the
            layers underneath keep their clicks, and only the strip inside it takes the
            pointer. */}
        <motion.div
          style={{ transform: track }}
          className="pointer-events-none absolute inset-0 z-10"
        >
          <div
            role="slider"
            tabIndex={0}
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={announced}
            aria-orientation="horizontal"
            onKeyDown={handleKeyDown}
            {...(onHandle ? dragHandlers : {})}
            className={cn(
              "pointer-events-auto absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 cursor-ew-resize bg-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              // A 2px line is not a grab target. The pseudo-element widens the hit area
              // to a comfortable strip without widening the line you can see.
              onHandle &&
                cn(
                  touch,
                  "select-none before:absolute before:inset-y-0 before:-left-2.5 before:-right-2.5 before:content-['']"
                )
            )}
          >
            <span
              aria-hidden
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground shadow-md",
                stickyHandle
                  ? // The divider is 2px wide, so the knob's flow position starts 1px
                    // left of centre and has to be pulled back by the rest of its half.
                    // The top margin only decides where it rests before anything has
                    // scrolled — without it the knob would start pinned to the very top
                    // edge of the panel, which reads as broken.
                    "sticky top-[50vh] -ml-[13px] mt-[30vh]"
                  : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              )}
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" transform="translate(-3 0)" />
                <polyline points="9 18 15 12 9 6" transform="translate(3 0)" />
              </svg>
            </span>
          </div>
        </motion.div>
      </div>
    )
  }
)
CompareSlider.displayName = "CompareSlider"

export { CompareSlider }
