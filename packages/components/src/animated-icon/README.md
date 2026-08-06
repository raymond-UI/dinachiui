# Animated Icon

Four icons that change state by moving rather than by swapping.

```tsx
import {
  AnimatedMenuIcon,
  AnimatedPlayIcon,
  AnimatedChevronIcon,
  AnimatedCheckIcon,
} from "@dinachi/components"

<button type="button" aria-label="Menu" aria-expanded={open} onClick={toggle}>
  <AnimatedMenuIcon open={open} />
</button>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## What the motion is for

Not that the icon is animated — that the two states are visibly the *same object*, so the
control reads as one toggle rather than as two buttons taking turns. Cross-fading a
hamburger into an X says the icon was replaced. Folding it says the button changed.

## The four

| Icon | Prop | What moves |
| --- | --- | --- |
| `AnimatedMenuIcon` | `open` | Three bars fold into a close button. The middle one shrinks out. |
| `AnimatedPlayIcon` | `playing` | The triangle's two halves square off into a pause bar. |
| `AnimatedChevronIcon` | `open` | The same glyph turns over. |
| `AnimatedCheckIcon` | `done` | The check draws itself. |

All four take the props of `motion.svg`, so `className` sizes them the usual way. They
default to `h-5 w-5` and inherit `currentColor`.

## Timing

150ms, no bounce, no delay. These sit on controls someone presses dozens of times a day,
and the motion must never come between the press and the answer.

`AnimatedCheckIcon` is the exception at 280ms. It fires once, on success, and the draw is
what makes it register as a confirmation rather than as an icon that was always there.

## Implementation notes

- **The menu and chevron are pure transforms on static geometry**, so they stay on the
  compositor.
- **`transform-box: view-box`** pins each bar's origin to the 24×24 coordinate system. A
  horizontal line's own bounding box is zero pixels tall, so `fill-box` would give it a
  degenerate origin and the rotation would swing wide instead of closing the X.
- **Play/pause interpolates `d` directly**, which only works because both paths are written
  with the same points in the same order. A morph between paths with different command
  structures does not degrade — it fails.
- **`d`, `pathLength` and `opacity` are stated as `initial`.** Motion can read a `div`'s
  current values back off the DOM, but these are SVG presentation attributes it cannot, so
  leaving them implied starts the animation from `undefined`.

## Accessibility

- **None of them carry an accessible name.** They are decoration inside a control, and the
  control is what gets named. Every one is `aria-hidden`.
- **Reduced motion cuts to the end state.** The state change is the information; watching it
  happen is not.
