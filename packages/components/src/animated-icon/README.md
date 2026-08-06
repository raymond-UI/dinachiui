# Animated Icon

Two icons in one place, trading with a transition instead of a swap.

```tsx
import { AnimatedIcon } from "@dinachi/components"
import { Play, Pause } from "lucide-react"

<button type="button" aria-label={playing ? "Pause" : "Play"} onClick={toggle}>
  <AnimatedIcon active={playing} from={<Play />} to={<Pause />} />
</button>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## What the motion is for

Not that the icon is animated — that the two states read as the *same object* changing, so
the control is one toggle rather than two buttons taking turns. Swap the element outright
and the eye registers a replacement; move it and the eye registers a state.

## It is a shell, not a set of icons

Give it any two and it handles the crossfade, the stacking, the sizing and the
reduced-motion path. A lucide pair, your own SVG, an emoji, two spans.

```tsx
<AnimatedIcon active={muted} from={<Volume2 />} to={<VolumeX />} />
<AnimatedIcon active={copied} from={<Copy />} to={<Check />} />
<AnimatedIcon active={open} from={<Menu />} to={<X />} mode="rotate" />
```

It does not morph one path into another. That needs two paths written with the same
commands in the same order, and no two icons out of a library ever are — a morph between
mismatched paths does not degrade, it fails. The transform pair works for every
combination instead of for the handful that happen to be compatible.

## Props

| Prop | Type | Default | |
| --- | --- | --- | --- |
| `active` | `boolean` | — | `false` shows `from`, `true` shows `to`. |
| `from` | `ReactNode` | — | The resting icon. |
| `to` | `ReactNode` | — | The icon for the active state. |
| `mode` | `"scale" \| "rotate" \| "flip" \| "fade"` | `"scale"` | How they trade places. |
| `className` | `string` | `"size-5"` | Sizes and colours both icons. |

Everything else lands on the wrapping `<span>`.

## Modes

| Mode | What happens |
| --- | --- |
| `scale` | The outgoing icon drops to 0.7 and fades; the incoming one rises from it. |
| `rotate` | Adds a quarter turn each way, so the icon reads as turning over. |
| `flip` | Rotates about the horizontal axis, with a vanishing point. |
| `fade` | Opacity only. For pairs where any movement would be noise. |

`exit` mirrors `initial` rather than repeating it, so the icon that leaves goes the way the
next one is coming from and the pair reads as one movement.

## Timing

150ms, no bounce, no delay. These sit on controls someone presses dozens of times a day,
and the motion must never come between the press and the answer.

## Sizing

The box owns the size and both icons fill it. Default `size-5`.

```tsx
<AnimatedIcon active={dark} from={<Sun />} to={<Moon />} className="size-8" />
```

Do not size the icons individually. An icon library ships an intrinsic 24×24, which a
smaller box squashes on one axis and a larger one leaves floating in the middle — and two
icons sized apart are two icons that jump as they trade.

## Implementation notes

- **Nothing appears from nothing.** `scale` starts at 0.7, not 0.
- **`initial={false}` on the `AnimatePresence`**, so the icon is simply present on first
  paint rather than animating in on every mount during hydration.
- **`perspective` only under `flip`.** A rotation about an axis in the plane of the screen
  is invisible without a vanishing point; the other three do not need one and should not
  pay for one.

## Accessibility

- **It carries `aria-hidden`.** It is decoration inside a control, and the control is what
  gets named. If the icon is the only thing in a button, name the button.
- **Reduced motion cuts to the end state.** Which icon is showing is the information;
  watching it arrive is not.
