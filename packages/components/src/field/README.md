# Field

A component for building accessible forms with custom styling and validation.

## Installation

```bash
npx @dinachi/cli@latest add field
```

## Usage

```tsx
import {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldValidity,
} from "@/components/ui/field"
```

```tsx
<Field>
  <FieldLabel>Email</FieldLabel>
  <FieldControl type="email" placeholder="you@example.com" required />
  <FieldDescription>We will never share your email.</FieldDescription>
  <FieldError match="valueMissing">Email is required.</FieldError>
  <FieldError match="typeMismatch">Please enter a valid email.</FieldError>
</Field>
```

## API Reference

- **Field** -- Styled wrapper around `Field.Root` from Base UI. Groups a label, control, description, and error together with automatic accessibility associations.
- **FieldLabel** -- Styled wrapper around `Field.Label`. Renders a `<label>` linked to the control. Shows destructive styling when invalid.
- **FieldControl** -- Styled wrapper around `Field.Control`. Renders an `<input>` with focus ring, placeholder, and validation styles.
- **FieldDescription** -- Styled wrapper around `Field.Description`. Helper text associated with the control via `aria-describedby`.
- **FieldError** -- Styled wrapper around `Field.Error`. Displays a validation error message. Use the `match` prop to target specific validity states (e.g., `"valueMissing"`, `"typeMismatch"`).
- **FieldValidity** -- Styled wrapper around `Field.Validity`. Provides render-prop access to the field's `ValidityState` for custom validation UI.
