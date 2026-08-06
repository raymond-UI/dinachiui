# Toast Stack

A stack of toasts that collapses into itself until the reader shows interest.

```tsx
import { ToastStack, ToastStackItem } from "@dinachi/components"

<ToastStack className="fixed bottom-4 right-4 w-80">
  {toasts.map((toast) => (
    <ToastStackItem key={toast.id} onDismiss={() => remove(toast.id)}>
      <p className="text-sm font-medium">{toast.title}</p>
    </ToastStackItem>
  ))}
</ToastStack>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

This is not `Toast`. `Toast` is the Base UI notification primitive with a provider and a
queue; this is the stacking presentation, and it takes whatever children you give it.

## Depth, not height

Three notifications should cost the same screen area as one. Collapsed, the toasts behind
the front one are pushed back with a scale and a small vertical offset, so the stack reads
as depth rather than as a list that has been cropped. Hovering or focusing it expands it
into the real column.

That depth is `scale` and `y`, never height or margin. The stack has to be able to expand
and collapse while a toast is entering or leaving, and layout properties cannot be
interrupted mid-flight without jumping.

## The open positions are measured

Toasts are not all one height — a two-line body pushes the next one down. Multiplying a
constant by the index is right exactly until the first toast wraps, after which every toast
under it overlaps. Each toast reports its own height and the column is built from those.

## The countdown pauses, it does not reset

Expanding the stack means the reader is reading it, so the countdown stops. Clearing and
restarting the timeout on every hover would hand them a fresh five seconds each time the
pointer crossed the stack, which is not a pause. The time already spent is banked, so
resuming picks up the remainder.

Pass `duration={Infinity}` for a toast that stays until it is dismissed by hand.

## Placement is yours

The toasts are absolutely positioned inside the stack element, so give it the corner and
the width you want it to occupy. It has no height of its own.

## Accessibility

- Focus expands the stack, not just hover. A keyboard reader reaching the second toast's
  button cannot be asked to hover first.
- The contents are yours, which includes the live region. Announce the notification where
  you produce it; a stack that re-announces on every re-render is worse than silence.
- Reduced motion drops the drag, so dismissing is only ever the button. Give every toast
  one.
