# Toolbar

A container for grouping a set of buttons and controls.

## Installation

```bash
npx @dinachi/cli add toolbar
```

## Usage

```typescript
import { Toolbar } from "@/components/toolbar"

export function ToolbarExample() {
  return (
    <Toolbar.Root>
      <Toolbar.Group>
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Button>Italic</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group>
        <Toolbar.Button>Left</Toolbar.Button>
        <Toolbar.Button>Center</Toolbar.Button>
        <Toolbar.Button>Right</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Input placeholder="Search..." />
      <Toolbar.Link href="/help">Help</Toolbar.Link>
    </Toolbar.Root>
  )
}
```

## API Reference

### Toolbar.Root

The root container for the toolbar.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |
| orientation | `"horizontal" \| "vertical"` | `"horizontal"` | The orientation of the toolbar |
| loop | `boolean` | `true` | Whether to loop keyboard navigation |
| disabled | `boolean` | `false` | Whether the toolbar is disabled |

### Toolbar.Button

A button element within the toolbar.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |
| disabled | `boolean` | `false` | Whether the button is disabled |
| render | `ReactElement` | - | Custom render element |

### Toolbar.Link

A link element within the toolbar.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |
| href | `string` | - | The URL to link to |

### Toolbar.Group

Groups related toolbar items together.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |
| disabled | `boolean` | `false` | Whether the group is disabled |

### Toolbar.Separator

A visual separator between toolbar items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |
| orientation | `"horizontal" \| "vertical"` | `"vertical"` | The orientation of the separator |

### Toolbar.Input

An input element within the toolbar.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |
| disabled | `boolean` | `false` | Whether the input is disabled |
| placeholder | `string` | - | Placeholder text |

## Examples

### Basic Toolbar

```typescript
import { Toolbar } from "@/components/toolbar"

export function BasicToolbar() {
  return (
    <Toolbar.Root>
      <Toolbar.Button>Save</Toolbar.Button>
      <Toolbar.Button>Edit</Toolbar.Button>
      <Toolbar.Button>Delete</Toolbar.Button>
    </Toolbar.Root>
  )
}
```

### Text Editor Toolbar

```typescript
import { Toolbar } from "@/components/toolbar"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

export function TextEditorToolbar() {
  return (
    <Toolbar.Root>
      <Toolbar.Group aria-label="Text formatting">
        <Toolbar.Button aria-label="Bold">
          <Bold className="h-4 w-4" />
        </Toolbar.Button>
        <Toolbar.Button aria-label="Italic">
          <Italic className="h-4 w-4" />
        </Toolbar.Button>
        <Toolbar.Button aria-label="Underline">
          <Underline className="h-4 w-4" />
        </Toolbar.Button>
      </Toolbar.Group>
      
      <Toolbar.Separator />
      
      <Toolbar.Group aria-label="Text alignment">
        <Toolbar.Button aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </Toolbar.Button>
        <Toolbar.Button aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </Toolbar.Button>
        <Toolbar.Button aria-label="Align right">
          <AlignRight className="h-4 w-4" />
        </Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Root>
  )
}
```

### Toolbar with Input

```typescript
import { Toolbar } from "@/components/toolbar"
import { Search } from "lucide-react"

export function SearchToolbar() {
  return (
    <Toolbar.Root>
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        <Toolbar.Input 
          placeholder="Search documents..." 
          className="w-64"
        />
      </div>
      <Toolbar.Separator />
      <Toolbar.Button>Filter</Toolbar.Button>
      <Toolbar.Button>Sort</Toolbar.Button>
    </Toolbar.Root>
  )
}
```

### Vertical Toolbar

```typescript
import { Toolbar } from "@/components/toolbar"

export function VerticalToolbar() {
  return (
    <Toolbar.Root orientation="vertical" className="w-12 flex-col">
      <Toolbar.Button>A</Toolbar.Button>
      <Toolbar.Button>B</Toolbar.Button>
      <Toolbar.Separator orientation="horizontal" />
      <Toolbar.Button>C</Toolbar.Button>
      <Toolbar.Button>D</Toolbar.Button>
    </Toolbar.Root>
  )
}
```

## Accessibility

- Toolbars are navigable using arrow keys
- Supports tab navigation to enter/exit the toolbar
- Proper ARIA roles and labels are applied
- Screen reader accessible with proper announcements
- Keyboard shortcuts can be added via `aria-keyshortcuts`

### Accessibility Guidelines

- Use `aria-label` or `aria-labelledby` to provide accessible names for toolbar buttons
- Group related items using `Toolbar.Group` with appropriate `aria-label`
- Use inputs sparingly - place them at the end of horizontal toolbars
- Provide keyboard shortcuts where appropriate using `aria-keyshortcuts`

## Base UI Foundation

This component is built on top of `@base-ui-components/react/toolbar`. For more advanced usage and customization options, refer to the [Base UI Toolbar documentation](https://base-ui.mui.com/react/components/toolbar). 