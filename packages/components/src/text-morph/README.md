# Text Morph

Text that morphs character by character when it changes.

```tsx
import { TextMorph } from "@dinachi/components"

<TextMorph>{status}</TextMorph>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## When to use it

For a short label that changes in place and where the two strings are related: a status
going from `Deploying` to `Deployed`, a count's unit, a toggle's label. Characters present
in both strings keep their identity and slide to their new positions, so the change reads
as the same word rearranging rather than as one word replacing another.

That relationship is what carries the effect. Two unrelated strings have nothing to share,
so every character fades and the result is an expensive crossfade. For numbers, reach for
Number Ticker instead, which counts rather than rearranges.

Keep it to a few words. The morph runs on every character at once, and the cost is per
character.

## Accessibility

- The resting DOM is a single text node. The split exists only for the length of the
  morph, so the text stays selectable, findable with the browser's find-in-page, and
  wrappable at word boundaries the rest of the time.
- While the characters are split they carry `aria-hidden`, because a screen reader spells
  out a run of one-character elements. An `sr-only` node carries the reading instead.
- Under reduced motion the text never splits. The change still gets a short crossfade, so
  it reads as one word becoming another rather than as a blink.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `string` | — | The text to display. Changing it triggers the morph. |
| `blur` | `number` | `2` | Blur radius in px on entering and exiting characters. |
| `distance` | `number` | `8` | Vertical travel in px for entering and exiting characters. |
| `duration` | `number` | `0.25` | Seconds. Keep it under 0.3: this is a content change, not a transition the reader should sit through. |

Any other `span` prop is forwarded to the root element.

## Implementation

`AnimatePresence` runs in `mode="popLayout"`, which pulls exiting characters out of flow
immediately so the survivors start closing the gap on the same frame rather than waiting
for the exit to finish. Exits run at 60% of the entrance duration: clearing the old
characters is the system responding, and reading the new ones is what the user is here
for.

Keys are grapheme plus occurrence index, so the second `s` in `accessible` is a distinct,
stable identity from the first. Without the occurrence counter React reuses the wrong node
and characters teleport instead of sliding. Segmentation is by grapheme rather than code
point, so a combining accent stays attached to its letter and a multi-codepoint emoji stays
whole.

Getting back to a single text node costs two commits. `AnimatePresence` can only animate an
exit for a child it rendered on the previous pass, so the first commit mounts the *outgoing*
string as characters and a layout effect swaps in the incoming one. Layout effects flush
before paint, so the intermediate frame is never shown.

There is no per-character stagger. At the 30–80ms that reads as a cascade, a ten character
word spends 270–720ms on the stagger alone before its last character has begun, several
times the budget for a UI transition. Anything short enough to stay inside the budget lands
below a frame of separation, which is no stagger at all.

Kerning and ligatures are off in both states. A run of one-character boxes cannot kern, and
matching the resting text node to that is what stops the word twitching width each time the
characters are stitched back together.
