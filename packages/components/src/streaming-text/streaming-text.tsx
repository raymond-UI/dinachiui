"use client"

import * as React from "react"
import { motion, MotionConfigContext, useReducedMotion } from "motion/react"
import { cn } from "@dinachi/core"

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

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

/** Fast enough to stay ahead of a reader, slow enough that the arrival is visible.
 *  Around the pace a mid-sized model emits at. */
const DEFAULT_WORDS_PER_SECOND = 14

export interface StreamingTextProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** The text so far. May grow between renders; appending resumes rather than restarts. */
  text: string
  /**
   * Whether the stream has ended.
   *
   * The component cannot infer this. Catching up to the current string is not the same
   * event as the stream finishing, and between two chunks the two are indistinguishable
   * from in here. Everything that means "finished" hangs off this: the blinking caret,
   * `onDone`, and the single announcement to assistive technology.
   */
  complete?: boolean
  /** Change it to rewind to the first word. */
  runKey?: number
  /** Holds the reveal where it is. The clock stops with it, so there is no catch-up
   *  burst on resume. */
  paused?: boolean
  /** Reveal pace. Changing it mid-stream changes the pace without restarting. */
  wordsPerSecond?: number
  /** Fired once, when the reveal has caught up and `complete` is true. */
  onDone?: () => void
}

/**
 * Text arriving a word at a time, the way a model emits it.
 *
 * Three things separate this from a typewriter effect.
 *
 * The pace is driven by elapsed time rather than by a per-character timer, so a dropped
 * frame costs smoothness rather than sending the paragraph out of sync with the stream.
 *
 * The unit is a word, not a character. Revealing per character reflows the line on nearly
 * every frame, which is both expensive and unreadable — the text jitters as words break
 * and rejoin. A word appears whole, in place, and only its opacity and blur change, so
 * nothing after it moves.
 *
 * And the reveal is append-aware. Real streaming hands you a string that grows, not a
 * finished paragraph to play back, so progress is carried in a ref and only ever moves
 * forward. Text arriving late raises the ceiling; it does not rewind the reader to the
 * first word.
 */
const StreamingText = React.forwardRef<HTMLDivElement, StreamingTextProps>(
  (
    {
      text,
      complete = true,
      runKey = 0,
      paused = false,
      wordsPerSecond = DEFAULT_WORDS_PER_SECOND,
      onDone,
      className,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotionConfig()

    // Split on whitespace *keeping* it, so the gaps survive the reveal as literal text
    // rather than having to be reconstructed.
    const words = React.useMemo(() => text.split(/(\s+)/), [text])

    const [visible, setVisible] = React.useState(0)
    /** Every word we have has been shown. More may yet arrive. */
    const caughtUp = visible >= words.length
    const done = caughtUp && complete

    /** Fractional word position. Integer state is what renders; this is what accumulates. */
    const progress = React.useRef(0)

    /**
     * Read inside the frame loop instead of closed over it. A pace change mid-stream is a
     * change of pace, not a change of content — as a dependency of the effect it would
     * tear the loop down and start the paragraph again.
     */
    const paceRef = React.useRef(wordsPerSecond)
    React.useEffect(() => {
      paceRef.current = wordsPerSecond
    }, [wordsPerSecond])

    const doneRef = React.useRef(onDone)
    React.useEffect(() => {
      doneRef.current = onDone
    }, [onDone])

    React.useEffect(() => {
      progress.current = 0
      setVisible(0)
    }, [runKey])

    React.useEffect(() => {
      if (paused || caughtUp) return

      let last = performance.now()
      let frame = requestAnimationFrame(function tick(now) {
        // Delta time, not time-since-start: the loop stops and restarts — for a pause, or
        // for text that has caught up with the stream — and picks up where it left off.
        const delta = (now - last) / 1000
        last = now

        progress.current = Math.min(
          progress.current + delta * paceRef.current,
          words.length
        )
        setVisible(Math.floor(progress.current))

        if (progress.current < words.length) frame = requestAnimationFrame(tick)
      })

      return () => cancelAnimationFrame(frame)
      // `caughtUp` flips once per chunk, not once per frame, so the loop is rebuilt only
      // when there is genuinely nothing left to reveal.
    }, [paused, caughtUp, words.length])

    React.useEffect(() => {
      if (done) doneRef.current?.()
    }, [done])

    return (
      <div
        ref={ref}
        className={cn("text-sm leading-relaxed text-foreground", className)}
        {...props}
      >
        <p
          // The visible text is decoration as far as assistive technology is concerned. A
          // live region over a growing paragraph re-announces the whole thing on every
          // word; the finished answer goes out once, below.
          aria-hidden
        >
          {words.slice(0, visible).map((word, index) =>
            // Whitespace is emitted as-is. Animating it would put a fade on a gap.
            /^\s+$/.test(word) ? (
              <React.Fragment key={index}>{word}</React.Fragment>
            ) : (
              <motion.span
                key={index}
                // Under reduced motion the word still arrives — the streaming is the
                // data, not the decoration. It just arrives without the blur-in.
                initial={
                  reducedMotion
                    ? { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" }
                    : { opacity: 0, filter: "blur(4px)", transform: "translateY(2px)" }
                }
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  transform: "translateY(0px)",
                }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                className="inline-block"
              >
                {word}
              </motion.span>
            )
          )}
          <Caret idle={done} reducedMotion={reducedMotion} />
        </p>

        <p aria-live="polite" className="sr-only">
          {done ? text : ""}
        </p>
      </div>
    )
  }
)
StreamingText.displayName = "StreamingText"

/**
 * The caret stays solid while tokens are landing: a blink during output competes with the
 * words for attention. It only starts blinking once the stream stops, where it means
 * "your turn" rather than "still working".
 */
function Caret({
  idle,
  reducedMotion,
}: {
  idle: boolean
  reducedMotion: boolean
}) {
  const blinking = idle && !reducedMotion

  return (
    <motion.span
      aria-hidden
      className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] rounded-full bg-primary align-baseline"
      animate={blinking ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
      transition={
        blinking
          ? { duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }
          : { duration: 0 }
      }
    />
  )
}

export { StreamingText }
