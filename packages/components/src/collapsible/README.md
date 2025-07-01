# Collapsible

A collapsible panel controlled by a button.

## Installation

```bash
npx @dinachi/cli add collapsible
```

## Usage

```typescript
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from "@/components/collapsible"

export function Example() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Show more details</CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="p-4">
          This content can be collapsed and expanded.
        </div>
      </CollapsiblePanel>
    </Collapsible>
  )
}
```

## API Reference

### Collapsible

Groups all parts of the collapsible. Renders a `<div>` element.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultOpen | boolean | false | Whether the collapsible is open by default. |
| open | boolean | undefined | Whether the collapsible is open. |
| onOpenChange | ((open: boolean) => void) | undefined | Callback when the collapsible open state changes. |
| disabled | boolean | false | Whether the collapsible is disabled. |

### CollapsibleTrigger

A button that opens and closes the collapsible panel. Renders a `<button>` element.

| Attribute | Description |
|-----------|-------------|
| data-panel-open | Present when the collapsible panel is open. |

### CollapsiblePanel

A panel with the collapsible contents. Renders a `<div>` element.

| Attribute | Description |
|-----------|-------------|
| data-open | Present when the collapsible panel is open. |
| data-closed | Present when the collapsible panel is closed. |
| data-starting-style | Present when the panel is animating in. |
| data-ending-style | Present when the panel is animating out. |

| CSS Variable | Description |
|--------------|-------------|
| --collapsible-panel-height | The collapsible panel's height. |
| --collapsible-panel-width | The collapsible panel's width. |

## Examples

### Basic Usage

```typescript
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from "@/components/collapsible"

export function BasicExample() {
  return (
    <Collapsible className="w-full border rounded-lg">
      <CollapsibleTrigger className="flex items-center gap-2 p-4">
        <span>Recovery Keys</span>
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="px-4 pb-4 space-y-2">
          <div>alien-bean-pasta</div>
          <div>wild-irish-burrito</div>
          <div>horse-battery-staple</div>
        </div>
      </CollapsiblePanel>
    </Collapsible>
  )
}
```

### Controlled State

```typescript
import { useState } from "react"
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from "@/components/collapsible"

export function ControlledExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger>
        {isOpen ? "Hide" : "Show"} Details
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="p-4">
          Content is {isOpen ? "visible" : "hidden"}
        </div>
      </CollapsiblePanel>
    </Collapsible>
  )
}
```

### With Icon

```typescript
import { ChevronDownIcon } from "lucide-react"
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from "@/components/collapsible"

export function WithIconExample() {
  return (
    <Collapsible>
      <CollapsibleTrigger className="group flex items-center gap-2">
        <ChevronDownIcon className="h-4 w-4 transition-transform group-data-[panel-open]:rotate-180" />
        <span>Advanced Settings</span>
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="p-4 space-y-2">
          <div>Setting 1</div>
          <div>Setting 2</div>
          <div>Setting 3</div>
        </div>
      </CollapsiblePanel>
    </Collapsible>
  )
}
```

## Accessibility

- Uses proper ARIA attributes for screen reader support
- Keyboard navigation with Enter and Space keys
- Focus management between trigger and panel
- Supports disabled state

## Base UI Foundation

This component is built on top of `@base-ui-components/react/collapsible`. For more advanced usage and customization options, refer to the [Base UI documentation](https://base-ui.mui.com/).
