import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "toggle-group",
  description: "A row of toggles sharing one value, pressed by a person or an agent.",
  usage: `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"

export function Alignment() {
  return (
    <ToggleGroup aria-label="Alignment" defaultValue={["left"]}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}`,
  anatomy: `<ToggleGroup>
  <ToggleGroupItem />
</ToggleGroup>`,

  examples: ["toggle-group-single", "toggle-group-default", "toggle-group-sizes"],

  parts: [
    {
      name: "ToggleGroup",
      summary: "Holds pressed values; moves focus between items.",
      props: [
        { name: "value", type: "string[]", description: "Controlled pressed values. Always an array." },
        { name: "defaultValue", type: "string[]", default: "[]", description: "Starting values when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "multiple", type: "boolean", default: "false", description: "Allows several pressed items. Agents also get setValue.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Which arrow keys move focus. Vertical also stacks the items." },
        { name: "loopFocus", type: "boolean", default: "true", description: "Wraps focus from the last item to the first." },
      ],
    },
    {
      name: "ToggleGroupItem",
      summary: "One toggle in the group.",
      props: [
        { name: "value", type: "string", description: "Added to the group's value while pressed." },
        { name: "variant", type: '"default" | "outline"', default: '"outline"', description: "Outline adds a border." },
        { name: "size", type: '"default" | "sm" | "lg"', default: '"sm"', description: "Height and padding." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks this item, for agents too.", agent: true },
        { name: "aria-label", type: "string", description: "The item's name; required for icon-only items. The agent picks by it.", agent: true },
      ],
    },
  ],

  notes: [
    {
      title: "Defaults",
      body: "Items default to `variant=\"outline\"` and `size=\"sm\"`; a standalone [Toggle](/docs/components/toggle) defaults to `default` for both.",
    },
    {
      title: "Single mode",
      body: "Without `multiple`, pressing an item replaces the value; pressing the pressed item clears it. Read `value[0]`.",
    },
  ],

  agent: {
    kind: "toggle-group",
    reads: [
      { field: "label", means: "The group's aria-label." },
      { field: "value", means: "The pressed item's label, or a list of labels when multiple." },
      { field: "items", means: "Every item's label." },
      { field: "multiple", means: "Present when several items can be pressed." },
      { field: "disabled", means: "True when the whole group is blocked." },
    ],
    actions: [
      { call: 'select("Align center")', does: "Picks by label, then by value. Replaces in single mode, adds in multiple. A miss lists the items." },
      { call: 'setValue(["Toggle bold", "Toggle italic"])', does: "Replaces the whole value. Only when multiple." },
    ],
    refusal:
      "An agent's change runs through onValueChange. isAgentChange(details) is true for it, and details.cancel() refuses it; the agent is told the app refused. A disabled item and a disabled group refuse on their own.",
    example: `await agent.act({
  steps: [{ ref: "toggle-group", action: "select", args: ["Align right"] }],
})`,
  },

  keyboard: [
    { keys: ["←", "→"], does: "Moves focus between items, or ↑ ↓ when vertical" },
    { keys: ["Home", "End"], does: "Moves focus to the first or last item" },
    { keys: ["Space", "Enter"], does: "Presses or releases the focused item" },
    { keys: ["Tab"], does: "Moves focus into and out of the group as one stop" },
  ],

  accessibility: [
    "The group has role group; each item is a button with aria-pressed.",
    "Name the group with aria-label. Without one the agent lists it as `toggle-group`.",
    "Icon-only items each need an aria-label. The agent reads these as item names.",
    "Disabled items stay in the group but cannot be pressed.",
  ],
} satisfies ComponentDoc;
