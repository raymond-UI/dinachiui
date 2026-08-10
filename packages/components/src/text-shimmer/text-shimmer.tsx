"use client"

import * as React from "react"
import { MotionConfigContext, useReducedMotion } from "motion/react"
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

export type TextShimmerVariant = "sweep" | "pulse"

/** Seconds for one loop. These are cycle lengths for ambient motion, not durations
 *  for a transition answering an input, so the sub-300ms UI budget does not apply —
 *  at that length either variant would strobe. `pulse` runs the slower of the two
 *  because a whole label changing brightness is more noticeable than a band crossing
 *  it, and the quieter effect is the one that can afford to be seen less often. */
const DEFAULT_DURATION: Record<TextShimmerVariant, number> = {
  sweep: 1.6,
  pulse: 1.8,
}

export interface TextShimmerProps extends React.ComponentPropsWithoutRef<"span"> {
  /** Which effect to run. See each variant's note on the component. */
  variant?: TextShimmerVariant
  /** Seconds for one cycle. Defaults per variant. */
  duration?: number
  /** How dim the un-lit text is, 0–1. This is a label the user is waiting on, not a
   *  placeholder, so it has to stay readable at this value. */
  dim?: number
}

/**
 * A shimmer for pending states where a spinner would be too loud — "Thinking…",
 * "Generating…". Signalling that something is in flight is the whole of what it is
 * for. It loops for as long as it is mounted, in the corner of the user's eye, so
 * mount it when the work starts and unmount it when the work lands; a loop running
 * over settled text is noise, and no amount of tuning makes decoration justify a
 * permanent animation.
 *
 * - `sweep` — a soft highlight band travelling across the text. The default.
 * - `pulse` — the whole label breathes between dim and lit. Quieter, and free: it
 *   animates opacity and nothing else. Prefer it in dense or small text, where a
 *   band is too subtle to read anyway.
 *
 * Both are built from `currentColor`, so they inherit the surrounding text colour and
 * theme themselves. `sweep` paints the highlight through `background-clip: text`, and
 * clears the fill with `-webkit-text-fill-color` rather than `color: transparent` —
 * the gradient is made of `currentColor`, so zeroing `color` would erase it.
 *
 * `sweep` moves that gradient with `background-position`, which the compositor cannot
 * accelerate. There is no transform-only equivalent: a gradient is fixed to the box
 * painting it, so translating the box carries the highlight and the glyphs together,
 * and masking a duplicate of the text does not help because a mask travels with its
 * element too. What is avoidable is the per-frame JavaScript, so the loop is driven
 * through the Web Animations API instead of a rAF loop — the browser owns the
 * timeline, and a busy main thread no longer costs frames during exactly the pending
 * work this is reporting on. The repaint that remains is bounded by the element's
 * box: keep this on label-sized text, never a paragraph.
 *
 * Under reduced motion the loop does not run at all. A continuous ambient animation
 * has no gentler version worth keeping — but the dim colour stays, so the label still
 * reads as unsettled rather than as ordinary prose.
 */
const TextShimmer = React.forwardRef<HTMLSpanElement, TextShimmerProps>(
  (
    {
      variant = "sweep",
      duration,
      dim = 0.7,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotionConfig()
    const nodeRef = React.useRef<HTMLSpanElement>(null)
    React.useImperativeHandle(ref, () => nodeRef.current as HTMLSpanElement, [])

    const seconds = duration ?? DEFAULT_DURATION[variant]

    React.useEffect(() => {
      const node = nodeRef.current
      if (!node || reducedMotion) return

      const animation = node.animate(
        variant === "pulse"
          ? [{ opacity: 1 }, { opacity: dim }, { opacity: 1 }]
          : // The gradient is `base` at both 0% and 100%, so it tiles without a seam,
            // and percentage positions resolve against (element − image) width — which
            // is -W here, since the image is 2W wide. So a 200% change moves the image
            // by exactly one tile and lands on an identical frame: the loop closes on
            // itself, with no jump to hide and no dead time to pad.
            [
              { backgroundPosition: "0% center" },
              { backgroundPosition: "-200% center" },
            ],
        {
          duration: seconds * 1000,
          iterations: Infinity,
          // Constant motion takes a linear curve. On `sweep` it is also structural:
          // an eased curve would visibly hitch every time the tile seam came round.
          easing: "linear",
        }
      )
      return () => animation.cancel()
    }, [variant, dim, seconds, reducedMotion])

    const base = `color-mix(in oklab, currentColor ${Math.round(dim * 100)}%, transparent)`

    const shimmerStyle: React.CSSProperties = reducedMotion
      ? { opacity: dim }
      : variant === "pulse"
        ? {}
        : {
            backgroundImage: `linear-gradient(90deg, ${base} 35%, currentColor 50%, ${base} 65%)`,
            backgroundSize: "200% 100%",
            backgroundRepeat: "repeat",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }

    return (
      <span
        ref={nodeRef}
        // The element is reporting a pending state, so assistive tech should read it
        // as one. It also makes the decorative use of a shimmer feel as wrong in the
        // markup as it is on screen.
        role="status"
        className={cn("inline-block", className)}
        style={{ ...shimmerStyle, ...style }}
        {...props}
      >
        {children}
      </span>
    )
  }
)
TextShimmer.displayName = "TextShimmer"

export { TextShimmer }
