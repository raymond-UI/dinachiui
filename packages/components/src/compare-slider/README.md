# Compare Slider

Drag a divider to compare two layers.

```tsx
import { CompareSlider } from "@dinachi/components"

<CompareSlider
  before={<img src="/before.jpg" alt="Before retouching" />}
  after={<img src="/after.jpg" alt="After retouching" />}
/>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## When to use it

For two versions of the same frame, where the difference is spatial and the reader wants
to control the reveal: a before/after photo, a design diff, a map with a layer toggled.
The divider works because both layers are registered — the same image, in the same place,
at the same size.

Not for two things that merely sit side by side. If the layers do not line up there is
nothing for the divider to reveal, and a pair of panels says it better.

## Drag modes

| Mode | Behaviour | Use it when |
| --- | --- | --- |
| `handle` *(default)* | Only the divider starts a drag. Both layers stay live: buttons take clicks, text takes selection, links take focus. | Either side is real UI, or has anything in it worth clicking. |
| `panel` | Pressing anywhere jumps the divider there. | Both sides are images. There is nothing to click, and a thin handle is a needlessly small target. |

`panel` makes both layers inert, which reads as a bug on anything interactive. That is why
it is not the default.

## Accessibility

- The handle is a `slider` with `aria-valuemin`, `aria-valuemax`, and a live
  `aria-valuenow`, so the position is readable rather than only visible.
- Arrow keys step; hold Shift for a five-times step; Home and End jump to either end.
- `aria-valuenow` updates on the key press, not when the animation lands, so the announced
  value is never waiting on pixels.
- Give it a `label` when the panel needs saying which two things are being compared. The
  default, "Compare position", describes the control and not the content.
- A reduced-motion preference places each keyboard step immediately instead of carrying
  it.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `before` | `ReactNode` | — | Content shown on the left of the divider. |
| `after` | `ReactNode` | — | Content shown on the right of the divider. |
| `defaultPosition` | `number` | `50` | Starting divider position, 0–100. |
| `step` | `number` | `2` | Percentage points moved per arrow key press. |
| `drag` | `"handle" \| "panel"` | `"handle"` | What starts a drag. |
| `label` | `string` | `"Compare position"` | Accessible name for the handle. |
| `stickyHandle` | `boolean` | `false` | Keep the knob at the vertical middle of the viewport rather than of the panel. Set it when the panel is taller than the screen. |
| `onPositionChange` | `(position: number) => void` | — | Fired on release and on each keyboard step. |

Any other `div` prop is forwarded. Pointer handlers are composed rather than replaced, so
passing one adds behaviour instead of removing the drag.

## Implementation

A pointer drag tracks 1:1 with no easing. That is direct manipulation, and any smoothing
there reads as lag. A keyboard step is the opposite case: one press moves the divider a
fixed slice of the panel in a single frame, which strobes rather than moves, so each step
is carried over 100ms. The tween retargets from wherever the divider currently is, so a
held arrow key composes into one continuous travel rather than a queue of restarts.

Position lives in a motion value, so dragging never triggers a React render. Component
state syncs on release and on each keyboard step, where it feeds `aria-valuenow`.

The divider is a percentage `translateX` on a track spanning the panel, not a `left`.
Both say the same thing; only one is composited.

Grabbing the handle measures the offset between the pointer and the divider and keeps it,
so the divider does not teleport under your finger. Pressing the panel deliberately does
the opposite.

A second pointer arriving mid-drag is ignored until the first lifts. It would otherwise
measure its own grab offset and jump the divider out from under the finger already
holding it.

`overflow: clip` rather than `hidden` when the knob is sticky: `hidden` opens a
scrollport, and a sticky element resolves against the nearest one, which would pin the
knob to a box that never scrolls.
