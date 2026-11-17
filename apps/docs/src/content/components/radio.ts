import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "radio",
  description: "One option from a short visible set, for people and agents.",
  usage: `import { Radio, RadioGroup } from "@/components/ui/radio"

export function PlanPicker() {
  return (
    <RadioGroup aria-label="Plan" defaultValue="free">
      <label className="flex items-center gap-2">
        <Radio value="free" />
        Free
      </label>
      <label className="flex items-center gap-2">
        <Radio value="pro" />
        Pro
      </label>
    </RadioGroup>
  )
}`,
  anatomy: `<RadioGroup>
  <Radio>
    <RadioIndicator />
  </Radio>
</RadioGroup>`,

  examples: ["radio-default", "radio-controlled", "radio-disabled"],

  parts: [
    {
      name: "RadioGroup",
      summary: "Holds the chosen value.",
      props: [
        { name: "value", type: "Value", description: "Controlled value." },
        { name: "defaultValue", type: "Value", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "aria-label", type: "string", description: "Names the group, as does aria-labelledby. The agent reads it.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "readOnly", type: "boolean", default: "false", description: "Shows the value, refuses any change.", agent: true },
        { name: "name", type: "string", description: "Submits the value with a form." },
        { name: "required", type: "boolean", default: "false", description: "Must have a value before the form submits." },
      ],
    },
    {
      name: "Radio",
      summary: "One option. Renders its own indicator.",
      props: [
        { name: "value", type: "Value", description: "What onValueChange receives. Required for the agent to list the radio.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Skipped by the keyboard, refused for agents.", agent: true },
        { name: "render", type: "ReactElement", description: "Swap the element, keep the behaviour." },
      ],
    },
    {
      name: "RadioIndicator",
      summary: "The dot shown when the radio is checked.",
      props: [{ name: "keepMounted", type: "boolean", default: "false", description: "Keeps the dot mounted while unchecked, for exit animations." }],
    },
  ],

  notes: [
    {
      title: "Radio labels",
      body: "Wrap each `Radio` and its text in a `<label>`. Clicking the text picks the radio, and the agent reads the text as the option's name. Without a label it falls back to `aria-label`, then the value.",
    },
    {
      title: "Built-in indicator",
      body: "`Radio` already renders a `RadioIndicator`; do not add one inside it. The export is for custom radios built on the Base UI primitive.",
    },
  ],

  agent: {
    kind: "radio-group",
    reads: [
      { field: "label", means: "The group's aria-label or aria-labelledby." },
      { field: "value", means: "The checked radio's label, or an empty string." },
      { field: "items", means: "Every radio's label, in document order." },
      { field: "disabled", means: "True when the whole group is blocked." },
    ],
    actions: [
      { call: 'select("Compact")', does: "Picks by label, then by value. A miss lists the options." },
    ],
    refusal:
      "An agent's change runs through onValueChange. isAgentChange(details) is true for it, and details.cancel() refuses it; the agent is told the app refused. A disabled radio, a disabled group and readOnly refuse on their own.",
    example: `await agent.act({
  steps: [{ ref: "radio-group", action: "select", args: ["Compact"] }],
})`,
  },

  keyboard: [
    { keys: ["Tab"], does: "Moves focus into the group, onto the checked radio" },
    { keys: ["↑", "↓", "←", "→"], does: "Moves to the next or previous radio and checks it" },
    { keys: ["Space"], does: "Checks the focused radio" },
  ],

  accessibility: [
    "The group is a radiogroup; each radio is a radio with aria-checked.",
    "Name the group with aria-label or aria-labelledby. The agent reads the same name.",
    "Enter does not check a radio; only Space and the arrow keys do.",
    "A hidden input submits the value with a native form.",
  ],
} satisfies ComponentDoc;
