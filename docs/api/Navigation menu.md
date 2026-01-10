Navigation Menu
A collection of links and menus for website navigation.

css-modules
import * as React from 'react';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import styles from './index.module.css';

export default function ExampleNavigationMenu() {
  return (
    <NavigationMenu.Root className={styles.Root}>
      <NavigationMenu.List className={styles.List}>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={styles.Trigger}>
            Overview
            <NavigationMenu.Icon className={styles.Icon}>
              <ChevronDownIcon />
            </NavigationMenu.Icon>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className={styles.Content}>
            <ul className={styles.GridLinkList}>
              {overviewLinks.map((item) => (
                <li key={item.href}>
                  <Link className={styles.LinkCard} href={item.href}>
                    <h3 className={styles.LinkTitle}>{item.title}</h3>
                    <p className={styles.LinkDescription}>{item.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={styles.Trigger}>
            Handbook
            <NavigationMenu.Icon className={styles.Icon}>
              <ChevronDownIcon />
            </NavigationMenu.Icon>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className={styles.Content}>
            <ul className={styles.FlexLinkList}>
              {handbookLinks.map((item) => (
                <li key={item.href}>
                  <Link className={styles.LinkCard} href={item.href}>
                    <h3 className={styles.LinkTitle}>{item.title}</h3>
                    <p className={styles.LinkDescription}>{item.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <Link className={styles.Trigger} href="https://github.com/mui/base-ui">
            GitHub
          </Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          className={styles.Positioner}
          sideOffset={10}
          collisionPadding={{ top: 5, bottom: 5, left: 20, right: 20 }}
        >
          <NavigationMenu.Popup className={styles.Popup}>
            <NavigationMenu.Arrow className={styles.Arrow}>
              <ArrowSvg />
            </NavigationMenu.Arrow>
            <NavigationMenu.Viewport className={styles.Viewport} />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}

function Link(props: NavigationMenu.Link.Props) {
  return (
    <NavigationMenu.Link
      render={
        // Use the `render` prop to render your framework's Link component
        // for client-side routing.
        // e.g. `<NextLink href={props.href} />` instead of `<a />`.
        <a />
      }
      {...props}
    />
  );
}

function ChevronDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
      <path d="M1 3.5L5 7.5L9 3.5" stroke="currentcolor" strokeWidth="1.5" />
    </svg>
  );
}

function ArrowSvg(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className={styles.ArrowFill}
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className={styles.ArrowOuterStroke}
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className={styles.ArrowInnerStroke}
      />
    </svg>
  );
}

const overviewLinks = [
  {
    href: '/react/overview/quick-start',
    title: 'Quick Start',
    description: 'Install and assemble your first component.',
  },
  {
    href: '/react/overview/accessibility',
    title: 'Accessibility',
    description: 'Learn how we build accessible components.',
  },
  {
    href: '/react/overview/releases',
    title: 'Releases',
    description: 'See what’s new in the latest Base UI versions.',
  },
  {
    href: '/react/overview/about',
    title: 'About',
    description: 'Learn more about Base UI and our mission.',
  },
] as const;

const handbookLinks = [
  {
    href: '/react/handbook/styling',
    title: 'Styling',
    description:
      'Base UI components can be styled with plain CSS, Tailwind CSS, CSS-in-JS, or CSS Modules.',
  },
  {
    href: '/react/handbook/animation',
    title: 'Animation',
    description:
      'Base UI components can be animated with CSS transitions, CSS animations, or JavaScript libraries.',
  },
  {
    href: '/react/handbook/composition',
    title: 'Composition',
    description:
      'Base UI components can be replaced and composed with your own existing components.',
  },
] as const;
Anatomy
Import the component and assemble its parts:

Anatomy
import { NavigationMenu } from '@base-ui/react/navigation-menu';
<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>
        <NavigationMenu.Icon />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link />
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
  <NavigationMenu.Portal>
    <NavigationMenu.Backdrop />
    <NavigationMenu.Positioner>
      <NavigationMenu.Popup>
        <NavigationMenu.Arrow />
        <NavigationMenu.Viewport />
      </NavigationMenu.Popup>
    </NavigationMenu.Positioner>
  </NavigationMenu.Portal>
</NavigationMenu.Root>
API reference
Root
Groups all parts of the navigation menu. Renders a <nav> element at the root, or <div> element when nested.

Prop
Type
Default
defaultValue
any

null

value
any

null

onValueChange
((value: any, event: Event | undefined, reason: BaseOpenChangeReason | undefined) => void)

undefined

actionsRef
RefObject<{ unmount: () => void; }>

undefined

onOpenChangeComplete
((open: boolean) => void)

undefined

delay
number

50

closeDelay
number

50

orientation
'horizontal' | 'vertical'

'horizontal'

className
| string
| ((state: NavigationMenu.Root.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: NavigationMenu.Root.State) => ReactElement)

undefined

List
Contains a list of navigation menu items. Renders a <div> element.

Prop
Type
Default
className
| string
| ((state: NavigationMenu.List.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: NavigationMenu.List.State) => ReactElement)

undefined

Item
An individual navigation menu item. Renders a <div> element.

Prop
Type
Default
value
any

undefined

className
| string
| ((state: NavigationMenu.Item.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: NavigationMenu.Item.State) => ReactElement)

undefined

Trigger
Opens the navigation menu popup when hovered or clicked, revealing the associated content. Renders a <button> element.

Prop
Type
Default
className
| string
| ((state: NavigationMenu.Trigger.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: NavigationMenu.Trigger.State) => ReactElement)

undefined

Attribute
Description
data-popup-open
Present when the corresponding navigation menu is open.

data-pressed
Present when the trigger is pressed.

Icon
An icon that indicates that the trigger button opens a menu.

Prop
Type
Default
className
| string
| ((state: NavigationMenu.Icon.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: NavigationMenu.Icon.State) => ReactElement)

undefined

Content
A container for the content of the navigation menu item that is moved into the popup when the item is active. Renders a <div> element.

Prop
Type
Default
className
| string
| ((state: NavigationMenu.Content.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: NavigationMenu.Content.State) => ReactElement)

undefined

Attribute
Description
data-open
Present when the popup is open.

data-closed
Present when the popup is closed.

data-activation-direction
Which direction another trigger was activated from.

data-starting-style
Present when the content is animating in.

data-ending-style
Present when the content is animating out.

Link
A link in the navigation menu that can be used to navigate to a different page or section. Renders an <a> element.

Prop
Type
Default
className
| string
| ((state: NavigationMenu.Link.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: NavigationMenu.Link.State) => ReactElement)

undefined

Backdrop
A backdrop for the navigation menu popup. Renders a <div> element.

Prop
Type
Default
className
| string
| ((state: NavigationMenu.Backdrop.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: NavigationMenu.Backdrop.State) => ReactElement)

undefined

Attribute
Description
data-open
Present when the popup is open.

data-closed
Present when the popup is closed.

data-starting-style
Present when the popup is animating in.

data-ending-style
Present when the popup is animating out.

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

Positioner
Positions the navigation menu against the currently active trigger. Renders a <div> element.

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
| ((state: NavigationMenu.Positioner.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: NavigationMenu.Positioner.State) => ReactElement)

undefined

Attribute
Description
data-open
Present when the popup is open.

data-closed
Present when the popup is closed.

data-anchor-hidden
Present when the anchor is hidden.

data-align
Indicates how the popup is aligned relative to the specified side.

data-instant
Present if animations should be instant.

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

--positioner-height
The fixed height of the positioner element.

--positioner-width
The fixed width of the positioner element.

--transform-origin
The coordinates that this element is anchored to. Used for animations and transitions.

Popup
A container for the navigation menu contents. Renders a <nav> element.

Prop
Type
Default
className
| string
| ((state: NavigationMenu.Popup.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: NavigationMenu.Popup.State) => ReactElement)

undefined

Attribute
Description
data-open
Present when the popup is open.

data-closed
Present when the popup is closed.

data-align
Indicates how the popup is aligned relative to the specified side.

data-side
Indicates which side the popup is positioned relative to the trigger.

data-starting-style
Present when the popup is animating in.

data-ending-style
Present when the popup is animating out.

CSS Variable
Description
--popup-height
The fixed height of the popup element.

--popup-width
The fixed width of the popup element.

Viewport
The clipping viewport of the navigation menu's current content. Renders a <div> element.

Prop
Type
Default
className
| string
| ((state: NavigationMenu.Viewport.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: NavigationMenu.Viewport.State) => ReactElement)

undefined

Arrow
Displays an element pointing toward the navigation menu's current anchor. Renders a <div> element.

Prop
Type
Default
className
| string
| ((state: NavigationMenu.Arrow.State) => string)

undefined

render
| ReactElement
| ((props: HTMLProps, state: NavigationMenu.Arrow.State) => ReactElement)

undefined

Attribute
Description
data-open
Present when the popup is open.

data-closed
Present when the popup is closed.

data-uncentered
Present when the popup arrow is uncentered.

data-align
Indicates how the popup is aligned relative to specified side.

data-side
Indicates which side the popup is positioned relative to the trigger.

Examples
Nested submenus
A NavigationMenu.Root component can be nested within a higher-level NavigationMenu.Content part to create a multi-level navigation menu.

Custom links
The NavigationMenu.Link part can be customized to render the link from your framework using the render prop to enable client-side routing.

Next.js example
import NextLink from 'next/link';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
function Link(props: NavigationMenu.Link.Props) {
  return (
    <NavigationMenu.Link
      render={<NextLink href={props.href} />}
      {...props}
    />
  );
}
Large menus
When you have large menu content that doesn’t fit in the viewport in some cases, you usually have two choices:

Compress the navigation menu content
You can change the layout of the navigation menu to render less content or be more compact by reducing the space it takes up. If your content is flexible, you can use the max-height property on Popup to limit the height of the navigation menu to let it compress itself while preventing overflow.

Compact layout
.Popup {
  max-height: var(--available-height);
}
Make the navigation menu scrollable
Scrollable layout
.Popup {
  max-height var(--available-height);
}
.Content {
  overflow-y: auto;
}
Native scrollbars will be visible while transitioning content, so we recommend using our Scroll Area component instead of native scrollbars to keep them hidden, which will also allow the Arrow to be centered correctly.