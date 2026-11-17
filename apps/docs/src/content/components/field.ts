import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "field",
  description: "A label, control, help text and error, wired and validated.",
  usage: `import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

export function EmailField() {
  return (
    <Field name="email">
      <FieldLabel>Email</FieldLabel>
      <FieldControl type="email" required />
      <FieldDescription>We only use it to sign you in.</FieldDescription>
      <FieldError />
    </Field>
  )
}`,
  anatomy: `<Field>
  <FieldLabel />
  <FieldControl />
  <FieldDescription />
  <FieldError />
  <FieldValidity />
</Field>`,

  examples: ["field-default", "field-validation", "field-error", "field-required", "field-disabled"],

  parts: [
    {
      name: "Field",
      summary: "Holds the field's name, state and validation.",
      props: [
        { name: "name", type: "string", description: "Names the field on submit and keys its server errors." },
        { name: "validate", type: "(value, formValues) => string | string[] | null", description: "Returns an error message, or nothing when valid. May be async." },
        { name: "validationMode", type: '"onSubmit" | "onBlur" | "onChange"', default: '"onSubmit"', description: "When validate runs. Wins over the Form's setting." },
        { name: "validationDebounceTime", type: "number", default: "0", description: "Milliseconds between validate calls in onChange mode." },
        { name: "invalid", type: "boolean", description: "Marks the field invalid, for example from a form library.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Disables the control. Overrides the control's own disabled.", agent: true },
      ],
    },
    {
      name: "FieldLabel",
      summary: "The visible label, linked to the control.",
      props: [{ name: "children", type: "ReactNode", description: "Also the name the agent reads for the control.", agent: true }],
    },
    {
      name: "FieldControl",
      summary: "The input, wired to the field.",
      props: [
        { name: "type", type: "string", default: '"text"', description: "Any native input type." },
        { name: "value", type: "string", description: "Controlled value." },
        { name: "defaultValue", type: "string", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs with the new string on each change." },
        { name: "required", type: "boolean", default: "false", description: "Must have a value to be valid.", agent: true },
        { name: "render", type: "ReactElement", description: "Swap the element, keep the wiring." },
      ],
    },
    {
      name: "FieldDescription",
      summary: "Help text, linked to the control.",
      props: [],
    },
    {
      name: "FieldError",
      summary: "The error, shown while invalid.",
      props: [
        { name: "match", type: "boolean | keyof ValidityState", description: "Shows only for one validity failure, such as `valueMissing`. `true` always shows." },
        { name: "children", type: "ReactNode", description: "The message. Defaults to the browser's or validate's message. The agent reads it as the control's error.", agent: true },
      ],
    },
    {
      name: "FieldValidity",
      summary: "Renders from the field's validity state.",
      props: [{ name: "children", type: "(state) => ReactNode", description: "Receives the validity state and the current value." }],
    },
  ],

  notes: [
    {
      title: "Required fields",
      body: "Put `required` on `FieldControl`. It shows nothing visually; mark the label too.",
    },
    {
      title: "Server errors",
      body: "Inside a [Form](/docs/components/form), pass `errors` keyed by each Field's `name`. Each error clears once its control changes.",
    },
  ],

  accessibility: [
    "FieldLabel labels the control; clicking it focuses the input.",
    "FieldDescription and FieldError describe the control via aria-describedby.",
    "Invalid controls get aria-invalid and `data-invalid`.",
    "While invalid, the agent reads FieldError's text as the control's `errors`.",
  ],
} satisfies ComponentDoc;
