# Tabs

A component for toggling between related panels on the same page.

## Features

- **Accessible**: Built on Base UI with full keyboard navigation and ARIA support
- **Flexible**: Supports both controlled and uncontrolled modes
- **Responsive**: Works with different orientations (horizontal/vertical)
- **Customizable**: Fully styleable with Tailwind CSS classes
- **Animated**: Smooth transitions with optional visual indicator

## Installation

```bash
npx @dinachi/cli add tabs
```

## Usage

### Basic Example

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export function TabsExample() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p>Overview content goes here.</p>
      </TabsContent>
      <TabsContent value="projects">
        <p>Projects content goes here.</p>
      </TabsContent>
      <TabsContent value="account">
        <p>Account content goes here.</p>
      </TabsContent>
    </Tabs>
  )
}
```

### With Indicator

Add a visual indicator that shows the active tab:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsIndicator } from '@/components/ui/tabs'

export function TabsWithIndicator() {
  return (
    <Tabs defaultValue="tab1" className="w-full">
      <TabsList className="relative">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
      <TabsContent value="tab3">Content 3</TabsContent>
    </Tabs>
  )
}
```

**Note**: The TabsList must have `className="relative"` for the indicator to position correctly.

### Controlled Mode

Control the active tab from your component state:

```tsx
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export function ControlledTabs() {
  const [activeTab, setActiveTab] = useState('tab1')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
    </Tabs>
  )
}
```

### Vertical Orientation

Display tabs vertically:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export function VerticalTabs() {
  return (
    <Tabs defaultValue="general" orientation="vertical" className="flex gap-4">
      <TabsList className="flex-col h-fit">
        <TabsTrigger value="general" className="w-full justify-start">
          General
        </TabsTrigger>
        <TabsTrigger value="security" className="w-full justify-start">
          Security
        </TabsTrigger>
        <TabsTrigger value="billing" className="w-full justify-start">
          Billing
        </TabsTrigger>
      </TabsList>
      <div className="flex-1">
        <TabsContent value="general">General settings content</TabsContent>
        <TabsContent value="security">Security settings content</TabsContent>
        <TabsContent value="billing">Billing settings content</TabsContent>
      </div>
    </Tabs>
  )
}
```

### Disabled Tabs

Disable specific tabs:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export function TabsWithDisabled() {
  return (
    <Tabs defaultValue="available">
      <TabsList>
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="another">Another</TabsTrigger>
      </TabsList>
      <TabsContent value="available">Available content</TabsContent>
      <TabsContent value="disabled">This content won't be shown</TabsContent>
      <TabsContent value="another">Another content</TabsContent>
    </Tabs>
  )
}
```

## API Reference

### Tabs

The root tabs component.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | `undefined` | The value of the tab that should be active when initially rendered |
| `value` | `string` | `undefined` | The controlled value of the tab to activate |
| `onValueChange` | `(value: string) => void` | `undefined` | Event handler called when the value changes |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The orientation of the tabs |
| `className` | `string` | `undefined` | Additional CSS classes |

### TabsList

Container for the tab triggers.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activateOnFocus` | `boolean` | `true` | Whether to automatically activate tab on focus |
| `loop` | `boolean` | `true` | Whether keyboard navigation should loop |
| `className` | `string` | `undefined` | Additional CSS classes |

### TabsTrigger

A tab trigger button.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The value for the tab |
| `disabled` | `boolean` | `false` | Whether the tab is disabled |
| `className` | `string` | `undefined` | Additional CSS classes |

### TabsContent

The content panel for a tab.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The value for the tab content |
| `keepMounted` | `boolean` | `false` | Whether to keep the content mounted when inactive |
| `className` | `string` | `undefined` | Additional CSS classes |

### TabsIndicator

Visual indicator for the active tab (optional).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `renderBeforeHydration` | `boolean` | `false` | Whether to render before hydration |
| `className` | `string` | `undefined` | Additional CSS classes |

## Accessibility

- Supports arrow key navigation between tabs
- Home and End keys jump to first/last tab
- Space and Enter keys activate tabs
- Properly implements ARIA attributes and roles
- Tab panels are focusable for screen reader users

## Styling

The component uses CSS custom properties for the indicator position and size. You can customize the appearance by overriding these variables or modifying the Tailwind classes.

### CSS Variables

- `--active-tab-width`: Width of the active tab
- `--active-tab-height`: Height of the active tab  
- `--active-tab-left`: Left position of the active tab
- `--active-tab-top`: Top position of the active tab

## Examples

See the [demo page](../../../src/TabsDemo.tsx) for more comprehensive examples. 