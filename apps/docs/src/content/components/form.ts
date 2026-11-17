import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "form",
  description: "A native form that validates Fields and shows server errors.",
  usage: `import { Button } from "@/components/ui/button"
import { Field, FieldControl, FieldError, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"

export function SignIn() {
  return (
    <Form onFormSubmit={(values) => console.log(values.email)}>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl type="email" required />
        <FieldError />
      </Field>
      <Button type="submit">Sign in</Button>
    </Form>
  )
}`,

  examples: ["form-validation", "form-default", "form-contact"],

  parts: [
    {
      name: "Form",
      summary: "A `<form>` that validates its Fields.",
      props: [
        { name: "onFormSubmit", type: "(values, details) => void", description: "Receives values keyed by Field `name`. Prevents the native submit." },
        { name: "errors", type: "Record<string, string | string[]>", description: "Errors from a server or form action, keyed by Field `name`." },
        { name: "validationMode", type: '"onSubmit" | "onBlur" | "onChange"', default: '"onSubmit"', description: "When Fields validate. A Field's own setting wins." },
        { name: "actionsRef", type: "RefObject<{ validate }>", description: "`validate()` checks every field, `validate(name)` checks one." },
        { name: "onSubmit", type: "(event) => void", description: "The native handler. Runs only when every field is valid." },
        { name: "aria-label", type: "string", description: "Names the form. The agent reports it as `in` on each control inside.", agent: true },
      ],
    },
  ],

  notes: [
    {
      title: "Submit",
      body: "Every Field validates. If any is invalid, submit stops and focus moves to the first invalid control. Otherwise `onSubmit` runs, then `onFormSubmit`. Browser validation bubbles are off (`noValidate`); Fields show the messages.",
    },
    {
      title: "Server errors",
      body: "Set `errors` after a request fails, keyed by Field `name`. Each Field's `FieldError` shows its message, focus moves to the first errored field, and an error clears once its control changes.\n\n```tsx\n<Form errors={{ email: \"That address is taken\" }} onFormSubmit={save}>\n  <Field name=\"email\">\n    <FieldLabel>Email</FieldLabel>\n    <FieldControl type=\"email\" />\n    <FieldError />\n  </Field>\n</Form>\n```",
    },
  ],

  accessibility: [
    "Renders a native `<form>`, so Enter in a text field submits it.",
    "An invalid submit focuses the first invalid control, announcing its error.",
    "With several forms on a page, give each an aria-label; agents report it as `in`.",
  ],
} satisfies ComponentDoc;
