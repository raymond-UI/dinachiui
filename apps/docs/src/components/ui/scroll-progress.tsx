"use client"

import * as React from "react"
import { motion, MotionConfigContext, useReducedMotion, useScroll, useSpring } from "motion/react"
import { cn } from "@/lib/utils"

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

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

/** The critically damped UI spring — damping ratio 1.0, response 0.3s. The snappy end of
 *  the range, because a bar that trails the scroll thumb reads as broken rather than as
 *  smooth, and nothing here may bounce: overshoot on a progress bar claims progress the
 *  reader has not made.
 *
 *  Written as physics rather than Motion's `duration`/`bounce` shorthand deliberately. A
 *  duration-defined spring zeroes the value's inherited velocity every time it re-targets,
 *  and this one re-targets on every scroll frame — the shorthand restarts the bar from
 *  rest continuously, so it can only ever lag. The physics form carries velocity across
 *  re-targets, which is what lets the bar run at the speed the reader is scrolling.
 *
 *  Kept as the derivation (Motion's own response → stiffness conversion) so the damping
 *  ratio stays exactly 1 rather than drifting with a rounded literal. */
const RESPONSE_SECONDS = 0.3
const STIFFNESS = ((2 * Math.PI) / (RESPONSE_SECONDS * 1.2)) ** 2
const SPRING = {
  stiffness: STIFFNESS,
  damping: 2 * Math.sqrt(STIFFNESS),
  mass: 1,
} as const

/** A ref to the scrollport, or a CSS selector for one. */
export type ScrollProgressContainer =
  | React.RefObject<HTMLElement | null>
  | string

/** A selector is accepted because an app whose scrollport lives in a server-rendered
 *  layout has nowhere to hang a ref. It resolves in a layout effect declared *before*
 *  `useScroll`, so the scroll listener attaches to the right element on the first commit;
 *  the node is in the DOM by then even when its own ref is not yet set. A selector that
 *  matches nothing falls back to the page rather than throwing.
 *
 *  A ref is handed to `useScroll` untouched — an ancestor's ref is still empty while this
 *  component's layout effects run, and Motion already defers its listener by a phase to
 *  cover exactly that. */
function useScrollContainer(container?: ScrollProgressContainer) {
  const [ref, setRef] = React.useState<React.RefObject<HTMLElement | null>>(
    () => ({ current: null })
  )

  useIsomorphicLayoutEffect(() => {
    if (typeof container !== "string") return

    const resolved =
      document.querySelector<HTMLElement>(container) ??
      // `scrollingElement` is null in quirks mode, and the element it names is the
      // documentElement everywhere else, so that is the fallback's fallback. Handing
      // Motion an empty ref instead would throw.
      (document.scrollingElement as HTMLElement | null) ??
      document.documentElement

    if (ref.current === resolved) return

    // Filling the object in place is enough on mount. After that `useScroll` only moves
    // its listener when the ref identity changes, so a later swap needs a new object.
    if (ref.current === null) ref.current = resolved
    else setRef({ current: resolved })
  }, [container, ref])

  return typeof container === "string" ? ref : container
}

export interface ScrollProgressProps
  extends React.ComponentProps<typeof motion.div> {
  /** Scroll container to track — a ref, or a CSS selector for a scrollport you cannot hang
   *  a ref on. Omit to track the page, but note that an app which scrolls an inner element
   *  rather than the document leaves the bar at zero until it is pointed at that element. */
  containerRef?: ScrollProgressContainer
  /** Smooth the bar with a spring. Set `false` for a 1:1 bar. */
  smooth?: boolean
  /** Position the bar itself. Set `false` to place it yourself. */
  fixed?: boolean
}

/**
 * A bar tracking how far a scroll container has been read.
 *
 * Uses `scaleX` rather than `width` — width forces layout on every scroll frame, scaleX
 * runs on the compositor.
 *
 * The spring is not decoration: a mouse wheel arrives in discrete notches, and smoothing
 * turns that staircase into continuous motion. It is short enough that the bar never
 * visibly disagrees with the text on screen. A reduced-motion preference drops it and
 * tracks scroll 1:1 — the bar still moves, because that movement is the reader's own
 * gesture rather than motion the interface added.
 */
const ScrollProgress = React.forwardRef<HTMLDivElement, ScrollProgressProps>(
  (
    {
      containerRef,
      smooth = true,
      fixed = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const container = useScrollContainer(containerRef)
    const { scrollYProgress } = useScroll({ container })
    const springProgress = useSpring(scrollYProgress, SPRING)
    const reducedMotion = useReducedMotionConfig()

    const scaleX = smooth && !reducedMotion ? springProgress : scrollYProgress

    return (
      <motion.div
        ref={ref}
        aria-hidden
        style={{ scaleX, ...style }}
        // `will-change-transform` stays on permanently, against the usual advice to hint
        // only imminent motion: this element is transformed on essentially every scroll
        // frame, so the layer it promotes is never idle. `pointer-events-none` keeps a
        // fixed bar from swallowing clicks along the top edge of the viewport.
        className={cn(
          "pointer-events-none h-0.5 w-full origin-left bg-primary will-change-transform",
          fixed && "fixed inset-x-0 top-0 z-50",
          className
        )}
        {...props}
      />
    )
  }
)
ScrollProgress.displayName = "ScrollProgress"

export { ScrollProgress }
