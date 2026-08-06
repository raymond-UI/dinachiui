# Progress Ring

A radial progress arc, determinate or indeterminate.

```tsx
import { ProgressRing } from "@dinachi/components"

<ProgressRing value={64} label="Upload" />
<ProgressRing label="Fetching" />
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## Why a spring

Progress arrives in jumps. A tween restarted on every jump either stutters or has to be
cancelled and rebuilt. A spring re-targets from wherever the arc currently is and carries
its velocity across, so a fast run of updates reads as one accelerating sweep instead of a
series of separate moves.

The number in the middle reads the same spring as the arc, so the two can never disagree.

## The indeterminate arc sweeps its own length

A fixed arc spinning at a constant rate is a loading spinner, and it says only "still
running". Letting the arc lengthen and shorten under the rotation is what makes it read as
work happening rather than as a wheel turning: the sweep and the rotation are deliberately
different lengths, so the pattern never lands in the same place twice in a row.

## Sizing

`thickness` scales with `size` unless you pin it — a ring twice the size with the same 8px
stroke reads as a thinner ring, not a bigger one.

## One honest caveat

The arc is `stroke-dashoffset`, which is not a compositor property. At this size that is
fine: one small element repainting a stroke. Forty of them on a page would be a different
conversation, and the alternative is a rotated half-disc mask that animates on `transform`
but cannot do a rounded cap cleanly.

## Accessibility

- Determinate rings are a `progressbar` with `aria-valuenow`, `aria-valuemin`,
  `aria-valuemax` and a spoken `aria-valuetext`.
- Indeterminate rings are a `status` with no value, because there is none.
- `label` is the accessible name, and it defaults to "Progress" or "Loading".
- Reduced motion has the arc report the value rather than travel to it, and replaces the
  endless sweep with a static gap. An animation that repeats forever is the thing the
  preference most clearly means to stop.
