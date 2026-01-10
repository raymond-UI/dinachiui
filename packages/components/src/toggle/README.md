# Toggle

A two-state button that can be toggled on or off.

## Installation

```bash
npx @dinachi/cli add toggle
```

## Usage

```typescript
import { Toggle } from "@/components/toggle"

export function Example() {
  return (
    <Toggle aria-label="Bold text">
      Bold
    </Toggle>
  )
}
```

## API Reference

### Toggle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `"default" \| "outline"` | `"default"` | The visual variant |
| size | `"sm" \| "default" \| "lg"` | `"default"` | The size variant |
| pressed | `boolean` | `undefined` | Controlled pressed state |
| defaultPressed | `boolean` | `false` | Default pressed state |
| onPressedChange | `(pressed: boolean, event: Event) => void` | `undefined` | Callback when pressed state changes |
| disabled | `boolean` | `false` | Whether the toggle is disabled |
| className | `string` | `undefined` | Additional CSS classes |

## Examples

### Basic Usage

```typescript
import { Toggle } from "@/components/toggle"

export function BasicExample() {
  return (
    <div className="flex gap-2">
      <Toggle variant="default" aria-label="Default toggle">
        Default
      </Toggle>
      <Toggle variant="outline" aria-label="Outline toggle">
        Outline
      </Toggle>
    </div>
  )
}
```

### Different Sizes

```typescript
import { Toggle } from "@/components/toggle"

export function SizeExample() {
  return (
    <div className="flex gap-2 items-center">
      <Toggle size="sm" aria-label="Small toggle">SM</Toggle>
      <Toggle size="default" aria-label="Default toggle">MD</Toggle>
      <Toggle size="lg" aria-label="Large toggle">LG</Toggle>
    </div>
  )
}
```

### Controlled State

```typescript
import { useState } from "react"
import { Toggle } from "@/components/toggle"

export function ControlledExample() {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div className="space-y-2">
      <Toggle
        pressed={isPressed}
        onPressedChange={setIsPressed}
        aria-label="Controlled toggle"
      >
        {isPressed ? "ON" : "OFF"}
      </Toggle>
      <p className="text-sm text-muted-foreground">
        State: {isPressed ? "Pressed" : "Not Pressed"}
      </p>
    </div>
  )
}
```

### With Icons

```typescript
import { Bold, Italic, Underline } from "lucide-react"
import { Toggle } from "@/components/toggle"

export function IconExample() {
  return (
    <div className="flex gap-1">
      <Toggle size="sm" variant="outline" aria-label="Bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" variant="outline" aria-label="Italic">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" variant="outline" aria-label="Underline">
        <Underline className="h-4 w-4" />
      </Toggle>
    </div>
  )
}
```

### Disabled States

```typescript
import { Toggle } from "@/components/toggle"

export function DisabledExample() {
  return (
    <div className="flex gap-2">
      <Toggle disabled aria-label="Disabled unpressed">
        Disabled
      </Toggle>
      <Toggle disabled defaultPressed aria-label="Disabled pressed">
        Disabled Pressed
      </Toggle>
    </div>
  )
}
```

### Settings Toggle

```typescript
import { useState } from "react"
import { Toggle } from "@/components/toggle"

export function SettingsExample() {
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <label htmlFor="notifications" className="text-sm font-medium">
          Enable Notifications
        </label>
        <p className="text-xs text-muted-foreground">
          Receive updates about important changes
        </p>
      </div>
      <Toggle
        id="notifications"
        pressed={notifications}
        onPressedChange={setNotifications}
        variant="outline"
        aria-label="Enable notifications"
      >
        {notifications ? "ON" : "OFF"}
      </Toggle>
    </div>
  )
}
```

## Styling

The Toggle component supports extensive styling through CSS classes and data attributes:

### Base UI Data Attributes

The component automatically applies Base UI data attributes for styling:

- `data-state="on|off"` - Current toggle state
- `data-pressed` - Present when the toggle is pressed
- `data-disabled` - Present when the toggle is disabled

### State-Specific Styling

```css
/* Pressed state */
.toggle[data-state="on"] {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

/* Disabled state */
.toggle[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}

/* Pressed + Disabled state */
.toggle[data-state="on"][data-disabled] {
  background-color: var(--accent-50);
}
```

### Custom Styling Example

```typescript
import { Toggle } from "@/components/toggle"

export function CustomStyledExample() {
  return (
    <Toggle 
      className="
        bg-gradient-to-r from-blue-500 to-purple-600 
        text-white border-0 shadow-lg
        data-[state=on]:from-purple-600 data-[state=on]:to-pink-600
        hover:shadow-xl transition-all
      "
      aria-label="Custom styled toggle"
    >
      Custom
    </Toggle>
  )
}
```

### Hover State Handling

The component includes sophisticated hover state handling:

- **Default variant**: Subtle muted background on hover
- **Outline variant**: Accent background and border on hover
- **Pressed state**: Reduced opacity on hover (`accent/90`)
- **Disabled state**: No hover effects

### Transition System

The component uses a comprehensive transition system:

```css
.toggle {
  transition: all 200ms ease-in-out;
}
```

This provides smooth transitions for:
- Background color changes
- Border color changes  
- Text color changes
- Opacity changes
- Transform effects

## Accessibility

The Toggle component provides comprehensive accessibility features:

### ARIA Support
- Uses `aria-pressed` to indicate the current state
- Supports `aria-label` and `aria-labelledby` for accessible naming
- Provides proper button semantics

### Keyboard Navigation
- **Space** and **Enter** keys toggle the state
- Focus management with visible focus indicators
- Tab navigation support

### Screen Reader Support
- Announces state changes ("pressed" or "not pressed")
- Works with all major screen readers
- Proper role and state information

### Best Practices

```typescript
// ✅ Good - Always provide accessible naming
<Toggle aria-label="Bold text formatting">
  <Bold />
</Toggle>

// ✅ Good - Use with visible labels
<Toggle id="notifications">
  Enable Notifications
</Toggle>

// ❌ Bad - No accessible name
<Toggle>
  <SomeIcon />
</Toggle>
```

## Performance

The Toggle component is optimized for performance:

- **Lightweight**: Minimal JavaScript footprint
- **CSS-first**: Uses CSS for all visual states
- **No animations by default**: Relies on CSS transitions
- **Tree-shakeable**: Only imports what you use

## Base UI Foundation

This component is built on top of `@base-ui/react/toggle`. For more advanced usage and customization options, refer to the [Base UI documentation](https://base-ui.com/react/components/toggle).
