"use client"

import * as React from "react"
import {
  motion,
  MotionConfigContext,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
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

/** Apple's move-and-reposition spring, the same one the number ticker uses, so a ring and
 *  a count beside it travel on one clock. */
const SETTLE = { duration: 400, bounce: 0 } as const

const DEFAULT_SIZE = 96

export interface ProgressRingProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** 0–100. Omit it for the indeterminate arc. */
  value?: number
  /** Accessible name. Defaults to "Progress", or "Loading" when indeterminate. */
  label?: string
  /** Outer diameter in px. */
  size?: number
  /** Stroke width in px. Scales with `size` unless given. */
  thickness?: number
  /** Show the percentage in the middle. Ignored when indeterminate — there is no number
   *  to show. */
  showValue?: boolean
}

/**
 * A radial progress arc.
 *
 * The value is driven through a spring rather than a tween, which matters more here than it
 * looks: progress arrives in jumps, and a tween restarted on every jump either stutters or
 * has to be cancelled and rebuilt. A spring re-targets from wherever the arc currently is
 * and carries its velocity across, so a fast run of updates reads as one accelerating sweep
 * instead of a series of separate moves.
 *
 * One honest caveat: the arc is `stroke-dashoffset`, which is not a compositor property. At
 * this size that is fine — one small element repainting a stroke. Forty of them on a page
 * would be a different conversation, and the alternative is a rotated half-disc mask that
 * animates on `transform` but cannot do a rounded cap cleanly.
 */
const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  // Two independent contracts, determinate-or-not and reduced-motion-or-not, and every
  // branch is one of the four combinations. Splitting the render in two would duplicate
  // the ring to separate the arc.
  // fallow-ignore-next-line complexity
  (
    {
      value,
      label,
      size = DEFAULT_SIZE,
      thickness,
      showValue = true,
      className,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotionConfig()
    const indeterminate = value === undefined

    // A ring twice the size with the same 8px stroke reads as a thinner ring, not a bigger
    // one. Proportional is the default; an explicit `thickness` wins.
    const stroke = thickness ?? Math.max(3, Math.round(size * 0.085))
    const radius = (size - stroke) / 2
    const circumference = 2 * Math.PI * radius

    const offsetFor = (v: number) =>
      circumference - (Math.min(Math.max(v, 0), 100) / 100) * circumference

    const target = useMotionValue(value ?? 0)
    React.useEffect(() => {
      if (value !== undefined) target.set(value)
    }, [value, target])

    const eased = useSpring(target, SETTLE)
    const offset = useTransform(eased, offsetFor)
    const readout = useTransform(eased, (v) => `${Math.round(v)}%`)

    // The arc starts at twelve o'clock either way. Rotating the whole SVG is a transform,
    // so the sweep costs nothing, unlike re-deriving the path.
    const spin =
      indeterminate && !reducedMotion
        ? {
            animate: { rotate: [-90, 270] },
            transition: {
              duration: 1.4,
              repeat: Infinity,
              ease: "linear" as const,
            },
          }
        : { animate: { rotate: -90 }, transition: { duration: 0 } }

    // An indeterminate ring has no value to report, so it is a live region rather than a
    // progressbar. A `progressbar` with no `aria-valuenow` is announced as 0%, which is a
    // worse answer than "loading".
    const rounded = Math.round(value ?? 0)
    const reported = indeterminate
      ? { role: "status" as const }
      : {
          role: "progressbar" as const,
          "aria-valuenow": rounded,
          "aria-valuemin": 0,
          "aria-valuemax": 100,
          "aria-valuetext": `${rounded} percent`,
        }

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <motion.svg
          width={size}
          height={size}
          {...spin}
          {...reported}
          aria-label={label ?? (indeterminate ? "Loading" : "Progress")}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className="stroke-muted"
          />

          {indeterminate ? (
            <IndeterminateArc
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={stroke}
              circumference={circumference}
              reducedMotion={reducedMotion}
            />
          ) : (
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              // Reduced motion means the arc reports the value rather than travelling to
              // it. The spring is still constructed — it is a hook — but nothing reads it,
              // so the arc and the number land together in one frame.
              strokeDashoffset={reducedMotion ? offsetFor(value ?? 0) : offset}
              className="stroke-primary"
            />
          )}
        </motion.svg>

        {!indeterminate && showValue ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* The number reads the same spring as the arc, so the two can never
                disagree. */}
            <motion.span
              aria-hidden
              className="font-semibold tabular-nums text-foreground"
              style={{ fontSize: Math.round(size * 0.19) }}
            >
              {reducedMotion ? `${rounded}%` : readout}
            </motion.span>
          </div>
        ) : null}
      </div>
    )
  }
)
ProgressRing.displayName = "ProgressRing"

/**
 * The indeterminate arc grows and shrinks as it sweeps.
 *
 * A fixed arc spinning at a constant rate is a loading spinner, and it says only "still
 * running". Letting the arc lengthen and shorten under the rotation is what makes it read
 * as *work happening* rather than as a wheel turning: the sweep and the rotation are
 * deliberately different lengths, so the pattern never lands in the same place twice in a
 * row.
 */
function IndeterminateArc({
  cx,
  cy,
  r,
  stroke,
  circumference,
  reducedMotion,
}: {
  cx: number
  cy: number
  r: number
  stroke: number
  circumference: number
  reducedMotion: boolean
}) {
  if (reducedMotion) {
    // No rotation, no sweep. A static gap still reads as "in progress" without anything
    // moving — and an endlessly repeating animation is the one thing the preference most
    // clearly means to stop.
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference * 0.25} ${circumference}`}
        className="stroke-primary"
      />
    )
  }

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      strokeWidth={stroke}
      strokeLinecap="round"
      className="stroke-primary"
      initial={{
        strokeDasharray: `${circumference * 0.06} ${circumference}`,
        strokeDashoffset: 0,
      }}
      animate={{
        strokeDasharray: [
          `${circumference * 0.06} ${circumference}`,
          `${circumference * 0.65} ${circumference}`,
          `${circumference * 0.06} ${circumference}`,
        ],
        strokeDashoffset: [0, -circumference * 0.2, -circumference * 0.95],
      }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      }}
    />
  )
}

export { ProgressRing }
