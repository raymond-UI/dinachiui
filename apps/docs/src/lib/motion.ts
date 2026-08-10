/**
 * Curves and durations for the site's own motion.
 *
 * The values match the ones the motion-tier components compile in, so a hand-rolled
 * entrance on a marketing page and a `<ScrollReveal>` next to it are on the same curve
 * rather than two that almost agree. Built-in `ease-out` is deliberately not used: it
 * is too weak to read as intentional.
 */
export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

/** Seconds. UI motion stays under 0.3; the hero is the one place allowed past it, and
 *  only because nothing is waiting on it. */
export const DURATION = {
  enter: 0.28,
  hero: 0.45,
} as const

/** Seconds between siblings entering. Past 0.08 the last one reads as a wait. */
export const STAGGER = 0.08

/**
 * Hover lift and press feedback for the link-styled buttons on the home page.
 *
 * CSS rather than `whileHover`/`whileTap`: a transition can be interrupted and
 * retargeted mid-flight, it runs off the main thread, and Tailwind's `hover:` already
 * sits behind `(hover: hover)` so a tap never leaves a link stuck in its hover state.
 * The press is faster than the release — feedback should be immediate, settling can
 * take its time.
 */
export const PRESSABLE = [
  "transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
  "hover:-translate-y-0.5 active:scale-[0.97] active:duration-[120ms]",
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
].join(" ")
