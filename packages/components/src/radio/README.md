# Radio

A radio input and group for selecting a single option from a set.

## Installation

```bash
npx @dinachi/cli@latest add radio
```

## Usage

```tsx
import { Radio, RadioGroup } from "@/components/ui/radio"
```

```tsx
<RadioGroup defaultValue="comfortable">
  <div className="flex items-center space-x-2">
    <Radio value="default" />
    <label htmlFor="default">Default</label>
  </div>
  <div className="flex items-center space-x-2">
    <Radio value="comfortable" />
    <label htmlFor="comfortable">Comfortable</label>
  </div>
  <div className="flex items-center space-x-2">
    <Radio value="compact" />
    <label htmlFor="compact">Compact</label>
  </div>
</RadioGroup>
```

## API Reference

- **RadioGroup** -- Groups radio inputs so only one can be selected at a time. Wraps `RadioGroup` from Base UI. Accepts `defaultValue`, `value`, `onValueChange`, `disabled`, and `name`.
- **Radio** -- A single radio input with a circular indicator. Wraps `Radio.Root` from Base UI. Accepts `value` and `disabled`. Includes a built-in indicator with a filled circle icon.
