/**
 * Motion design tokens
 * Defines the easing curves and durations every component animates on.
 *
 * Components reference these through Tailwind arbitrary values with the literal
 * value inlined as a fallback, e.g.
 * `ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))]`. A component
 * copied into a project that never wrote the variables still animates
 * correctly; a project that did write them can retheme every component at once.
 *
 * The `--motion-` prefix is deliberate. Tailwind v4 ships its own `--ease-out`
 * and `--duration-*` theme variables, so an unprefixed name would silently
 * resolve to Tailwind's weaker built-in curve instead of the fallback.
 */

export const easing = {
  /** Entrances and exits. Starts fast, so the user sees movement immediately. */
  out: 'cubic-bezier(0.23, 1, 0.32, 1)',
  /** Movement between two on-screen positions, such as a tab indicator. */
  inOut: 'cubic-bezier(0.77, 0, 0.175, 1)',
  /** Travel for surfaces that slide in from an edge. The iOS drawer curve. */
  drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
} as const

export const duration = {
  /** Popovers, tooltips, menus, selects, press feedback, and every exit. */
  fast: '150ms',
  /** Modals, drawers, panels that change height, and the tabs indicator. */
  base: '200ms',
} as const

/** The CSS custom properties `dinachi init` writes into `:root`. */
export const motionCssVars = {
  '--motion-ease-out': easing.out,
  '--motion-ease-in-out': easing.inOut,
  '--motion-ease-drawer': easing.drawer,
  '--motion-duration-fast': duration.fast,
  '--motion-duration-base': duration.base,
} as const

export type Easing = keyof typeof easing
export type Duration = keyof typeof duration
