import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "number-field",
  description: "A number typed, stepped or scrubbed by a person or agent.",
  usage: `import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field"

export function Quantity() {
  return (
    <NumberField defaultValue={1} min={1} max={10}>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput aria-label="Quantity" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  )
}`,
  anatomy: `<NumberField>
  <NumberFieldScrubArea>
    <NumberFieldScrubAreaCursor />
  </NumberFieldScrubArea>
  <NumberFieldGroup>
    <NumberFieldDecrement />
    <NumberFieldInput />
    <NumberFieldIncrement />
  </NumberFieldGroup>
</NumberField>`,

  examples: ["number-field-default", "number-field-minmax", "number-field-step"],

  parts: [
    {
      name: "NumberField",
      summary: "Holds the value, the range and the step.",
      props: [
        { name: "value", type: "number | null", description: "Controlled value." },
        { name: "defaultValue", type: "number | null", default: "null", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "onValueCommitted", type: "(value, details) => void", description: "Runs when a person commits, such as on blur, and after each accepted agent change.", agent: true },
        { name: "min", type: "number", description: "Lowest value. Agent changes are clamped to it.", agent: true },
        { name: "max", type: "number", description: "Highest value. Agent changes are clamped to it.", agent: true },
        { name: "step", type: "number | \"any\"", default: "1", description: "How far one step moves. With \"any\" the agent steps by 1.", agent: true },
        { name: "smallStep", type: "number", default: "0.1", description: "The step while Alt is held." },
        { name: "largeStep", type: "number", default: "10", description: "The step while Shift is held." },
        { name: "format", type: "Intl.NumberFormatOptions", description: "Formats the value in the input, for example as currency." },
        { name: "locale", type: "Intl.LocalesArgument", description: "The locale used to format and parse the value." },
        { name: "allowWheelScrub", type: "boolean", default: "false", description: "Steps the value with the mouse wheel while the input is focused." },
        { name: "snapOnStep", type: "boolean", default: "false", description: "Snaps stepped values to the nearest multiple of the step." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "readOnly", type: "boolean", default: "false", description: "Shows the value, refuses any change.", agent: true },
        { name: "name", type: "string", description: "Submits the value with a form." },
        { name: "required", type: "boolean", default: "false", description: "Must have a value before the form submits." },
      ],
    },
    {
      name: "NumberFieldGroup",
      summary: "The bordered row of input and buttons.",
      props: [],
    },
    {
      name: "NumberFieldInput",
      summary: "The text input.",
      props: [{ name: "aria-label", type: "string", description: "Names the field without a label element. The agent reads it too.", agent: true }],
    },
    {
      name: "NumberFieldDecrement",
      summary: "Steps the value down.",
      props: [{ name: "children", type: "ReactNode", default: "<Minus />", description: "Replaces the icon." }],
    },
    {
      name: "NumberFieldIncrement",
      summary: "Steps the value up.",
      props: [{ name: "children", type: "ReactNode", default: "<Plus />", description: "Replaces the icon." }],
    },
    {
      name: "NumberFieldScrubArea",
      summary: "Drag to change the value; often wraps a label.",
      props: [
        { name: "direction", type: "\"horizontal\" | \"vertical\"", default: "\"horizontal\"", description: "Which way the pointer moves to scrub." },
        { name: "pixelSensitivity", type: "number", default: "2", description: "Pixels the pointer moves per step." },
      ],
    },
    {
      name: "NumberFieldScrubAreaCursor",
      summary: "A custom cursor shown while scrubbing.",
      props: [{ name: "children", type: "ReactNode", description: "The cursor icon." }],
    },
  ],

  agent: {
    kind: "number",
    reads: [
      { field: "label", means: "The input's label or aria-label." },
      { field: "value", means: "The current number, or nothing while empty." },
      { field: "min / max", means: "The range, when set." },
      { field: "step", means: "The step size. 1 when step is \"any\"." },
      { field: "disabled", means: "True when the field is blocked." },
    ],
    actions: [
      { call: "setValue(42)", does: "Sets the value, clamped to min and max. A string that is not a number fails." },
      { call: "increment(3)", does: "Steps up by that many steps, 1 if omitted. An empty field steps from min, or 0." },
      { call: "decrement(3)", does: "Steps down the same way." },
    ],
    refusal:
      "An agent's change runs through onValueChange like anyone's. isAgentChange(details) is true for it; details.cancel() refuses it and the agent is told the app refused. An accepted change also runs onValueCommitted. A disabled or readOnly field refuses on its own.",
    example: `await agent.act({
  steps: [{ ref: "number", action: "increment", args: [3] }],
})`,
  },

  keyboard: [
    { keys: ["↑", "↓"], does: "Steps the value up or down" },
    { keys: ["Shift", "↑"], does: "Steps by largeStep, with ↓ to go down" },
    { keys: ["Alt", "↑"], does: "Steps by smallStep, with ↓ to go down" },
    { keys: ["Home"], does: "Sets the value to min, when set" },
    { keys: ["End"], does: "Sets the value to max, when set" },
  ],

  accessibility: [
    "The input is a text field described as a \"Number field\", with a numeric inputmode.",
    "Name every field with a label element or aria-label on NumberFieldInput. The agent reads it too.",
    "The step buttons are hidden from the agent, which steps through the field.",
  ],
} satisfies ComponentDoc;
