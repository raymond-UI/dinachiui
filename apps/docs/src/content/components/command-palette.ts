import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "command-palette",
  description: "One search for every page, action and record, opened with Cmd or Ctrl+K and run by a person or an agent.",
  usage: `import { FileText, Receipt } from "lucide-react"
import {
  CommandPalette,
  CommandPaletteBody,
  CommandPaletteContent,
  CommandPaletteInput,
  CommandPaletteList,
  CommandPalettePreview,
  CommandPaletteTrigger,
  type CommandItem,
} from "@/components/ui/command-palette"

const commands: CommandItem[] = [
  { id: "orders", label: "Orders", group: "Pages", kind: "Page", icon: <FileText />, shortcut: "G O" },
  {
    id: "order-4821",
    label: "Order #4821",
    description: "Ada Okafor",
    group: "Orders",
    kind: "Order",
    icon: <Receipt />,
    actions: [
      { id: "open", label: "Open order" },
      { id: "refund", label: "Refund" },
    ],
  },
]

export function Search({ run }: { run: (id: string, action?: string) => void }) {
  return (
    <CommandPalette items={commands} recent={["order-4821"]} onRun={(item, action) => run(item.id, action?.id)}>
      <CommandPaletteTrigger />
      <CommandPaletteContent>
        <CommandPaletteInput />
        <CommandPaletteBody>
          <CommandPaletteList />
          <CommandPalettePreview placeholder="Type to search pages and orders." />
        </CommandPaletteBody>
      </CommandPaletteContent>
    </CommandPalette>
  )
}`,
  anatomy: `<CommandPalette>
  <CommandPaletteTrigger />
  <CommandPaletteContent>
    <CommandPaletteInput />
    <CommandPaletteBody>
      <CommandPaletteList>
        {(item) => <CommandPaletteItem item={item} />}
      </CommandPaletteList>
      <CommandPalettePreview />
    </CommandPaletteBody>
  </CommandPaletteContent>
</CommandPalette>`,

  examples: ["command-palette-default", "command-palette-list-only"],

  parts: [
    {
      name: "CommandPalette",
      summary: "Holds the commands, the search, the open state and the sub-list you are in.",
      props: [
        { name: "items", type: "CommandItem[]", description: "Every command, in the order groups and rows are listed. The agent reads them while closed.", agent: true },
        { name: "recent", type: "string[]", description: "Ids listed first, under Recent, while the search is empty." },
        { name: "recentLabel", type: "string", default: '"Recent"', description: "The heading over recent items." },
        { name: "onRun", type: "(item, action, details) => void", description: "Runs a picked item with its first action, or the one asked for. details.cancel() keeps the palette open.", agent: true },
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starts open when uncontrolled." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "value", type: "string", description: "Controlled search text." },
        { name: "defaultValue", type: "string", default: '""', description: "Starting search text." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs as the search changes, from either side.", agent: true },
        { name: "shortcut", type: "string | false", default: '"k"', description: "The letter that toggles it with Cmd or Ctrl. false turns it off." },
        { name: "label", type: "string", default: '"Command palette"', description: "Names the dialog and the field. The agent finds the palette by it.", agent: true },
        { name: "filter", type: "(item, query) => boolean", default: "filterCommands", description: "Decides what matches. The default needs every word in the label, description or keywords." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks the trigger, the shortcut and the agent.", agent: true },
      ],
    },
    {
      name: "CommandPaletteTrigger",
      summary: "A search-style button with the shortcut hint. The agent sees the closed palette through it.",
      props: [{ name: "children", type: "ReactNode", description: "Replaces the icon, Search and ⌘K." }],
    },
    {
      name: "CommandPaletteContent",
      summary: "The dialog. 720px under the top of the screen on a desktop; full screen on a phone.",
      props: [{ name: "className", type: "string", description: "Sizes the panel, such as sm:w-[520px]." }],
    },
    {
      name: "CommandPaletteInput",
      summary: "The search field, with Esc on a desktop and Cancel on a phone. Shows the sub-list you are in.",
      props: [
        { name: "placeholder", type: "string", default: '"Search or run a command"', description: "Shown while empty, at the top level." },
        { name: "cancelLabel", type: "string", default: '"Cancel"', description: "The phone's close button." },
      ],
    },
    {
      name: "CommandPaletteBody",
      summary: "Lays the list and preview side by side, 380px tall on a desktop.",
      props: [],
    },
    {
      name: "CommandPaletteList",
      summary: "The grouped results and the empty state.",
      props: [
        { name: "children", type: "(item) => ReactNode", default: "CommandPaletteItem", description: "Renders each row." },
        { name: "empty", type: "ReactNode | (query) => ReactNode", description: "Shown when nothing matches." },
      ],
    },
    {
      name: "CommandPaletteItem",
      summary: "One row: icon, label with the matched words in bold, description, meta and shortcut.",
      props: [
        { name: "item", type: "CommandItem", description: "The command this row stands for." },
        { name: "children", type: "ReactNode", description: "Replaces the row's content. Highlight and picking stay." },
      ],
    },
    {
      name: "CommandPalettePreview",
      summary: "The highlighted item and its actions beside the list; on a phone, the screen a record opens into.",
      props: [
        { name: "children", type: "(item) => ReactNode", description: "The item's own fields, under its name." },
        { name: "placeholder", type: "ReactNode", description: "Shown while nothing is highlighted." },
        { name: "actionLabel", type: "string", default: '"Open"', description: "The button for an item without actions." },
        { name: "backLabel", type: "string", default: '"Search"', description: "The phone's way back to the results." },
      ],
    },
    {
      name: "CommandPaletteShortcut",
      summary: "A key hint, as rows and the trigger use.",
      props: [],
    },
  ],

  notes: [
    {
      title: "The item shape",
      body: "A `CommandItem` is plain data: `id`, `label`, and optionally `description`, `group`, `kind`, `icon`, `shortcut`, `meta`, `keywords`, `disabled`, `actions` and `items`. `actions` is a list of `{ id, label }`: Enter runs the first, Cmd or Ctrl+Enter the second. `items` makes it a sub-list that opens in place. The same shape can feed other command surfaces, so keep app logic in `onRun` rather than on the items.",
    },
    {
      title: "What stays in your app",
      body: "The palette lays out a record's name and actions. Its fields, such as an order's status and amount, come from `CommandPalettePreview`'s children. What running does, and any toast after it, is `onRun`'s job. `shortcut` on an item is a hint; binding it is up to you.",
    },
    {
      title: "No motion",
      body: "It is opened from the keyboard many times a day, so it never animates: no scale, fade or backdrop fade, and the highlight and sub-lists change at once. `CommandPaletteContent` undoes the Dialog's transition on its own popup and backdrop, so other dialogs keep theirs. The phone screen appears at once too, as the keyboard already rises under it.",
    },
    {
      title: "On a phone",
      body: "Below 640px it fills the screen with the field at the bottom, above the keyboard, and the best match just above the field. A record with more than one action opens a detail screen with the keyboard down and the actions within reach. Rows and Cancel are 44px or taller.",
    },
    {
      title: "In these docs",
      body: "The site's search holds Cmd+K, so the demos here open from their button.",
    },
  ],

  agent: {
    kind: "combobox",
    reads: [
      { field: "label", means: "The palette's label." },
      { field: "open", means: "True while the palette is showing." },
      { field: "value", means: "The search text, while open." },
      { field: "items", means: "Every command on the current level while closed, or the matches while open." },
      { field: "disabled", means: "True when the palette is blocked." },
    ],
    actions: [
      { call: "open() / close()", does: "Opens or closes the palette." },
      { call: 'search("refund")', does: "Opens it, types the text, returns the matches with their group and actions." },
      { call: 'select("Order #4821", "Refund")', does: "Runs a command, with its first action or the one named, and closes. A sub-list opens and returns its commands." },
    ],
    refusal:
      "Opening and closing run through onOpenChange, the search through onValueChange and running through onRun. isAgentChange(details) is true for each; details.cancel() refuses it and the agent is told. disabled refuses everything. The agent sees a closed palette through its trigger, so render CommandPaletteTrigger for an agent to find it before it opens.",
    example: `await agent.act({
  steps: [
    { ref: "Command palette", action: "search", args: ["4821"] },
    { ref: "Command palette", action: "select", args: ["Order #4821", "Refund"] },
  ],
})`,
  },

  keyboard: [
    { keys: ["⌘", "K"], does: "Opens or closes the palette" },
    { keys: ["↓", "↑"], does: "Moves the highlight" },
    { keys: ["Enter"], does: "Runs the highlighted item, or opens its sub-list" },
    { keys: ["⌘", "Enter"], does: "Runs the highlighted item's second action" },
    { keys: ["Esc"], does: "Leaves a sub-list, or closes the palette" },
    { keys: ["Backspace"], does: "Leaves a sub-list when the search is empty" },
  ],

  accessibility: [
    "The palette is a modal dialog named by label; focus moves to the search and returns to the trigger on close.",
    "The search has role combobox and the results are a listbox of options; aria-activedescendant keeps focus in the field.",
    "Groups are labelled by their headings. On a phone they are reversed visually only, so reading order stays best match first.",
    "Matched words are marked with mark, and shortcuts are kbd.",
  ],
} satisfies ComponentDoc;
