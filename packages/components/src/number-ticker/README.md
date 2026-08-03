# Number Ticker

A number that animates to its value.

```tsx
import { NumberTicker } from "@dinachi/components"

<NumberTicker value={12_480} />
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## Variants

| Variant | Behaviour | Use it when |
| --- | --- | --- |
| `odometer` *(default)* | Digit columns roll like a mechanical counter, each settling a beat after the one to its left. | A figure should feel counted rather than printed. |
| `counter` | The value is interpolated and reformatted every frame. | The numbers in between matter, or the format is too complex to split into columns. |
| `flip` | A split-flap board. Columns turn towards you when the value rises, away when it falls. | Departure boards, scoreboards. |

## When not to animate

The roll marks an arrival. A value that updates on a timer has already been read and
only needs to be correct. Pass `live` and nothing moves:

```tsx
<NumberTicker value={cartTotal} live />
```

As a rule: if the number changes more than once every few seconds, use `live`.

## Accessibility

- All three variants announce only the final formatted value. The moving parts are
  `aria-hidden`.
- A reduced-motion preference renders the plain value. Movement is the whole effect, so
  there is nothing gentler to fall back to.
- Both the OS setting and `<MotionConfig reducedMotion="always">` are honoured.
- Under `<MotionConfig isStatic>` the ticker renders the real value, not `from`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | — | The value to count to. |
| `variant` | `"odometer" \| "counter" \| "flip"` | `"odometer"` | Which effect to run. |
| `from` | `number` | `0` | The value each column starts from. |
| `decimals` | `number` | `0` | Decimal places to render. |
| `locale` | `string` | user's locale | Passed to `Intl.NumberFormat`. |
| `format` | `Intl.NumberFormatOptions` | — | Extra formatting options, e.g. `{ style: "currency", currency: "USD" }`. |
| `live` | `boolean` | `false` | Render instantly with no roll. |
| `stagger` | `number` | `0.03` | Seconds added per column, left to right. Keep it in the 0.03–0.08 range. Ignored by `counter`. |
| `duration` | `number` | `0.4` | Seconds for a column to settle. |
| `bounce` | `number` | `0` | Spring overshoot, 0–1. Off by default: no gesture precedes this motion, so an overshoot reads as the figure being briefly wrong. |
| `startOnView` | `boolean` | `true` | Count when scrolled into view rather than on mount. |
| `once` | `boolean` | `true` | Only arm the reveal on first entry. Later changes to `value` still animate; `live` is what stops that. |

Any other `span` prop is forwarded to the root element.

## Implementation

Each column's spring runs in unwrapped digit space rather than on the bare 0-9 glyph.
The ones column of `1,199` sits at `1199` and of `1,200` at `1200`, so a carry is one
step forward instead of nine steps back.

Columns are keyed by place value, so they keep their identity when the number gains or
loses digits.
