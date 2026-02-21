# Form

A native form element with consolidated error handling, built on Base UI foundation.

## Installation

```bash
npx @dinachi/cli@latest add form
```

## Usage

```tsx
import { Form } from "@/components/ui/form"
```

```tsx
const [errors, setErrors] = React.useState({})

async function handleSubmit(event: React.FormEvent) {
  event.preventDefault()
  const result = await submitForm()
  if (!result.ok) {
    setErrors(result.errors)
  }
}

<Form errors={errors} onSubmit={handleSubmit}>
  {/* Place Field components here */}
</Form>
```

## API Reference

- **Form** -- Styled wrapper around `Form` from Base UI. Renders a `<form>` element with `space-y-4` spacing. Supports Base UI's `render` prop pattern for custom rendering.

| Prop | Type | Default | Description |
|---|---|---|---|
| `errors` | `Record<string, string \| string[]>` | `{}` | Object mapping field names to error messages. Errors are automatically cleared when the field value changes. |
| `onSubmit` | `React.FormEventHandler<HTMLFormElement>` | -- | Form submission handler. |
| `render` | `RenderProp<FormState>` | -- | Custom render function or element for advanced use cases. |

### Types

```tsx
type Errors = Record<string, string | string[]>

interface FormState extends Record<string, unknown> {
  errors: Errors
}
```
