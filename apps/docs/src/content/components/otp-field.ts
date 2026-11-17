import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "otp-field",
  description: "A one-time code in separate slots.",
  usage: `import { OTPField, OTPFieldGroup, OTPFieldInput } from "@/components/ui/otp-field"

export function VerificationCode() {
  return (
    <OTPField length={6} aria-label="Verification code">
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
    </OTPField>
  )
}`,
  anatomy: `<OTPField>
  <OTPFieldGroup>
    <OTPFieldInput />
  </OTPFieldGroup>
  <OTPFieldSeparator />
  <OTPFieldGroup>
    <OTPFieldInput />
  </OTPFieldGroup>
</OTPField>`,

  examples: ["otp-field-default", "otp-field-separator", "otp-field-masked", "otp-field-controlled", "otp-field-disabled"],

  parts: [
    {
      name: "OTPField",
      summary: "Holds the code; moves focus between slots.",
      props: [
        { name: "length", type: "number", description: "Required. Number of slots. Longer codes are refused, for agents too.", agent: true },
        { name: "value", type: "string", description: "Controlled value." },
        { name: "defaultValue", type: "string", default: "\"\"", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "onValueComplete", type: "(value, details) => void", description: "Runs once every slot is filled." },
        { name: "onValueInvalid", type: "(value, details) => void", description: "Runs when typed or pasted characters are rejected." },
        { name: "validationType", type: "\"numeric\" | \"alpha\" | \"alphanumeric\" | \"none\"", default: "\"numeric\"", description: "Allowed characters. Agent codes are checked too.", agent: true },
        { name: "normalizeValue", type: "(value: string) => string", description: "Rewrites the value after filtering, such as uppercasing. Must be idempotent." },
        { name: "mask", type: "boolean", default: "false", description: "Hides each character. The agent reads the value as redacted.", agent: true },
        { name: "autoComplete", type: "string", default: "\"one-time-code\"", description: "Set on the first slot. While `one-time-code`, the agent reads the value as redacted.", agent: true },
        { name: "autoSubmit", type: "boolean", default: "false", description: "Submits the owning form once the code is complete." },
        { name: "inputMode", type: "string", description: "On-screen keyboard. Defaults per validationType." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "readOnly", type: "boolean", default: "false", description: "Shows the code, refuses any change.", agent: true },
        { name: "name", type: "string", description: "Submits the code with a form." },
        { name: "required", type: "boolean", default: "false", description: "Must be filled before the form submits." },
      ],
    },
    {
      name: "OTPFieldGroup",
      summary: "A row of joined slots.",
      props: [],
    },
    {
      name: "OTPFieldInput",
      summary: "One slot. Render one per character.",
      props: [{ name: "type", type: "string", description: "Overrides the input type for this slot." }],
    },
    {
      name: "OTPFieldSeparator",
      summary: "A mark between groups.",
      props: [{ name: "children", type: "ReactNode", description: "What to show, such as a dash." }],
    },
  ],

  notes: [
    {
      title: "Slots",
      body: "Render exactly `length` OTPFieldInputs, split across any number of groups. Separate groups with `OTPFieldSeparator`.",
    },
  ],

  agent: {
    kind: "input",
    reads: [
      { field: "label", means: "The root's aria-label or aria-labelledby." },
      { field: "value", means: "The code, or [redacted] for a one-time code or a masked field." },
      { field: "length", means: "How many characters the code takes." },
      { field: "disabled", means: "True when the field is blocked." },
    ],
    actions: [
      { call: 'setValue("4321")', does: "Fills the code. Spaces are dropped; too long or invalid characters fails." },
      { call: "clear()", does: "Empties every slot." },
    ],
    refusal:
      "Listed once, not per slot. An agent's change runs through onValueChange; isAgentChange(details) is true for it, and details.cancel() refuses it. The agent is told the app refused. Disabled or readOnly fields refuse on their own.",
    example: `await agent.act({
  steps: [{ ref: "input", action: "setValue", args: ["482913"] }],
})`,
  },

  keyboard: [
    { keys: ["←", "→"], does: "Moves to the previous or next slot" },
    { keys: ["Home", "End"], does: "Moves to the first slot, or the first empty one" },
    { keys: ["Backspace"], does: "Deletes the character and moves back" },
    { keys: ["Delete"], does: "Deletes the character in this slot" },
    { keys: ["Ctrl", "Backspace"], does: "Clears the whole code. Cmd on macOS" },
  ],

  accessibility: [
    "The root is a group. Name it with aria-label or aria-labelledby; the agent reads it.",
    "One slot is in the tab order; arrows move between slots.",
    "The first slot has `autocomplete=\"one-time-code\"` so browsers can offer received codes.",
    "Disabled fields show their value but take no input.",
  ],
} satisfies ComponentDoc;
