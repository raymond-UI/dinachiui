# Tooltip

A popup that appears when an element is hovered or focused, showing a hint for sighted users. Built on top of Base UI's Tooltip component.

## Installation

```bash
npx @dinachi/cli add tooltip
```

## Usage

```typescript
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/tooltip"

export function Example() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button>Hover me</button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is a tooltip!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

## API Reference

### TooltipProvider

Provides a shared delay for multiple tooltips.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `delay` | `number` | `undefined` | Delay in milliseconds before showing |
| `closeDelay` | `number` | `undefined` | Delay in milliseconds before hiding |
| `timeout` | `number` | `400` | Timeout for the provider |

### Tooltip

The root component that manages the tooltip state.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Whether the tooltip is open by default |
| `open` | `boolean` | `undefined` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback when open state changes |

### TooltipTrigger

An element to attach the tooltip to. Renders a `<button>` element.

### TooltipContent

A convenient wrapper that includes Portal, Positioner, Popup, and Arrow components.

## Base UI Foundation

This component is built on top of `@base-ui/react/tooltip`. For more advanced usage and customization options, refer to the [Base UI Tooltip documentation](https://base-ui.mui.com/react/tooltip).
