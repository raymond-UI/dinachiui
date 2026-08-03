# Animated Tabs

Tabs whose active pill travels between triggers instead of cutting.

```tsx
import {
  AnimatedTabs,
  AnimatedTabsList,
  AnimatedTabsTrigger,
  AnimatedTabsContent,
} from "@dinachi/components"

<AnimatedTabs defaultValue="overview">
  <AnimatedTabsList>
    <AnimatedTabsTrigger value="overview">Overview</AnimatedTabsTrigger>
    <AnimatedTabsTrigger value="activity">Activity</AnimatedTabsTrigger>
  </AnimatedTabsList>
  <AnimatedTabsContent value="overview">Overview panel</AnimatedTabsContent>
  <AnimatedTabsContent value="activity">Activity panel</AnimatedTabsContent>
</AnimatedTabs>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## When to use it

For a small, stable set of tabs the user switches between by pointer: a settings pane, a
profile, a chart's time range. The travel carries the eye from the old selection to the
new one, which is the whole job.

Not for a tab strip that scrolls, and not for one with a dozen entries. The further the
pill has to go the more it reads as a delay, and a strip long enough to scroll will move
the pill somewhere off screen. Use the core `Tabs` there.

## Accessibility

- Built on Base UI's Tabs, so roving focus, arrow-key navigation, and `aria-controls`
  wiring come from the primitive rather than from this component.
- Arrow keys move focus; Enter or Space selects. Pass `activateOnFocus` to select on
  arrow instead.
- Keyboard-driven changes cut rather than travel. They repeat far more often than pointer
  changes, and animating them puts the pill between the keypress and the answer.
- A reduced-motion preference does the same: the pill is simply in its new position.
- The pill is `aria-hidden`, so a screen reader hears the selection state once, from
  `aria-selected`, and never as a stray element.

## Props

### AnimatedTabs

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `transition` | `Transition` | critically damped spring, 0.3s | Overrides the indicator spring. |

Any other Base UI `Tabs.Root` prop is forwarded, including `value`, `defaultValue`,
`onValueChange`, and `activateOnFocus`.

### AnimatedTabsTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `indicatorClassName` | `string` | — | Class applied to the travelling pill, so it can be themed without touching the tab. |

`AnimatedTabsList` and `AnimatedTabsContent` forward every Base UI prop of their
corresponding part.

## Implementation

The indicator is a single element carrying `layoutId`, mounted on the active trigger
alone. Motion measures both positions and interpolates between them, so there is no width
or offset arithmetic and the pill stays correct when every tab label is a different width.

The spring is critically damped. A click carries no momentum, so an overshoot on arrival
is motion the gesture never asked for.

Whether a change was keyboard-driven is decided from the event that caused it, and set in
the same batch as the value. The render that moves the pill is therefore already the one
that knows whether it should move at all — deciding a frame later would animate the first
keypress of every run.

Enter and Space on a focused tab reach Base UI as a synthesized click with no pointer type
and no click count, which is how they are told apart from a real one.
