# Popover

An anchored floating panel for contextual information and lightweight interactions.

## Installation

```bash
npx @dinachi/cli@latest add popover
```

## Usage

```tsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  PopoverPortal,
  PopoverBackdrop,
} from "@/components/ui/popover"
```

```tsx
<Popover>
  <PopoverTrigger>Open Popover</PopoverTrigger>
  <PopoverContent>
    <PopoverArrow />
    <PopoverTitle>Dimensions</PopoverTitle>
    <PopoverDescription>
      Set the dimensions for the layer.
    </PopoverDescription>
    <PopoverClose>Close</PopoverClose>
  </PopoverContent>
</Popover>
```

## API Reference

- **Popover** -- Root provider that manages open state. Direct re-export of `Popover.Root` from Base UI.
- **PopoverTrigger** -- The element that toggles the popover. Direct re-export of `Popover.Trigger`.
- **PopoverContent** -- The floating panel with built-in portal and positioner. Wraps `Popover.Popup`.

  | Prop | Type | Default | Description |
  |------|------|---------|-------------|
  | `side` | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` | Preferred side of the trigger |
  | `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment along the trigger edge |
  | `sideOffset` | `number` | `8` | Distance from the trigger in pixels |

- **PopoverArrow** -- A decorative arrow pointing toward the trigger. Wraps `Popover.Arrow`.
- **PopoverTitle** -- A styled title for the popover content. Wraps `Popover.Title`.
- **PopoverDescription** -- A styled description for the popover content. Wraps `Popover.Description`.
- **PopoverClose** -- A button that closes the popover. Direct re-export of `Popover.Close`.
- **PopoverPortal** -- Renders the popover into a portal. Direct re-export of `Popover.Portal`.
- **PopoverBackdrop** -- An optional overlay behind the popover. Wraps `Popover.Backdrop`.
