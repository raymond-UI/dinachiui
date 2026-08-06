"use client"

import * as React from "react"
import { motion, MotionConfigContext, useReducedMotion } from "motion/react"
import { cn } from "@dinachi/core"

/**
 * Icons that change state by moving rather than by swapping.
 *
 * The value is not that the icon is animated. It is that the two states are visibly the
 * *same object*, so the button reads as one toggle rather than as two buttons taking turns.
 *
 * Where the shapes allow it these are pure transforms on static geometry, which stays on
 * the compositor. Play/pause is the exception: it interpolates `d` directly, which only
 * works because both paths are written with the same points in the same order. A morph
 * between paths with different command structures does not degrade — it fails.
 *
 * None of them carry an accessible name. They are decoration inside a control, and the
 * control is what gets named.
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

/**
 * The budget for a control someone presses dozens of times a day. Short enough that it
 * never sits between the press and the answer: no bounce, no delay.
 */
const SNAP = { duration: 0.15, ease: [0.23, 1, 0.32, 1] } as const

function useSnap() {
  const reducedMotion = useReducedMotionConfig()
  return reducedMotion ? { duration: 0 } : SNAP
}

export type AnimatedIconProps = React.ComponentProps<typeof motion.svg>

/**
 * `transform-box: view-box` pins the origin to the 24×24 coordinate system rather than to
 * each line's own bounding box — a horizontal line's box is zero pixels tall, so `fill-box`
 * would give it a degenerate origin and the rotation would swing wide. With the view box,
 * each bar's origin is its own midpoint stated in viewBox units, so the two ±45° rotations
 * land on the same point and the X actually closes.
 */
const barOrigin = (y: number) =>
  ({ transformBox: "view-box", transformOrigin: `12px ${y}px` }) as const

export interface AnimatedMenuIconProps extends AnimatedIconProps {
  open: boolean
}

/** Three bars that fold into a close button. */
const AnimatedMenuIcon = React.forwardRef<SVGSVGElement, AnimatedMenuIconProps>(
  ({ open, className, ...props }, ref) => {
    const transition = useSnap()

    return (
      <motion.svg
        ref={ref}
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        className={cn("h-5 w-5 stroke-current", className)}
        {...props}
      >
        <motion.line
          x1="4"
          x2="20"
          y1="7"
          y2="7"
          // Translate first, then rotate about the bar's own midpoint: +5 puts it on the
          // centre line at y=12, and the rotation pivots there. The X is built out of the
          // menu rather than replacing it.
          animate={open ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
          transition={transition}
          style={barOrigin(7)}
        />
        <motion.line
          x1="4"
          x2="20"
          y1="12"
          y2="12"
          animate={open ? { opacity: 0, scaleX: 0.4 } : { opacity: 1, scaleX: 1 }}
          transition={transition}
          style={barOrigin(12)}
        />
        <motion.line
          x1="4"
          x2="20"
          y1="17"
          y2="17"
          animate={open ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
          transition={transition}
          style={barOrigin(17)}
        />
      </motion.svg>
    )
  }
)
AnimatedMenuIcon.displayName = "AnimatedMenuIcon"

// Four points each, in the same order, so the two halves of the pause bar can slide into
// the two halves of the triangle without the path structure changing under them.
const PAUSE_LEFT = "M 8 5 L 12 5 L 12 19 L 8 19 Z"
const PLAY_LEFT = "M 8 5 L 12 7.4 L 12 16.6 L 8 19 Z"
const PAUSE_RIGHT = "M 14 5 L 18 5 L 18 19 L 14 19 Z"
const PLAY_RIGHT = "M 12 7.4 L 18 10.9 L 18 13.1 L 12 16.6 Z"

export interface AnimatedPlayIconProps extends AnimatedIconProps {
  playing: boolean
}

/** A play triangle that folds into a pause bar, and back. */
const AnimatedPlayIcon = React.forwardRef<SVGSVGElement, AnimatedPlayIconProps>(
  ({ playing, className, ...props }, ref) => {
    const transition = useSnap()

    return (
      <motion.svg
        ref={ref}
        aria-hidden
        viewBox="0 0 24 24"
        className={cn("h-5 w-5 fill-current", className)}
        {...props}
      >
        {/* `d` is stated as `initial` rather than left to `animate` alone: motion cannot read
            a path back off the DOM, so without it the first paint is an empty <path>. */}
        <motion.path
          initial={{ d: playing ? PAUSE_LEFT : PLAY_LEFT }}
          animate={{ d: playing ? PAUSE_LEFT : PLAY_LEFT }}
          transition={transition}
        />
        <motion.path
          initial={{ d: playing ? PAUSE_RIGHT : PLAY_RIGHT }}
          animate={{ d: playing ? PAUSE_RIGHT : PLAY_RIGHT }}
          transition={transition}
        />
      </motion.svg>
    )
  }
)
AnimatedPlayIcon.displayName = "AnimatedPlayIcon"

export interface AnimatedChevronIconProps extends AnimatedIconProps {
  open: boolean
}

/** A chevron that turns over rather than flipping to a different glyph. */
const AnimatedChevronIcon = React.forwardRef<SVGSVGElement, AnimatedChevronIconProps>(
  ({ open, className, ...props }, ref) => {
    const transition = useSnap()

    return (
      <motion.svg
        ref={ref}
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("h-5 w-5 stroke-current", className)}
        animate={{ rotate: open ? 180 : 0 }}
        transition={transition}
        {...props}
      >
        <path d="M6 9l6 6 6-6" />
      </motion.svg>
    )
  }
)
AnimatedChevronIcon.displayName = "AnimatedChevronIcon"

export interface AnimatedCheckIconProps extends AnimatedIconProps {
  done: boolean
}

/**
 * The check draws itself.
 *
 * This is the one icon here allowed a little theatre: it fires once, on success, and the
 * draw is what makes it register as a confirmation rather than as an icon that was always
 * there. It gets 280ms rather than the 150ms the others live under, because it happens once
 * and is the whole point of the moment.
 */
const AnimatedCheckIcon = React.forwardRef<SVGSVGElement, AnimatedCheckIconProps>(
  ({ done, className, ...props }, ref) => {
    const reducedMotion = useReducedMotionConfig()

    return (
      <motion.svg
        ref={ref}
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("h-5 w-5 stroke-current", className)}
        {...props}
      >
        <motion.path
          d="M5 13l4 4L19 7"
          // Stated rather than `initial={false}`. Reading the current value back off the
          // DOM works for a div, but `opacity` and `pathLength` on an SVG path are
          // presentation attributes motion cannot read, so it would start from `undefined`
          // and warn.
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.28, ease: [0.23, 1, 0.32, 1] }
          }
        />
      </motion.svg>
    )
  }
)
AnimatedCheckIcon.displayName = "AnimatedCheckIcon"

export {
  AnimatedMenuIcon,
  AnimatedPlayIcon,
  AnimatedChevronIcon,
  AnimatedCheckIcon,
}
