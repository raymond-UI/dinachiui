import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "label",
  description: "The visible name of a form control.",
  usage: `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EmailField() {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
    </div>
  )
}`,

  examples: ["label-default", "label-disabled"],

  parts: [
    {
      name: "Label",
      summary: "A styled native `label` element.",
      props: [
        { name: "htmlFor", type: "string", description: "Id of the named control. Clicking the label focuses it." },
        { name: "children", type: "ReactNode", description: "The name, read by the agent as the control's label.", agent: true },
        { name: "className", type: "string", description: "Merged with the default classes." },
      ],
    },
  ],

  notes: [
    {
      title: "Disabled styling",
      body: "The label dims through Tailwind's `peer-disabled:`, so it must come after a disabled control with the `peer` class.",
    },
    {
      title: "Inside a Field",
      body: "Inside a `Field`, use `FieldLabel`. It wires the label to the control and its validation state.",
    },
  ],

  accessibility: [
    "A native label; its text is the control's accessible name.",
    "Link it with `htmlFor` and a matching id, or wrap the control inside it.",
    "The agent addresses a labelled field by its label text.",
  ],
} satisfies ComponentDoc;
