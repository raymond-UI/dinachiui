# Sortable

A list the reader can reorder, by pointer or by keyboard.

```tsx
import { Sortable, SortableItem, SortableHandle } from "@dinachi/components"

const [order, setOrder] = useState(["overview", "install", "components"])

<Sortable value={order} onValueChange={setOrder}>
  {order.map((id) => (
    <SortableItem key={id} id={id} label={pages[id].title}>
      <SortableHandle />
      <span>{pages[id].title}</span>
    </SortableItem>
  ))}
</Sortable>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## The order is ids

`value` is a `string[]`, not your objects. Identity is what a reorder is about, and it is
what React's keys need anyway, so the list carries the ids and you keep the lookup. It also
means the announcements and the drag agree on what a row *is* without a comparator.

## The keyboard path is not an afterthought

Reordering by pointer and reordering by keyboard have to end at the same place, and only
one of them can be expressed as a gesture. `SortableHandle` is a real button:

| Key | Effect |
| --- | --- |
| Space / Enter | Picks the row up, or drops it if it is already up. |
| Arrow up / down | Moves the grabbed row one position. |
| Escape | Restores the order from before the grab. |
| Tab | Drops the row where it is. Focus left, but the moves were deliberate. |

Escape is stopped from propagating while a row is grabbed, so cancelling a reorder inside a
dialog does not also close the dialog.

## When to use it

For a list whose order is content: navigation, a playlist, a pinned set, form fields. Not
for a list the reader only reads — a drag affordance on a list nobody reorders is one more
thing on the row.

## Behaviour

- **The row only moves from the handle.** A whole-row drag target fights text selection and
  swallows every click inside the row.
- **The lifted row scales and takes a shadow**, because a row being dragged is above the
  page rather than in it. The shadow is an opacity change on a layer that already has one,
  not an interpolated `boxShadow` — a shadow keyframe repaints the blur every frame.
- **Displaced rows animate with FLIP**, so a row that moved because another passed it reads
  as pushed rather than repainted somewhere else.
- **The row's contents are yours.** Put the handle wherever the layout wants it.

## Accessibility

- The list is a `ul` of `li`s.
- Each handle is named after its row (`Reorder Installation`) and carries `aria-pressed`
  while the row is up.
- Every move is announced through an assertive live region — position included, since the
  reader is mid-interaction and the position is the only thing telling them where the row
  went.
- Reduced motion keeps the reorder and drops the lift. Reordering is the function.
