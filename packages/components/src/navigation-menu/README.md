# NavigationMenu

A collection of links and menus for website navigation, built on top of Base UI's NavigationMenu components.

## Installation

```bash
npx @dinachi/cli add navigation-menu
```

## Usage

```typescript
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
} from "@/components/navigation-menu"

export function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuPortal>
            <NavigationMenuPositioner>
              <NavigationMenuPopup>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <div className="row-span-3">
                      <NavigationMenuLink href="/">
                        <div className="mb-2 mt-4 text-lg font-medium">
                          shadcn/ui
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Beautifully designed components built with Radix UI and
                          Tailwind CSS.
                        </p>
                      </NavigationMenuLink>
                    </div>
                    <NavigationMenuLink href="/docs">
                      <div className="text-sm font-medium leading-none">Introduction</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Re-usable components built using Radix UI and Tailwind CSS.
                      </p>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuPopup>
            </NavigationMenuPositioner>
          </NavigationMenuPortal>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs">
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
```

## API Reference

### NavigationMenu

The root container for the navigation menu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |

### NavigationMenuList

Container for navigation menu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |

### NavigationMenuItem

An individual navigation menu item.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `any` | - | Unique value for the item |
| className | `string` | - | Additional CSS classes |

### NavigationMenuTrigger

Button that opens a navigation menu popup.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |

### NavigationMenuContent

Container for the content of a navigation menu item.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |

### NavigationMenuLink

A navigation link that can be used for direct navigation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| href | `string` | - | URL to navigate to |
| className | `string` | - | Additional CSS classes |

### NavigationMenuPortal

Portal for rendering popup content outside the normal DOM flow.

### NavigationMenuPositioner

Positions the navigation menu popup relative to the trigger.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |

### NavigationMenuPopup

Container for the popup content.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |

### NavigationMenuViewport

Viewport for the navigation menu content.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |

## Examples

### Basic Navigation

```typescript
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink href="/">Home</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/about">About</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/contact">Contact</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Navigation with Dropdowns

```typescript
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                <li className="row-span-3">
                  <NavigationMenuLink href="/products/featured">
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Featured Product
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Our most popular item this month.
                    </p>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="/products/category-1">
                    <div className="text-sm font-medium leading-none">Category 1</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Description for category 1 products.
                    </p>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="/products/category-2">
                    <div className="text-sm font-medium leading-none">Category 2</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Description for category 2 products.
                    </p>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuPopup>
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/services">Services</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Custom Link Component

```typescript
import Link from "next/link"

function CustomLink(props: React.ComponentProps<typeof NavigationMenuLink>) {
  return (
    <NavigationMenuLink
      render={<Link href={props.href || ""} />}
      {...props}
    />
  )
}

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <CustomLink href="/custom-route">
        Custom Navigation
      </CustomLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

## Accessibility

The NavigationMenu component is built with accessibility in mind:

- **Keyboard Navigation**: Supports arrow keys, Enter, and Escape
- **Screen Reader Support**: Proper ARIA attributes and announcements
- **Focus Management**: Logical focus flow through menu items
- **High Contrast**: Works with high contrast modes

### Keyboard Interactions

| Key | Action |
|-----|--------|
| `Tab` | Move focus to next focusable element |
| `Shift + Tab` | Move focus to previous focusable element |
| `Enter` | Activate the focused item |
| `Space` | Activate the focused item |
| `Arrow Down` | Move focus to next item in submenu |
| `Arrow Up` | Move focus to previous item in submenu |
| `Arrow Right` | Open submenu or move to next top-level item |
| `Arrow Left` | Close submenu or move to previous top-level item |
| `Escape` | Close submenu |

## Base UI Foundation

This component is built on top of `@base-ui-components/react/navigation-menu`. For more advanced usage and customization options, refer to the [Base UI NavigationMenu documentation](https://base-ui.mui.com/react/navigation-menu).

## Styling

The component uses Tailwind CSS classes and CSS custom properties for styling. You can customize the appearance by:

1. **Overriding CSS classes**: Pass custom `className` props
2. **CSS custom properties**: Use the available CSS variables
3. **Tailwind config**: Extend your Tailwind configuration

### CSS Custom Properties

The component exposes several CSS custom properties for advanced styling:

- `--transform-origin`: Transform origin for animations
- `--anchor-width`: Width of the anchor element
- `--anchor-height`: Height of the anchor element
- `--available-width`: Available width in viewport
- `--available-height`: Available height in viewport 