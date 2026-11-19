import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "omnibar",
  description: "The header's search field, grown in place into scoped results with each row's actions inline. On a phone it becomes a full-screen search.",
  usage: `import { BedDouble, User } from "lucide-react"
import {
  Omnibar,
  OmnibarContent,
  OmnibarInput,
  OmnibarList,
  OmnibarScopes,
  OmnibarTrigger,
  type CommandItem,
  type OmnibarScope,
} from "@/components/ui/omnibar"

const commands: CommandItem[] = [
  {
    id: "tomas",
    label: "Tomás Herrera",
    description: "Arriving 14:00",
    group: "Guests",
    icon: <User />,
    actions: [
      { id: "check-in", label: "Check in" },
      { id: "message", label: "Message" },
    ],
  },
  { id: "room-108", label: "Room 108", description: "Garden Single", group: "Rooms", icon: <BedDouble /> },
]

const scopes: OmnibarScope[] = [
  { id: "guests", label: "Guests", prefix: "@" },
  { id: "rooms", label: "Rooms", prefix: "#" },
]

export function DeskSearch({ run }: { run: (id: string, action?: string) => void }) {
  return (
    <Omnibar items={commands} scopes={scopes} onRun={(item, action) => run(item.id, action?.id)}>
      <OmnibarTrigger />
      <OmnibarContent>
        <OmnibarInput />
        <OmnibarScopes />
        <OmnibarList />
      </OmnibarContent>
    </Omnibar>
  )
}`,
  anatomy: `<Omnibar>
  <OmnibarTrigger />
  <OmnibarContent>
    <OmnibarInput />
    <OmnibarScopes />
    <OmnibarList>
      {(item) => <OmnibarItem item={item} />}
    </OmnibarList>
  </OmnibarContent>
</Omnibar>`,

  examples: ["omnibar-default", "omnibar-unscoped"],

  parts: [
    {
      name: "Omnibar",
      summary: "Holds the commands, the scopes, the search and the open state.",
      props: [
        { name: "items", type: "CommandItem[]", description: "Every command, in the order groups and rows are listed. The same shape as the Command Palette's. The agent reads them while closed.", agent: true },
        { name: "scopes", type: "OmnibarScope[]", description: "The chips after All. Each holds the items whose group is its label, or what its match function picks; a prefix such as @ picks it by typing." },
        { name: "recent", type: "string[]", description: "Ids listed first, under Recent, while the search is empty and no scope is picked." },
        { name: "recentLabel", type: "string", default: '"Recent"', description: "The heading over recent items." },
        { name: "suggested", type: "string[]", description: "Ids listed after Recent while the search is empty and no scope is picked, such as the main actions. Without it, the items after Recent." },
        { name: "idleLimit", type: "number", default: "8", description: "How many rows show while the search is empty. Applies once recent or suggested is set; without either, the list shows up to limit." },
        { name: "limit", type: "number", default: "50", description: "The most rows the list renders, searching or idle. The count read out says how many matched in all, and an agent's search returns the same rows people see." },
        { name: "onRun", type: "(item, action, details) => void", description: "Runs a picked item with the action chosen, or its first. details.cancel() keeps it open.", agent: true },
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starts open when uncontrolled." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "value", type: "string", description: "Controlled search text, without the scope's prefix." },
        { name: "defaultValue", type: "string", default: '""', description: "Starting search text." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs as the search changes, from either side.", agent: true },
        { name: "scope", type: "string | null", description: "Controlled scope id. null is All." },
        { name: "defaultScope", type: "string | null", default: "null", description: "Starting scope when uncontrolled." },
        { name: "onScopeChange", type: "(scope) => void", description: "Runs when a chip, a prefix, Backspace or an agent changes the scope." },
        { name: "shortcut", type: "string | false", default: '"/"', description: 'The key that focuses it from the page. Ignored while typing in another field. "mod+j" asks for Cmd or Ctrl and works anywhere. false turns it off.' },
        { name: "label", type: "string", default: '"Search"', description: "Names the field and the panel. The agent finds the omnibar by it.", agent: true },
        { name: "filter", type: "(item, query) => boolean", default: "filterCommands", description: "Decides what matches. The default needs every word in the label, description or keywords." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks the field, the shortcut and the agent.", agent: true },
      ],
    },
    {
      name: "OmnibarTrigger",
      summary: "The field in the header while closed, with its shortcut hint. Typing a letter on it starts the search with that letter.",
      props: [
        { name: "placeholder", type: "string", default: '"Search or run a command"', description: "The field's text." },
        { name: "children", type: "ReactNode", description: "Replaces the icon, text and hint." },
      ],
    },
    {
      name: "OmnibarContent",
      summary: "The panel: 560px wide, laid over the field so its search lines up with it, on a desktop; the whole screen on a phone.",
      props: [
        { name: "align", type: '"start" | "center" | "end"', default: '"end"', description: "Which edge of the field the wider panel keeps. It narrows to fit the space the field has, so it never runs past its clipping container or the screen." },
        { name: "className", type: "string", description: "Sizes the panel, such as sm:w-[400px]." },
      ],
    },
    {
      name: "OmnibarInput",
      summary: "The search, with the scope as a chip before it. Esc on a desktop, Cancel on a phone.",
      props: [
        { name: "placeholder", type: "string", default: '"Search or run a command"', description: "Shown while empty and unscoped. A scope shows Search and its name." },
        { name: "phonePlaceholder", type: "string", default: "placeholder", description: "A shorter placeholder for the narrower phone field. Prefixes are not typed there, so leave them out." },
        { name: "cancelLabel", type: "string", default: '"Cancel"', description: "The phone's close button." },
      ],
    },
    {
      name: "OmnibarScopes",
      summary: "All and a chip per scope, with its prefix on a desktop. Renders nothing without scopes.",
      props: [
        { name: "allLabel", type: "string", default: '"All"', description: "The first chip." },
        { name: "aria-label", type: "string", default: '"Scope"', description: "Names the group of chips." },
      ],
    },
    {
      name: "OmnibarList",
      summary: "The grouped results, the empty state, and on a phone the action sheet a row's ⋯ opens.",
      props: [
        { name: "children", type: "(item) => ReactNode", default: "OmnibarItem", description: "Renders each row." },
        { name: "empty", type: "ReactNode | (query) => ReactNode", description: "Shown when nothing matches." },
      ],
    },
    {
      name: "OmnibarItem",
      summary: "One row: icon, label with the matched words in bold, description, and its actions once highlighted.",
      props: [
        { name: "item", type: "CommandItem", description: "The command this row stands for." },
        { name: "children", type: "ReactNode", description: "Replaces the row's content. Highlight and picking stay." },
      ],
    },
  ],

  notes: [
    {
      title: "Scopes",
      body: "A scope narrows the list to one kind of record. Pick it from its chip, or type its prefix first: `@tom` searches guests for tom. A prefix only works from All, so a scoped search can hold an @. Backspace on an empty search goes back to All. By default a scope holds the items whose `group` is its label; give it `match` when the groups do not line up.",
    },
    {
      title: "Actions on the row",
      body: "The highlighted row shows its actions when it has more than one. Tab and Shift+Tab move between them, Enter runs the one picked, and a click runs the one clicked. Moving the highlight or typing starts again from the first. A row with one action, or none, leaves Tab alone. Disabled rows show no actions and are listed last, so the first highlight is always one Enter can run.",
    },
    {
      title: "Long lists",
      body: "The list renders at most `limit` rows, 50 by default, so a search over thousands of records stays quick: keep typing to narrow it. Moving the highlight re-renders only the two rows it leaves and lands on, and rows are memoized, so a custom `OmnibarList` child that returns an `OmnibarItem` keeps that.",
    },
    {
      title: "The item shape",
      body: "`CommandItem`, `CommandAction`, `CommandRunDetails` and `filterCommands` live in `command-items`, which `dinachi add omnibar` installs alongside, and the Command Palette uses the same module, so one list can feed both. A sub-list's items are listed in its place here, as the omnibar has no levels.",
    },
    {
      title: "No motion",
      body: "It is used many times a day, so it never animates: the field does not grow, the panel does not fade in, and the results, highlight and scope change at once. On a phone the action sheet is a Drawer and keeps its own slide.",
    },
    {
      title: "On a phone",
      body: "Below 640px the field opens a full-screen search with Cancel, and chips without prefixes. The best match carries its actions as buttons; other rows have a ⋯ that opens them in a sheet. Rows, chips, the ⋯ menus, buttons and Cancel take a tap of 44px or more, the sheet's actions 50px. Give `OmnibarInput` a `phonePlaceholder` when its placeholder is long.",
    },
  ],

  agent: {
    kind: "combobox",
    reads: [
      { field: "label", means: "The omnibar's label." },
      { field: "open", means: "True while the panel is showing." },
      { field: "value", means: "The search text, with the scope's prefix in front, while open." },
      { field: "items", means: "Every command while closed, or the matches while open." },
      { field: "disabled", means: "True when the omnibar is blocked." },
    ],
    actions: [
      { call: "open() / close()", does: "Opens or closes the panel." },
      { call: 'search("tom", "Guests")', does: "Opens it, picks the scope if named, types the text and returns the matches with their group and actions. A prefix in the text picks its scope too." },
      { call: 'select("Tomás Herrera", "Check in")', does: "Runs a command with its first action or the one named, and closes." },
    ],
    refusal:
      "Opening and closing run through onOpenChange, the search through onValueChange and running through onRun. isAgentChange(details) is true for each; details.cancel() refuses it and the agent is told. disabled refuses everything. The agent finds a closed omnibar through its field, so render OmnibarTrigger.",
    example: `await agent.act({
  steps: [
    { ref: "Search the desk", action: "search", args: ["tom", "Guests"] },
    { ref: "Search the desk", action: "select", args: ["Tomás Herrera", "Check in"] },
  ],
})`,
  },

  keyboard: [
    { keys: ["/"], does: "Opens the omnibar from anywhere but another field" },
    { keys: ["↓", "↑"], does: "Moves the highlight" },
    { keys: ["Tab"], does: "Moves to the highlighted row's next action" },
    { keys: ["Shift", "Tab"], does: "Moves to its previous action" },
    { keys: ["Enter"], does: "Runs the highlighted row's picked action" },
    { keys: ["Backspace"], does: "Goes back to All when the search is empty" },
    { keys: ["Esc"], does: "Closes the panel" },
  ],

  accessibility: [
    "The field is a button named by label while closed; the panel is a popover dialog with the same name, and focus moves to its search and back to the field on close.",
    "The search has role combobox and the results are a listbox named by label; aria-activedescendant keeps focus in the search.",
    "Scope chips are toggle buttons in a group named Scope; the picked one is aria-pressed.",
    "An option holds no controls. Its actions are pointer targets hidden from assistive tech; the highlighted option is described by what Enter runs, such as Enter: Message, and moving it with Tab is announced politely.",
    "Matched words are marked with mark. The number of matches and a change of scope, from a chip, a typed prefix or Backspace, are announced politely.",
    "On a phone the panel is modal: it has aria-modal and the rest of the page is hidden from assistive tech while it is up. Each ⋯ is a button beside its option named Actions for and the item, and the sheet is a Drawer named by the item that returns focus to its ⋯ when it closes.",
  ],
} satisfies ComponentDoc;
