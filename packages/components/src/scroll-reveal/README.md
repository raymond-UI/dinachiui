# Scroll Reveal

A block that wipes into view the first time it is scrolled to.

```tsx
import { ScrollReveal } from "@dinachi/components"

<ScrollReveal>
  <FeatureGrid />
</ScrollReveal>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## When to use it

Sparingly, and only on content the reader has not seen yet: one hero block, one feature
grid. A page where everything reveals is a page that is slow to read, because every block
withholds itself until the scroll catches up. Anything the reader returns to, or arrives at
from a deep link, is better off just being there.

The hidden state is a real style on the element, so the content depends on JS running to
become visible. That is the trade for the effect. Don't wrap anything whose absence would
be a bug rather than a missing flourish.

## Direction

The aperture opens *against* the travel, so the block appears to slide up through a shutter
opening downwards. `up` is the default and the right one for anything read top to bottom.

| Direction | Content travels | Aperture opens from |
| --- | --- | --- |
| `up` *(default)* | Up | Top |
| `down` | Down | Bottom |
| `left` | Left | Right |
| `right` | Right | Left |

## Accessibility

- Under reduced motion the wipe and the travel are dropped and only the fade remains. The
  fade still signals that new content arrived, which is the part worth keeping.
- Nothing here is announced or focusable; the wrapper is presentational.
- `repeat` is off by default. Replaying an entrance on content the reader has already read
  is decoration rather than information, and it makes the page feel like it is fighting the
  scroll.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `"up" \| "down" \| "left" \| "right"` | `"up"` | Direction the content travels as it reveals. |
| `distance` | `number` | `8` | Travel distance in px. The wipe is the gesture; the nudge only gives it a direction. |
| `duration` | `number` | `0.45` | Seconds. Front-loaded by the easing, so most of the travel lands in the first third and the rest is settle. |
| `delay` | `number` | `0` | Seconds to wait after entering view. |
| `repeat` | `boolean` | `false` | Re-run every time it re-enters view. |
| `margin` | `string` | `"0px 0px -100px 0px"` | Root margin for the viewport trigger. |
| `amount` | `number \| "some" \| "all"` | `"some"` | Fraction of the element that must be visible. |
| `root` | `RefObject<Element>` | — | Observe against a scrollable ancestor instead of the viewport. |

Any other `div` prop is forwarded to the animated element.

## Implementation

The reveal is a `clip-path` inset paired with a short travel, so the content is uncovered
edge-first rather than fading in as a whole. A fade alone reads as a loading state rather
than as arrival.

The observed node and the animated node are different elements. `clip-path` shrinks an
element's intersection rect in Chromium, and the hidden state clips to zero area, so
observing the node being wiped would pin it off screen and the content could never reveal
itself. The wrapper is never clipped.

Travel is a full `transform` string rather than motion's `x`/`y` shorthands. Only `opacity`,
`clipPath`, `filter` and `transform` are handed off to the compositor; `x` and `y` stay on
the main thread, which is the worst place to be for something that by definition runs while
the user is scrolling. It would also leave the clip and the travel on two different clocks,
drifting apart.

Leaving view under `repeat` resets instantly rather than animating out. Animating back out
would fade the block away at the edge of the viewport while it is still being read, and
`delay` would hold it there first.

`margin`'s default holds the reveal back until the block is clear of the fold, so the wipe
is not already over by the time it is worth looking at. The cost is that a block shorter
than that inset sitting at the very bottom of the scroll range can never clear the line.
Pass `"0px"` for trailing content with nothing below it.

`root` must be an ancestor of the revealed content. `IntersectionObserver` reports no
intersection at all against an unrelated root, and the block would stay hidden forever.
