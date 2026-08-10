# Text Shimmer

A shimmer for pending states where a spinner would be too loud.

```tsx
import { TextShimmer } from "@dinachi/components"

{isGenerating && <TextShimmer>Thinking…</TextShimmer>}
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## When to use it

Signalling that something is in flight is the whole of what it is for. It loops for as
long as it is mounted, so mount it when the work starts and unmount it when the work
lands. A loop running over settled text is noise, and no amount of tuning makes
decoration justify a permanent animation.

## Variants

| Variant | Behaviour | Use it when |
| --- | --- | --- |
| `sweep` *(default)* | A soft highlight band travels across the text. | Label-sized text where a band has room to read. |
| `pulse` | The whole label breathes between dim and lit. | Dense or small text, where a band is too subtle. Also the cheaper of the two: it animates opacity and nothing else. |

Both are built from `currentColor`, so they inherit the surrounding text colour and theme
themselves.

## Accessibility

- The span carries `role="status"`, because it reports a pending state. That also makes
  decorative use feel as wrong in the markup as it does on screen.
- Under reduced motion the loop does not run. A continuous ambient animation has no
  gentler version worth keeping, but the dim colour stays, so the label still reads as
  unsettled rather than as ordinary prose.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"sweep" \| "pulse"` | `"sweep"` | Which effect to run. |
| `duration` | `number` | `1.6` / `1.8` | Seconds for one cycle. Defaults per variant. |
| `dim` | `number` | `0.7` | How dim the un-lit text is, 0–1. This is a label the user is waiting on, not a placeholder, so it has to stay readable. |

Any other `span` prop is forwarded to the root element.

## Implementation

`sweep` paints the highlight through `background-clip: text` and clears the fill with
`-webkit-text-fill-color` rather than `color: transparent`, since the gradient is made of
`currentColor` and zeroing `color` would erase it.

The gradient is two tiles wide and identical at both ends, so moving it by exactly one
tile lands on an identical frame. The loop closes on itself with no jump to hide.

`background-position` cannot be composited, and there is no transform-only equivalent: a
gradient is fixed to the box painting it. What is avoidable is the per-frame JavaScript,
so the loop runs through the Web Animations API rather than a rAF loop. A busy main
thread no longer costs frames during exactly the pending work this is reporting on. The
repaint that remains is bounded by the element's box, so keep this on label-sized text,
never a paragraph.

Cycle lengths are longer than the 300ms UI budget on purpose. These are ambient loops,
not transitions answering an input, and at that length either variant would strobe.
