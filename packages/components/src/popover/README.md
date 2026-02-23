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
  PopoverPositioner,
  PopoverPopup,
  PopoverArrow,
  PopoverViewport,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  PopoverPortal,
  PopoverBackdrop,
  createPopoverHandle,
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

- **Popover** -- Root provider that manages open state. Direct re-export of `Popover.Root` from Base UI. Accepts `open`, `defaultOpen`, `onOpenChange`, `modal`, and `onOpenChangeComplete`.
- **PopoverTrigger** -- The element that toggles the popover. Direct re-export of `Popover.Trigger`. Accepts `openOnHover`, `delay`, `closeDelay`, `handle`, and `payload`.
- **PopoverContent** -- Convenience wrapper composing Portal + Positioner + Popup. Accepts `side`, `align`, `sideOffset`, `alignOffset`, `collisionBoundary`, `collisionPadding`, `sticky`, and `portal`.
- **PopoverPositioner** -- Positions the popup relative to the trigger. Wraps `Popover.Positioner`. For custom compositions outside PopoverContent.
- **PopoverPopup** -- The floating panel container with animations. Wraps `Popover.Popup`. For custom compositions outside PopoverContent.
- **PopoverArrow** -- A decorative arrow pointing toward the trigger. Wraps `Popover.Arrow`.
- **PopoverViewport** -- Enables animated content transitions between triggers. Wraps `Popover.Viewport`.
- **PopoverTitle** -- A styled title for the popover content. Wraps `Popover.Title`.
- **PopoverDescription** -- A styled description for the popover content. Wraps `Popover.Description`.
- **PopoverClose** -- A button that closes the popover. Direct re-export of `Popover.Close`.
- **PopoverPortal** -- Renders the popover into a portal. Direct re-export of `Popover.Portal`.
- **PopoverBackdrop** -- An optional overlay behind the popover. Wraps `Popover.Backdrop`.
- **createPopoverHandle** -- Creates a handle for detached trigger/root associations. Re-export of `Popover.createHandle`.
