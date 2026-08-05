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

/** Hovering is a request to read, so the strip clears out of the way at press-feedback
 *  speed. Resuming answers nothing the reader is waiting on and takes the slower half of
 *  the asymmetry, so the strip does not snap back into their eye. */
const PAUSE_MS = 160
const RESUME_MS = 240

const EDGE_MASK =
  "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)"

export interface MarqueeProps extends React.ComponentProps<"div"> {
  /** Seconds for one full pass of the content. */
  duration?: number
  /** Travel direction. */
  direction?: "left" | "right"
  /** Pause while hovered. Focus pauses regardless, so a keyboard user never loses the
   *  element they are on. */
  pauseOnHover?: boolean
  /** Fade the leading and trailing edges. Applies only while the strip is moving. */
  fade?: boolean
  /** Names the strip once reduced motion turns it into a focusable scroller. */
  label?: string
}

/**
 * A strip that scrolls its content on a seamless loop.
 *
 * The loop runs only when it has something to say. Content narrower than the container
 * is already fully readable, so it sits still instead of sliding a gap past the reader,
 * and the strip stops whenever it is scrolled out of view. Under a reduced-motion
 * preference it becomes an ordinary horizontal scroller: the overflow stays reachable by
 * pointer and by keyboard, it just no longer moves on its own.
 *
 * Travel is handed to the compositor through the Web Animations API rather than driven
 * per frame from React, because this is ambient motion that runs for the life of the
 * page — a busy main thread must not be able to make it stutter.
 */
const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      duration = 24,
      direction = "left",
      label = "Scrolling content",
      pauseOnHover = true,
      fade = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotionConfig()

    const containerRef = React.useRef<HTMLDivElement>(null)
    const laneRef = React.useRef<HTMLDivElement>(null)
    const trackRef = React.useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => containerRef.current!, [])

    /** One track's width, or 0 while the content still fits. The loop distance and the
     *  "is there anything left to reveal" test are the same measurement. */
    const [distance, setDistance] = React.useState(0)

    React.useEffect(() => {
      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track || typeof ResizeObserver === "undefined") return

      const observer = new ResizeObserver(() => {
        const width = track.getBoundingClientRect().width
        setDistance(width > container.clientWidth ? width : 0)
      })
      observer.observe(container)
      observer.observe(track)
      return () => observer.disconnect()
    }, [])

    const running = distance > 0 && !reducedMotion

    const animationRef = React.useRef<Animation | null>(null)
    const progressRef = React.useRef(0)
    const rateRef = React.useRef(1)
    const visibleRef = React.useRef(true)
    const rampRef = React.useRef(0)

    React.useEffect(() => {
      const lane = laneRef.current
      if (!lane || !running) return

      const total = duration * 1000
      const from = { transform: "translateX(0px)" }
      const to = { transform: `translateX(${-distance}px)` }
      const animation = lane.animate(
        direction === "left" ? [from, to] : [to, from],
        { duration: total, iterations: Infinity, easing: "linear" }
      )
      // A resize or a prop change rebuilds the animation; carrying the progress across
      // keeps the strip from snapping back to the top of the loop mid-pass.
      animation.currentTime = progressRef.current * total
      animation.playbackRate = rateRef.current
      if (!visibleRef.current) animation.pause()
      animationRef.current = animation

      return () => {
        const elapsed = animation.currentTime
        progressRef.current =
          typeof elapsed === "number" ? (elapsed / total) % 1 : 0
        // A ramp in flight is still writing `playbackRate` to this animation frame by
        // frame. Left running it would spend the rest of its span walking a cancelled
        // animation's rate while the replacement above sat at whatever it was built
        // with — a strip braked mid-hover and then resized would never finish stopping.
        cancelAnimationFrame(rampRef.current)
        animation.cancel()
        animationRef.current = null
      }
    }, [running, distance, duration, direction])

    React.useEffect(() => {
      const container = containerRef.current
      if (!container || !running || typeof IntersectionObserver === "undefined")
        return

      // Off-screen the loop is spending battery on something nobody can see.
      const observer = new IntersectionObserver(([entry]) => {
        visibleRef.current = entry.isIntersecting
        if (entry.isIntersecting) animationRef.current?.play()
        else animationRef.current?.pause()
      })
      observer.observe(container)
      return () => observer.disconnect()
    }, [running])

    const rampTo = React.useCallback((target: number) => {
      rateRef.current = target
      const animation = animationRef.current
      if (!animation) return

      cancelAnimationFrame(rampRef.current)
      const start = animation.playbackRate
      if (start === target) return

      // A ticker that stops dead reads as a dropped frame rather than as a pause, so the
      // playback rate is walked down instead. Linear, like the travel it is braking.
      const startedAt = performance.now()
      const span = target === 0 ? PAUSE_MS : RESUME_MS
      const step = (now: number) => {
        const progress = Math.min((now - startedAt) / span, 1)
        animation.playbackRate = start + (target - start) * progress
        if (progress < 1) rampRef.current = requestAnimationFrame(step)
      }
      rampRef.current = requestAnimationFrame(step)
    }, [])

    React.useEffect(() => () => cancelAnimationFrame(rampRef.current), [])

    const hoveredRef = React.useRef(false)
    const focusedRef = React.useRef(false)
    const syncRate = () =>
      rampTo(hoveredRef.current || focusedRef.current ? 0 : 1)

    const setHovered = (
      hovered: boolean,
      event: React.PointerEvent<HTMLDivElement>
    ) => {
      // A tap fires pointerenter with no matching pointerleave, which would strand the
      // strip until the next tap somewhere else.
      if (!pauseOnHover || event.pointerType === "touch") return
      hoveredRef.current = hovered
      syncRate()
    }

    const setFocused = (focused: boolean) => {
      focusedRef.current = focused
      syncRate()
    }

    const scrollable = reducedMotion && distance > 0

    return (
      <div
        ref={containerRef}
        {...props}
        className={cn(
          "group flex w-full",
          scrollable ? "overflow-x-auto" : "overflow-hidden",
          className
        )}
        style={
          running && fade
            ? { maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK, ...props.style }
            : props.style
        }
        // Nothing carries the overflow into view on its own here, so the reader has to be
        // able to pan it themselves — including from the keyboard. A focusable element
        // needs a name and a role to be one, so the scroller is announced as a region.
        tabIndex={scrollable ? 0 : props.tabIndex}
        role={scrollable ? (props.role ?? "region") : props.role}
        aria-label={scrollable ? (props['aria-label'] ?? label) : props['aria-label']}
        // Declared after the spread and composed rather than replaced: a consumer that
        // wants to know about hover must not be able to switch off the pause that keeps
        // the strip still while a keyboard user is reading it.
        onPointerEnter={(event) => {
          props.onPointerEnter?.(event)
          setHovered(true, event)
        }}
        onPointerLeave={(event) => {
          props.onPointerLeave?.(event)
          setHovered(false, event)
        }}
        onFocusCapture={(event) => {
          props.onFocusCapture?.(event)
          setFocused(true)
        }}
        onBlurCapture={(event) => {
          props.onBlurCapture?.(event)
          setFocused(false)
        }}
      >
        <div ref={laneRef} className="flex min-w-full shrink-0">
          <div ref={trackRef} className="flex shrink-0 items-center gap-4 pr-4">
            {children}
          </div>
          {running && (
            /* The duplicate makes the loop seamless. `inert` keeps its copies of any
               links out of the tab order as well as out of the accessibility tree. */
            <div
              aria-hidden
              inert
              className="flex shrink-0 items-center gap-4 pr-4"
            >
              {children}
            </div>
          )}
        </div>
      </div>
    )
  }
)
Marquee.displayName = "Marquee"

export { Marquee }
