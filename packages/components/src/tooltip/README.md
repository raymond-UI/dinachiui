# Tooltip

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## Installation

```bash
npx @dinachi/cli@latest add tooltip
```

## Usage

```tsx
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
```

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>This is a tooltip.</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## API Reference

- **TooltipProvider** -- Provides shared delay configuration for multiple tooltips. Wraps Base UI `Tooltip.Provider`. Accepts `delay`, `closeDelay`, and `timeout` props.

- **Tooltip** -- The root component that manages open/close state for a single tooltip. Wraps Base UI `Tooltip.Root`. Accepts `defaultOpen`, `open`, and `onOpenChange` props.

- **TooltipTrigger** -- The element that activates the tooltip on hover or focus. Extends Base UI `Tooltip.Trigger`. Supports the `render` prop for element composition (e.g., `<TooltipTrigger render={<a href="..." />}>`).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "ghost" \| "outline" \| "icon"` | `"ghost"` | Visual style of the trigger button |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | `"default"` | Size of the trigger button |

- **TooltipContent** -- A convenience wrapper that combines Portal, Positioner, Popup, and Arrow into a single component. This is the recommended way to render tooltip content.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "inverse"` | `"default"` | Visual style of the tooltip popup |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | Preferred side for positioning |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment along the side |
| `sideOffset` | `number` | `4` | Distance from the trigger in pixels |
| `showArrow` | `boolean` | `true` | Whether to render the arrow indicator |

- **TooltipPortal** -- Renders tooltip content into a portal. Wraps Base UI `Tooltip.Portal`.

- **TooltipPositioner** -- Handles positioning logic. Extends Base UI `Tooltip.Positioner`. Use for custom layouts instead of `TooltipContent`.

- **TooltipPopup** -- The visible tooltip container. Extends Base UI `Tooltip.Popup`. Accepts a `variant` prop (`"default"` | `"inverse"`).

- **TooltipArrow** -- The arrow indicator pointing toward the trigger. Extends Base UI `Tooltip.Arrow`. Accepts a `variant` prop (`"default"` | `"inverse"`).

- **TooltipArrowSvg** -- The SVG element used by `TooltipArrow`, exported for custom arrow rendering.
