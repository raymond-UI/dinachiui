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
  SelectLabel,
  SelectItem,
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
- **SelectContent** -- The dropdown panel with built-in portal, positioner, and scroll arrows. Wraps `Select.Popup`.

  | Prop | Type | Default | Description |
  |------|------|---------|-------------|
  | `position` | `"item-aligned" \| "popper"` | `"popper"` | Positioning strategy for the dropdown |
  | `sideOffset` | `number` | `4` | Distance from the trigger in pixels |

- **SelectLabel** -- A non-interactive label for a group of items. Wraps `Select.GroupLabel`.
- **SelectItem** -- A selectable option in the dropdown. Wraps `Select.Item`.

  | Prop | Type | Default | Description |
  |------|------|---------|-------------|
  | `inset` | `boolean` | -- | Adds left padding to align with items that have indicators |
  | `showIndicator` | `boolean` | `false` | Shows a check icon for the selected item |
  | `indicatorIcon` | `ReactNode` | Check icon | Custom icon for the selection indicator |
  | `indicatorPosition` | `"left" \| "right"` | `"left"` | Which side to place the indicator |

- **SelectSeparator** -- A visual divider between groups or items. Wraps `Select.Separator`.
