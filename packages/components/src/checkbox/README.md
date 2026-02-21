# Checkbox

A control that allows the user to select one or more options from a set.

## Installation

```bash
npx @dinachi/cli@latest add checkbox
```

## Usage

```tsx
import { Checkbox } from "@/components/ui/checkbox"
```

```tsx
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms">Accept terms and conditions</label>
</div>
```

## API Reference

- **Checkbox** -- A styled checkbox input. Extends `Checkbox.Root` from Base UI. Includes a built-in check icon indicator. Accepts `checked`, `defaultChecked`, `onCheckedChange`, and `disabled` props. Supports indeterminate state.
