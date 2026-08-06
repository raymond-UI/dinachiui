# Load Transition

The handover from skeleton to content.

```tsx
import { LoadTransition } from "@dinachi/components"

<LoadTransition loading={isLoading} skeleton={<Skeleton />}>
  <DeploymentSummary data={data} />
</LoadTransition>
```

Part of the opt-in motion tier. It pulls in `motion`; nothing in the core tier depends
on it.

## The jankiest moment in most apps

Almost nobody treats this as an animation, which is why: the skeleton is removed, the real
content is inserted at a different height, and everything below it jumps. The skeleton was
supposed to be preventing exactly that.

Three things fix it, and only two of them are motion.

**The container animates its own height across the swap**, so the page below settles instead
of snapping. Because that is motion's layout animation, the height change is applied as a
transform with a scale correction on the children rather than as a real height tween, so it
stays off the main thread.

**The skeleton leaves on a shorter clock than the content arrives on** — 120ms out against
260ms in. There is never a frame with both at full strength and never one with neither.

**A skeleton that appears and disappears inside 150ms is a flash**, and a flash is worse than
the wait it was hiding. That one is timing, not animation.

## Two thresholds, solving opposite problems

| Prop | Default | What it prevents |
| --- | --- | --- |
| `delay` | `180` | Nothing shows for the first 180ms. A request that returns in 120ms goes straight to content; a placeholder shown for two frames reads as a glitch, not as feedback. |
| `minimum` | `420` | Once shown, the skeleton stays. A placeholder that appears and vanishes immediately is the same flash arriving from the other direction. |

They are not motion, so reduced motion does not remove them.

`useSkeletonVisibility(loading, delay, minimum)` is exported on its own if you want the
same two thresholds somewhere this component does not fit.

## The radius is an inline style

`radius` is a number in px, applied inline, not a class. Motion can only counteract the
distortion its own scale introduces on a value it is animating, and a class is invisible to
it — as a class the corners visibly stretch during the resize.

## Behaviour

- **The swap is `mode="popLayout"`**, so the leaving skeleton is pulled out of flow
  immediately and the arriving content does not wait behind it.
- **Both children carry `layout`**, so the parent's scale is undone on them rather than
  squashing the rows inside.
- **Reduced motion drops the travel and the resize**, and keeps the crossfade. The handover
  is still a handover; it just does not move.
