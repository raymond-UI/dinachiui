"use client"

import * as React from "react"
import {
  MotionConfigContext,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  type MotionValue,
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

/** The columns are written by hand rather than by React, and a layout effect is the
 *  only place a DOM write lands before the browser paints. There is no paint to beat
 *  on the server, and React warns if you ask for one. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/** Apple's move-and-reposition spring: 0.4s response, critically damped. Nothing here
 *  was thrown by a finger, so there is no momentum for an overshoot to stand for. */
const DURATION = 0.4
const BOUNCE = 0

/** One full revolution. A column crossing more ground than that still settles in the
 *  same 0.4s, so the surplus digits arrive faster than the eye resolves them. Starting
 *  nearer keeps the landing digit and the direction of travel and drops the strobe. */
const REVOLUTION = 10

const CELL = "flex h-[1.15em] items-center justify-center leading-[1.15em]"

const digitOf = (position: number) => ((Math.trunc(position) % 10) + 10) % 10

/**
 * Where a column should start from to reach `to` within one revolution. The result is
 * always congruent to `from` modulo ten and on the same side of the target, so the
 * glyph and the sub-digit offset on screen are unchanged. Only the lap count drops.
 */
function trimTravel(from: number, to: number) {
  const span = to - from
  if (Math.abs(span) <= REVOLUTION) return from
  const laps = Math.ceil(Math.abs(span) / REVOLUTION) - 1
  return from + Math.sign(span) * laps * REVOLUTION
}

export type NumberTickerVariant = "odometer" | "counter" | "flip"

/** A column's start and target, both in unwrapped digit space. See the note on
 *  `cells` in the component for what that space is. */
interface ColumnProps {
  to: number
  from: number
  duration: number
  bounce: number
  delay: number
  active: boolean
}

/**
 * Sends a column to its target once it is allowed to move. A spring re-targets from
 * wherever the value currently sits and carries its velocity across, so a number that
 * changes mid-roll bends towards the new one rather than starting again from zero.
 */
function useSettle(
  position: MotionValue<number>,
  to: number,
  delay: number,
  active: boolean
) {
  React.useEffect(() => {
    if (!active) return

    const settle = () => {
      const trimmed = trimTravel(position.get(), to)
      if (trimmed !== position.get()) position.jump(trimmed)
      position.set(to)
    }

    if (delay <= 0) {
      settle()
      return
    }
    const timer = setTimeout(settle, delay * 1000)
    return () => clearTimeout(timer)
  }, [position, to, delay, active])
}

/**
 * One wheel of the odometer, drawn as a two-cell strip: the digit in the window and
 * the one after it. Rolling is a fractional offset of that strip, and the pair is
 * rewritten in the same write as the offset resets, so the wheel is seamless without
 * carrying ten cells per column.
 */
function TickerDigit({ to, from, duration, bounce, delay, active }: ColumnProps) {
  const stripRef = React.useRef<HTMLSpanElement>(null)
  const nearRef = React.useRef<HTMLSpanElement>(null)
  const farRef = React.useRef<HTMLSpanElement>(null)

  // `useSpring` takes raw spring options, where `duration` is milliseconds, unlike a
  // `Transition`, which is seconds. The public prop is seconds to match the rest of the
  // tier, so convert here.
  const position = useSpring(from, { duration: duration * 1000, bounce })

  const paint = React.useCallback((at: number) => {
    const settled = Math.floor(at)
    if (nearRef.current) nearRef.current.textContent = String(digitOf(settled))
    if (farRef.current) farRef.current.textContent = String(digitOf(settled + 1))
    // The strip is two cells tall, so half of it is exactly one digit.
    if (stripRef.current) {
      stripRef.current.style.transform = `translateY(${(settled - at) * 50}%)`
    }
  }, [])

  useMotionValueEvent(position, "change", paint)
  // React owns the glyphs on the first render and after every prop change; this pulls
  // them straight back to the live spring value before any of that reaches the screen.
  useIsomorphicLayoutEffect(() => paint(position.get()))
  useSettle(position, to, delay, active)

  return (
    <span className="relative inline-block h-[1.15em] overflow-hidden align-bottom">
      {/* An invisible glyph sizes the window. The strip is absolutely placed so it can
          be taller than the line box without stretching it. `aria-hidden` is explicit so
          the guarantee does not rest on the `invisible` class surviving a restyle. */}
      <span aria-hidden className="invisible block h-[1.15em] leading-[1.15em]">
        0
      </span>
      <span
        ref={stripRef}
        className="absolute inset-x-0 top-0 flex flex-col"
        aria-hidden
      >
        <span ref={nearRef} className={CELL}>
          {digitOf(from)}
        </span>
        <span ref={farRef} className={CELL}>
          {digitOf(from + 1)}
        </span>
      </span>
    </span>
  )
}

/**
 * One flap of a split-flap board, driven by the same spring as the odometer wheel and
 * read as a rotation instead of an offset. The face turns a half circle between one
 * digit and the next, so it is edge-on, and therefore invisible, at the exact moment the
 * glyph behind it is swapped. Counting up tips the flap towards you and counting down
 * tips it away, both of which fall out of the direction the spring is travelling.
 */
function FlipDigit({ to, from, duration, bounce, delay, active }: ColumnProps) {
  const faceRef = React.useRef<HTMLSpanElement>(null)
  const position = useSpring(from, { duration: duration * 1000, bounce })

  const paint = React.useCallback((at: number) => {
    const face = faceRef.current
    if (!face) return
    // Rounding rather than flooring puts the swap at the half-way point, which is the
    // one place in the turn where the face has no height to show it happening.
    const settled = Math.round(at)
    face.textContent = String(digitOf(settled))
    face.style.transform = `rotateX(${(at - settled) * 180}deg)`
  }, [])

  useMotionValueEvent(position, "change", paint)
  useIsomorphicLayoutEffect(() => paint(position.get()))
  useSettle(position, to, delay, active)

  return (
    <span
      className="relative inline-block h-[1.15em] overflow-hidden align-bottom"
      // Without perspective the rotation is orthographic: the flap squashes vertically
      // instead of turning away from you.
      style={{ perspective: "260px" }}
    >
      <span aria-hidden className="invisible block h-[1.15em] leading-[1.15em]">
        0
      </span>
      <span
        ref={faceRef}
        aria-hidden
        className="absolute inset-0 flex items-center justify-center leading-[1.15em]"
      >
        {digitOf(from)}
      </span>
    </span>
  )
}

interface CounterValueProps {
  value: number
  from: number
  duration: number
  bounce: number
  active: boolean
  formatter: Intl.NumberFormat
}

/**
 * The plain count-up: one spring on the value itself, so every frame shows a real
 * number the user could read off. The wheel variants roll through digits that never
 * meant anything; this one is the right choice when the intermediate values matter,
 * or when the format is too involved to split into columns.
 */
function CounterValue({
  value,
  from,
  duration,
  bounce,
  active,
  formatter,
}: CounterValueProps) {
  const nodeRef = React.useRef<HTMLSpanElement>(null)
  const position = useSpring(from, { duration: duration * 1000, bounce })

  // Written straight to the DOM. Routing sixty frames a second through state would
  // re-render the whole subtree for a string only this node reads.
  const paint = React.useCallback(
    (at: number) => {
      if (nodeRef.current) nodeRef.current.textContent = formatter.format(at)
    },
    [formatter]
  )

  useMotionValueEvent(position, "change", paint)
  useIsomorphicLayoutEffect(() => paint(position.get()))
  useSettle(position, value, 0, active)

  return (
    <span ref={nodeRef} aria-hidden>
      {formatter.format(from)}
    </span>
  )
}

interface Cell {
  char: string
  /** Null for anything that is not a digit: the grouping mark, the decimal separator,
   *  a minus sign. */
  place: number | null
  to: number
  order: number
}

export interface NumberTickerProps
  extends Omit<React.ComponentProps<"span">, "children"> {
  /** The value to count to. */
  value: number
  /** Which effect to run. See each variant's note on the component. */
  variant?: NumberTickerVariant
  /** The value each column starts from. */
  from?: number
  /** Decimal places to render. */
  decimals?: number
  /**
   * Locale passed to Intl.NumberFormat. Defaults to the user's locale.
   *
   * A locale that formats with non-Latin digits (`ar-EG`, `hi-IN-u-nu-deva`) renders
   * and announces correctly but does not roll — the columns are found by matching
   * Latin `0-9`, so nothing is recognised as a digit and the value simply updates.
   */
  locale?: string
  /** Extra Intl.NumberFormat options, e.g. `{ style: "currency", currency: "USD" }`. */
  format?: Intl.NumberFormatOptions
  /** Set this when `value` is bound to something that keeps moving, like a dashboard
   *  metric or a cart total. The number renders instantly, with no roll. A figure that
   *  is mid-animation whenever you look at it cannot be read. */
  live?: boolean
  /** Seconds added per column, left to right. The cascade is what makes it read as a
   *  board settling rather than every column stopping at once. Keep it in the
   *  0.03–0.08 range. Ignored by `counter`, which has no columns. */
  stagger?: number
  /** Seconds for a column to settle. */
  duration?: number
  /** Spring overshoot, 0–1. Off by default: no gesture precedes this motion, so an
   *  overshoot has no momentum to express and reads as the figure being briefly wrong. */
  bounce?: number
  /** Count when scrolled into view rather than on mount. */
  startOnView?: boolean
  /** Only arm the reveal the first time it enters view. Later changes to `value` still
   *  animate; `live` is the prop that stops that. */
  once?: boolean
}

/**
 * A number that animates to its value, in three flavours:
 *
 * - `odometer`: digit columns roll like a mechanical counter, spring driven, each column
 *   settling a beat after the one to its left.
 * - `counter`: the value itself is interpolated and reformatted every frame, so the
 *   intermediate numbers are real. No per-digit DOM.
 * - `flip`: a split-flap board. Each column turns over to its new digit, towards you
 *   when the value rises and away when it falls.
 *
 * The effect is a reveal, so it is budgeted as one: it earns its 0.4s the first time a
 * figure arrives. A value that keeps changing only needs to be correct, so pass `live`
 * and nothing moves.
 *
 * All three announce only the final formatted value to assistive technology. The moving
 * parts are `aria-hidden`, since a number changing sixty times a second is noise in a
 * screen reader.
 */
const NumberTicker = React.forwardRef<HTMLSpanElement, NumberTickerProps>(
  (
    {
      value,
      variant = "odometer",
      from = 0,
      decimals = 0,
      locale,
      format,
      live = false,
      stagger = 0.03,
      duration = DURATION,
      bounce = BOUNCE,
      startOnView = true,
      once = true,
      className,
      ...props
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLSpanElement>(null)
    React.useImperativeHandle(ref, () => innerRef.current as HTMLSpanElement)

    const inView = useInView(innerRef, { once, margin: "0px 0px -48px 0px" })
    const reducedMotion = useReducedMotionConfig()
    // `isStatic` is how Motion is told to render a tree without animating it. A number
    // is content, so that pass has to hold the real one, not the starting value.
    const { isStatic } = React.useContext(MotionConfigContext)

    const formatter = React.useMemo(
      () =>
        new Intl.NumberFormat(locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          ...format,
        }),
      [locale, decimals, format]
    )
    const formatted = React.useMemo(
      () => formatter.format(value),
      [formatter, value]
    )

    // Walk right to left so each digit knows its place value, then left to right to
    // accumulate the digits above it. That accumulation is the column's position in an
    // unwrapped space: the ones column of 1,199 sits at 1199 and of 1,200 at 1200. A
    // carry is therefore one step forward rather than nine steps back, which is what a
    // real wheel does and what springing the bare 0–9 digit can never express.
    const cells = React.useMemo(() => {
      let place = 0
      const byPlace = Array.from(formatted)
        .reverse()
        .map<Cell>((char) => ({
          char,
          place: /\d/.test(char) ? place++ - decimals : null,
          to: 0,
          order: 0,
        }))
        .reverse()

      let above = 0
      let order = 0
      for (const cell of byPlace) {
        if (cell.place === null) continue
        above = above * 10 + Number(cell.char)
        cell.to = above
        cell.order = order++
      }
      return byPlace
    }, [formatted, decimals])

    // `from` in that same unwrapped space, as an integer so no column inherits a
    // rounding error from the one below it.
    const fromScaled = React.useMemo(
      () => Math.round(Math.abs(from) * 10 ** decimals),
      [from, decimals]
    )

    const active = !startOnView || inView

    if (live || reducedMotion || isStatic) {
      return (
        <span
          ref={innerRef}
          className={cn("inline-block tabular-nums tracking-tight", className)}
          {...props}
        >
          {formatted}
        </span>
      )
    }

    if (variant === "counter") {
      return (
        <span
          ref={innerRef}
          className={cn("inline-block tabular-nums tracking-tight", className)}
          {...props}
        >
          <CounterValue
            value={value}
            from={from}
            duration={duration}
            bounce={bounce}
            active={active}
            formatter={formatter}
          />
          <span className="sr-only">{formatted}</span>
        </span>
      )
    }

    return (
      <span
        ref={innerRef}
        className={cn(
          "inline-flex items-baseline tabular-nums tracking-tight",
          className
        )}
        {...props}
      >
        {cells.map((cell, i) => {
          if (cell.place === null) {
            return (
              <span key={`sep-${i}`} aria-hidden>
                {cell.char}
              </span>
            )
          }
          const shared = {
            to: cell.to,
            from: Math.floor(fromScaled / 10 ** (cell.place + decimals)),
            duration,
            bounce,
            // Left-most column starts first; the ones column settles last.
            delay: cell.order * stagger,
            active,
          }
          // Keyed by place so a column keeps its identity when the number gains or
          // loses digits. Keyed by position, 1,200 dropping to 900 would hand the
          // thousands column's spring to the hundreds and roll a settled wheel.
          const key = `place-${cell.place}`
          return variant === "flip" ? (
            <FlipDigit key={key} {...shared} />
          ) : (
            <TickerDigit key={key} {...shared} />
          )
        })}
        {/* The columns are decorative; this is what a screen reader announces. */}
        <span className="sr-only">{formatted}</span>
      </span>
    )
  }
)
NumberTicker.displayName = "NumberTicker"

export { NumberTicker }
