"use client"

import * as React from "react"
import { motion, MotionConfigContext, useInView, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

/** Motion does not export it, so it is read back off `useInView`. */
type InViewMargin = NonNullable<Parameters<typeof useInView>[1]>["margin"]

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

/** Seconds. Shared with the rest of the motion tier so a page that reduces one
 *  component reduces all of them at the same rate. */
const REDUCED_DURATION = 0.2

type Direction = "up" | "down" | "left" | "right"

// All values are percentages so motion can interpolate the clip-path cleanly —
// mixing px and % in one inset() breaks interpolation.
const HIDDEN_CLIP: Record<Direction, string> = {
  up: "inset(0% 0% 100% 0%)",
  down: "inset(100% 0% 0% 0%)",
  left: "inset(0% 0% 0% 100%)",
  right: "inset(0% 100% 0% 0%)",
}

const SHOWN_CLIP = "inset(0% 0% 0% 0%)"

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
}

const SHOWN_TRANSFORM = "translate(0px, 0px)"

export interface ScrollRevealProps
  extends React.ComponentProps<typeof motion.div> {
  /** Direction the content travels as it reveals. The aperture opens against the
   *  travel, so the block appears to slide up through a shutter opening downwards. */
  direction?: Direction
  /** Travel distance in px. Matches StaggerList's item travel; the wipe is the
   *  gesture here, and the nudge only gives it a direction. */
  distance?: number
  /** Seconds. The wipe traverses the whole block rather than nudging it, which puts
   *  it in the same class of slower gesture as StaggerList's `blur` — and on the same
   *  budget. Front-loaded by `EASE_OUT`, so most of the travel lands in the first
   *  third and the rest is settle. */
  duration?: number
  /** Seconds to wait after entering view. Only useful for cascading sibling reveals,
   *  and only in the 0.03–0.08 range per step — past that the last block is late
   *  enough to read as a wait. For an actual list, reach for StaggerList instead,
   *  which sequences from one trigger rather than one observer per item. */
  delay?: number
  /** Re-run every time it re-enters view. Off by default and best left off: replaying
   *  an entrance on content the reader has already read is decoration, not
   *  information, and it makes the page feel like it is fighting the scroll. */
  repeat?: boolean
  /** Root margin for the viewport trigger. The default holds the reveal back until
   *  the block is clear of the fold, so the wipe is not already over by the time it
   *  is worth looking at. The cost is that a block shorter than that inset which sits
   *  at the very bottom of the scroll range can never clear the line — pass `"0px"`
   *  for trailing content with nothing below it. */
  margin?: string
  /** Fraction of the element that must be visible, 0–1. Defaults to `"some"` — any
   *  intersection at all — because a numeric amount is unreachable for a block taller
   *  than the root, and content that never reveals is worse than content that reveals
   *  early. `margin` is the threshold that does the work. */
  amount?: number | "some" | "all"
  /** Observe against a scrollable ancestor instead of the viewport. Needed whenever
   *  the content lives in its own scroll container — a dialog body, a sidebar, a chat
   *  log — since otherwise the trigger is measured against the window and fires at
   *  effectively arbitrary times. Must be an ancestor of the revealed content:
   *  IntersectionObserver reports no intersection at all against an unrelated root,
   *  and the block would stay hidden forever. */
  root?: React.RefObject<Element | null>
}

/**
 * A block that wipes into view the first time it is scrolled to.
 *
 * The reveal is a `clip-path` inset paired with a short travel, so the content is
 * uncovered edge-first rather than fading in as a whole — a fade alone reads as a
 * loading state rather than as arrival.
 *
 * Use it sparingly, and only on content the reader has not seen yet: one hero block,
 * one feature grid. A page where everything reveals is a page that is slow to read,
 * because every block withholds itself until the scroll catches up. Anything the
 * reader returns to, or arrives at from a deep link, is better off just being there.
 *
 * The hidden state is a real style on the element, so the content depends on JS
 * running to become visible. That is the trade for the effect; don't wrap anything
 * whose absence would be a bug rather than a missing flourish.
 */
const ScrollReveal = React.forwardRef<HTMLDivElement, ScrollRevealProps>(
  (
    {
      direction = "up",
      distance = 8,
      duration = 0.45,
      delay = 0,
      repeat = false,
      margin = "0px 0px -100px 0px",
      amount = "some",
      root,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement)

    const inView = useInView(innerRef, {
      once: !repeat,
      // Motion types this as a template literal, which a plain `string` prop cannot
      // satisfy. Kept as `string` so callers are not made to fight the type.
      margin: margin as InViewMargin,
      amount,
      root,
    })
    const reducedMotion = useReducedMotionConfig()

    const offset = OFFSET[direction]

    // Reduced motion keeps the fade — it still signals "new content arrived" —
    // but drops the wipe and the travel.
    const hidden = reducedMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          clipPath: HIDDEN_CLIP[direction],
          // A `transform` string rather than motion's `x`/`y`: only `opacity`,
          // `clipPath`, `filter` and `transform` are handed off to WAAPI. `x` and `y`
          // stay on the main thread, which is the worst place to be for something
          // that by definition runs while the user is scrolling — and it would leave
          // the clip and the travel on two different clocks, drifting apart.
          transform: `translate(${offset.x * distance}px, ${offset.y * distance}px)`,
        }

    const shown = reducedMotion
      ? { opacity: 1 }
      : { opacity: 1, clipPath: SHOWN_CLIP, transform: SHOWN_TRANSFORM }

    return (
      // The observed node and the animated node have to be different elements.
      // `clip-path` shrinks an element's intersection rect in Chromium, and the hidden
      // state clips to zero area — so observing the node we wipe would pin `inView` to
      // false and the content could never reveal itself. This wrapper is never clipped.
      <div ref={innerRef}>
        <motion.div
          className={cn(className)}
          initial={hidden}
          animate={inView ? shown : hidden}
          transition={
            inView
              ? {
                  duration: reducedMotion ? REDUCED_DURATION : duration,
                  delay,
                  ease: EASE_OUT,
                }
              : // Re-arming is not a performance anyone should have to sit through.
                // Under `repeat`, animating back out would fade the block away at the
                // edge of the viewport while it is still being read, and `delay` would
                // hold it there first. Leaving view resets instead.
                { duration: 0 }
          }
          {...props}
        >
          {children}
        </motion.div>
      </div>
    )
  }
)
ScrollReveal.displayName = "ScrollReveal"

export { ScrollReveal }
