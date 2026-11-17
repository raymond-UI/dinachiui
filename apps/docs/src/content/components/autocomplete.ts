import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "autocomplete",
  description: "Free text with suggestions, filled in by a person or an agent.",
  usage: `import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/autocomplete"

const cities = ["London", "Paris", "Tokyo"]

export function CitySearch() {
  return (
    <Autocomplete items={cities}>
      <AutocompleteInput aria-label="City" placeholder="Search cities..." />
      <AutocompleteContent>
        <AutocompleteEmpty>No cities found.</AutocompleteEmpty>
        <AutocompleteList>
          {(city: string) => (
            <AutocompleteItem key={city} value={city}>
              {city}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  )
}`,
  anatomy: `<Autocomplete>
  <AutocompleteInputGroup>
    <AutocompleteInput />
    <AutocompleteClear />
    <AutocompleteTrigger />
  </AutocompleteInputGroup>
  <AutocompleteContent>
    <AutocompleteStatus />
    <AutocompleteEmpty />
    <AutocompleteList>
      <AutocompleteGroup>
        <AutocompleteGroupLabel />
        <AutocompleteItem />
      </AutocompleteGroup>
      <AutocompleteSeparator />
    </AutocompleteList>
  </AutocompleteContent>
</Autocomplete>`,

  examples: ["autocomplete-default", "autocomplete-groups", "autocomplete-clear"],

  parts: [
    {
      name: "Autocomplete",
      summary: "Holds text, suggestions and open state.",
      props: [
        { name: "items", type: "T[] | { value, items: T[] }[]", description: "The suggestions, flat or grouped. The agent reads them while closed.", agent: true },
        { name: "value", type: "string", description: "Controlled input text." },
        { name: "defaultValue", type: "string", default: '""', description: "Starting text when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs when the list opens or closes, from either side. An agent's search opens it first.", agent: true },
        { name: "mode", type: '"list" | "both" | "inline" | "none"', default: '"list"', description: "list filters the items; both also completes inline; inline completes without filtering; none does neither." },
        { name: "openOnInputClick", type: "boolean", default: "false", description: "Opens the list when the input is clicked." },
        { name: "autoHighlight", type: "boolean | \"always\"", default: "false", description: "Highlights the first match while typing, or always." },
        { name: "keepHighlight", type: "boolean", default: "false", description: "Keeps the highlight when the pointer leaves the list." },
        { name: "itemToStringValue", type: "(item) => string", description: "Text for an object item. A `{ value, label }` item defaults to its label." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "readOnly", type: "boolean", default: "false", description: "Blocks typing, and refuses the agent's text.", agent: true },
        { name: "name", type: "string", description: "Submits the text with a form." },
      ],
    },
    {
      name: "AutocompleteInput",
      summary: "The text field.",
      props: [
        { name: "aria-label", type: "string", description: "Names the field without a visible label. The agent reads it, then the placeholder.", agent: true },
        { name: "placeholder", type: "string", description: "Shown while empty." },
      ],
    },
    {
      name: "AutocompleteInputGroup",
      summary: "Wraps the input and buttons as one box.",
      props: [],
    },
    {
      name: "AutocompleteTrigger",
      summary: "The button that opens the list.",
      props: [{ name: "children", type: "ReactNode", default: "<ChevronDown />", description: "Replaces the chevron." }],
    },
    {
      name: "AutocompleteClear",
      summary: "The button that empties the input.",
      props: [{ name: "children", type: "ReactNode", default: "<X />", description: "Replaces the X icon." }],
    },
    {
      name: "AutocompleteContent",
      summary: "The positioned popup, 4px from the input.",
      props: [
        { name: "portal", type: "boolean", default: "true", description: "Renders into the body. Set false inside a Dialog or Drawer." },
      ],
    },
    {
      name: "AutocompleteList",
      summary: "The scrolling list of suggestions.",
      props: [{ name: "children", type: "(item) => ReactNode", description: "Renders each item, or each group, from items." }],
    },
    {
      name: "AutocompleteItem",
      summary: "One suggestion.",
      props: [
        { name: "value", type: "any", description: "The item this row stands for." },
        { name: "inset", type: "boolean", default: "false", description: "Adds left padding for nested layouts." },
        { name: "disabled", type: "boolean", default: "false", description: "Cannot be highlighted or picked." },
      ],
    },
    {
      name: "AutocompleteGroup",
      summary: "Groups items under a label.",
      props: [{ name: "items", type: "T[]", description: "The group's items, for an AutocompleteCollection inside it." }],
    },
    {
      name: "AutocompleteGroupLabel",
      summary: "The heading of a group.",
      props: [],
    },
    {
      name: "AutocompleteEmpty",
      summary: "Shown when nothing matches.",
      props: [],
    },
    {
      name: "AutocompleteStatus",
      summary: "Hidden announced text, such as a result count.",
      props: [],
    },
    {
      name: "AutocompleteSeparator",
      summary: "A line between items or groups.",
      props: [],
    },
    {
      name: "AutocompleteCollection",
      summary: "Renders a group's items from its items prop.",
      props: [{ name: "children", type: "(item) => ReactNode", description: "Renders each item in the group." }],
    },
    {
      name: "AutocompleteValue",
      summary: "Renders the current text elsewhere.",
      props: [],
    },
    {
      name: "AutocompletePortal",
      summary: "Renders its children into the body.",
      props: [],
    },
  ],

  notes: [
    {
      title: "Autocomplete or Combobox",
      body: "Autocomplete holds free text. When the value must be one of the options, use [Combobox](/docs/components/combobox).",
    },
    {
      title: "Inside a Dialog or Drawer",
      body: "`AutocompleteContent` portals by default. Pass `portal={false}` inside a `Dialog` or `Drawer` to keep their stacking.",
    },
  ],

  agent: {
    kind: "combobox",
    reads: [
      { field: "label", means: "The input's aria-label or label, then its placeholder." },
      { field: "value", means: "The text in the input." },
      { field: "items", means: "The suggestions showing while open, or every item passed as items." },
      { field: "disabled", means: "True when the autocomplete is blocked." },
    ],
    actions: [
      { call: 'search("to")', does: "Opens the list, types the text, returns the shown suggestions." },
      { call: 'setValue("Lisbon")', does: "Sets the text outright, even when no suggestion matches." },
    ],
    refusal:
      "An agent's text runs through onValueChange, and search's open through onOpenChange. isAgentChange(details) is true for both; details.cancel() refuses either, and a refused search leaves text and list unchanged. disabled and readOnly refuse on their own.",
    example: `await agent.act({
  steps: [{ ref: "Search cities", action: "search", args: ["to"] }],
})`,
  },

  keyboard: [
    { keys: ["↓", "↑"], does: "Opens the list, or moves the highlight" },
    { keys: ["Enter"], does: "Fills the input with the highlighted item" },
    { keys: ["Esc"], does: "Closes the list" },
  ],

  accessibility: [
    "The input has role combobox, with aria-expanded and aria-controls on the list.",
    "The list is a listbox of options; aria-activedescendant keeps focus in the input.",
    "Name the input with a label or aria-label; a placeholder disappears on typing.",
    "AutocompleteStatus is hidden and announced, for counts such as matching results.",
  ],
} satisfies ComponentDoc;
