import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "toggle",
  description: "A button that stays pressed or unpressed.",
  usage: `import { Toggle } from "@/components/ui/toggle"
import { Bold } from "lucide-react"

export function BoldToggle() {
  return (
    <Toggle aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  )
}`,

  examples: ["toggle-default", "toggle-controlled", "toggle-variants", "toggle-sizes"],

  parts: [
    {
      name: "Toggle",
      summary: "A two-state button.",
      props: [
        { name: "pressed", type: "boolean", description: "Controlled pressed state." },
        { name: "defaultPressed", type: "boolean", default: "false", description: "Starting state when uncontrolled." },
        { name: "onPressedChange", type: "(pressed, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "variant", type: '"default" | "outline"', default: '"default"', description: "Outline adds a border." },
        { name: "size", type: '"default" | "sm" | "lg"', default: '"default"', description: "Height and padding." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "value", type: "string", description: "Identifies the toggle inside a ToggleGroup." },
        { name: "render", type: "ReactElement", description: "Swap the element, keep the behaviour." },
      ],
    },
  ],

  notes: [
    {
      title: "Several toggles",
      body: "For a set, use [Toggle Group](/docs/components/toggle-group). It holds the shared value and agents read it as one control.",
    },
    {
      title: "toggleVariants",
      body: "`toggleVariants` gives another element the same look.",
    },
  ],

  agent: {
    kind: "toggle",
    reads: [
      { field: "label", means: "The aria-label, or the button's text." },
      { field: "checked", means: "Whether it is pressed." },
      { field: "disabled", means: "True when the toggle is blocked." },
    ],
    actions: [
      { call: "toggle()", does: "Flips the pressed state." },
      { call: "setChecked(true)", does: "Sets it pressed or unpressed. A no-op if already there." },
    ],
    refusal:
      "An agent's change runs through onPressedChange like anyone's. isAgentChange(details) is true for it; details.cancel() refuses it and the agent is told the app refused. A disabled toggle refuses on its own.",
    example: `await agent.act({
  steps: [{ ref: "Toggle bold", action: "toggle" }],
})`,
  },

  keyboard: [
    { keys: ["Space", "Enter"], does: "Flips the pressed state" },
  ],

  accessibility: [
    "Renders a `<button>` with aria-pressed.",
    "An icon-only toggle needs an aria-label. The agent reads the same name.",
    "Keep the label the same in both states; aria-pressed carries the state.",
  ],
} satisfies ComponentDoc;
