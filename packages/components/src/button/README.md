# Button

A customizable button component with multiple variants.

## Installation

```bash
npx @dinachi/cli@latest add button
```

## Usage

```tsx
import { Button, buttonVariants } from "@/components/ui/button"
```

```tsx
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

Use the `render` prop for element composition (e.g., rendering as a link):

```tsx
<Button render={<a href="/about" />}>About</Button>
```

## API Reference

**Button**

Extends `Button` from Base UI.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"default"` | Visual style of the button. |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | `"default"` | Controls the button size. |
| `render` | `React.ReactElement` | -- | Custom element to render (e.g., `<a href="..." />`). When provided, `nativeButton` defaults to `false`. |

**buttonVariants**

A standalone function for generating button class names outside the component. Useful for applying button styles to non-Button elements.
