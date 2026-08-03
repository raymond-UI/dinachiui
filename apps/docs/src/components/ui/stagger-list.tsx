"use client"

import * as React from "react"
import { motion, MotionConfigContext, useReducedMotion, type Variants } from "motion/react"
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

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

export type StaggerListVariant = "rise" | "scale" | "blur"

/** One duration for every variant. A list entrance is UI, and UI motion stays under
 *  300ms whichever channel it animates — a variant that needs longer to read is a
 *  variant that is doing too much. */
const DEFAULT_DURATION = 0.3

/** Reduced motion drops to a bare fade, which has less to say and so needs less time. */
const REDUCED_DURATION = 0.2

/** Blur is the one channel here the compositor cannot do for free, and its cost scales
 *  with the radius rather than with the fact of blurring. Small enough to stay cheap on
 *  a long list, large enough to still read as focus arriving. */
const BLUR_RADIUS = 2

interface StaggerContextValue {
  itemVariants: Variants
}

const StaggerContext = React.createContext<StaggerContextValue | null>(null)

export interface StaggerListProps
  extends React.ComponentProps<typeof motion.ul> {
  /** How each item enters. See each variant's note on the component. */
  variant?: StaggerListVariant
  /** Seconds between each item. Keep it in the 0.03–0.08 range — beyond that the
   *  last item is late enough to feel like a wait. */
  stagger?: number
  /** Seconds before the first item. */
  delay?: number
  /** Seconds for each item's own animation. */
  duration?: number
  /** Item travel distance in px. Ignored by `scale`, which does not travel. */
  distance?: number
  /** Start when scrolled into view rather than on mount. */
  startOnView?: boolean
}

/**
 * A list whose items arrive one after another, drawn three ways:
 *
 * - `rise` — items lift into place from below. The default, and the right one for
 *   anything read top to bottom, because the motion runs along the reading direction.
 * - `scale` — items settle in place from slightly small. Use it for grids and
 *   card walls, where there is no single reading direction for a rise to follow.
 * - `blur` — items pull into focus as they rise. The only variant that animates a
 *   filter, so it is the only one whose cost grows with the item count. Two things keep
 *   that in hand: the radius is small, and the item travels, which puts it on its own
 *   compositing layer so the filter is a layer operation rather than a repaint. The
 *   residue is a `filter: blur(0px)` left on each item after it lands, which makes that
 *   item a containing block for any fixed-position descendant.
 *
 * Every variant fades in, so a reduced-motion preference drops the second channel and
 * keeps the fade and the stagger — sequencing is not movement, and the sequence is the
 * information this component carries.
 */
const StaggerList = React.forwardRef<HTMLUListElement, StaggerListProps>(
  (
    {
      variant = "rise",
      stagger = 0.05,
      delay = 0,
      duration,
      distance = 8,
      startOnView = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotionConfig()
    const seconds = duration ?? DEFAULT_DURATION

    // The stagger survives a reduced-motion preference. What that preference asks for is
    // less movement, and a sequence of fades has none — collapsing it would delete the
    // component's whole point rather than soften it.
    const containerVariants: Variants = React.useMemo(
      () => ({
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }),
      [stagger, delay]
    )

    const itemVariants: Variants = React.useMemo(() => {
      const transition = {
        duration: reducedMotion ? REDUCED_DURATION : seconds,
        ease: EASE_OUT,
      }

      if (reducedMotion) {
        return { hidden: { opacity: 0 }, show: { opacity: 1, transition } }
      }

      // Full transform strings rather than motion's `x`/`y`/`scale` shorthands. The
      // shorthands are driven from the main thread, which is exactly where the contention
      // is when a stagger runs: during a scroll, or while the page is still painting the
      // content the list is made of.
      switch (variant) {
        case "scale":
          return {
            hidden: { opacity: 0, transform: "scale(0.96)" },
            show: { opacity: 1, transform: "scale(1)", transition },
          }
        case "blur":
          return {
            hidden: {
              opacity: 0,
              filter: `blur(${BLUR_RADIUS}px)`,
              transform: `translateY(${distance}px)`,
            },
            show: {
              opacity: 1,
              filter: "blur(0px)",
              transform: "translateY(0px)",
              transition,
            },
          }
        default:
          return {
            hidden: { opacity: 0, transform: `translateY(${distance}px)` },
            show: { opacity: 1, transform: "translateY(0px)", transition },
          }
      }
    }, [variant, distance, seconds, reducedMotion])

    const contextValue = React.useMemo(() => ({ itemVariants }), [itemVariants])

    return (
      <StaggerContext.Provider value={contextValue}>
        <motion.ul
          ref={ref}
          className={cn("list-none", className)}
          variants={containerVariants}
          initial="hidden"
          {...(
            // A margin rather than a visible fraction: a fraction of a tall list is a lot
            // of scrolling, so a grid would sit at zero opacity while its first rows were
            // already on screen. Insetting from the edge starts the sequence once the list
            // has properly arrived, rather than the instant it clips the fold.
            startOnView
              ? { whileInView: "show", viewport: { once: true, margin: "-100px" } }
              : { animate: "show" }
          )}
          {...props}
        >
          {children}
        </motion.ul>
      </StaggerContext.Provider>
    )
  }
)
StaggerList.displayName = "StaggerList"

export type StaggerListItemProps = React.ComponentProps<typeof motion.li>

const StaggerListItem = React.forwardRef<HTMLLIElement, StaggerListItemProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(StaggerContext)

    if (!context) {
      throw new Error("StaggerListItem must be used within a StaggerList")
    }

    return (
      <motion.li
        ref={ref}
        className={cn(className)}
        variants={context.itemVariants}
        {...props}
      >
        {children}
      </motion.li>
    )
  }
)
StaggerListItem.displayName = "StaggerListItem"

export { StaggerList, StaggerListItem }
