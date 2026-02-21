# NavigationMenu

A collection of links and menus for website navigation.

## Installation

```bash
npx @dinachi/cli@latest add navigation-menu
```

## Usage

```tsx
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuPopup,
  NavigationMenuViewport,
  NavigationMenuIndicator,
} from "@/components/ui/navigation-menu"
```

```tsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup>
            <NavigationMenuContent>
              <NavigationMenuLink href="/docs">
                Documentation
              </NavigationMenuLink>
              <NavigationMenuLink href="/docs/installation">
                Installation
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuPopup>
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/about">About</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
  <NavigationMenuViewport />
</NavigationMenu>
```

## API Reference

- **NavigationMenu** -- Root container. Wraps `NavigationMenu.Root` from Base UI.
- **NavigationMenuList** -- Contains the top-level navigation items. Wraps `NavigationMenu.List`.
- **NavigationMenuItem** -- A single item in the navigation list. Wraps `NavigationMenu.Item`.
- **NavigationMenuTrigger** -- Button that toggles a dropdown content panel. Wraps `NavigationMenu.Trigger`. Includes a chevron icon.
- **NavigationMenuContent** -- The collapsible content shown when a trigger is activated. Wraps `NavigationMenu.Content`.
- **NavigationMenuLink** -- A styled navigation link. Wraps `NavigationMenu.Link`.
- **NavigationMenuPortal** -- Renders content into a portal. Wraps `NavigationMenu.Portal`.
- **NavigationMenuPositioner** -- Positions the popup relative to its trigger. Wraps `NavigationMenu.Positioner`.
- **NavigationMenuPopup** -- The popup container with enter/exit animations. Wraps `NavigationMenu.Popup`.
- **NavigationMenuViewport** -- A shared viewport area for displaying content panels with animations. Wraps `NavigationMenu.Viewport`.
- **NavigationMenuIndicator** -- A visual indicator (arrow) that tracks the active item. Renders a styled `div`.
