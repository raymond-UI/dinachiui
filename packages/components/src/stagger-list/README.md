# Stagger List

A list whose items arrive one after another.

```tsx
import { StaggerList, StaggerListItem } from "@dinachi/components"

<StaggerList>
  {items.map((item) => (
    <StaggerListItem key={item.id}>{item.label}</StaggerListItem>
  ))}
</StaggerList>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## When to use it

For a list the reader is seeing for the first time: search results landing, a dashboard's
first paint, a feed loading its first page. The sequence says the items arrived together
and in an order, which is information a simultaneous fade does not carry.

Not for a list that re-renders on every keystroke, and not for one the reader is scrolling
back to. Re-running an entrance on content already on screen is the fastest way to make a
list feel slower than it is.

## Variants

| Variant | Behaviour | Use it when |
| --- | --- | --- |
| `rise` *(default)* | Items lift into place from below. | Anything read top to bottom: the motion runs along the reading direction. |
| `scale` | Items settle in place from slightly small. | Grids and card walls, where there is no single reading direction for a rise to follow. |
| `blur` | Items pull into focus as they rise. | Sparingly. The only variant that animates a filter, so it is the only one whose cost grows with the item count. |

## Accessibility

- The list keeps its `ul`/`li` semantics; only the markers are dropped.
- Every variant fades in, so a reduced-motion preference drops the second channel and keeps
  the fade *and* the stagger. Sequencing is not movement, and the sequence is the
  information this component carries.
- `StaggerListItem` throws outside a `StaggerList`, since it has no sequence to belong to.

## Props

### StaggerList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"rise" \| "scale" \| "blur"` | `"rise"` | How each item enters. |
| `stagger` | `number` | `0.05` | Seconds between each item. Keep it in the 0.03–0.08 range: beyond that the last item is late enough to feel like a wait. |
| `delay` | `number` | `0` | Seconds before the first item. |
| `duration` | `number` | `0.3` | Seconds for each item's own animation. |
| `distance` | `number` | `8` | Item travel distance in px. Ignored by `scale`, which does not travel. |
| `startOnView` | `boolean` | `true` | Start when scrolled into view rather than on mount. |

Any other `ul` prop is forwarded. `StaggerListItem` forwards any `li` prop.

## Implementation

One duration for every variant. A list entrance is UI, and UI motion stays under 300ms
whichever channel it animates. A variant that needs longer to read is a variant doing too
much.

Item variants are full transform strings rather than motion's `x`/`y`/`scale` shorthands.
The shorthands are driven from the main thread, which is exactly where the contention is
when a stagger runs: during a scroll, or while the page is still painting the content the
list is made of.

`blur` is the one channel the compositor cannot do for free, and its cost scales with the
radius rather than with the fact of blurring. Two things keep that in hand: the radius is
2px, and the item travels, which puts it on its own compositing layer so the filter is a
layer operation rather than a repaint. The residue is a `filter: blur(0px)` left on each
item after it lands, which makes that item a containing block for any fixed-position
descendant.

`startOnView` triggers on a root margin rather than a visible fraction. A fraction of a
tall list is a lot of scrolling, so a grid would sit at zero opacity while its first rows
were already on screen. Insetting from the edge starts the sequence once the list has
properly arrived, rather than the instant it clips the fold.
