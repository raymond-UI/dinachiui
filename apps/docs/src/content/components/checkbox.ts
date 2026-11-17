import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "checkbox",
  description: "One yes or no, ticked by a person or an agent.",
  usage: `import { Checkbox } from "@/components/ui/checkbox"

export function TermsCheckbox() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" name="terms" />
      <label htmlFor="terms" className="text-sm">
        Accept terms and conditions
      </label>
    </div>
  )
}`,

  examples: ["checkbox-default", "checkbox-states"],

  parts: [
    {
      name: "Checkbox",
      summary: "The box, indicator and hidden form input.",
      props: [
        { name: "checked", type: "boolean", description: "Controlled checked state." },
        { name: "defaultChecked", type: "boolean", default: "false", description: "Starting state when uncontrolled." },
        {
          name: "onCheckedChange",
          type: "(checked, details) => void",
          description: "Runs for people and agents. details.cancel() refuses the change.",
          agent: true,
        },
        {
          name: "indeterminate",
          type: "boolean",
          default: "false",
          description: 'Shows the mixed state. The agent reads `checked` as `"mixed"`.',
          agent: true,
        },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "readOnly", type: "boolean", default: "false", description: "Shows the state, refuses any change.", agent: true },
        { name: "required", type: "boolean", default: "false", description: "Must be ticked before the form submits." },
        { name: "name", type: "string", description: "Submits the checkbox with a form." },
        {
          name: "value",
          type: "string",
          description: "Identifies it in a CheckboxGroup; submitted when ticked.",
          agent: true,
        },
        {
          name: "parent",
          type: "boolean",
          default: "false",
          description: "Ticks or clears every checkbox in its CheckboxGroup. Needs `allValues` on the group.",
          agent: true,
        },
        { name: "id", type: "string", description: "The id a `<label htmlFor>` points at." },
      ],
    },
  ],

  notes: [
    {
      title: "Labels and peer classes",
      body: "The box sits in a wrapper span with the hidden input. A `<label htmlFor>` beside it works, but Tailwind `peer-*` classes on that label cannot see the box: the label is a sibling of the wrapper, not the box.",
    },
    {
      title: "In a group",
      body: "Inside a [CheckboxGroup](/docs/components/checkbox-group), give each Checkbox a `value`. The group's value decides which are ticked, and changes go through the group's `onValueChange` instead of `onCheckedChange`.",
    },
  ],

  agent: {
    kind: "checkbox",
    reads: [
      { field: "label", means: "The label pointing at it, or its aria-label." },
      { field: "checked", means: 'true, false, or "mixed" when indeterminate.' },
      { field: "disabled", means: "True when the checkbox is blocked." },
    ],
    actions: [
      { call: "toggle()", does: "Ticks it, or clears it when ticked. A mixed box becomes ticked." },
      { call: "setChecked(true)", does: "Sets the state. Setting the current state succeeds as a no-op." },
    ],
    refusal:
      "An agent's change runs through onCheckedChange like anyone's. isAgentChange(details) is true for it; details.cancel() refuses it and the agent is told the app refused. In a group it goes through the group's onValueChange instead. A disabled or readOnly checkbox refuses on its own.",
    example: `await agent.act({
  steps: [{ ref: "Accept terms", action: "setChecked", args: [true] }],
})`,
  },

  keyboard: [{ keys: ["Space"], does: "Toggles the checkbox" }],

  accessibility: [
    'The box has role="checkbox" with aria-checked set to true, false or mixed.',
    "Name it with a `<label htmlFor>` on its id, or aria-label. The agent reads it too.",
    "A hidden input submits the value with a native form.",
  ],
} satisfies ComponentDoc;
