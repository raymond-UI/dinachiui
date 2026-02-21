# Badge

A small status indicator for highlighting information.

## Installation

```bash
npx @dinachi/cli@latest add badge
```

## Usage

```tsx
import { Badge, badgeVariants } from "@/components/ui/badge"
```

```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

## API Reference

**Badge**

The badge component. Uses Base UI's `useRender` for element composition via the `render` prop.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline" \| "success" \| "warning" \| "info"` | `"default"` | Visual style of the badge. |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | Controls the badge size. |
| `rounded` | `"default" \| "sm" \| "md" \| "lg" \| "none"` | `"default"` | Controls the border radius. |
| `render` | `React.ReactElement` | `<div />` | Custom element to render as the badge root. |
| `interactive` | `boolean` | `false` | Makes the badge clickable with pointer cursor and hover effects. |
| `icon` | `React.ReactNode` | -- | Icon displayed before the badge content. |
| `dismissible` | `boolean` | `false` | Shows a close button inside the badge. |
| `onDismiss` | `() => void` | -- | Callback fired when the close button is clicked. |

**badgeVariants**

A standalone function for generating badge class names outside the component. Useful for applying badge styles to other elements.
