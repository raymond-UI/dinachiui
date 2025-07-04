# Form

A native form element with consolidated error handling, built on Base UI foundation.

## Installation

```bash
npx @dinachi/cli add form
```

## Usage

The Form component provides centralized error handling and state management for forms. It works seamlessly with Field components to create accessible, validated forms.

### Basic Usage

```tsx
import { Form } from "@/components/form"
import { Field, FieldLabel, FieldControl, FieldError } from "@/components/field"

export function BasicForm() {
  const [errors, setErrors] = React.useState({})
  const [loading, setLoading] = React.useState(false)

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        // Handle form submission
      }}
    >
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl type="email" required placeholder="Enter your email" />
        <FieldError />
      </Field>
      <button type="submit" disabled={loading}>
        Submit
      </button>
    </Form>
  )
}
```

### Form with Validation

```tsx
import { Form } from "@/components/form"
import { Field, FieldLabel, FieldControl, FieldError } from "@/components/field"

export function ValidationForm() {
  const [errors, setErrors] = React.useState({})

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    // Validate form data
    const newErrors = {}
    const email = formData.get('email') as string
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Submit valid form
    try {
      await submitForm(formData)
      setErrors({}) // Clear errors on success
    } catch (error) {
      setErrors({ submit: 'Failed to submit form' })
    }
  }

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={handleSubmit}
    >
      <Field name="email">
        <FieldLabel>Email Address</FieldLabel>
        <FieldControl type="email" required />
        <FieldError />
      </Field>
      <Field name="password">
        <FieldLabel>Password</FieldLabel>
        <FieldControl type="password" required minLength={8} />
        <FieldError />
      </Field>
      <button type="submit">Create Account</button>
    </Form>
  )
}
```

### Using with Zod Validation

```tsx
import { z } from "zod"
import { Form } from "@/components/form"
import { Field, FieldLabel, FieldControl, FieldError } from "@/components/field"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.coerce.number().positive("Age must be positive"),
  email: z.string().email("Please enter a valid email")
})

export function ZodForm() {
  const [errors, setErrors] = React.useState({})

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const formData = new FormData(event.currentTarget)
    const result = schema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    // Form is valid
    setErrors({})
    console.log(result.data)
  }

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={handleSubmit}
    >
      <Field name="name">
        <FieldLabel>Name</FieldLabel>
        <FieldControl placeholder="Enter name" />
        <FieldError />
      </Field>
      <Field name="age">
        <FieldLabel>Age</FieldLabel>
        <FieldControl type="number" placeholder="Enter age" />
        <FieldError />
      </Field>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl type="email" placeholder="Enter email" />
        <FieldError />
      </Field>
      <button type="submit">Submit</button>
    </Form>
  )
}
```

### Dynamic Class Names

```tsx
import { Form } from "@/components/form"

export function DynamicForm() {
  const [errors, setErrors] = React.useState({})

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      className={(state) => 
        state.errors && Object.keys(state.errors).length > 0 
          ? "border-red-500 bg-red-50" 
          : "border-gray-200"
      }
    >
      {/* Form content */}
    </Form>
  )
}
```

### Custom Render Prop

```tsx
import { Form } from "@/components/form"

export function CustomRenderForm() {
  const [errors, setErrors] = React.useState({})

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      render={(props, state) => (
        <form {...props} className="custom-form-class">
          <div className="form-header">
            {Object.keys(state.errors).length > 0 && (
              <div className="error-summary">
                Please fix {Object.keys(state.errors).length} error(s) below:
              </div>
            )}
          </div>
          {/* Form fields */}
        </form>
      )}
    >
      {/* This content won't be rendered when using render prop */}
    </Form>
  )
}
```

## API Reference

### Form

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `errors` | `Record<string, string \| string[] \| undefined>` | `{}` | Object containing field errors |
| `onClearErrors` | `(errors: Errors) => void` | `undefined` | Callback called when errors should be cleared |
| `className` | `string \| ((state: FormState) => string)` | `undefined` | CSS class name or function returning class name |
| `render` | `ReactElement \| ((props: HTMLProps, state: FormState) => ReactElement)` | `undefined` | Custom render prop for complete control |

The Form component also accepts all standard HTML form props.

### FormState

The form state object passed to className and render functions:

```typescript
interface FormState {
  errors: Record<string, string | string[] | undefined>
}
```

### Errors Type

```typescript
type Errors = Record<string, string | string[] | undefined>
```

## Form Composition

The Form component is designed to work with Field components:

```tsx
<Form>
  <Field name="fieldName">
    <FieldLabel />
    <FieldControl />
    <FieldError />
  </Field>
</Form>
```

## Error Handling

### Server-side Errors

```tsx
const handleSubmit = async (event) => {
  event.preventDefault()
  
  try {
    const response = await api.submit(formData)
    setErrors({}) // Clear errors on success
  } catch (error) {
    // Set server errors
    setErrors({
      email: "This email is already taken",
      submit: "Failed to create account"
    })
  }
}
```

### Client-side Validation

```tsx
const validateForm = (formData) => {
  const errors = {}
  
  if (!formData.get('email')) {
    errors.email = 'Email is required'
  }
  
  if (!formData.get('password')) {
    errors.password = 'Password is required'
  }
  
  return errors
}
```

### Multiple Error Messages

The Form component supports arrays of error messages:

```tsx
const errors = {
  password: [
    "Password is required",
    "Password must be at least 8 characters",
    "Password must contain a number"
  ]
}
```

## Accessibility

- **Form Role**: Automatically provides proper form semantics
- **Error Association**: Works with Field components to associate errors with inputs
- **Screen Readers**: Error messages are properly announced
- **Keyboard Navigation**: Full keyboard support for form navigation

## Performance

- **Optimized Rendering**: Only re-renders when errors change
- **Memoized ClassName**: ClassName function is memoized for performance
- **Minimal Re-renders**: Efficient state management reduces unnecessary updates

## Examples

### Loading States

```tsx
export function LoadingForm() {
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState({})

  return (
    <Form errors={errors} onClearErrors={setErrors}>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl disabled={loading} />
        <FieldError />
      </Field>
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </Form>
  )
}
```

### Multi-step Forms

```tsx
export function MultiStepForm() {
  const [step, setStep] = React.useState(1)
  const [errors, setErrors] = React.useState({})

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      className={(state) => `step-${step} ${Object.keys(state.errors).length > 0 ? 'has-errors' : ''}`}
    >
      {step === 1 && (
        <Field name="email">
          <FieldLabel>Email</FieldLabel>
          <FieldControl />
          <FieldError />
        </Field>
      )}
      {step === 2 && (
        <Field name="password">
          <FieldLabel>Password</FieldLabel>
          <FieldControl type="password" />
          <FieldError />
        </Field>
      )}
    </Form>
  )
}
```

## Base UI Foundation

This component is built on top of `@base-ui-components/react/form`. For more advanced usage and customization options, refer to the [Base UI Form documentation](https://base-ui.mui.com/react/components/form).

## Related Components

- [Field](../field/README.md) - Form field wrapper with validation
- [Input](../input/README.md) - Input component for form controls
- [Button](../button/README.md) - Button component for form actions 