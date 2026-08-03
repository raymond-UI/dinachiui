# Scroll Progress

A bar tracking how far a scroll container has been read.

```tsx
import { ScrollProgress } from "@dinachi/components"

<ScrollProgress />
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## When to use it

On long-form content where the scrollbar alone is not enough of an answer to "how much is
left": an article, a changelog, a documentation page. On a short page it reports something
the reader already knows.

By default it tracks the page. An app that scrolls an inner element rather than the
document leaves the bar at zero until it is pointed at that element, with either a ref or a
CSS selector.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `containerRef` | `RefObject<HTMLElement> \| string` | — | Scroll container to track: a ref, or a CSS selector for a scrollport you cannot hang a ref on. Omit to track the page. |
| `smooth` | `boolean` | `true` | Smooth the bar with a spring. Set `false` for a 1:1 bar. |
| `fixed` | `boolean` | `true` | Position the bar itself. Set `false` to place it yourself. |

Any other `div` prop is forwarded to the root element.

## Accessibility

- The bar carries `aria-hidden`. It restates the scrollbar, which assistive technology
  already exposes, so announcing it would be noise.
- `pointer-events-none` keeps a fixed bar from swallowing clicks along the top edge of the
  viewport.
- Under reduced motion the spring is dropped and the bar tracks scroll 1:1. It still moves,
  because that movement is the reader's own gesture rather than motion the interface added.

## Implementation

`scaleX` rather than `width`. Width forces layout on every scroll frame; scaleX runs on the
compositor.

The spring is not decoration. A mouse wheel arrives in discrete notches, and smoothing turns
that staircase into continuous motion. It is short enough that the bar never visibly
disagrees with the text on screen.

It is written as physics — stiffness, damping, mass — rather than motion's
`duration`/`bounce` shorthand, deliberately. A duration-defined spring zeroes the value's
inherited velocity every time it re-targets, and this one re-targets on every scroll frame:
the shorthand would restart the bar from rest continuously, so it could only ever lag. The
physics form carries velocity across re-targets, which is what lets the bar run at the speed
the reader is scrolling. Damping ratio is exactly 1, because overshoot on a progress bar
claims progress the reader has not made.

`will-change: transform` stays on permanently, against the usual advice to hint only
imminent motion. This element is transformed on essentially every scroll frame, so the layer
it promotes is never idle.

A selector is accepted because an app whose scrollport lives in a server-rendered layout has
nowhere to hang a ref. It resolves in a layout effect declared before the scroll listener
attaches, so the listener finds the right element on the first commit. A selector that
matches nothing falls back to the page rather than throwing.
