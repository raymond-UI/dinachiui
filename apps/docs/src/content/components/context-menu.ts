import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "context-menu",
  description: "Actions for one element, opened by right click, long press or agent.",
  usage: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function FileMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="rounded-md border border-dashed p-8 text-sm">
        Report.pdf
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}`,
  anatomy: `<ContextMenu>
  <ContextMenuTrigger />
  <ContextMenuContent>
    <ContextMenuItem>
      <ContextMenuShortcut />
    </ContextMenuItem>
    <ContextMenuLinkItem />
    <ContextMenuCheckboxItem />
    <ContextMenuGroup>
      <ContextMenuLabel />
      <ContextMenuRadioGroup>
        <ContextMenuRadioItem />
      </ContextMenuRadioGroup>
    </ContextMenuGroup>
    <ContextMenuSeparator />
    <ContextMenuSub>
      <ContextMenuSubTrigger />
      <ContextMenuSubContent />
    </ContextMenuSub>
  </ContextMenuContent>
</ContextMenu>`,

  examples: ["context-menu-default", "context-menu-checkbox", "context-menu-radio", "context-menu-submenu"],

  parts: [
    {
      name: "ContextMenu",
      summary: "Holds the open state.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starting open state when uncontrolled." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs on open and close, from either side. details.cancel() refuses it.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Ignores right clicks and long presses, and blocks agents.", agent: true },
        { name: "loopFocus", type: "boolean", default: "true", description: "Wraps the keyboard highlight from the last item to the first." },
        { name: "highlightItemOnHover", type: "boolean", default: "true", description: "Moves the highlight with the pointer." },
      ],
    },
    {
      name: "ContextMenuTrigger",
      summary: "The area that opens the menu.",
      props: [
        { name: "children", type: "ReactNode", description: "The area's content. Its text, or an aria-label, is the agent's name for it.", agent: true },
        { name: "render", type: "ReactElement", description: "Swap the element, keep the behaviour." },
      ],
    },
    {
      name: "ContextMenuContent",
      summary: "The popup, portalled and positioned at the pointer.",
      props: [{ name: "className", type: "string", description: "Classes for the popup, such as a width." }],
    },
    {
      name: "ContextMenuItem",
      summary: "One action.",
      props: [
        { name: "onClick", type: "(event) => void", description: "Runs when the item is chosen." },
        { name: "inset", type: "boolean", default: "false", description: "Indents the item to line up with checkbox and radio items." },
        { name: "closeOnClick", type: "boolean", default: "true", description: "Closes the menu once chosen." },
        { name: "disabled", type: "boolean", default: "false", description: "Skipped by the keyboard, refused for agents.", agent: true },
      ],
    },
    {
      name: "ContextMenuLinkItem",
      summary: "An item that navigates.",
      props: [
        { name: "href", type: "string", description: "Where the item goes." },
        { name: "closeOnClick", type: "boolean", default: "false", description: "Closes the menu once followed." },
      ],
    },
    {
      name: "ContextMenuCheckboxItem",
      summary: "An item that toggles, with a check when on.",
      props: [
        { name: "checked", type: "boolean", description: "Controlled checked state.", agent: true },
        { name: "defaultChecked", type: "boolean", default: "false", description: "Starting state when uncontrolled." },
        { name: "onCheckedChange", type: "(checked, details) => void", description: "Runs on toggle." },
        { name: "closeOnClick", type: "boolean", default: "false", description: "Closes the menu on toggle." },
        { name: "disabled", type: "boolean", default: "false", description: "Skipped by the keyboard, refused for agents.", agent: true },
      ],
    },
    {
      name: "ContextMenuRadioGroup",
      summary: "Holds the value of a set of radio items.",
      props: [
        { name: "value", type: "any", description: "Controlled value." },
        { name: "defaultValue", type: "any", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs when a radio item is chosen." },
      ],
    },
    {
      name: "ContextMenuRadioItem",
      summary: "One radio choice, dotted when chosen.",
      props: [
        { name: "value", type: "any", description: "What onValueChange receives." },
        { name: "closeOnClick", type: "boolean", default: "false", description: "Closes the menu on choice." },
        { name: "disabled", type: "boolean", default: "false", description: "Skipped by the keyboard, refused for agents.", agent: true },
      ],
    },
    {
      name: "ContextMenuGroup",
      summary: "Groups items under a ContextMenuLabel.",
      props: [{ name: "children", type: "ReactNode", description: "A ContextMenuLabel, then items." }],
    },
    {
      name: "ContextMenuLabel",
      summary: "The heading of a group.",
      props: [{ name: "inset", type: "boolean", default: "false", description: "Indents the label to line up with checkbox and radio items." }],
    },
    {
      name: "ContextMenuSeparator",
      summary: "A line between groups.",
      props: [],
    },
    {
      name: "ContextMenuShortcut",
      summary: "A display-only key hint.",
      props: [{ name: "children", type: "ReactNode", description: "The shortcut text, for example ⌘R." }],
    },
    {
      name: "ContextMenuSub",
      summary: "Holds the open state of a submenu.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs when the submenu opens or closes." },
      ],
    },
    {
      name: "ContextMenuSubTrigger",
      summary: "Opens a submenu; shows a chevron.",
      props: [
        { name: "inset", type: "boolean", default: "false", description: "Indents the item to line up with checkbox and radio items." },
        { name: "disabled", type: "boolean", default: "false", description: "Keeps the submenu shut." },
      ],
    },
    {
      name: "ContextMenuSubContent",
      summary: "The submenu popup, portalled beside its trigger.",
      props: [{ name: "className", type: "string", description: "Classes for the popup." }],
    },
    {
      name: "ContextMenuPortal",
      summary: "Portals children to the body. ContextMenuContent includes it.",
      props: [],
    },
    {
      name: "ContextMenuPositioner",
      summary: "Positions the popup. ContextMenuContent includes it.",
      props: [],
    },
  ],

  notes: [
    {
      title: "Checkbox and radio items",
      body: "`ContextMenuCheckboxItem` and `ContextMenuRadioItem` keep the menu open when chosen. Pass `closeOnClick` to close on choice.",
    },
  ],

  agent: {
    kind: "menu",
    reads: [
      { field: "label", means: "The trigger's aria-label or text while closed." },
      { field: "open", means: "Whether the menu is showing." },
      { field: "disabled", means: "True when the whole menu is disabled." },
    ],
    actions: [
      { call: "open() / close()", does: "Whichever fits the current state. Needs no pointer." },
      { call: "press()", does: "On an item, once the menu is open. Items are listed as `menuitem`." },
      { call: "setChecked(true)", does: "On a checkbox item. Presses it only if the state differs." },
    ],
    refusal:
      "Opening and closing run through onOpenChange. isAgentChange(details) is true for an agent's change, and details.cancel() refuses it; the agent is told the app refused. Item presses arrive as ordinary clicks; refuse those in the item's handler. A disabled menu and disabled items refuse on their own.",
    example: `await agent.act({
  steps: [{ ref: "Right click here", action: "open" }],
})`,
  },

  keyboard: [
    { keys: ["↑", "↓"], does: "Moves the highlight" },
    { keys: ["Home", "End"], does: "Jumps to the first or last item" },
    { keys: ["Enter", "Space"], does: "Chooses the highlighted item" },
    { keys: ["→"], does: "Opens the highlighted submenu" },
    { keys: ["←"], does: "Closes the current submenu" },
    { keys: ["A", "Z"], range: true, does: "Jumps to the next item starting with that letter" },
    { keys: ["Esc"], does: "Closes the menu" },
  ],

  accessibility: [
    "The popup is a menu; items are menuitem, menuitemcheckbox or menuitemradio, with checked state.",
    "On touch, a 500ms long press opens the menu.",
    "Right click is hard to discover and absent on many devices. Offer the actions elsewhere too.",
    "Disabled items stay announced but are skipped by the keyboard.",
  ],
} satisfies ComponentDoc;
