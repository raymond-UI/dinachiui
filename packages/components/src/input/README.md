# Input

A customizable input field component with multiple variants and sizes.

## Features

- ✅ Multiple variants (default, destructive, success)
- ✅ Multiple sizes (sm, default, lg)
- ✅ Full TypeScript support
- ✅ Forward ref support
- ✅ Accessible focus states
- ✅ File input styling
- ✅ Disabled state styling

## Usage

```tsx
import { Input } from "@dinachi/components"

// Basic usage
<Input placeholder="Enter your email" />

// With variants
<Input variant="destructive" placeholder="Error state" />
<Input variant="success" placeholder="Success state" />

// With sizes
<Input size="sm" placeholder="Small input" />
<Input size="lg" placeholder="Large input" />

// With types
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input type="file" />

// Controlled
const [value, setValue] = useState("")
<Input 
  value={value} 
  onChange={(e) => setValue(e.target.value)}
  placeholder="Controlled input"
/>
```

## Props

The Input component accepts all standard HTML input attributes plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default"` \| `"destructive"` \| `"success"` | `"default"` | Visual variant of the input |
| `size` | `"sm"` \| `"default"` \| `"lg"` | `"default"` | Size of the input |

## Styling

The component uses CSS variables for theming. Key design tokens:

- `--background` - Input background color
- `--border` - Default border color
- `--destructive` - Error state color
- `--ring` - Focus ring color
- `--muted-foreground` - Placeholder text color

## Accessibility

- Supports all standard input accessibility attributes
- Proper focus management with visible focus indicators
- Screen reader friendly
- Supports keyboard navigation
