# Hold to Confirm

A destructive action gated behind a deliberate hold.

```tsx
import { HoldToConfirm } from "@dinachi/components"

<HoldToConfirm onConfirm={deleteProject} confirmedLabel="Deleted">
  Hold to delete
</HoldToConfirm>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## When to use it

For an irreversible action the user is already looking at: deleting a project, revoking a
key, ending a session. The hold buys the same deliberation a confirmation dialog does
without taking over the screen, and it keeps the action in the place the user found it.

Not for anything that repeats. A hold is a second and a half every time, and a control the
user hits ten times a day will be resented by the third. Not for anything reversible
either — an undo is faster to offer and cheaper to ignore.

## Variants

| Variant | Behaviour | Use it when |
| --- | --- | --- |
| `fill` *(default)* | A bar sweeps the button from the left, behind the label. | Most cases. The most legible of the three, and the only one that reads at a glance across a room. |
| `ring` | A stroke closes around the button. | Square icon-only buttons, where there is no width for a bar to travel. |
| `border` | The button's own outline draws itself. | A hold inside dense UI. Nothing moves behind the label, so it is the quietest option. |

## Accessibility

- Space and Enter hold, and key up releases. Auto-repeat is ignored, so a held key is one
  hold rather than a restart on every repeat.
- Blur cancels. A hold that continues once the button is no longer focused is a hold the
  user can no longer watch.
- `data-holding` and `data-confirmed` expose both states for styling, so the press feedback
  does not have to ride on `:active`.
- Give a `ring` button an `aria-label`. It has an outline and an icon, and neither is a
  name.
- A reduced-motion preference drops the press scale and keeps the progress. The progress is
  the affordance rather than decoration: a hold that counts invisibly is a control with no
  feedback at all.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"fill" \| "ring" \| "border"` | `"fill"` | How progress is drawn. |
| `duration` | `number` | `1600` | Milliseconds the user must hold to confirm. |
| `onConfirm` | `() => void` | — | Fired once the hold completes. |
| `resetAfter` | `number` | `1600` | Milliseconds the confirmed state is held before resetting. Set `0` to stay confirmed. |
| `confirmedLabel` | `ReactNode` | — | Replaces the label while confirmed. |
| `fillClassName` | `string` | — | Class applied to the progress fill. |
| `render` | `RenderProp` | — | Render as a different element, such as the library's `Button`. |

Any other `button` prop is forwarded. Pointer and keyboard handlers are composed rather
than replaced, so passing one adds behaviour instead of removing the hold.

## Implementation

The timing is asymmetric whichever way it is drawn: progress takes `duration` to complete
but unwinds in 200ms. Committing should feel considered; backing out should feel free.

Release resumes from the current position rather than snapping, so repeated part-holds
stay continuous — a user who lets go and presses again does not start over.

Pointer capture keeps events arriving once the finger leaves the button, which is the
difference between a hold that survives a small drag and one that quietly disarms.

The outline variants are drawn to measured geometry rather than percentages. SVG cannot
inherit a border radius, and the computed radius is the *specified* one — `rounded-full`
reports 9999px, which the element is far too small to honour — so the value is clamped
against the measured size. Percentage radii on a `circle` resolve against the diagonal,
which is only correct for a square.

The measurement is of the padding box, since that is what an absolutely positioned
`inset-0` child resolves against, and it comes from `borderBoxSize` rather than
`getBoundingClientRect`. The rect folds in the press transform, so a re-measure mid-hold
would redraw the outline 3% small and snap it back on release.

`border` reserves a transparent border rather than having none, so it sits the same size
as `fill` and the SVG has a box to draw in.
