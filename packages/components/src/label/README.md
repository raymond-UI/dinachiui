# Label

A styled label component for form fields.

## Installation

```bash
npx @dinachi/cli@latest add label
```

## Usage

```tsx
import { Label } from "@/components/ui/label"
```

```tsx
<Label htmlFor="email">Email</Label>
```

## API Reference

**Label**

A styled `<label>` element. Accepts all standard `label` props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `htmlFor` | `string` | -- | The `id` of the form element this label is associated with. |
| `className` | `string` | -- | Additional classes for custom styling. |
