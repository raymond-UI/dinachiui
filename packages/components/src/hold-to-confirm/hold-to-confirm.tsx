"use client"

import * as React from "react"
import { useRender } from "@base-ui/react/use-render"
import {
  animate,
  motion,
  MotionConfigContext,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"
import { cn } from "@dinachi/core"

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

/** Every path back to zero — released, cancelled, or reset after a confirm. */
const UNWIND = { duration: 0.2, ease: EASE_OUT }

const STROKE = 2

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

export type HoldToConfirmVariant = "fill" | "ring" | "border"

/**
 * The button's *padding* box, in px, with the matching inner corner radius. SVG cannot
 * inherit a border radius, so the outline variants are drawn to measured geometry.
 *
 * Padding box because that is what an absolutely positioned `inset-0` child resolves
 * against, and the SVG is one. The radius is clamped against the measured size:
 * `rounded-full` computes to 9999px, which the element is far too small to honour.
 */
function useBox(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [box, setBox] = React.useState({ w: 0, h: 0, r: 0 })

  React.useLayoutEffect(() => {
    const node = ref.current
    if (!node || !enabled) return

    const measure = (borderBoxWidth: number, borderBoxHeight: number) => {
      const style = getComputedStyle(node)
      const border = parseFloat(style.borderTopWidth) || 0
      const outer = parseFloat(style.borderTopLeftRadius) || 0
      const width = borderBoxWidth - border * 2
      const height = borderBoxHeight - border * 2
      const next = {
        w: width,
        h: height,
        // The specified radius is the outer one; a border's inner curve is tighter
        // by its own width.
        r: Math.max(0, Math.min(outer - border, width / 2, height / 2)),
      }
      // The observer fires on every layout pass; only re-render when it matters.
      setBox((prev) =>
        prev.w === next.w && prev.h === next.h && prev.r === next.r ? prev : next
      )
    }

    measure(node.offsetWidth, node.offsetHeight)
    const observer = new ResizeObserver(([entry]) => {
      // The laid-out size, not `getBoundingClientRect` — that folds in the press
      // transform, so any re-measure while the button is held would redraw the
      // outline 3% small and then snap it back on release.
      // `borderBoxSize` was a bare object before Firefox 92 and absent from early
      // Safari, either of which throws on the array read. `offsetWidth` reports the
      // same border box, and is what the first measure above already uses.
      const size = entry.borderBoxSize?.[0]
      if (size) measure(size.inlineSize, size.blockSize)
      else measure(node.offsetWidth, node.offsetHeight)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, enabled])

  return box
}

type Box = ReturnType<typeof useBox>

interface ProgressLayerProps {
  /** 0–1, the whole state each layer draws itself from. */
  progress: MotionValue<number>
  fillClassName?: string
  /** The button's label. Sits above the progress, so each layer places it itself. */
  text: React.ReactNode
}

/** Above the progress in every variant, and the only thing that has to be. */
function Label({ children }: { children: React.ReactNode }) {
  return <span className="relative z-10">{children}</span>
}

/**
 * The stroke `ring` and `border` are both drawn with.
 *
 * `pathLength` is normalised to 1 by Motion, so the same 0–1 progress value that scales
 * the `fill` bar also closes a stroke — the length never has to be measured, only the
 * shape it is drawn on.
 */
function useStroke(progress: MotionValue<number>, fillClassName?: string) {
  // A round cap still paints a dot at zero length, which on an untouched control reads
  // as an indicator stuck at the starting line.
  const visible = useTransform(progress, (p) => (p > 0 ? 1 : 0))

  return {
    fill: "none",
    strokeWidth: STROKE,
    strokeLinecap: "round" as const,
    pathLength: 1,
    style: { pathLength: progress, opacity: visible },
    className: cn("stroke-destructive", fillClassName),
  }
}

/** A bar sweeping the button from the left, behind the label. */
function FillProgress({ progress, fillClassName, text }: ProgressLayerProps) {
  // The sweep, as a clip in the button's own coordinates.
  const unswept = useTransform(progress, (p) => (1 - p) * 100)
  const swept = useMotionTemplate`inset(0% ${unswept}% 0% 0%)`

  return (
    <>
      {/* Covers the border box and takes no radius of its own: the button's
          `overflow-hidden` is what shapes it. A radius here would be the outer one
          applied a border-width inside, which does not nest and leaves a hairline gap. */}
      <motion.span
        aria-hidden
        style={{ scaleX: progress }}
        className={cn(
          "absolute -inset-px origin-left bg-destructive",
          fillClassName
        )}
      />
      <Label>{text}</Label>
      {/* A second copy of the label, inverted and clipped to the bar's edge. No colour
          transition can be timed to a moving boundary; a clip shares it exactly. Boxed
          like the bar so the clip resolves against the width the bar is scaling. */}
      <motion.span
        aria-hidden
        style={{ clipPath: swept }}
        className="absolute -inset-px z-20 flex items-center justify-center text-destructive-foreground"
      >
        {text}
      </motion.span>
    </>
  )
}

/** A stroke closing around a square button. */
function RingProgress({
  progress,
  fillClassName,
  text,
  box,
}: ProgressLayerProps & { box: Box }) {
  const stroke = useStroke(progress, fillClassName)
  // Inset by half the stroke so the whole width stays inside both the SVG viewport and
  // the button's own `overflow: hidden` — otherwise the outer half is trimmed.
  const inset = STROKE / 2
  const ring = {
    cx: box.w / 2,
    cy: box.h / 2,
    r: Math.max(0, Math.min(box.w, box.h) / 2 - inset),
  }

  return (
    <>
      <svg
        aria-hidden
        // Rotated so the stroke closes from the top rather than from 3 o'clock.
        className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
      >
        <circle
          {...ring}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-destructive/20"
        />
        <motion.circle {...ring} {...stroke} />
      </svg>
      <Label>{text}</Label>
    </>
  )
}

/** The button's own outline, drawing itself. */
function BorderProgress({
  progress,
  fillClassName,
  text,
  box,
}: ProgressLayerProps & { box: Box }) {
  const stroke = useStroke(progress, fillClassName)
  const { w, h, r } = box
  // Half a stroke in, for the same reason as the ring — and here the corners disappear
  // entirely without it.
  const inset = STROKE / 2
  const right = w - inset
  const bottom = h - inset
  // The measured radius is the button's outer one; the trace sits half a stroke inside
  // it, so its own corners are that much tighter.
  const corner = Math.max(0, r - inset)

  // Two halves leaving the top centre in opposite directions and meeting at the bottom.
  // A single lap would spend its first third crawling along the top edge — which is
  // just the `fill` bar again — and would start at wherever the top-left corner happens
  // to end. Mirrored halves read as the outline closing in, and the moment they meet is
  // the moment the hold completes.
  const outline = [
    // Clockwise: right along the top, down the right side, back to the bottom centre.
    `M ${w / 2} ${inset} H ${right - corner} A ${corner} ${corner} 0 0 1 ${right} ${inset + corner} V ${bottom - corner} A ${corner} ${corner} 0 0 1 ${right - corner} ${bottom} H ${w / 2}`,
    // Anticlockwise: the same path mirrored down the left side.
    `M ${w / 2} ${inset} H ${inset + corner} A ${corner} ${corner} 0 0 0 ${inset} ${inset + corner} V ${bottom - corner} A ${corner} ${corner} 0 0 0 ${inset + corner} ${bottom} H ${w / 2}`,
  ]

  return (
    <>
      {w > 0 && h > 0 && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {/* The rail is the same two paths, so it cannot drift from the trace.
              Drawing it here rather than as a CSS border also keeps the two exactly
              coincident — a real border sits a padding box further out. */}
          {outline.map((d, index) => (
            <path
              key={`rail-${index}`}
              d={d}
              fill="none"
              strokeWidth={STROKE}
              className="stroke-destructive/20"
            />
          ))}
          {outline.map((d, index) => (
            <motion.path key={index} d={d} {...stroke} />
          ))}
        </svg>
      )}
      <Label>{text}</Label>
    </>
  )
}

/** Picks the layer a variant is drawn with. */
function ProgressLayer({
  variant,
  box,
  ...layer
}: ProgressLayerProps & { variant: HoldToConfirmVariant; box: Box }) {
  if (variant === "ring") return <RingProgress {...layer} box={box} />
  if (variant === "border") return <BorderProgress {...layer} box={box} />
  return <FillProgress {...layer} />
}

/**
 * The shape of the button itself, per variant.
 *
 * `ring` and `border` draw their own outline, so a visible static border under either
 * would read as a second indicator, stuck. Theirs is transparent rather than absent:
 * the width still has to be reserved, so all three sit the same size.
 *
 * `ring`'s padding is the room its circle is drawn in. With none, the button is only as
 * big as its icon and the stroke lands on the glyph. 10px clears a 16px icon at 38px,
 * the height of the other two.
 */
const SHAPE: Record<HoldToConfirmVariant, string> = {
  fill: "rounded-md border border-destructive",
  ring: "aspect-square rounded-full border border-transparent p-2.5",
  border: "rounded-md border border-transparent",
}

/**
 * The hold itself: how far through it is, whether it is running, and the two ways it
 * can end.
 *
 * Everything here is a ref rather than state, because a hold is driven by pointer and
 * key events that have to read the current value synchronously. `isHolding` and
 * `confirmed` are the only parts the render tree needs, so they are the only state.
 */
function useHold({
  duration,
  resetAfter,
  disabled,
  onConfirm,
}: Pick<
  HoldToConfirmProps,
  "duration" | "resetAfter" | "disabled" | "onConfirm"
> & { duration: number; resetAfter: number }) {
  const progress = useMotionValue(0)
  const animation = React.useRef<ReturnType<typeof animate> | null>(null)
  const reset = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const holding = React.useRef(false)
  const [confirmed, setConfirmed] = React.useState(false)
  const [isHolding, setIsHolding] = React.useState(false)

  React.useEffect(
    () => () => {
      animation.current?.stop()
      if (reset.current) clearTimeout(reset.current)
    },
    []
  )

  // Read when the hold completes, not captured when it starts. The running animation
  // keeps whichever `onComplete` it was handed at the press, so a handler closing over
  // a selected row would otherwise fire against the row selected 1600ms earlier.
  const onConfirmRef = React.useRef(onConfirm)
  React.useEffect(() => {
    onConfirmRef.current = onConfirm
  })

  const settle = React.useCallback(() => {
    setConfirmed(false)
    // Tracked like every other run. A press landing inside this window has to be able
    // to stop it, or two animations drive `progress` at once and the new hold gets
    // dragged back to zero under the user's finger.
    animation.current = animate(progress, 0, UNWIND)
  }, [progress])

  // Read late for the same reason `onConfirm` is: the running animation keeps whichever
  // `onComplete` it was handed at the press, so a `resetAfter` raised during the hold
  // would be ignored for the hold the user is actually watching.
  const resetAfterRef = React.useRef(resetAfter)
  React.useEffect(() => {
    resetAfterRef.current = resetAfter
  })

  const complete = React.useCallback(() => {
    holding.current = false
    setIsHolding(false)
    setConfirmed(true)
    onConfirmRef.current?.()
    if (resetAfterRef.current > 0)
      reset.current = setTimeout(settle, resetAfterRef.current)
  }, [settle])

  const start = React.useCallback(() => {
    if (disabled || confirmed || holding.current) return
    holding.current = true
    setIsHolding(true)
    animation.current?.stop()
    // Resume from where the fill actually is, not from zero.
    const remaining = (1 - progress.get()) * duration
    animation.current = animate(progress, 1, {
      duration: remaining / 1000,
      ease: "linear",
      onComplete: complete,
    })
  }, [disabled, confirmed, duration, progress, complete])

  const cancel = React.useCallback(() => {
    if (!holding.current) return
    holding.current = false
    setIsHolding(false)
    animation.current?.stop()
    animation.current = animate(progress, 0, UNWIND)
  }, [progress])

  return { progress, confirmed, isHolding, start, cancel }
}

/**
 * `type` and `disabled` mean nothing on an anchor, and `disabled` on one is invalid HTML
 * that leaves the element still clickable. Only a native button gets them; anything else
 * is told the same thing in the way its own role understands.
 */
function disabledAttrs(render: useRender.RenderProp | undefined, disabled?: boolean) {
  const nativeButton =
    render === undefined ||
    (React.isValidElement(render) && render.type === "button")

  return nativeButton
    ? { type: "button" as const, disabled }
    : { "aria-disabled": disabled || undefined }
}

/** The button's own surface, which is the same whichever way progress is drawn. */
function shellClass(
  variant: HoldToConfirmVariant,
  reducedMotion: boolean | null,
  className: string | undefined
) {
  return cn(
    "relative isolate inline-flex select-none items-center justify-center overflow-hidden",
    "px-4 py-2 text-sm font-medium text-destructive",
    // Keyed to the held state rather than `:active`, so a keyboard hold gets the same
    // press feedback as a pointer one, and so the button lifts on the frame the hold
    // completes. Quicker in than out: the press is the interface answering the user,
    // the release is only it relaxing.
    !reducedMotion &&
      "transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-[holding]:duration-100 data-[holding]:scale-[0.97]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    SHAPE[variant],
    className
  )
}

/**
 * The press and release wiring, composed with whatever the consumer passed rather than
 * replacing it. A consumer handler runs first, but it cannot take over a release path:
 * a hold whose release never fires stays armed and confirms on its own.
 */
function holdHandlers(
  theirs: React.ButtonHTMLAttributes<HTMLButtonElement>,
  start: () => void,
  cancel: () => void
) {
  return {
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      theirs.onPointerDown?.(event)
      // A right- or middle-press is not an intent to confirm, and a destructive hold
      // should not start counting on one.
      if (event.button !== 0) return
      event.currentTarget.setPointerCapture(event.pointerId)
      start()
    },
    onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => {
      theirs.onPointerUp?.(event)
      cancel()
    },
    onPointerCancel: (event: React.PointerEvent<HTMLButtonElement>) => {
      theirs.onPointerCancel?.(event)
      cancel()
    },
    onLostPointerCapture: (event: React.PointerEvent<HTMLButtonElement>) => {
      theirs.onLostPointerCapture?.(event)
      cancel()
    },
    // Keyboard users hold the same way — otherwise this control is mouse-only.
    onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
      theirs.onKeyDown?.(event)
      if (event.key !== " " && event.key !== "Enter") return
      event.preventDefault()
      if (event.repeat) return
      start()
    },
    onKeyUp: (event: React.KeyboardEvent<HTMLButtonElement>) => {
      theirs.onKeyUp?.(event)
      if (event.key !== " " && event.key !== "Enter") return
      cancel()
    },
    onBlur: (event: React.FocusEvent<HTMLButtonElement>) => {
      theirs.onBlur?.(event)
      cancel()
    },
  }
}

export interface HoldToConfirmProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onProgress"> {
  /** How progress is drawn. See each variant's note on the component. */
  variant?: HoldToConfirmVariant
  /** Milliseconds the user must hold to confirm. */
  duration?: number
  /** Fired once the hold completes. */
  onConfirm?: () => void
  /** Milliseconds the confirmed state is held before resetting. Set `0` to stay confirmed. */
  resetAfter?: number
  /** Replaces the label while confirmed. */
  confirmedLabel?: React.ReactNode
  /** The description read to assistive tech, which cannot see that this button is held. */
  holdHint?: string
  /** Class applied to the progress fill. */
  fillClassName?: string
  /** Render as a different element (e.g. the library's Button).
   *  Accepts a ReactElement or `(props, state) => ReactElement`. */
  render?: useRender.RenderProp
}

/**
 * A destructive action gated behind a deliberate hold, drawn three ways:
 *
 * - `fill` — a bar sweeps the button from the left, behind the label. The most
 *   legible of the three, and the only one that reads at a glance across a room.
 * - `ring` — a stroke closes around the button. Sized for square icon-only buttons,
 *   where there is no width for a bar to travel.
 * - `border` — the button's own outline draws itself. The quietest option: nothing
 *   moves behind the label, so it suits a hold that sits inside dense UI.
 *
 * The timing is intentionally asymmetric whichever way it is drawn: progress takes
 * `duration` to complete but unwinds in 200ms. Committing should feel considered;
 * backing out should feel free. Release always resumes from the current position
 * rather than snapping, so repeated part-holds stay continuous.
 *
 * Reduced motion drops the press scale and keeps the progress. The progress is the
 * affordance rather than decoration — a hold that counts invisibly is a control with
 * no feedback at all, which is worse than the movement it would save.
 */
const HoldToConfirm = React.forwardRef<HTMLButtonElement, HoldToConfirmProps>(
  (
    {
      variant = "fill",
      duration = 1600,
      onConfirm,
      resetAfter = 1600,
      confirmedLabel,
      holdHint = "Press and hold to confirm",
      fillClassName,
      render,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const outlined = variant !== "fill"
    const box = useBox(buttonRef, outlined)
    const reducedMotion = useReducedMotionConfig()
    const { progress, confirmed, isHolding, start, cancel } = useHold({
      duration,
      resetAfter,
      disabled,
      onConfirm,
    })

    const text = confirmed && confirmedLabel ? confirmedLabel : children
    const hintId = React.useId()

    return useRender({
      defaultTagName: "button",
      render,
      ref: [ref, buttonRef],
      props: {
        ...disabledAttrs(render, disabled),
        // The hold is the whole interaction and nothing about a button announces it, so
        // it is stated outright. `aria-hidden` keeps the description out of the name
        // while leaving it reachable through the reference.
        "aria-describedby": cn(props["aria-describedby"], hintId),
        // Confirming swaps the label, and a name change on an already-focused element is
        // not reliably announced. As a live region the swap is spoken.
        "aria-live": "polite" as const,
        "data-holding": isHolding || undefined,
        "data-confirmed": confirmed || undefined,
        className: shellClass(variant, reducedMotion, className),
        ...props,
        ...holdHandlers(props, start, cancel),
        children: (
          <>
            <ProgressLayer
              variant={variant}
              box={box}
              progress={progress}
              fillClassName={fillClassName}
              text={text}
            />
            <span id={hintId} aria-hidden className="sr-only">
              {holdHint}
            </span>
          </>
        ),
      },
    })
  }
)
HoldToConfirm.displayName = "HoldToConfirm"

export { HoldToConfirm }
