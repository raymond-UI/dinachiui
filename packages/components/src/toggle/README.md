# Toggle

A two-state button that can be on or off.

## Installation

```bash
npx @dinachi/cli@latest add toggle
```

## Usage

```tsx
import { Toggle } from "@/components/ui/toggle"
```

```tsx
<Toggle aria-label="Toggle bold">
  Bold
</Toggle>
```

## API Reference

- **Toggle** -- A pressable button that toggles between on and off states. Extends Base UI `Toggle`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "outline"` | `"default"` | Visual style variant |
| `size` | `"default" \| "sm" \| "lg"` | `"default"` | Size of the toggle button |
| `pressed` | `boolean` | -- | Controlled pressed state |
| `defaultPressed` | `boolean` | `false` | Initial pressed state (uncontrolled) |
| `onPressedChange` | `(pressed: boolean, event: Event) => void` | -- | Callback when pressed state changes |
| `disabled` | `boolean` | `false` | Whether the toggle is disabled |

- **toggleVariants** -- The CVA variants definition, exported for custom styling or use with other elements.
