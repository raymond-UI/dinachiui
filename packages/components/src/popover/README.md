# Popover

An accessible popup anchored to a button. A high-quality, unstyled React popover component that displays content in a floating panel.

## Features

- 🎨 Fully customizable with Tailwind CSS
- ♿ Accessible by default (WAI-ARIA compliant)
- 📱 Responsive positioning with collision detection
- 🎯 Customizable arrow indicator
- 🖱️ Optional hover trigger
- 🎭 Smooth animations and transitions
- 🛠️ TypeScript support
- 🎨 Modal and non-modal modes

## Installation

```bash
npx @dinachi/cli add popover
```

## Components

- `Popover` - Root component
- `PopoverTrigger` - The button that toggles the popover
- `PopoverContent` - The popover content container
- `PopoverArrow` - Optional arrow pointing to the trigger
- `PopoverTitle` - Title/heading for the popover
- `PopoverDescription` - Description text for the popover
- `PopoverClose` - Button to close the popover
- `PopoverPortal` - Portal for rendering outside the DOM hierarchy
- `PopoverBackdrop` - Optional backdrop overlay

## Basic Usage

```tsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverTitle,
  PopoverDescription,
} from "@dinachi/components"
import { Bell } from "lucide-react"

export function BasicPopover() {
  return (
    <Popover>
      <PopoverTrigger className="rounded-md border bg-background px-4 py-2 hover:bg-accent">
        <Bell className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverTitle>Notifications</PopoverTitle>
        <PopoverDescription>
          You are all caught up. Good job!
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  )
}
```

## Examples

### With Custom Positioning

```tsx
<Popover>
  <PopoverTrigger>Open Popover</PopoverTrigger>
  <PopoverContent side="top" align="end" sideOffset={12}>
    <PopoverArrow />
    <PopoverTitle>Custom Position</PopoverTitle>
    <PopoverDescription>
      This popover opens at the top-end position.
    </PopoverDescription>
  </PopoverContent>
</Popover>
```

### With Close Button

```tsx
import { PopoverClose } from "@dinachi/components"
import { X } from "lucide-react"

<Popover>
  <PopoverTrigger>Settings</PopoverTrigger>
  <PopoverContent>
    <div className="flex items-start justify-between">
      <PopoverTitle>Settings</PopoverTitle>
      <PopoverClose className="rounded-sm opacity-70 hover:opacity-100">
        <X className="h-4 w-4" />
      </PopoverClose>
    </div>
    <PopoverDescription>
      Configure your application settings.
    </PopoverDescription>
  </PopoverContent>
</Popover>
```

### With Modal Backdrop

```tsx
<Popover modal>
  <PopoverTrigger>Open Modal Popover</PopoverTrigger>
  <PopoverContent>
    <PopoverBackdrop />
    <PopoverArrow />
    <PopoverTitle>Important Notice</PopoverTitle>
    <PopoverDescription>
      This popover has a backdrop and traps focus.
    </PopoverDescription>
  </PopoverContent>
</Popover>
```

### Hover Trigger

```tsx
<Popover openOnHover delay={200} closeDelay={100}>
  <PopoverTrigger>Hover me</PopoverTrigger>
  <PopoverContent>
    <PopoverArrow />
    <PopoverTitle>Hover Tooltip</PopoverTitle>
    <PopoverDescription>
      This opens when you hover over the trigger.
    </PopoverDescription>
  </PopoverContent>
</Popover>
```

### Controlled Popover

```tsx
import { useState } from "react"

export function ControlledPopover() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>Toggle Popover</PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverTitle>Controlled</PopoverTitle>
        <PopoverDescription>
          This popover's state is controlled externally.
        </PopoverDescription>
        <button onClick={() => setOpen(false)}>Close</button>
      </PopoverContent>
    </Popover>
  )
}
```

## Props

### Popover (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Whether the popover is initially open |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `modal` | `boolean \| 'trap-focus'` | `false` | Whether to enter modal mode |
| `openOnHover` | `boolean` | `false` | Open popover on hover |
| `delay` | `number` | `300` | Hover delay in milliseconds |
| `closeDelay` | `number` | `0` | Close delay in milliseconds |

### PopoverTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge with child element |
| `className` | `string` | - | Additional class names |

### PopoverContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Preferred side |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment relative to trigger |
| `sideOffset` | `number` | `8` | Distance from trigger in pixels |
| `initialFocus` | `boolean \| RefObject` | - | Element to focus on open |
| `finalFocus` | `boolean \| RefObject` | - | Element to focus on close |
| `className` | `string` | - | Additional class names |

### PopoverArrow

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional class names |
| `children` | `ReactNode` | Default SVG | Custom arrow element |

### PopoverTitle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional class names |

### PopoverDescription

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional class names |

### PopoverClose

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge with child element |
| `className` | `string` | - | Additional class names |

## Styling

You can customize the appearance using Tailwind CSS classes:

```tsx
<Popover>
  <PopoverTrigger className="rounded-full bg-primary px-6 py-3 text-primary-foreground">
    Custom Button
  </PopoverTrigger>
  <PopoverContent className="w-80 border-2 border-primary bg-gradient-to-br from-background to-accent">
    <PopoverArrow className="fill-primary" />
    <PopoverTitle className="text-xl text-primary">Custom Styled</PopoverTitle>
    <PopoverDescription className="text-muted-foreground">
      Fully customizable with Tailwind CSS.
    </PopoverDescription>
  </PopoverContent>
</Popover>
```

## Accessibility

The Popover component follows WAI-ARIA design patterns:

- Keyboard navigation (Enter/Space to open, Escape to close)
- Screen reader support with proper ARIA attributes
- Focus management and trap
- Proper role and aria-labelledby/aria-describedby relationships
- Modal mode with backdrop and focus trap

## Advanced Usage

### Custom Arrow

```tsx
<Popover>
  <PopoverTrigger>Custom Arrow</PopoverTrigger>
  <PopoverContent>
    <PopoverArrow>
      <div className="h-4 w-4 rotate-45 bg-primary" />
    </PopoverArrow>
    <PopoverTitle>Custom Arrow</PopoverTitle>
  </PopoverContent>
</Popover>
```

### Without Portal

```tsx
<div className="relative">
  <Popover>
    <PopoverTrigger>Open</PopoverTrigger>
    <PopoverContent>
      {/* Content renders in place without portal */}
    </PopoverContent>
  </Popover>
</div>
```

For more advanced use cases, you can access the underlying Base UI components:

```tsx
import { Popover as BasePopover } from "@base-ui-components/react/popover"
```

Refer to the [Base UI documentation](https://base-ui.mui.com/) for complete API reference.

