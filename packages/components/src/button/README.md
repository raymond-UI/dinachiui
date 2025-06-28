# Button Component

A foundational button component built on Base UI with full accessibility support and customizable variants.

## Features

- **Accessible**: Built on Base UI's button component with full ARIA support
- **Variant System**: Multiple visual variants (default, destructive, outline, secondary, ghost, link)
- **Size Options**: Different sizes (default, sm, lg, icon)
- **Customizable**: Easy to customize with Tailwind CSS classes
- **TypeScript**: Full TypeScript support with proper types

## Installation

```bash
npx @dinachi/cli add button
```

## Usage

```tsx
import { Button } from '@dinachi/components'

export function Example() {
  return (
    <div className="flex gap-2">
      <Button>Default</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Visual variant of the button |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Size of the button |
| `asChild` | `boolean` | `false` | Change the component to the HTML tag or custom component of the only child |

Extends all standard HTML button attributes.

## Examples

### Variants

```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <Icon />
</Button>
```

### With Icons

```tsx
import { PlusIcon } from 'lucide-react'

<Button>
  <PlusIcon className="mr-2 h-4 w-4" />
  Add Item
</Button>
```

## Accessibility

The Button component includes:

- Proper `role="button"` semantics
- Keyboard navigation support (Enter and Space keys)
- Focus management and visual indicators
- Screen reader support
- Disabled state handling

## Customization

The component uses CSS variables for theming. You can customize the appearance by overriding these variables in your CSS:

```css
:root {
  --primary: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  /* ... more variables */
}
```