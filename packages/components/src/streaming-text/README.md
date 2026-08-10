# Streaming Text

Text arriving a word at a time, the way a model emits it.

```tsx
import { StreamingText } from "@dinachi/components"

<StreamingText text={answer} complete={!pending} onDone={() => setDone(true)} />
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## When to use it

For text that is genuinely arriving over a network. The reveal is a claim about where the
text is coming from, and playing it over a string you already had in full is a lie that
costs the reader the seconds it takes to run.

## What it does differently

| | Why |
| --- | --- |
| Paced by elapsed time | A dropped frame costs smoothness, not sync. A per-character timer drifts against the stream. |
| Reveals whole words | Per-character reveal reflows the line on nearly every frame: expensive, and unreadable as words break and rejoin. |
| Append-aware | Progress only moves forward. Text arriving late raises the ceiling rather than rewinding the reader. |

## `complete` is not optional information

The component cannot work out for itself that the stream ended. Catching up to the current
string and the stream finishing are indistinguishable from inside — between two chunks
they look identical. Only the caller knows which one happened, so `complete` is what
drives the blinking caret, `onDone`, and the announcement.

```tsx
const [text, setText] = useState("")
const [pending, setPending] = useState(true)

<StreamingText text={text} complete={!pending} />
```

Leave it at its default of `true` for a string that is already whole.

## Accessibility

- The visible paragraph is `aria-hidden`. A live region over a growing paragraph
  re-announces the whole thing on every word.
- The finished text is announced once, through a polite live region, when `complete`
  becomes true.
- Under a reduced-motion preference the words still arrive at the same pace; they arrive
  without the blur-in. The streaming is the data, not the decoration.
- The caret stays solid while tokens land and only blinks once the stream stops, where it
  means "your turn" rather than "still working".
