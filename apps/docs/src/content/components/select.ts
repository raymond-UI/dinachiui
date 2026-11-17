import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "select",
  description: "One value from a list, chosen by a person or an agent.",
  usage: `import {
  Select,
  SelectContent,
  SelectFieldLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const regions = [
  { value: "fra", label: "Frankfurt" },
  { value: "lhr", label: "London" },
  { value: "nrt", label: "Tokyo" },
]

export function RegionPicker() {
  return (
    <Select items={regions}>
      <SelectFieldLabel>Region</SelectFieldLabel>
      <SelectTrigger>
        <SelectValue placeholder="Choose a region" />
      </SelectTrigger>
      <SelectContent>
        {regions.map((r) => (
          <SelectItem key={r.value} value={r.value}>
            {r.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}`,
  anatomy: `<Select>
  <SelectFieldLabel />
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel />
      <SelectItem />
    </SelectGroup>
    <SelectSeparator />
  </SelectContent>
</Select>`,

  examples: ["select-controlled", "select-multiple", "select-groups", "select-disabled-item", "select-form"],

  parts: [
    {
      name: "Select",
      summary: "Holds the value and the open state.",
      props: [
        { name: "items", type: "{ value, label }[]", description: "Labels for each value. The trigger shows them and the agent reads them.", agent: true },
        { name: "value", type: "Value | null", description: "Controlled value." },
        { name: "defaultValue", type: "Value | null", default: "null", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs when the list opens or closes, from either side.", agent: true },
        { name: "multiple", type: "boolean", default: "false", description: "Holds an array of values. Agents also get setValue.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "readOnly", type: "boolean", default: "false", description: "Opens to look, refuses any change.", agent: true },
        { name: "name", type: "string", description: "Submits the value with a form." },
        { name: "required", type: "boolean", default: "false", description: "Must have a value before the form submits." },
        { name: "modal", type: "boolean", default: "true", description: "Locks page scroll and outside clicks while open." },
      ],
    },
    {
      name: "SelectFieldLabel",
      summary: "The visible label.",
      props: [{ name: "children", type: "ReactNode", description: "Also the name the agent reads.", agent: true }],
    },
    {
      name: "SelectTrigger",
      summary: "The button that opens the list.",
      props: [{ name: "render", type: "ReactElement", description: "Swap the element, keep the behaviour." }],
    },
    {
      name: "SelectValue",
      summary: "Shows the current choice.",
      props: [
        { name: "placeholder", type: "ReactNode", description: "Shown while there is no value." },
        { name: "children", type: "(value) => ReactNode", description: "Formats the value yourself, for example a list in multiple mode." },
      ],
    },
    {
      name: "SelectContent",
      summary: "The positioned popup. Scroll arrows are built in.",
      props: [
        { name: "alignItemWithTrigger", type: "boolean", default: "false", description: "Lines the chosen item up over the trigger." },
        { name: "sideOffset", type: "number", default: "4", description: "Gap to the trigger, in pixels." },
        { name: "portal", type: "boolean", default: "false", description: "Renders into the body." },
        { name: "positionMethod", type: '"fixed" | "absolute"', default: '"fixed"', description: "Use absolute if the popup lands away from its trigger in Safari." },
      ],
    },
    {
      name: "SelectItem",
      summary: "One option.",
      props: [
        { name: "value", type: "Value", description: "What onValueChange receives." },
        { name: "showIndicator", type: "boolean", default: "false", description: "Shows a check beside the chosen item." },
        { name: "disabled", type: "boolean", default: "false", description: "Skipped by the keyboard, refused for agents.", agent: true },
      ],
    },
    {
      name: "SelectGroup",
      summary: "Groups items under a SelectLabel.",
      props: [{ name: "children", type: "ReactNode", description: "A SelectLabel, then items." }],
    },
    {
      name: "SelectLabel",
      summary: "The heading of a group.",
      props: [{ name: "children", type: "ReactNode", description: "Group name. Not selectable." }],
    },
    {
      name: "SelectSeparator",
      summary: "A line between groups.",
      props: [],
    },
    {
      name: "SelectItemIndicator",
      summary: "The check for a custom item layout.",
      props: [{ name: "children", type: "ReactNode", default: "<Check />", description: "Replaces the check icon." }],
    },
    {
      name: "SelectBackdrop",
      summary: "A full-screen layer under the popup.",
      props: [],
    },
    {
      name: "SelectArrow",
      summary: "A pointer from the popup to the trigger.",
      props: [],
    },
  ],

  notes: [
    {
      title: "Clipped popups",
      body: "`SelectContent` renders in place by default, so it inherits the stacking of an open `Dialog` or `Drawer`. Pass `portal` when an ancestor clips it with `overflow: hidden`.",
    },
  ],

  agent: {
    kind: "select",
    reads: [
      { field: "label", means: "The SelectFieldLabel, or the trigger's aria-label." },
      { field: "value", means: "The chosen label, a list of labels when multiple, or null." },
      { field: "open", means: "Whether the list is showing." },
      { field: "items", means: "Every option's label, when open or passed as items." },
      { field: "disabled", means: "True when the whole select is blocked." },
    ],
    actions: [
      { call: 'select("Tokyo")', does: "Picks by label, then by value. A miss lists the options." },
      { call: "open() / close()", does: "Whichever fits the current state." },
      { call: 'setValue(["Tokyo", "London"])', does: "Replaces the whole list. Only when multiple." },
    ],
    refusal:
      "An agent's change runs through onValueChange like anyone's. isAgentChange(details) is true for it, and details.cancel() refuses it; the agent is told the app refused. Disabled items, a disabled select and readOnly refuse on their own.",
    example: `await agent.act({
  steps: [{ ref: "Region", action: "select", args: ["Tokyo"] }],
})`,
  },

  keyboard: [
    { keys: ["Space", "Enter"], does: "Opens the list, or picks the highlighted item" },
    { keys: ["↑", "↓"], does: "Moves the highlight" },
    { keys: ["Home", "End"], does: "Jumps to the first or last item" },
    { keys: ["A", "Z"], range: true, does: "Jumps to the next item starting with that letter" },
    { keys: ["Esc"], does: "Closes and returns focus to the trigger" },
  ],

  accessibility: [
    "The trigger is a button with a listbox popup; items are options with their selected state exposed.",
    "Give every select a name: a SelectFieldLabel, or aria-label on the trigger. The agent reads the same name.",
    "Disabled items stay announced but are skipped by the keyboard.",
    "Focus returns to the trigger when the list closes.",
  ],
} satisfies ComponentDoc;
