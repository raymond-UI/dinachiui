# Field

A component for building accessible forms with custom styling and validation.

## Anatomy

Import the component and its parts:

```tsx
import {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldValidity,
} from '@dinachi/components';
```

## Example

```tsx
import * as React from 'react';
import {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldValidity,
} from '@dinachi/components';
import { Input } from '@dinachi/components';

export default function ExampleField() {
  return (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <FieldControl asChild>
        <Input placeholder="Enter your email" />
      </FieldControl>
      <FieldDescription>We'll never share your email.</FieldDescription>
      <FieldError>Email is required</FieldError>
    </Field>
  );
}
```
