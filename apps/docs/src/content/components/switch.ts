import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "switch",
  description: "An on/off setting that applies at once.",
  usage: `import { Switch, SwitchThumb } from "@/components/ui/switch"

export function AirplaneMode() {
  return (
    <label className="flex items-center gap-2">
      <Switch>
        <SwitchThumb />
      </Switch>
      Airplane Mode
    </label>
  )
}`,
  anatomy: `<Switch>
  <SwitchThumb />
</Switch>`,

  examples: ["switch-default", "switch-controlled", "switch-states"],

  parts: [
    {
      name: "Switch",
      summary: "The track. Holds the checked state.",
      props: [
        { name: "checked", type: "boolean", description: "Controlled checked state." },
        { name: "defaultChecked", type: "boolean", default: "false", description: "Starting state when uncontrolled." },
        { name: "onCheckedChange", type: "(checked, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "readOnly", type: "boolean", default: "false", description: "Shows the state, refuses any change.", agent: true },
        { name: "name", type: "string", description: "Submits the switch with a form." },
        { name: "value", type: "string", description: "Submitted while on. The browser sends `on` without it." },
        { name: "uncheckedValue", type: "string", description: "Submitted while off. Without it, nothing is sent." },
        { name: "required", type: "boolean", default: "false", description: "Must be on before the form submits." },
        { name: "nativeButton", type: "boolean", default: "false", description: "Set when `render` swaps in a real `<button>`." },
      ],
    },
    {
      name: "SwitchThumb",
      summary: "The sliding knob.",
      props: [],
    },
  ],

  agent: {
    kind: "switch",
    reads: [
      { field: "label", means: "The label around the switch, or its aria-label." },
      { field: "checked", means: "Whether the switch is on." },
      { field: "disabled", means: "True when the switch is blocked." },
    ],
    actions: [
      { call: "toggle()", does: "Flips the switch." },
      { call: "setChecked(true)", does: "Sets it on or off. The current state is a no-op." },
    ],
    refusal:
      "An agent's change runs through onCheckedChange. isAgentChange(details) is true for it; details.cancel() refuses it and the agent is told. Disabled or readOnly switches refuse on their own.",
    example: `await agent.act({
  steps: [{ ref: "Airplane Mode", action: "setChecked", args: [true] }],
})`,
  },

  keyboard: [{ keys: ["Space", "Enter"], does: "Turns the switch on or off" }],

  accessibility: [
    "The track has `role=\"switch\"` and `aria-checked`; a hidden checkbox submits the value.",
    "Name every switch with a wrapping `<label>` or aria-label; the agent reads it.",
    "readOnly and required are exposed as `aria-readonly` and `aria-required`.",
    "Reduced motion drops the thumb's slide.",
  ],
} satisfies ComponentDoc;
