import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "checkbox-group",
  description: "Several checkboxes whose ticked values form one list.",
  usage: `import { Checkbox } from "@/components/ui/checkbox"
import { CheckboxGroup } from "@/components/ui/checkbox-group"

const toppings = [
  { value: "cheese", label: "Cheese" },
  { value: "olives", label: "Olives" },
  { value: "peppers", label: "Peppers" },
]

export function ToppingsPicker() {
  return (
    <div>
      <p id="toppings-label" className="text-sm font-medium">Toppings</p>
      <CheckboxGroup aria-labelledby="toppings-label" defaultValue={["cheese"]}>
        {toppings.map((t) => (
          <div key={t.value} className="flex items-center gap-2">
            <Checkbox id={t.value} value={t.value} />
            <label htmlFor={t.value} className="text-sm">{t.label}</label>
          </div>
        ))}
      </CheckboxGroup>
    </div>
  )
}`,
  anatomy: `<CheckboxGroup>
  <Checkbox />
  <Checkbox />
</CheckboxGroup>`,

  examples: ["checkbox-group-controlled", "checkbox-group-default", "checkbox-group-horizontal", "checkbox-group-disabled"],

  parts: [
    {
      name: "CheckboxGroup",
      summary: "Holds the ticked values of its Checkboxes.",
      props: [
        { name: "value", type: "string[]", description: "Controlled list of ticked values." },
        { name: "defaultValue", type: "string[]", default: "[]", description: "Starting list when uncontrolled." },
        {
          name: "onValueChange",
          type: "(value, details) => void",
          description: "Runs for people and agents. details.cancel() refuses the change.",
          agent: true,
        },
        {
          name: "allValues",
          type: "string[]",
          description: "Every checkbox's value. Required for a `parent` checkbox.",
          agent: true,
        },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks every checkbox, for people and agents.", agent: true },
        { name: "className", type: "string", description: "Merged over the vertical stack, for example to lay out a row." },
      ],
    },
  ],

  notes: [
    {
      title: "Checkbox values",
      body: "A [Checkbox](/docs/components/checkbox) joins the group through its `value`. Without one it is not in the group's list or the agent's items.",
    },
    {
      title: "Parent checkbox",
      body: "Pass `allValues` and add a `<Checkbox parent />`. It ticks or clears every child and shows mixed when some are ticked. Disabled children are left alone.",
    },
  ],

  agent: {
    kind: "checkbox-group",
    reads: [
      { field: "label", means: "The group's aria-label or aria-labelledby. Unnamed groups go by checkbox-group." },
      { field: "value", means: "The labels of the ticked checkboxes." },
      { field: "items", means: "Every checkbox's label, in order." },
      { field: "multiple", means: "Always true." },
      { field: "disabled", means: "True when the whole group is blocked." },
    ],
    actions: [
      {
        call: 'setValue(["React", "Vue"])',
        does: "Ticks exactly these, by label then by value. A miss lists the options. Disabled checkboxes keep their state.",
      },
    ],
    refusal:
      "Each checkbox is also listed and takes toggle and setChecked, which run through the group's onValueChange like setValue. isAgentChange(details) is true there; details.cancel() refuses and tells the agent. Naming a disabled checkbox fails; a disabled group refuses on its own.",
    example: `await agent.act({
  steps: [{ ref: "checkbox-group", action: "setValue", args: [["React", "Vue"]] }],
})`,
  },

  keyboard: [
    { keys: ["Tab"], does: "Moves between the checkboxes" },
    { keys: ["Space"], does: "Toggles the focused checkbox" },
  ],

  accessibility: [
    'Renders role="group". Name it with aria-labelledby or aria-label; the agent reads the same name.',
    "Each checkbox needs its own label, also its name in the agent's items.",
    "A parent checkbox reports mixed while some children are ticked.",
  ],
} satisfies ComponentDoc;
