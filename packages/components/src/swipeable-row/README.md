# Swipeable Row

A row that reveals actions under a swipe.

```tsx
import { SwipeableRow, SwipeableRowGroup } from "@dinachi/components"
import { Archive, Trash2 } from "lucide-react"

<SwipeableRowGroup>
  {rows.map((row) => (
    <SwipeableRow
      key={row.id}
      actions={[
        { label: `Archive ${row.title}`, icon: <Archive className="h-4 w-4" />, onSelect: () => archive(row.id) },
        { label: `Delete ${row.title}`, icon: <Trash2 className="h-4 w-4" />, onSelect: () => remove(row.id), destructive: true },
      ]}
      onDismiss={() => remove(row.id)}
    >
      {row.title}
    </SwipeableRow>
  ))}
</SwipeableRowGroup>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## The release is the whole thing

Snapping to the nearest position on release ignores that the finger was still moving, and
the row stops dead under a hand that was clearly throwing it. This one projects: where
would the row end up if it kept decelerating the way a flicked object does? That projected
point is what gets compared against the thresholds.

So a short fast flick opens the row, and a long slow drag that stops short of the same
point falls back. Both match what the hand meant. The spring that takes over is handed the
pointer's exit velocity, so there is no seam between the finger driving the row and the
animation driving it.

The projection is measured from where the row *is*, not from how far the finger travelled.
Under drag elasticity those two disagree, and the eye is following the row.

## The threshold is shown, not documented

Past `dismissAt` the destructive action takes the whole row, before release. A reader
cannot be asked to estimate a threshold from how far their own finger has moved. It snaps
rather than fading in proportionally — a half-committed delete is not a thing.

Omit `onDismiss` and there is no threshold and no destructive layer: the row only ever
opens. Arming a commit that leads nowhere is a promise the row cannot keep.

## Grouping

`SwipeableRowGroup` keeps at most one row open. Opening a second closes the first, because
the reader swiping a second row has said they are done with the first. A row outside a
group still works; it just does not know about its neighbours.

## Accessibility

- Every action is a real button with an accessible name. A swipe is not an affordance on
  its own, and it is unavailable to anyone using a keyboard.
- Focusing an action opens the row, so the reader can see what they are on.
- Under a reduced-motion preference the drag is switched off and the actions are given
  room in the layout rather than hidden under the row. The functionality is not the
  gesture.
- The row's own content is yours. Give it whatever semantics the list needs — this
  component owns the gesture, not the markup.
