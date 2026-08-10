# Expandable Card

A card that opens into its own detail view, and travels there rather than being replaced.

```tsx
import {
  ExpandableCard,
  ExpandableCardTrigger,
  ExpandableCardPanel,
  ExpandableCardShared,
  ExpandableCardBody,
} from "@dinachi/components"

<ExpandableCard>
  <ExpandableCardTrigger>
    <ExpandableCardShared part="art" className="h-32 bg-muted" />
    <ExpandableCardShared part="title" className="p-4 font-medium">
      Shared layout
    </ExpandableCardShared>
  </ExpandableCardTrigger>

  <ExpandableCardPanel title="Shared layout">
    <ExpandableCardShared part="art" className="h-48 bg-muted" />
    <ExpandableCardShared part="title" className="px-5 pt-4 text-lg font-medium">
      Shared layout
    </ExpandableCardShared>
    <ExpandableCardBody className="px-5 pb-5">
      Content that only exists in the panel.
    </ExpandableCardBody>
  </ExpandableCardPanel>
</ExpandableCard>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## What the motion is for

Two elements sharing a `layoutId` are one object to the layout engine. The card does not
fade out while a dialog fades in — it travels, and the reader never loses track of what
they are looking at. That is the one thing here a cut cannot do.

It is also the easiest effect in the tier to overuse. On a grid of forty cards it turns a
glance into a wait. It earns its place on a hero item, or on a list short enough that
opening one is a decision rather than a habit.

## The parts

| Part | Role |
| --- | --- |
| `ExpandableCard` | Owns the open state and scopes the shared ids to this card. |
| `ExpandableCardTrigger` | The card. It is the thing that travels, so it is a button. |
| `ExpandableCardPanel` | The opened card. Mounted only while open. Needs a `title`. |
| `ExpandableCardShared` | An element that exists on both sides. Pair by `part`. |
| `ExpandableCardBody` | Panel-only content. Arrives after the travel. |

Use the same `part` once on each side. A `part` used twice on one side has two elements
claiming to be the same object, and the layout engine picks one.

Anything that exists on only one side belongs in `ExpandableCardBody`, which fades in after
the card lands rather than trying to share a transition it has no counterpart for.

## Controlled or not

`defaultOpen` for uncontrolled, `open` + `onOpenChange` when the state lives with you.

## `aria-modal` is a promise

The panel is a real modal, which is a larger commitment than it looks. A dialog that claims
`aria-modal` and does not honour it is worse than one that never claimed to be modal, so the
whole set is here:

- Escape closes.
- Focus moves into the panel on open and returns to the card on close.
- Tab cycles inside the panel, in both directions.
- The card is `inert` while open — not merely covered.
- The page underneath cannot scroll, and the scroll lock compensates for the scrollbar it
  removes. Otherwise the layout shifts sideways at the exact moment the card is mid-flight.

## Behaviour

- **The travel is a spring at 420ms**, longer than the tier's 300ms rule. That rule is about
  elements moving a short distance; this one crosses most of the viewport, and landing it
  too fast reads as a cut.
- **The backdrop is a plain fade.** It is the only part of the transition that is not the
  card, so it should not compete.
- **Reduced motion cuts.** The relationship is carried by the layout, not by the travel.
