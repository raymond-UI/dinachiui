# CheckboxGroup

A group of checkboxes that share a common state.

## Usage

```tsx
import { CheckboxGroup } from "@dinachi/components/checkbox-group";
import { Checkbox } from "@dinachi/components/checkbox";

export function CheckboxGroupDemo() {
  return (
    <CheckboxGroup defaultValue={["apple"]}>
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="banana">Banana</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
    </CheckboxGroup>
  );
}
```

## Props

Extends `React.ComponentPropsWithoutRef<typeof BaseCheckboxGroup>` from Base UI.