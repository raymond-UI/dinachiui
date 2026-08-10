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

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

/** Characters that survive the morph are neither arriving nor leaving — they are
 *  travelling across the word — and on-screen movement wants a curve that eases both
 *  ends rather than one tuned to feel responsive at the start. */
const EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1]

/** Clearing the old characters is the system responding; reading the new ones is what
 *  the user is here for. The exit runs short of the entrance so the gap has closed by
 *  the time the eye arrives. */
const EXIT_RATIO = 0.6

/** Seconds. Under a reduced-motion preference the change still needs a bridge, but a
 *  short crossfade is the whole of it. Shared with the rest of the motion tier so a
 *  page that reduces one component reduces all of them at the same rate. */
const REDUCED_DURATION = 0.2

/** The morph is driven from a layout effect so the setup commit never paints. On the
 *  server there is nothing to lay out, and `useLayoutEffect` warns there. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

interface GraphemeSegmenter {
  segment(input: string): Iterable<{ segment: string }>
}

let segmenter: GraphemeSegmenter | null | undefined

/** Splitting on code points detaches a combining accent from its letter and shatters
 *  multi-codepoint emoji, so segment by grapheme wherever the runtime offers it. */
function toGraphemes(text: string): string[] {
  if (segmenter === undefined) {
    const Segmenter = (
      Intl as unknown as {
        Segmenter?: new (
          locales: undefined,
          options: { granularity: "grapheme" }
        ) => GraphemeSegmenter
      }
    ).Segmenter
    segmenter = Segmenter
      ? new Segmenter(undefined, { granularity: "grapheme" })
      : null
  }
  return segmenter
    ? Array.from(segmenter.segment(text), (entry) => entry.segment)
    : Array.from(text)
}

/**
 * Keys are grapheme + occurrence index, so the second "s" in "accessible" is a distinct,
 * stable identity from the first. Without the occurrence counter, React reuses the
 * wrong node and characters teleport instead of sliding.
 */
function toCharacters(text: string) {
  const seen: Record<string, number> = {}
  return toGraphemes(text).map((char) => {
    seen[char] = (seen[char] ?? 0) + 1
    return { key: `${char}-${seen[char]}`, char }
  })
}

interface MorphPhase {
  /** The string the character layer is rendering. */
  text: string
  /** Whether the character layer is mounted at all. */
  split: boolean
}

/**
 * Text is content, not decoration. Held permanently in one element per character it
 * stops being selectable, findable with the browser's find-in-page, wrappable at word
 * boundaries, and pronounceable — a screen reader spells it out. So the split exists
 * only for the length of the morph and the resting DOM is a single text node.
 *
 * Getting there costs two commits. `AnimatePresence` can only animate an exit for a
 * child it rendered on the previous pass, so the first commit mounts the *outgoing*
 * string as characters and a layout effect swaps in the incoming one. Layout effects
 * flush before paint, so the intermediate frame is never shown.
 */
function useMorphPhase(
  text: string,
  enabled: boolean,
  settleMs: number
): MorphPhase {
  const [phase, setPhase] = React.useState<MorphPhase>({ text, split: false })

  if (enabled && !phase.split && phase.text !== text) {
    setPhase({ text: phase.text, split: true })
  }

  useIsomorphicLayoutEffect(() => {
    if (!enabled) {
      if (phase.split || phase.text !== text) setPhase({ text, split: false })
      return
    }
    if (phase.split && phase.text !== text) setPhase({ text, split: true })
  }, [enabled, phase, text])

  React.useEffect(() => {
    if (!enabled || !phase.split || phase.text !== text) return
    const id = window.setTimeout(() => setPhase({ text, split: false }), settleMs)
    // Cleared whenever the target changes again, so a morph interrupted mid-flight
    // restarts the settle instead of collapsing to a text node under its own feet.
    return () => window.clearTimeout(id)
  }, [enabled, phase, text, settleMs])

  return phase
}

export interface TextMorphProps
  extends Omit<React.ComponentProps<typeof motion.span>, "children"> {
  /** The text to display. Changing it triggers the morph. */
  children: string
  /** Blur radius in px on entering and exiting characters. */
  blur?: number
  /** Vertical travel in px for entering and exiting characters. */
  distance?: number
  /** Seconds. Keep it under 0.3 — this is a content change, not a transition the
   *  reader should have to sit through. */
  duration?: number
}

/**
 * Text that morphs character by character.
 *
 * Characters present in both strings keep their identity and slide to their new
 * positions; only the genuine additions and removals fade. `mode="popLayout"` pulls
 * exiting characters out of flow immediately, so the survivors start closing the gap
 * on the same frame rather than waiting for the exit to finish.
 *
 * There is no per-character stagger. At the 30–80ms that reads as a cascade, a ten
 * character word spends 270–720ms on the stagger alone before its last character has
 * even begun — several times the budget for a UI transition. Anything short enough to
 * stay inside the budget lands below a frame of separation, which is no stagger at all.
 */
const TextMorph = React.forwardRef<HTMLSpanElement, TextMorphProps>(
  (
    { children, blur = 2, distance = 8, duration = 0.25, className, ...props },
    ref
  ) => {
    const reducedMotion = useReducedMotionConfig()
    // A little past the animation, so the characters are never stitched back into a
    // text node while one of them is still moving.
    const settleMs = Math.round(duration * 1000) + 60
    const phase = useMorphPhase(children, !reducedMotion, settleMs)

    const { enter, exit, move } = React.useMemo(
      () => ({
        enter: { duration, ease: EASE_OUT } as Transition,
        exit: { duration: duration * EXIT_RATIO, ease: EASE_OUT } as Transition,
        move: { duration, ease: EASE_IN_OUT } as Transition,
      }),
      [duration]
    )

    const characters = React.useMemo(
      () => (phase.split ? toCharacters(phase.text) : []),
      [phase.split, phase.text]
    )

    if (reducedMotion) {
      return (
        <motion.span
          ref={ref}
          className={cn("relative inline-block", className)}
          {...props}
        >
          {/* Travel and blur are what the preference asks us to drop. The crossfade
              stays, so the change still reads as one word becoming another rather
              than as a blink. */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={children}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: REDUCED_DURATION, ease: EASE_OUT }}
            >
              {children}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      )
    }

    return (
      <motion.span
        ref={ref}
        layout
        transition={move}
        className={cn(
          // `relative` because `popLayout` positions exiting characters absolutely
          // against the nearest positioned ancestor — without it they anchor outside
          // the word and jump the moment the layout animation transforms the wrapper.
          // `inline-block` rather than `inline-flex`: a flex container never wraps, so
          // a long string would run out of its column. Kerning and ligatures are off in
          // both states because a run of one-character boxes cannot kern; matching the
          // resting text node to that is what stops the word twitching width each time
          // the characters are stitched back together.
          "relative inline-block [font-kerning:none] [font-variant-ligatures:none]",
          className
        )}
        {...props}
      >
        {phase.split ? (
          <>
            <AnimatePresence mode="popLayout" initial={false}>
              {characters.map(({ key, char }) => (
                <motion.span
                  key={key}
                  layout
                  aria-hidden
                  className="inline-block whitespace-pre"
                  initial={{ opacity: 0, filter: `blur(${blur}px)`, y: distance }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{
                    opacity: 0,
                    filter: `blur(${blur}px)`,
                    y: -distance,
                    transition: exit,
                  }}
                  transition={{ default: enter, layout: move }}
                >
                  {char}
                </motion.span>
              ))}
            </AnimatePresence>
            {/* The characters are decorative for as long as they are moving; this is
                what a screen reader announces during the morph. */}
            <span className="sr-only">{children}</span>
          </>
        ) : (
          children
        )}
      </motion.span>
    )
  }
)
TextMorph.displayName = "TextMorph"

export { TextMorph }
