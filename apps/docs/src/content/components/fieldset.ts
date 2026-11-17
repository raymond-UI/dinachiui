import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "fieldset",
  description: "A labelled group of fields, disabled as one.",
  usage: `import { Field, FieldControl, FieldLabel } from "@/components/ui/field"
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset"

export function Shipping() {
  return (
    <Fieldset>
      <FieldsetLegend>Shipping address</FieldsetLegend>
      <Field name="street">
        <FieldLabel>Street</FieldLabel>
        <FieldControl />
      </Field>
      <Field name="city">
        <FieldLabel>City</FieldLabel>
        <FieldControl />
      </Field>
    </Fieldset>
  )
}`,
  anatomy: `<Fieldset>
  <FieldsetLegend />
  <Field />
</Fieldset>`,

  examples: ["fieldset-default", "fieldset-groups"],

  parts: [
    {
      name: "Fieldset",
      summary: "The group, a bordered `<fieldset>`.",
      props: [
        { name: "disabled", type: "boolean", default: "false", description: "Disables every control inside, native inputs and Fields.", agent: true },
        { name: "render", type: "ReactElement", description: "Swap the element, keep the behaviour." },
      ],
    },
    {
      name: "FieldsetLegend",
      summary: "The group's name.",
      props: [{ name: "children", type: "ReactNode", description: "Also the container name the agent reports for each control inside.", agent: true }],
    },
  ],

  notes: [
    {
      title: "Agents",
      body: "Not a control of its own. The agent reports the legend as `in` on each control inside, so two **City** fields stay distinct: one in **Shipping address**, one in **Billing address**.",
    },
  ],

  accessibility: [
    "A native `<fieldset>`; the group and its disabled state are announced.",
    "FieldsetLegend is a freely styleable `<div>` that names the fieldset via aria-labelledby.",
    "Disabled, the browser disables native controls inside and every Field reads the state.",
  ],
} satisfies ComponentDoc;
