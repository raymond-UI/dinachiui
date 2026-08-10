"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  MotionConfigContext,
  useReducedMotion,
  type Target,
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

/**
 * The budget for a control someone presses dozens of times a day. Short enough that it never
 * sits between the press and the answer: no bounce, no delay.
 */
const SNAP = { duration: 0.15, ease: [0.23, 1, 0.32, 1] } as const

export type AnimatedIconMode = "scale" | "rotate" | "flip" | "fade"

/**
 * How the outgoing icon leaves and the incoming one arrives.
 *
 * All four are transforms and opacity, so any pair of icons works — including two that share
 * no geometry at all. `exit` deliberately mirrors `initial` rather than repeating it: the
 * icon that leaves goes the way the next one is coming from, so the pair reads as one
 * movement rather than as two.
 */
const MODES: Record<AnimatedIconMode, { initial: Target; animate: Target; exit: Target }> = {
  // Nothing appears from nothing: 0.7 rather than 0, so the icon is always a shape.
  scale: {
    initial: { opacity: 0, scale: 0.7 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.7 },
  },
  rotate: {
    initial: { opacity: 0, scale: 0.7, rotate: -90 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.7, rotate: 90 },
  },
  flip: {
    initial: { opacity: 0, rotateX: -90 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: 90 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
}

export interface AnimatedIconProps
  extends Omit<React.ComponentProps<"span">, "children"> {
  /** Which of the two is showing. `false` shows `from`, `true` shows `to`. */
  active: boolean
  /** The resting icon. Any element: a lucide icon, an inline `<svg>`, an emoji. */
  from: React.ReactNode
  /** The icon for the active state. */
  to: React.ReactNode
  mode?: AnimatedIconMode
}

/**
 * Two icons in one place, trading with a transition instead of a swap.
 *
 * The value is not that the icon is animated. It is that the two states read as the *same
 * object* changing, so the control is one toggle rather than two buttons taking turns. Swap
 * the element outright and the eye registers a replacement; move it and the eye registers a
 * state.
 *
 * This is a shell, not a set of icons. Give it any two — play and pause, volume and mute,
 * copy and check, a lucide pair, your own SVG — and it handles the crossfade, the stacking,
 * the sizing and the reduced-motion path. It cannot morph one path into another, because
 * that requires two paths written with the same commands in the same order and no two icons
 * from a library ever are. What it does instead is a transform pair, which works for every
 * combination rather than for the handful that happen to be compatible.
 *
 * Both icons live in one grid cell, so nothing reflows mid-transition, and the cell owns the
 * size: `className="size-8"` and both of them are 8. Sizing each icon separately is the
 * thing that goes wrong here — an icon library ships an intrinsic 24×24 that a smaller box
 * squashes on one axis, and two icons sized apart are two icons that jump.
 *
 * It carries `aria-hidden`, because it is decoration inside a control and the control is what
 * gets named. If the icon is the only thing in a button, name the button.
 */
const AnimatedIcon = React.forwardRef<HTMLSpanElement, AnimatedIconProps>(
  ({ active, from, to, mode = "scale", className, style, ...props }, ref) => {
    const reducedMotion = useReducedMotionConfig()
    const variants = MODES[mode]

    return (
      <span
        ref={ref}
        aria-hidden
        // A grid rather than a stack of absolutely positioned children: both icons occupy
        // one cell, so nothing reflows mid-transition and neither one has to be measured.
        //
        // The box owns the size, and the icons fill it. An icon library ships its own
        // intrinsic 24×24, which a smaller cell would squash on one axis and a larger one
        // would leave floating in the middle — so the size is stated once, here, and both
        // icons are made to agree with it.
        className={cn(
          "relative inline-grid size-5 shrink-0 place-items-center [&_svg]:size-full",
          className
        )}
        // `flip` turns around an axis in the plane of the screen, which is a rotation you
        // cannot see without a vanishing point. The others do not need one.
        style={mode === "flip" ? { perspective: 400, ...style } : style}
        {...props}
      >
        {/* `initial={false}` so the icon is simply present on first paint. An entrance on
            mount would animate every icon on the page during hydration. */}
        <AnimatePresence initial={false} mode="sync">
          <motion.span
            key={active ? "to" : "from"}
            className="col-start-1 row-start-1 inline-flex size-full"
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            // Reduced motion keeps the change and drops the movement. At zero duration the
            // two states cut, which is the correct answer for a control this frequent.
            transition={reducedMotion ? { duration: 0 } : SNAP}
          >
            {active ? to : from}
          </motion.span>
        </AnimatePresence>
      </span>
    )
  }
)
AnimatedIcon.displayName = "AnimatedIcon"

export { AnimatedIcon }
