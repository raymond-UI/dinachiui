import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "combobox",
  description: "A text input that filters a list, searched and picked by a person or an agent.",
  usage: `import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox"

const fruits = ["Apple", "Banana", "Cherry", "Mango"]

export function FruitPicker() {
  return (
    <Combobox items={fruits}>
      <label htmlFor="fruit" className="text-sm font-medium">Fruit</label>
      <ComboboxInputGroup className="flex w-64 items-center rounded-md border">
        <ComboboxInput id="fruit" placeholder="Search fruit" />
        <ComboboxTrigger />
      </ComboboxInputGroup>
      <ComboboxContent>
        <ComboboxEmpty>No fruit found.</ComboboxEmpty>
        <ComboboxList>
          {(fruit: string) => (
            <ComboboxItem key={fruit} value={fruit}>
              {fruit}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}`,
  anatomy: `<Combobox>
  <ComboboxLabel />
  <ComboboxInputGroup>
    <ComboboxInput />
    <ComboboxClear />
    <ComboboxTrigger />
  </ComboboxInputGroup>
  <ComboboxContent>
    <ComboboxEmpty />
    <ComboboxList>
      <ComboboxGroup>
        <ComboboxGroupLabel />
        <ComboboxItem />
      </ComboboxGroup>
      <ComboboxSeparator />
    </ComboboxList>
    <ComboboxStatus />
  </ComboboxContent>
</Combobox>`,

  examples: ["combobox-default", "combobox-groups", "combobox-clear", "combobox-create-items"],

  parts: [
    {
      name: "Combobox",
      summary: "Holds value, input text and open state. No element.",
      props: [
        {
          name: "items",
          type: "Item[] | Group[] | ItemCollection",
          description: "The options. Needed for filtering; lets the agent pick while closed.",
          agent: true,
        },
        { name: "value", type: "Value | Value[] | null", description: "Controlled value." },
        { name: "defaultValue", type: "Value | Value[] | null", default: "null, or [] when multiple", description: "Starting value when uncontrolled." },
        {
          name: "onValueChange",
          type: "(value, details) => void",
          description: "Runs for people and agents. details.cancel() refuses the change.",
          agent: true,
        },
        {
          name: "onInputValueChange",
          type: "(text, details) => void",
          description: "Runs as the input text changes, including when an agent searches.",
          agent: true,
        },
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starting open state when uncontrolled." },
        {
          name: "onOpenChange",
          type: "(open, details) => void",
          description: "Runs when the list opens or closes, from either side.",
          agent: true,
        },
        { name: "multiple", type: "boolean", default: "false", description: "Holds an array of values. Agents also get setValue.", agent: true },
        { name: "openOnInputClick", type: "boolean", default: "true", description: "Opens the list when the input is clicked." },
        { name: "autoHighlight", type: "boolean", default: "false", description: "Highlights the first match while filtering." },
        {
          name: "itemToStringLabel",
          type: "(value) => string",
          description: "Turns an object value into its label. The agent matches by it too.",
          agent: true,
        },
        { name: "filter", type: "(item, query) => boolean | null", description: "Replaces the built-in filter. `null` turns filtering off." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "readOnly", type: "boolean", default: "false", description: "Refuses any change, from a person or an agent.", agent: true },
        { name: "name", type: "string", description: "Submits the value with a form." },
        { name: "required", type: "boolean", default: "false", description: "Must have a value before the form submits." },
      ],
    },
    {
      name: "ComboboxInputGroup",
      summary: "Wraps the input and buttons; aligns the popup.",
      props: [],
    },
    {
      name: "ComboboxInput",
      summary: "The text field. Typing filters the list.",
      props: [
        { name: "id", type: "string", description: "Point a `<label htmlFor>` at it. The agent reads that label.", agent: true },
        { name: "placeholder", type: "string", description: "Shown while empty. The agent's fallback name for the control." },
      ],
    },
    {
      name: "ComboboxTrigger",
      summary: "The button that opens the list.",
      props: [{ name: "children", type: "ReactNode", default: "<ChevronDown />", description: "Replaces the icon." }],
    },
    {
      name: "ComboboxClear",
      summary: "A button that clears the value.",
      props: [{ name: "children", type: "ReactNode", default: "<X />", description: "Replaces the icon." }],
    },
    {
      name: "ComboboxLabel",
      summary: "A visible label, associated with the trigger.",
      props: [{ name: "children", type: "ReactNode", description: "The label text." }],
    },
    {
      name: "ComboboxContent",
      summary: "The positioned popup, 4px from the field.",
      props: [{ name: "portal", type: "boolean", default: "true", description: "Renders into the body. Pass false to render in place." }],
    },
    {
      name: "ComboboxList",
      summary: "The scrolling list of options.",
      props: [{ name: "children", type: "ReactNode | (item, index) => ReactNode", description: "A function renders each filtered item." }],
    },
    {
      name: "ComboboxItem",
      summary: "One option, with a check while chosen.",
      props: [
        { name: "value", type: "Value", description: "What onValueChange receives." },
        { name: "disabled", type: "boolean", default: "false", description: "Stays in the list but cannot be picked." },
        { name: "inset", type: "boolean", default: "false", description: "Adds left padding for nested layouts." },
      ],
    },
    {
      name: "ComboboxGroup",
      summary: "Groups items under a ComboboxGroupLabel.",
      props: [{ name: "items", type: "Item[]", description: "The group's items, read by a ComboboxCollection inside it." }],
    },
    {
      name: "ComboboxGroupLabel",
      summary: "The heading of a group.",
      props: [{ name: "children", type: "ReactNode", description: "Group name. Not selectable." }],
    },
    {
      name: "ComboboxEmpty",
      summary: "Shown when nothing matches. Needs root `items`.",
      props: [],
    },
    {
      name: "ComboboxStatus",
      summary: "Hidden polite announcement, such as loading status.",
      props: [],
    },
    {
      name: "ComboboxSeparator",
      summary: "A line between groups.",
      props: [],
    },
    {
      name: "ComboboxValue",
      summary: "Renders the current value. No element.",
      props: [
        { name: "placeholder", type: "ReactNode", description: "Shown while there is no value." },
        { name: "children", type: "ReactNode | (value) => ReactNode", description: "Formats the value yourself." },
      ],
    },
    {
      name: "ComboboxCollection",
      summary: "Renders a group's filtered items. No element.",
      props: [{ name: "children", type: "(item, index) => ReactNode", description: "Renders each item." }],
    },
    {
      name: "ComboboxPortal",
      summary: "Base UI's portal, for building a custom popup.",
      props: [],
    },
    {
      name: "createComboboxItems",
      summary: "Builds an item collection from your objects.",
      props: [
        { name: "getValue", type: "(item) => string | number", description: "The value onValueChange receives, such as an id." },
        { name: "getLabel", type: "(item) => string", description: "The text shown and filtered on, and read by the agent." },
      ],
    },
  ],

  notes: [
    {
      title: "Selecting by ID",
      body: "`createComboboxItems` derives each item's value and label, so `value` and `onValueChange` use IDs while the list receives the full object. Create the collection at module scope, or memoize it for runtime data:\n\n```tsx\nconst userItems = React.useMemo(\n  () => createComboboxItems(users, { getValue: (user) => user.id, getLabel: (user) => user.name }),\n  [users]\n)\n```",
    },
    {
      title: "Naming the input",
      body: "`ComboboxLabel` names the trigger. Name the input with a `<label htmlFor>` on its id, or `aria-label`, as in the default example. The agent reads the input's name.",
    },
    {
      title: "Rendering in place",
      body: "`ComboboxContent` portals by default. Pass `portal={false}` to render inside its parent and inherit its stacking.",
    },
  ],

  agent: {
    kind: "combobox",
    reads: [
      { field: "label", means: "The input's label, aria-label, or placeholder." },
      { field: "value", means: "The chosen label, a list of labels when multiple, or null." },
      { field: "open", means: "Whether the list is showing." },
      { field: "items", means: "Every option's label from items, or what the open list shows." },
      { field: "multiple", means: "Present when the combobox holds several values." },
      { field: "disabled", means: "True when the combobox is blocked." },
    ],
    actions: [
      { call: 'select("Svelte")', does: "Picks by label, then by value, open or closed. A miss lists the options." },
      { call: 'search("sv")', does: "Types into the input and returns the labels that match." },
      { call: "open() / close()", does: "Whichever fits the current state." },
      { call: 'setValue(["Vue", "Svelte"])', does: "Replaces the whole list. Only when multiple." },
    ],
    refusal:
      "An agent's change runs through onValueChange, onInputValueChange and onOpenChange like anyone's. isAgentChange(details) is true for it, and details.cancel() refuses it; the agent is told the app refused. A disabled combobox refuses on its own, and readOnly refuses select, setValue and search.",
    example: `await agent.act({
  steps: [{ ref: "Framework", action: "select", args: ["Svelte"] }],
})`,
  },

  keyboard: [
    { keys: ["↓", "↑"], does: "Opens the list, then moves the highlight" },
    { keys: ["Enter"], does: "Picks the highlighted item" },
    { keys: ["Esc"], does: "Closes the list" },
  ],

  accessibility: [
    "The input has role=\"combobox\" and controls the list popup.",
    "Give the input a name with a `<label htmlFor>` or aria-label. The agent reads the same name.",
    "ComboboxEmpty and ComboboxStatus announce changes politely.",
    "The list is a listbox; focus stays in the input as the highlight moves.",
  ],
} satisfies ComponentDoc;
