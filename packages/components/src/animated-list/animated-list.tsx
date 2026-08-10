"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  MotionConfigContext,
  useReducedMotion,
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

const DEFAULT_DURATION = 0.3

interface AnimatedListContextValue {
  from: "top" | "bottom"
  duration: number
  reducedMotion: boolean
}

const AnimatedListContext = React.createContext<AnimatedListContextValue | null>(null)

export interface AnimatedListProps extends React.ComponentProps<"ul"> {
  /** Which edge new rows arrive from. The direction of travel is a claim about where a
   *  row came from, so a feed that grows downward should not have its rows rising. */
  from?: "top" | "bottom"
  /**
   * The key of the row the reader closed themselves, if any.
   *
   * A row the reader dismissed and a row the server retracted are the same removal to
   * React and two different events to the reader, so they leave differently: the first
   * slides out towards the control that was just pressed, the second collapses in place.
   *
   * Set it in the same update that removes the row. By the time the row is leaving it is
   * already gone from the list, so nothing captured at render can still say why — this
   * value rides `AnimatePresence`'s `custom`, which is the one channel motion re-reads
   * when it resolves an exit. Leave it unset and every removal collapses in place.
   */
  dismissed?: string | null
  /** Seconds for each row's own animation. The reflow spring is scaled from it. */
  duration?: number
}

/**
 * A list whose contents change under the reader.
 *
 * Entering and leaving are the easy half. The case that decides whether a live list feels
 * built or assembled is the third one: the row that neither entered nor left but had to
 * move because something above it did. That movement is FLIP — motion measures both
 * positions across the commit and animates the difference — so a row that shifts up reads
 * as *displaced* rather than as having been repainted somewhere else.
 *
 * `mode="popLayout"` is what makes entrances, exits and displacement cooperate. An exiting
 * row is pulled out of layout flow immediately and animated on top of it, so the rows
 * below start closing the gap on the same frame the row starts leaving instead of waiting
 * for it to finish.
 *
 * Reduced motion drops the travel but not the reflow. Rows still have to end up in the
 * right place; they just get there in one frame.
 */
const AnimatedList = React.forwardRef<HTMLUListElement, AnimatedListProps>(
  (
    { from = "top", dismissed = null, duration, className, children, ...props },
    ref
  ) => {
    const reducedMotion = useReducedMotionConfig()
    const seconds = duration ?? DEFAULT_DURATION

    const context = React.useMemo(
      () => ({ from, duration: seconds, reducedMotion }),
      [from, seconds, reducedMotion]
    )

    return (
      <AnimatedListContext.Provider value={context}>
        <ul ref={ref} className={cn("list-none", className)} {...props}>
          <AnimatePresence mode="popLayout" initial={false} custom={dismissed}>
            {children}
          </AnimatePresence>
        </ul>
      </AnimatedListContext.Provider>
    )
  }
)
AnimatedList.displayName = "AnimatedList"

export interface AnimatedListItemProps
  extends React.ComponentProps<typeof motion.li> {
  /** The same string given to React's `key`, which a component cannot read back. Only
   *  needed if the list is using `dismissed`. */
  itemKey?: string
}

const AnimatedListItem = React.forwardRef<HTMLLIElement, AnimatedListItemProps>(
  ({ itemKey, className, children, ...props }, ref) => {
    const context = React.useContext(AnimatedListContext)

    if (!context) {
      throw new Error("AnimatedListItem must be used within an AnimatedList")
    }

    const { from, duration, reducedMotion } = context

    // `x`, `y` and `scale` rather than the full transform strings the rest of the tier
    // prefers. Those keep motion off the main thread, but `layout` builds the element's
    // transform out of these very values plus its own projection delta — hand it a
    // `transform` string and the two write over each other.
    const variants = {
      exit: (closedByReader: string | null) => {
        if (reducedMotion) return { opacity: 0, x: 0, scale: 1 }
        return closedByReader != null && closedByReader === itemKey
          ? { opacity: 0, x: 24, scale: 0.97 }
          : { opacity: 0, x: 0, scale: 0.94 }
      },
    }

    return (
      <motion.li
        ref={ref}
        layout
        className={cn(className)}
        // Every key `animate` sets appears in every branch. Dropping one under reduced
        // motion does not disable it — it animates it from `undefined`.
        initial={
          reducedMotion
            ? { opacity: 0, x: 0, y: 0, scale: 1 }
            : { opacity: 0, x: 0, y: from === "top" ? -12 : 12, scale: 0.97 }
        }
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        variants={variants}
        exit="exit"
        transition={{
          layout: reducedMotion
            ? { duration: 0 }
            : { type: "spring", bounce: 0.15, duration: duration * 1.4 },
          // Opacity stays on a fixed clock so a row is never left half-visible waiting
          // for a spring to settle.
          default: { duration: reducedMotion ? 0.2 : duration, ease: EASE_OUT },
        }}
        {...props}
      >
        {children}
      </motion.li>
    )
  }
)
AnimatedListItem.displayName = "AnimatedListItem"

export { AnimatedList, AnimatedListItem }
