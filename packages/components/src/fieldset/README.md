# Fieldset

A grouping container for related form controls with an accessible legend.

## Installation

```bash
npx @dinachi/cli@latest add fieldset
```

## Usage

```tsx
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset"
```

```tsx
<Fieldset>
  <FieldsetLegend>Shipping Address</FieldsetLegend>
  {/* Place Field components or other form controls here */}
</Fieldset>
```

## API Reference

- **Fieldset** -- Styled wrapper around `Fieldset.Root` from Base UI. Renders a `<fieldset>` element with border and spacing. Groups related form controls and can propagate a disabled state to all children.
- **FieldsetLegend** -- Styled wrapper around `Fieldset.Legend`. Renders a `<legend>` element that labels the fieldset group.
