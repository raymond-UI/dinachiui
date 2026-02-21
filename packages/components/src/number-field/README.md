# NumberField

A numeric input with increment, decrement, and optional scrubbing controls.

## Installation

```bash
npx @dinachi/cli@latest add number-field
```

## Usage

```tsx
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
} from "@/components/ui/number-field"
```

```tsx
<NumberField defaultValue={0}>
  <NumberFieldGroup>
    <NumberFieldDecrement />
    <NumberFieldInput />
    <NumberFieldIncrement />
  </NumberFieldGroup>
</NumberField>
```

## API Reference

- **NumberField** -- Root provider that manages the numeric value state. Direct re-export of `NumberField.Root` from Base UI. Accepts `defaultValue`, `value`, `onValueChange`, `min`, `max`, `step`, and `disabled`.
- **NumberFieldGroup** -- Visual container that groups the input with its increment/decrement buttons. Wraps `NumberField.Group`.
- **NumberFieldInput** -- The text input for typing numeric values. Wraps `NumberField.Input`.
- **NumberFieldIncrement** -- Button to increase the value by one step. Wraps `NumberField.Increment`. Renders a plus icon by default.
- **NumberFieldDecrement** -- Button to decrease the value by one step. Wraps `NumberField.Decrement`. Renders a minus icon by default.
- **NumberFieldScrubArea** -- An area where the user can click and drag horizontally to adjust the value. Wraps `NumberField.ScrubArea`.
- **NumberFieldScrubAreaCursor** -- A custom cursor displayed while scrubbing. Wraps `NumberField.ScrubAreaCursor`.
