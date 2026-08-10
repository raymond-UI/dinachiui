"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  MotionConfigContext,
  useReducedMotion,
  type Transition,
} from "motion/react"
import { cn } from "@dinachi/core"

/**
 * The handover from skeleton to content.
 *
 * Almost nobody treats this as an animation, which is why it is the jankiest moment in most
 * apps: the skeleton is removed, the real content is inserted at a different height, and
 * everything below it jumps. The skeleton was supposed to be preventing exactly that.
 *
 * Two things fix it. The container animates its own height across the swap, so the page
 * below settles instead of snapping — and because that is motion's layout animation, the
 * height change is applied as a transform with a scale correction on the children rather
 * than as a real height tween, so it stays off the main thread. The skeleton then leaves on
 * a shorter clock than the content arrives on, so there is never a frame with both at full
 * strength and never one with neither.
 *
 * The third thing is not motion at all: a skeleton that appears and disappears inside 150ms
 * is a flash, and a flash is worse than the wait it was hiding. See `useSkeletonVisibility`.
 */

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

const RESIZE: Transition = { type: "spring", bounce: 0, duration: 0.4 }

export interface LoadTransitionProps
  extends Omit<React.ComponentProps<typeof motion.div>, "children"> {
  loading: boolean
  skeleton: React.ReactNode
  /** Milliseconds of loading before the skeleton appears at all. */
  delay?: number
  /** Milliseconds the skeleton is held once shown, so it cannot flash. */
  minimum?: number
  /** Corner radius in px. An inline value, not a class — see below. */
  radius?: number
  children?: React.ReactNode
}

const LoadTransition = React.forwardRef<HTMLDivElement, LoadTransitionProps>(
  (
    {
      loading,
      skeleton,
      delay = 180,
      minimum = 420,
      radius = 12,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotionConfig()
    const showSkeleton = useSkeletonVisibility(loading, delay, minimum)

    return (
      <motion.div
        ref={ref}
        layout
        transition={reducedMotion ? { duration: 0 } : RESIZE}
        // Radius as an inline style, not a class: motion can only counteract the distortion
        // its own scale introduces on a value it is animating, and a class is invisible to
        // it. As a class the corners visibly stretch during the resize.
        style={{ borderRadius: radius, ...style }}
        className={cn(
          "relative overflow-hidden border border-border bg-background p-4",
          className
        )}
        {...props}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {showSkeleton ? (
            <motion.div
              key="skeleton"
              // `layout` on the child too, so the parent's scale is undone here rather than
              // squashing the rows inside it.
              layout
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              // Out fast. A skeleton lingering over the real text is the one thing worse
              // than a hard swap.
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.12 }}
            >
              {skeleton}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              layout
              // `y` is present in both branches so reduced motion drops the travel rather
              // than animating it from `undefined`.
              initial={reducedMotion ? { opacity: 0, y: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.26,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }
)
LoadTransition.displayName = "LoadTransition"

/**
 * When the skeleton is actually on screen, which is not the same as when the data is
 * loading.
 *
 * Two thresholds, and they solve opposite problems. Nothing shows for the first `delay`,
 * because a request that returns in 120ms should go straight to content — a placeholder
 * shown for two frames reads as a glitch, not as feedback. Once shown it stays for at least
 * `minimum`, because a skeleton that appears and vanishes immediately is the same flash
 * arriving from the other direction.
 */
function useSkeletonVisibility(loading: boolean, delay = 180, minimum = 420) {
  const [visible, setVisible] = React.useState(false)
  const shownAt = React.useRef(0)

  React.useEffect(() => {
    if (loading) {
      if (visible) return
      const timer = setTimeout(() => {
        shownAt.current = Date.now()
        setVisible(true)
      }, delay)
      return () => clearTimeout(timer)
    }

    if (!visible) return
    const held = Date.now() - shownAt.current
    const timer = setTimeout(() => setVisible(false), Math.max(0, minimum - held))
    return () => clearTimeout(timer)
  }, [loading, visible, delay, minimum])

  return visible
}

export { LoadTransition, useSkeletonVisibility }
