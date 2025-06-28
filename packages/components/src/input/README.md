# Input
A native input element that automatically works with Field.

## Anatomy
Import the component and use it as a single part:
```tsx
import { Input } from '@dinachi/components';

<Input />
```

## Example
```tsx
import * as React from 'react';
import { Input } from '@dinachi/components';

export default function ExampleInput() {
  return (
    <Input
      placeholder="Name"
      className="h-10 w-full max-w-64 rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
    />
  );
}
```

## API reference
### Prop
| Prop | Type | Default |
| --- | --- | --- |
| `defaultValue` | `string | number | string[]` | `undefined` |
| `onValueChange` | `((value: string | number | string[] | undefined, event: Event) => void)` | `undefined` |
| `className` | `string | ((state: Input.State) => string)` | `undefined` |
| `render` | `ReactElement | ((props: HTMLProps, state: Input.State) => ReactElement)` | `undefined` |

### Attribute
| Attribute | Description |
| --- | --- |
| `data-disabled` | Present when the input is disabled. |
| `data-valid` | Present when the input is in valid state. |
| `data-invalid` | Present when the input is in invalid state. |
| `data-dirty` | Present when the input's value has changed. |
| `data-touched` | Present when the input has been touched. |
| `data-filled` | Present when the input is filled. |
| `data-focused` | Present when the input is focused. |