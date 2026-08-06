# Animated List

A list whose contents change under the reader.

```tsx
import { AnimatedList, AnimatedListItem } from "@dinachi/components"

<AnimatedList dismissed={dismissed}>
  {items.map((item) => (
    <AnimatedListItem key={item.id} itemKey={item.id}>
      {item.title}
    </AnimatedListItem>
  ))}
</AnimatedList>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## When to use it

For a list the reader is already looking at when it changes: a notification feed, an
inbox, a live activity stream. The value is not the entrance — it is that a row moving to
close a gap reads as *displaced* rather than as having been repainted somewhere else.

Not for a list that is simply appearing. Use `StaggerList` for that; a list that already
has its content wants an entrance, not a reconciliation.

## The three cases

| Case | What happens |
| --- | --- |
| A row enters | Fades and travels in from the edge given by `from`. |
| A row leaves | Pulled out of layout flow immediately, so the gap starts closing on the same frame. |
| A row neither entered nor left | Springs to its new position. This is the case the component exists for. |

## Two exits

A row the reader dismissed and a row the server retracted are the same removal to React
and two different events to the reader. Pass the key of the row the reader closed as
`dismissed`, in the same update that removes it:

```tsx
const dismiss = (id: string) => {
  setDismissed(id)
  setItems((current) => current.filter((item) => item.id !== id))
}
```

It slides out towards the control that was just pressed; everything else collapses in
place. Leave `dismissed` unset and every removal collapses.

It has to be set at removal rather than read at render, because by the time the row is
leaving it is already gone from the list. The value rides `AnimatePresence`'s `custom`,
the one channel motion re-reads when it resolves an exit.

## Accessibility

- The list keeps its `ul`/`li` semantics; only the markers are dropped.
- Under a reduced-motion preference rows still fade, and the rows below still end up in
  the right place — they get there in one frame instead of on a spring. The reflow is not
  decoration; deleting it would leave the list wrong, not calmer.
- Announce the change yourself if it matters. A list that mutates silently is a motion
  problem for sighted readers and no signal at all for anyone else.

## Notes

`AnimatedListItem` uses motion's `x`/`y`/`scale` shorthands rather than the full transform
strings the rest of the tier prefers. `layout` builds the element's transform out of those
values plus its own projection delta, so a `transform` string would fight it.
