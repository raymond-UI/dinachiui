"use client"

import * as React from "react"
import {
  animate,
  motion,
  useMotionValue,
  MotionConfigContext,
  useReducedMotion,
  type PanInfo,
} from "motion/react"
import { cn } from "@/lib/utils"

/**
 * A carousel that lands where the flick was aimed.
 *
 * Snap-to-nearest is the wrong rule. It measures where the finger stopped, which on a quick
 * flick is barely past the slide it started on, so a decisive gesture bounces back and the
 * carousel feels stuck. Projecting the release velocity forward and snapping to whichever
 * slide *that* lands in gets the opposite behaviour: a flick advances, a slow drag that
 * stops short does not, and both match what the hand meant.
 *
 * Under reduced motion the drag is switched off and this becomes an ordinary scroll-snap
 * strip. That is not a downgrade — a native scroller is a better carousel than a JS one for
 * anyone who did not want the momentum in the first place. The dots and the arrows keep
 * working either way; they just jump instead of animating.
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

/** Seconds of deceleration to project forward before choosing a slide. */
const PROJECTION = 0.2

const SNAP = { type: "spring", stiffness: 380, damping: 40, mass: 0.9 } as const

interface CarouselContextValue {
  index: number
  count: number
  goTo: (next: number, velocity?: number) => void
  reducedMotion: boolean
  x: ReturnType<typeof useMotionValue<number>>
  offsets: number[]
  setOffsets: (offsets: number[]) => void
  scroller: React.RefObject<HTMLDivElement | null>
  registerSlide: (position: number, node: HTMLDivElement | null) => void
  /** Reads every slide's position out of the layout. Trims to `count` first, because a
   *  shortened list leaves stale nodes behind and a stale node still reports an offset. */
  measureSlides: (count: number) => number[]
  currentIndex: () => number
  setIndex: (next: number) => void
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

function useCarousel(component: string) {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error(`${component} must be used within a Carousel`)
  }
  return context
}

/** Position within the strip, handed down so a slide does not have to count itself. */
const CarouselSlotContext = React.createContext<number | null>(null)

export interface CarouselProps extends React.ComponentProps<"div"> {
  /** Names the carousel. Screen readers read it before the slide. */
  label?: string
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      label = "Carousel",
      index: indexProp,
      defaultIndex = 0,
      onIndexChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotionConfig()
    const [uncontrolled, setUncontrolled] = React.useState(defaultIndex)
    const index = indexProp ?? uncontrolled

    const x = useMotionValue(0)
    const scroller = React.useRef<HTMLDivElement>(null)
    const slides = React.useRef<(HTMLDivElement | null)[]>([])
    const [offsets, setOffsets] = React.useState<number[]>([])
    // Slides are counted by measuring them, so the dots cannot get out of step with the
    // strip they control.
    const count = offsets.length

    // The resize and scroll handlers need to know where we are without being rebuilt
    // every time we move.
    const indexRef = React.useRef(index)
    React.useEffect(() => {
      indexRef.current = index
    }, [index])

    const setIndex = React.useCallback(
      (next: number) => {
        // Scrolling reports the same slide many times over. Only a change is news.
        if (next === indexRef.current) return
        indexRef.current = next
        if (indexProp === undefined) setUncontrolled(next)
        onIndexChange?.(next)
      },
      [indexProp, onIndexChange]
    )

    const currentIndex = React.useCallback(() => indexRef.current, [])

    const registerSlide = React.useCallback(
      (position: number, node: HTMLDivElement | null) => {
        slides.current[position] = node
      },
      []
    )

    const measureSlides = React.useCallback((slideCount: number) => {
      slides.current.length = slideCount
      return slides.current.map((slide) => slide?.offsetLeft ?? 0)
    }, [])

    const goTo = React.useCallback(
      (next: number, velocity = 0) => {
        const last = offsets.length - 1
        if (last < 0) return
        const clamped = Math.min(Math.max(next, 0), last)
        setIndex(clamped)

        const to = offsets[clamped]
        if (to === undefined) return

        if (reducedMotion) {
          scroller.current?.scrollTo({ left: to, behavior: "auto" })
          return
        }
        animate(x, -to, { ...SNAP, velocity })
      },
      [offsets, setIndex, reducedMotion, x]
    )

    const context = React.useMemo(
      () => ({
        index,
        count,
        goTo,
        reducedMotion,
        x,
        offsets,
        setOffsets,
        scroller,
        registerSlide,
        measureSlides,
        currentIndex,
        setIndex,
      }),
      [
        index,
        count,
        goTo,
        reducedMotion,
        x,
        offsets,
        registerSlide,
        measureSlides,
        currentIndex,
        setIndex,
      ]
    )

    return (
      <CarouselContext.Provider value={context}>
        <div
          ref={ref}
          role="group"
          aria-roledescription="carousel"
          aria-label={label}
          className={cn("space-y-4", className)}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

export type CarouselViewportProps = React.ComponentProps<"div">

/** The window the strip moves inside. Everything measured is measured from here. */
const CarouselViewport = React.forwardRef<HTMLDivElement, CarouselViewportProps>(
  ({ className, children, ...props }, ref) => {
    const {
      x,
      offsets,
      setOffsets,
      goTo,
      reducedMotion,
      scroller,
      measureSlides,
      currentIndex,
      setIndex,
    } = useCarousel("CarouselViewport")

    /**
     * Where each slide actually starts, read from the DOM.
     *
     * The obvious shortcut is `viewport.width * 0.72 + gap`, and it is wrong the moment the
     * gap comes from a class rather than a constant, or a slide is a different width, or the
     * container has padding. Asking the layout where the slides are costs one measurement
     * per resize and cannot drift.
     */
    const slideCount = React.Children.count(children)

    React.useEffect(() => {
      const node = scroller.current
      if (!node || typeof ResizeObserver === "undefined") return

      const measure = () => {
        const next = measureSlides(slideCount)
        setOffsets(next)

        // A resize moves every slide. Without this the strip keeps its old translation and
        // the carousel silently ends up sitting between two of them.
        const to = next[currentIndex()]
        if (to === undefined) return
        if (reducedMotion) node.scrollTo({ left: to, behavior: "auto" })
        else x.set(-to)
      }

      const observer = new ResizeObserver(measure)
      observer.observe(node)
      return () => observer.disconnect()
    }, [
      x,
      reducedMotion,
      scroller,
      setOffsets,
      measureSlides,
      currentIndex,
      slideCount,
    ])

    const positioned = React.Children.map(children, (child, i) => (
      <CarouselSlotContext.Provider value={i}>{child}</CarouselSlotContext.Provider>
    ))

    if (reducedMotion) {
      return (
        <div
          ref={mergeRefs(ref, scroller)}
          // Under reduced motion the browser's own scroller does the work, so the only
          // thing left to do is keep the dots honest about where it stopped.
          onScroll={(event) => {
            if (offsets.length === 0) return
            setIndex(nearest(offsets, event.currentTarget.scrollLeft))
          }}
          className={cn(
            "relative flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2",
            className
          )}
          {...props}
        >
          {positioned}
        </div>
      )
    }

    const onDragEnd = (_: unknown, info: PanInfo) => {
      if (offsets.length === 0) return

      const projected = -(x.get() + info.velocity.x * PROJECTION)
      // Nearest by measured position rather than by dividing through a nominal slide width,
      // so uneven slides land as accurately as even ones.
      goTo(nearest(offsets, projected), info.velocity.x)
    }

    return (
      <div
        ref={mergeRefs(ref, scroller)}
        className={cn("overflow-hidden", className)}
        {...props}
      >
        <motion.div
          drag="x"
          style={{ x }}
          dragConstraints={{ left: -(offsets[offsets.length - 1] ?? 0), right: 0 }}
          // Give at both ends rather than a wall, so the edge of the set is something you
          // feel instead of something you hit.
          dragElastic={0.16}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          // `relative` makes the strip the offset parent, so each slide's `offsetLeft` is
          // its position within the strip rather than within the page.
          className="relative flex cursor-grab touch-pan-y gap-3 active:cursor-grabbing"
        >
          {positioned}
        </motion.div>
      </div>
    )
  }
)
CarouselViewport.displayName = "CarouselViewport"

export interface CarouselSlideProps extends React.ComponentProps<"div"> {
  /** Names this slide. Falls back to its position in the set. */
  label?: string
}

const CarouselSlide = React.forwardRef<HTMLDivElement, CarouselSlideProps>(
  ({ label, className, ...props }, ref) => {
    const { count, registerSlide } = useCarousel("CarouselSlide")
    const position = React.useContext(CarouselSlotContext)
    if (position === null) {
      throw new Error("CarouselSlide must be used within a CarouselViewport")
    }

    const counted = `${position + 1} of ${count || position + 1}`

    return (
      <div
        ref={mergeRefs(ref, (node: HTMLDivElement | null) => {
          registerSlide(position, node)
        })}
        role="group"
        aria-roledescription="slide"
        aria-label={label ? `${counted}: ${label}` : counted}
        className={cn("w-[72%] shrink-0 snap-start", className)}
        {...props}
      />
    )
  }
)
CarouselSlide.displayName = "CarouselSlide"

export interface CarouselDotsProps extends React.ComponentProps<"div"> {
  /** Slide names, in order. Used in each dot's accessible name. */
  labels?: string[]
  dotClassName?: string
}

/**
 * Not tabs.
 *
 * A tab controls a panel that appears in its place; these move a strip that is already
 * fully present, and calling them tabs promises a `tabpanel` relationship that does not
 * exist. They are buttons that jump.
 */
const CarouselDots = React.forwardRef<HTMLDivElement, CarouselDotsProps>(
  ({ labels, dotClassName, className, ...props }, ref) => {
    const { index, count, goTo } = useCarousel("CarouselDots")

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Choose a slide"
        className={cn("flex gap-1.5", className)}
        {...props}
      >
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={
              labels?.[i] ? `Go to slide ${i + 1}: ${labels[i]}` : `Go to slide ${i + 1}`
            }
            aria-current={i === index ? "true" : undefined}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              i === index ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground",
              dotClassName
            )}
          />
        ))}
      </div>
    )
  }
)
CarouselDots.displayName = "CarouselDots"

export type CarouselArrowProps = React.ComponentProps<"button">

const CarouselPrevious = React.forwardRef<HTMLButtonElement, CarouselArrowProps>(
  ({ className, children, ...props }, ref) => {
    const { index, goTo } = useCarousel("CarouselPrevious")

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Previous slide"
        disabled={index === 0}
        onClick={() => goTo(index - 1)}
        className={cn(arrowClass, className)}
        {...props}
      >
        {children ?? <ChevronIcon direction="left" />}
      </button>
    )
  }
)
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselArrowProps>(
  ({ className, children, ...props }, ref) => {
    const { index, count, goTo } = useCarousel("CarouselNext")

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Next slide"
        disabled={count === 0 || index === count - 1}
        onClick={() => goTo(index + 1)}
        className={cn(arrowClass, className)}
        {...props}
      >
        {children ?? <ChevronIcon direction="right" />}
      </button>
    )
  }
)
CarouselNext.displayName = "CarouselNext"

const arrowClass =
  "rounded-lg border border-border p-1.5 text-foreground transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-35"

/** Inlined so the carousel installs with nothing but `motion`. */
function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  )
}

function nearest(offsets: number[], target: number) {
  let closest = 0
  for (let i = 1; i < offsets.length; i += 1) {
    if (Math.abs(offsets[i] - target) < Math.abs(offsets[closest] - target)) {
      closest = i
    }
  }
  return closest
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value)
      else if (ref) (ref as React.RefObject<T | null>).current = value
    }
  }
}

export {
  Carousel,
  CarouselViewport,
  CarouselSlide,
  CarouselDots,
  CarouselPrevious,
  CarouselNext,
}
