# Radio

A radio input and group for selecting a single option from a set.

## Installation

```bash
npx @dinachi/cli@latest add radio
```

## Usage

```tsx
import { Radio, RadioGroup, RadioIndicator } from "@/components/ui/radio"
```

```tsx
<RadioGroup defaultValue="comfortable">
  <label className="flex items-center gap-2">
    <Radio value="default" />
    <span className="text-sm font-medium">Default</span>
  </label>
  <label className="flex items-center gap-2">
    <Radio value="comfortable" />
    <span className="text-sm font-medium">Comfortable</span>
  </label>
  <label className="flex items-center gap-2">
    <Radio value="compact" />
    <span className="text-sm font-medium">Compact</span>
  </label>
</RadioGroup>
```

## API Reference

- **RadioGroup** -- Groups radio inputs so only one can be selected at a time. Wraps `RadioGroup` from Base UI. Accepts `defaultValue`, `value`, `onValueChange`, `disabled`, `readOnly`, `required`, and `name`.
- **Radio** -- A single radio input with a built-in circular indicator. Wraps `Radio.Root` from Base UI. Accepts `value`, `disabled`, and `render`.
- **RadioIndicator** -- The visual selection indicator. Wraps `Radio.Indicator` from Base UI. Accepts `keepMounted`, `className`, and `render`. Used internally by `Radio` but can be composed separately for custom layouts.
