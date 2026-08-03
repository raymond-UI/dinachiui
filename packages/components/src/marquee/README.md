# Marquee

A strip that scrolls its content on a seamless loop.

```tsx
import { Marquee } from "@dinachi/components"

<Marquee>
  {logos.map((logo) => (
    <img key={logo.name} src={logo.src} alt={logo.name} className="h-8" />
  ))}
</Marquee>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## When it moves

The loop only runs when it has something to say:

- Content narrower than the container sits still. Sliding a gap past the reader adds
  nothing they could not already see.
- The strip stops while scrolled out of view.
- Hover or focus brakes it to a stop, then releases when you leave.
- A reduced-motion preference turns it into an ordinary horizontal scroller.

## Accessibility

- The seamless loop needs a duplicate track. That copy is `aria-hidden` and `inert`, so
  its links are neither announced twice nor reachable by tab.
- Focus pauses the strip regardless of `pauseOnHover`, so a keyboard user never loses the
  element they are on.
- Under reduced motion the container becomes a focusable scroll region. Nothing carries
  the overflow into view on its own, so the reader has to be able to pan it.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `duration` | `number` | `24` | Seconds for one full pass of the content. |
| `direction` | `"left" \| "right"` | `"left"` | Travel direction. |
| `pauseOnHover` | `boolean` | `true` | Brake while hovered. Focus pauses regardless. |
| `fade` | `boolean` | `true` | Fade the leading and trailing edges. Applies only while moving. |

Any other `div` prop is forwarded to the container.

## Implementation

Travel goes to the compositor through the Web Animations API rather than being driven per
frame from React. This is ambient motion that runs for the life of the page, so a busy
main thread must not be able to make it stutter.

Pausing walks `playbackRate` to 0 over 160ms rather than stopping dead, which would read
as a dropped frame. Resuming takes 240ms: it answers nothing the reader is waiting on, so
it gets the slower half of the asymmetry.

Touch `pointerenter` is ignored. A tap fires it with no matching `pointerleave`, which
would strand the strip until the next tap somewhere else.
