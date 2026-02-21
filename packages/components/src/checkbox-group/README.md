# CheckboxGroup

A group of checkboxes that share a common state.

## Installation

```bash
npx @dinachi/cli@latest add checkbox-group
```

## Usage

```tsx
import { CheckboxGroup } from "@/components/ui/checkbox-group"
import { Checkbox } from "@/components/ui/checkbox"
```

```tsx
<CheckboxGroup defaultValue={["apple"]} onValueChange={(value) => console.log(value)}>
  <div className="flex items-center space-x-2">
    <Checkbox value="apple" id="apple" />
    <label htmlFor="apple">Apple</label>
  </div>
  <div className="flex items-center space-x-2">
    <Checkbox value="banana" id="banana" />
    <label htmlFor="banana">Banana</label>
  </div>
  <div className="flex items-center space-x-2">
    <Checkbox value="cherry" id="cherry" />
    <label htmlFor="cherry">Cherry</label>
  </div>
</CheckboxGroup>
```

## API Reference

- **CheckboxGroup** -- A container that manages shared state for multiple Checkbox components. Extends `CheckboxGroup` from Base UI. Accepts `value`, `defaultValue`, and `onValueChange` props to control which checkboxes are selected.
