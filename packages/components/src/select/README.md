# Select

A customizable and accessible select/dropdown component for React applications. Built on top of `@base-ui/react/select` with enhanced features and styling.

## Features

- 🎨 Fully customizable with Tailwind CSS
- ♿ Accessible by default (WAI-ARIA compliant)
- 📱 Responsive design
- 🎯 Custom indicators and separators
- 📜 Scrollable content with scroll indicators
- 🛠️ TypeScript support

## Installation

```bash
npx @dinachi/cli add select
```

## Components

- `Select` - Root component
- `SelectGroup` - Groups related options
- `SelectValue` - Displays the selected value
- `SelectTrigger` - The button that toggles the dropdown
- `SelectContent` - The dropdown content container
- `SelectLabel` - Label for a group of options
- `SelectItem` - Individual selectable option
- `SelectSeparator` - Visual separator between items
- `SelectScrollUpArrow` - Scroll up indicator
- `SelectScrollDownArrow` - Scroll down indicator

## Basic Usage

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dinachi/components"

export function BasicSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## Examples

### With Groups and Labels

```tsx
<Select>
  <SelectTrigger className="w-[280px]">
    <SelectValue placeholder="Select a time" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>North America</SelectLabel>
      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
      <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
      <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
      <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Europe & Africa</SelectLabel>
      <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
      <SelectItem value="cet">Central European Time (CET)</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### With Custom Indicators

```tsx
<Select>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select a status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem 
      value="success" 
      showIndicator 
      indicatorIcon={<CheckCircle className="h-4 w-4 text-green-500" />}
    >
      Success
    </SelectItem>
    <SelectItem 
      value="warning" 
      showIndicator 
      indicatorIcon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
      indicatorPosition="right"
    >
      Warning
    </SelectItem>
    <SelectItem 
      value="error" 
      showIndicator 
      indicatorIcon={<XCircle className="h-4 w-4 text-red-500" />}
    >
      Error
    </SelectItem>
  </SelectContent>
</Select>
```

## Props

### SelectItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The value of the select item |
| `disabled` | `boolean` | `false` | Whether the item is disabled |
| `inset` | `boolean` | `false` | Adds padding to the left of the item |
| `showIndicator` | `boolean` | `false` | Shows a checkmark indicator when selected |
| `indicatorIcon` | `ReactNode` | `<Check />` | Custom indicator icon |
| `indicatorPosition` | `'left' | 'right'` | `'left'` | Position of the indicator |

### SelectTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge the trigger with another element |
| `className` | `string` | - | Additional class names |

### SelectContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'item-aligned' | 'popper'` | `'popper'` | Positioning behavior |
| `sideOffset` | `number` | `4` | Offset from the trigger |
| `className` | `string` | - | Additional class names |

## Styling

You can customize the appearance using Tailwind CSS classes. Here are some common customizations:

```tsx
<Select>
  <SelectTrigger className="w-full max-w-xs border-2 border-dashed">
    <SelectValue placeholder="Custom styled trigger" />
  </SelectTrigger>
  <SelectContent className="bg-gray-900 text-white border-gray-700">
    <SelectItem className="hover:bg-gray-800" value="light">Light</SelectItem>
    <SelectItem className="hover:bg-gray-800" value="dark">Dark</SelectItem>
    <SelectItem className="hover:bg-gray-800" value="system">System</SelectItem>
  </SelectContent>
</Select>
```

## Accessibility

The Select component follows WAI-ARIA design patterns for comboboxes. It includes:

- Keyboard navigation
- Screen reader support
- Proper ARIA attributes
- Focus management
- Escape key to close

## Advanced Usage

For more advanced use cases, you can access the underlying Base UI components:

```tsx
import { Select as BaseSelect } from "@base-ui/react/select"
```

Refer to the [Base UI documentation](https://base-ui.mui.com/) for complete API reference.
