# Select

A common form component for choosing a predefined value in a dropdown menu.

## Installation

```bash
npx @dinachi/cli@latest add select
```

## Usage

```tsx
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectBackdrop,
  SelectLabel,
  SelectItem,
  SelectItemIndicator,
  SelectArrow,
  SelectScrollUpArrow,
  SelectScrollDownArrow,
  SelectSeparator,
} from "@/components/ui/select"
```

```tsx
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

## API Reference

- **Select** -- Root provider that manages selection state. Direct re-export of `Select.Root` from Base UI.
- **SelectGroup** -- Groups related items under a label. Direct re-export of `Select.Group`.
- **SelectValue** -- Displays the currently selected value inside the trigger. Direct re-export of `Select.Value`.
- **SelectTrigger** -- The button that opens the dropdown. Wraps `Select.Trigger`. Includes a chevron icon.
- **SelectContent** -- The dropdown panel with built-in portal, positioner, list, and scroll arrows. Wraps `Select.Popup`.

  | Prop | Type | Default | Description |
  |------|------|---------|-------------|
  | `alignItemWithTrigger` | `boolean` | `false` | Overlaps trigger to align selected item text with trigger value |
  | `sideOffset` | `number` | `4` | Distance from the trigger in pixels |
  | `portal` | `boolean` | `true` | Whether to render in a portal. Set to `false` inside Dialog/Drawer |

- **SelectBackdrop** -- Overlay beneath the popup for modal selects. Wraps `Select.Backdrop`.
- **SelectLabel** -- A non-interactive label for a group of items. Wraps `Select.GroupLabel`.
- **SelectItem** -- A selectable option in the dropdown. Wraps `Select.Item`.

  | Prop | Type | Default | Description |
  |------|------|---------|-------------|
  | `showIndicator` | `boolean` | `false` | Shows a check icon for the selected item |

- **SelectItemIndicator** -- Standalone selection indicator for advanced composition. Wraps `Select.ItemIndicator`. Renders a check icon by default.
- **SelectArrow** -- Visual arrow pointing at the trigger. Wraps `Select.Arrow`.
- **SelectScrollUpArrow** -- Scroll-up indicator for long lists (mouse only). Wraps `Select.ScrollUpArrow`.
- **SelectScrollDownArrow** -- Scroll-down indicator for long lists (mouse only). Wraps `Select.ScrollDownArrow`.
- **SelectSeparator** -- A visual divider between groups or items. Wraps `Select.Separator`.
