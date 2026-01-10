Preview Card
A popup that appears when a link is hovered, showing a preview for sighted users.

The principles of good typography remain into the digital age.

index.tsx
tailwind
import * as React from 'react';
import { PreviewCard } from '@base-ui/react/preview-card';

export default function ExamplePreviewCard() {
  return (
    <PreviewCard.Root>
      <p className="max-w-64 text-base text-balance text-gray-900">
        The principles of good{' '}
        <PreviewCard.Trigger
          className="text-blue-800 no-underline decoration-blue-800/60 decoration-1 underline-offset-2 outline-none hover:underline focus-visible:rounded-sm focus-visible:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800 data-[popup-open]:underline data-[popup-open]:focus-visible:no-underline"
          href="https://en.wikipedia.org/wiki/Typography"
        >
          typography
        </PreviewCard.Trigger>{' '}
        remain into the digital age.
      </p>

      <PreviewCard.Portal>
        <PreviewCard.Positioner sideOffset={8}>
          <PreviewCard.Popup className="flex w-[240px] origin-[var(--transform-origin)] flex-col gap-2 rounded-lg bg-[canvas] p-2 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
            <PreviewCard.Arrow className="data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
              <ArrowSvg />
            </PreviewCard.Arrow>
            <img
              width="448"
              height="300"
              className="block w-full rounded-sm"
              src="https://images.unsplash.com/photo-1619615391095-dfa29e1672ef?q=80&w=448&h=300"
              alt="Station Hofplein signage in Rotterdam, Netherlands"
            />
            <p className="text-sm text-pretty text-gray-900">
              <strong>Typography</strong> is the art and science of arranging type to
              make written language clear, visually appealing, and effective in
              communication.
            </p>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}

function ArrowSvg(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-[canvas]"
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className="fill-gray-200 dark:fill-none"
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className="dark:fill-gray-300"
      />
    </svg>
  );
}
Anatomy
Import the component and assemble its parts:

Anatomy
import { PreviewCard } from '@base-ui/react/previewCard';
<PreviewCard.Root>
  <PreviewCard.Trigger />
  <PreviewCard.Portal>
    <PreviewCard.Backdrop />
    <PreviewCard.Positioner>
      <PreviewCard.Popup>
        <PreviewCard.Arrow />
      </PreviewCard.Popup>
    </PreviewCard.Positioner>
  </PreviewCard.Portal>
</PreviewCard.Root>
API reference
Root
Groups all parts of the preview card. Doesn’t render its own HTML element.

Prop
Type
Default
defaultOpen
boolean

false

open
boolean

undefined

onOpenChange
(open: boolean, event?: Event, reason?: PreviewCard.Root.OpenChangeReason) => void

undefined

actionsRef
RefObject<Actions>

undefined

onOpenChangeComplete
((open: boolean) => void)

undefined

delay
number

600

closeDelay
number

300

children
ReactNode

undefined

Trigger
A link that opens the preview card. Renders an <a> element.

Prop
Type
Default
className
| string
| ((state: PreviewCard.Trigger.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: PreviewCard.Trigger.State) => ReactElement)

undefined

Attribute
Description
data-popup-open
Present when the corresponding preview card is open.

Portal
A portal element that moves the popup to a different part of the DOM. By default, the portal element is appended to <body>.

Prop
Type
Default
container
| HTMLElement
| RefObject<HTMLElement
| null>
| null

undefined

children
ReactNode

undefined

keepMounted
boolean

false

Backdrop
An overlay displayed beneath the popup. Renders a <div> element.

Prop
Type
Default
className
| string
| ((state: PreviewCard.Backdrop.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: PreviewCard.Backdrop.State) => ReactElement)

undefined

Attribute
Description
data-open
Present when the preview card is open.

data-closed
Present when the preview card is closed.

data-starting-style
Present when the preview card is animating in.

data-ending-style
Present when the preview card is animating out.

Positioner
Positions the popup against the trigger. Renders a <div> element.

Prop
Type
Default
collisionAvoidance
CollisionAvoidance

undefined

align
'center' | 'start' | 'end'

'center'

alignOffset
number | OffsetFunction

0

side
Side

'bottom'

sideOffset
number | OffsetFunction

0

arrowPadding
number

5

anchor
| Element
| RefObject<Element
| null>
| VirtualElement
| (() => Element | VirtualElement | null)
| null

undefined

collisionBoundary
Boundary

'clipping-ancestors'

collisionPadding
Padding

5

sticky
boolean

false

positionMethod
'fixed' | 'absolute'

'absolute'

trackAnchor
boolean

true

className
| string
| ((state: PreviewCard.Positioner.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: PreviewCard.Positioner.State) => ReactElement)

undefined

Attribute
Description
data-open
Present when the preview card is open.

data-closed
Present when the preview card is closed.

data-anchor-hidden
Present when the anchor is hidden.

data-align
Indicates how the popup is aligned relative to specified side.

data-side
Indicates which side the popup is positioned relative to the trigger.

CSS Variable
Description
--anchor-height
The anchor's height.

--anchor-width
The anchor's width.

--available-height
The available height between the trigger and the edge of the viewport.

--available-width
The available width between the trigger and the edge of the viewport.

--transform-origin
The coordinates that this element is anchored to. Used for animations and transitions.

Popup
A container for the preview card contents. Renders a <div> element.

Prop
Type
Default
className
| string
| ((state: PreviewCard.Popup.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: PreviewCard.Popup.State) => ReactElement)

undefined

Attribute
Description
data-open
Present when the preview card is open.

data-closed
Present when the preview card is closed.

data-align
Indicates how the popup is aligned relative to specified side.

data-side
Indicates which side the popup is positioned relative to the trigger.

data-starting-style
Present when the preview card is animating in.

data-ending-style
Present when the preview card is animating out.

Arrow
Displays an element positioned against the preview card anchor. Renders a <div> element.

Prop
Type
Default
className
| string
| ((state: PreviewCard.Arrow.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: PreviewCard.Arrow.State) => ReactElement)

undefined

Attribute
Description
data-open
Present when the preview card is open.

data-closed
Present when the preview card is closed.

data-uncentered
Present when the preview card arrow is uncentered.

data-anchor-hidden
Present when the anchor is hidden.

data-align
Indicates how the popup is aligned relative to specified side.

data-side
Indicates which side the popup is positioned relative to the trigg