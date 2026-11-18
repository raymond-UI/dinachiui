import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "detail-list",
  description: "Labelled values for one record, with copy and inline edit.",
  usage: `import { DetailList, DetailListDetails, DetailListItem, DetailListTerm } from "@/components/ui/detail-list"

export function Order() {
  return (
    <DetailList>
      <DetailListItem>
        <DetailListTerm>Customer</DetailListTerm>
        <DetailListDetails>Ada Okafor</DetailListDetails>
      </DetailListItem>
      <DetailListItem copyable editable defaultValue="ada.okafor@fastmail.com">
        <DetailListTerm>Email</DetailListTerm>
        <DetailListDetails />
      </DetailListItem>
    </DetailList>
  )
}`,

  examples: ["detail-list-default", "detail-list-controlled"],

  parts: [
    {
      name: "DetailList",
      summary: "The `dl`. Sets whether labels sit beside values or above them.",
      props: [
        { name: "layout", type: '"side" | "stacked"', default: '"side"', description: "Labels beside values, or above them. Below 768px they always sit above." },
      ],
    },
    {
      name: "DetailListItem",
      summary:
        "One row, holding a term and its details. It owns the value, so copy, edit, validation and the agent all work from the row.",
      props: [
        { name: "value", type: "string", description: "Controlled value.", agent: true },
        { name: "defaultValue", type: "string", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs on every saved edit, a person's or an agent's. `details.cancel()` refuses it.", agent: true },
        { name: "validate", type: "(value) => string | undefined", description: "Return a message to refuse a value. A person sees it under the field; an agent gets it back as the step's error.", agent: true },
        { name: "copyable", type: "boolean", default: "false", description: "Adds a button that copies the value." },
        { name: "editable", type: "boolean", default: "false", description: "Adds a button that edits the value in place, and registers the row with the agent.", agent: true },
        { name: "multiline", type: "boolean", default: "false", description: "Edits in a textarea, saved with Cmd or Ctrl and Enter, so Enter adds a line." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks editing by people and agents. Copy still works.", agent: true },
      ],
    },
    {
      name: "DetailListTerm",
      summary: "The label, as a `dt`. Its text names the row's buttons, its field and its agent entry.",
      props: [],
    },
    {
      name: "DetailListDetails",
      summary: "The value, as a `dd`, with the row's buttons and, while editing, its field.",
      props: [
        { name: "children", type: "ReactNode | (value) => ReactNode", description: "What the row shows. Defaults to the item's value; pass a function to show the value your way, such as in a mono font." },
      ],
    },
  ],

  notes: [
    {
      title: "Actions on demand",
      body: "Copy and Edit show on the row you point at or tab into. Rows without them take no extra space, so a read-only list lines up with an editable one.",
    },
    {
      title: "Editing in place",
      body: "Edit turns the value into a field. Enter saves, Escape cancels, and focus goes back to the Edit button either way. A saved change flashes the row for under 300ms, and not at all with reduced motion.",
    },
    {
      title: "Phone",
      body: "Below 768px labels sit above values, and Copy and Edit are always shown at 44px, since there is no hover.",
    },
  ],

  agent: {
    kind: "input",
    reads: [
      { field: "label", means: "The row's term, such as Email." },
      { field: "component", means: "`input`, or `textarea` for a multiline row." },
      { field: "value", means: "The row's value." },
    ],
    actions: [
      { call: 'setValue("ada@okafor.dev")', does: "Saves a new value and flashes the row, as a person's save does." },
      { call: "clear()", does: "Saves an empty value, through `validate` like any other." },
    ],
    refusal:
      "Each editable row registers itself. An agent's value runs through `validate` first, and its message comes back as the step's error. Then it reaches onValueChange, where isAgentChange(details) is true and details.cancel() refuses it. A row a person is editing refuses the agent, so it never overwrites a draft. Copy buttons are plain buttons the agent can press.",
    example: `await agent.act({
  steps: [{ ref: "Email", action: "setValue", args: ["ada@okafor.dev"] }],
})`,
  },

  keyboard: [
    { keys: ["Tab"], does: "Moves to a row's Copy and Edit buttons, showing them" },
    { keys: ["Enter"], does: "Saves a one-line field" },
    { keys: ["⌘", "Enter"], does: "Saves a multiline field; Ctrl and Enter elsewhere" },
    { keys: ["Esc"], does: "Cancels the edit and puts the old value back" },
  ],

  accessibility: [
    "A native `dl` of `dt` and `dd`, so a screen reader announces each label with its value.",
    "Each button is named by its action and the row, such as Copy Email, through `aria-labelledby` on the term.",
    "Copying says Copied in a polite live region, and the icon turns to a tick. A blocked or missing clipboard says Could not copy.",
    "The field is named by the term. A refused value sets `aria-invalid`, is linked as its description and is announced.",
    "Focus returns to the Edit button after saving or cancelling.",
  ],
} satisfies ComponentDoc;
