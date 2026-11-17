import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "menu",
  description: "A list of actions behind a button, for people and agents.",
  usage: `import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu"

export function ProjectActions() {
  return (
    <Menu>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem onClick={() => rename()}>Rename</MenuItem>
        <MenuItem onClick={() => duplicate()}>Duplicate</MenuItem>
      </MenuContent>
    </Menu>
  )
}`,
  anatomy: `<Menu>
  <MenuTrigger />
  <MenuContent>
    <MenuGroup>
      <MenuLabel />
      <MenuItem>
        <MenuShortcut />
      </MenuItem>
      <MenuLinkItem />
    </MenuGroup>
    <MenuSeparator />
    <MenuCheckboxItem />
    <MenuRadioGroup>
      <MenuRadioItem />
    </MenuRadioGroup>
    <MenuSub>
      <MenuSubTrigger />
      <MenuSubContent />
    </MenuSub>
  </MenuContent>
</Menu>`,

  examples: ["menu-default", "menu-checkbox", "menu-radio", "menu-submenu", "menu-filter", "menu-filter-submenu"],

  parts: [
    {
      name: "Menu",
      summary: "Holds the open state.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starting open state when uncontrolled." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs on open and close, for people and agents. `details.cancel()` refuses.", agent: true },
        { name: "modal", type: "boolean", default: "true", description: "Locks page scroll and outside clicks while open." },
        { name: "loopFocus", type: "boolean", default: "true", description: "Wraps keyboard focus from the last item to the first." },
        { name: "disabled", type: "boolean", default: "false", description: "Ignores interaction." },
        { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Which arrow keys move between items." },
      ],
    },
    {
      name: "MenuTrigger",
      summary: "The button that opens the menu.",
      props: [
        { name: "children", type: "ReactNode", description: "The label. Also the name the agent reads.", agent: true },
        { name: "openOnHover", type: "boolean", default: "false", description: "Opens on hover as well as on press." },
        { name: "delay", type: "number", default: "100", description: "Milliseconds before a hover opens it." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks the trigger." },
        { name: "render", type: "ReactElement", description: "Swap the element, keep the behaviour." },
      ],
    },
    {
      name: "MenuContent",
      summary: "The popup, portalled, 6px from the trigger.",
      props: [{ name: "className", type: "string", description: "Merged with the popup styles." }],
    },
    {
      name: "MenuItem",
      summary: "One action.",
      props: [
        { name: "onClick", type: "(event) => void", description: "Runs the action. An agent's press triggers it too.", agent: true },
        { name: "closeOnClick", type: "boolean", default: "true", description: "Closes the menu once clicked." },
        { name: "disabled", type: "boolean", default: "false", description: "Skipped by the keyboard, refused for agents.", agent: true },
        { name: "inset", type: "boolean", default: "false", description: "Indents the item to line up with checkbox and radio items." },
      ],
    },
    {
      name: "MenuLinkItem",
      summary: "A navigating item, rendered as an anchor.",
      props: [
        { name: "href", type: "string", description: "Where the item goes." },
        { name: "closeOnClick", type: "boolean", default: "false", description: "Closes the menu once clicked." },
        { name: "render", type: "ReactElement", description: "Swap in a router's link." },
      ],
    },
    {
      name: "MenuCheckboxItem",
      summary: "A toggle item, checked when on.",
      props: [
        { name: "checked", type: "boolean", description: "Controlled checked state.", agent: true },
        { name: "defaultChecked", type: "boolean", default: "false", description: "Starting state when uncontrolled." },
        { name: "onCheckedChange", type: "(checked, details) => void", description: "Runs when ticked or unticked." },
        { name: "closeOnClick", type: "boolean", default: "false", description: "Closes the menu once clicked." },
        { name: "disabled", type: "boolean", default: "false", description: "Skipped by the keyboard, refused for agents.", agent: true },
      ],
    },
    {
      name: "MenuRadioGroup",
      summary: "Holds the value of its radio items.",
      props: [
        { name: "value", type: "any", description: "Controlled value." },
        { name: "defaultValue", type: "any", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs when another radio item is chosen." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks every item in the group." },
      ],
    },
    {
      name: "MenuRadioItem",
      summary: "One radio choice, dotted when chosen.",
      props: [
        { name: "value", type: "any", description: "What the group's onValueChange receives." },
        { name: "closeOnClick", type: "boolean", default: "false", description: "Closes the menu once clicked." },
        { name: "disabled", type: "boolean", default: "false", description: "Skipped by the keyboard, refused for agents.", agent: true },
      ],
    },
    {
      name: "MenuGroup",
      summary: "Groups items under a MenuLabel.",
      props: [{ name: "children", type: "ReactNode", description: "A MenuLabel, then items." }],
    },
    {
      name: "MenuLabel",
      summary: "The heading of a group.",
      props: [{ name: "inset", type: "boolean", default: "false", description: "Indents the label to line up with inset items." }],
    },
    {
      name: "MenuSeparator",
      summary: "A line between items or groups.",
      props: [],
    },
    {
      name: "MenuShortcut",
      summary: "A display-only key hint; binds no key.",
      props: [{ name: "children", type: "ReactNode", description: "The shortcut text, such as `⌘S`." }],
    },
    {
      name: "MenuSub",
      summary: "Holds a nested menu.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs when the submenu opens or closes." },
        { name: "closeParentOnEsc", type: "boolean", default: "false", description: "Escape also closes the parent menu." },
      ],
    },
    {
      name: "MenuSubTrigger",
      summary: "Opens a submenu; shows a chevron.",
      props: [
        { name: "openOnHover", type: "boolean", default: "true", description: "Opens the submenu on hover." },
        { name: "delay", type: "number", default: "100", description: "Milliseconds before a hover opens it." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks the submenu." },
        { name: "inset", type: "boolean", default: "false", description: "Indents it to line up with inset items." },
      ],
    },
    {
      name: "MenuSubContent",
      summary: "The submenu popup, with its own portal and positioner.",
      props: [{ name: "className", type: "string", description: "Merged with the popup styles." }],
    },
    {
      name: "MenuFilter",
      summary: "Makes the Menu or MenuSub inside it filterable.",
      props: [
        { name: "value", type: "string", description: "Controlled filter query." },
        { name: "defaultValue", type: "string", description: "Starting query when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs when the query changes." },
        { name: "filter", type: "((text, query) => boolean) | null", description: "Decides whether an item matches. `null` leaves filtering to you." },
        { name: "autoHighlight", type: 'boolean | "always"', default: "false", description: "Highlights the first match while there is a query, or always." },
      ],
    },
    {
      name: "MenuInput",
      summary: "Search field, with icon, atop a filterable popup.",
      props: [
        { name: "placeholder", type: "string", description: "Shown while the query is empty." },
        { name: "children", type: "ReactNode", description: "Rendered after the input, for a MenuClear." },
      ],
    },
    {
      name: "MenuClear",
      summary: "A button that empties the query.",
      props: [{ name: "children", type: "ReactNode", default: "<X />", description: "Replaces the icon." }],
    },
    {
      name: "MenuEmpty",
      summary: "Shown when no item matches the query.",
      props: [{ name: "children", type: "ReactNode", description: "The empty message." }],
    },
    {
      name: "MenuList",
      summary: "Scrolling item list in a filterable popup.",
      props: [{ name: "children", type: "ReactNode", description: "Items and groups." }],
    },
    {
      name: "MenuPortal",
      summary: "Portals children to the body. MenuContent includes one.",
      props: [],
    },
    {
      name: "MenuPositioner",
      summary: "Places the popup. MenuContent includes one.",
      props: [
        { name: "side", type: '"top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"', default: '"bottom"', description: "Which side of the trigger the popup goes on." },
        { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "How the popup lines up along that side." },
        { name: "sideOffset", type: "number", default: "6", description: "Gap to the trigger, in pixels." },
      ],
    },
  ],

  notes: [
    {
      title: "Positioning",
      body: "`MenuContent` includes its portal and positioner and takes no positioning props. To change side, alignment or offset, compose `MenuPortal` and `MenuPositioner` around a popup.",
    },
    {
      title: "Filtering",
      body: "- Wrap the menu in `MenuFilter`, put `MenuInput` at the top of the popup and the items inside `MenuList`. `MenuEmpty` shows when nothing matches.\n- A filterable submenu needs its own `MenuFilter` around `MenuSub`.\n- To separate groups, mark each `data-filter-section` and start it with `<MenuSeparator data-filter-separator className=\"hidden\" />`. `MenuList` shows it only between two visible groups.\n- Filtering is a Base UI preview; its API may change.",
    },
  ],

  agent: {
    kind: "menu",
    reads: [
      { field: "label", means: "The trigger's text, or the popup's own name if set." },
      { field: "open", means: "Whether the popup is showing. Closed, the agent sees the trigger; open, the popup." },
    ],
    actions: [
      { call: "open() / close()", does: "Whichever fits the current state." },
      { call: 'press() on an item', does: "Items are listed inside the open menu as `menuitem`. Runs the item as a click." },
      { call: "setChecked(true) on a checkbox item", does: "Ticks or unticks it. Radio items take only press." },
    ],
    refusal:
      "Opening and closing run through onOpenChange. isAgentChange(details) is true for an agent's change, and details.cancel() refuses it; the agent is told the app refused. An item press is a click, so onClick and onCheckedChange get an ordinary event. Disabled items refuse on their own.",
    example: `await agent.act({
  steps: [
    { ref: "Open Menu", action: "open" },
    { ref: "Profile", action: "press" },
  ],
})`,
  },

  keyboard: [
    { keys: ["Enter", "Space"], does: "Opens the menu from the trigger, or runs the highlighted item" },
    { keys: ["↑", "↓"], does: "Moves the highlight" },
    { keys: ["→"], does: "Opens the highlighted submenu" },
    { keys: ["←"], does: "Closes the submenu and returns to its trigger" },
    { keys: ["Home", "End"], does: "Jumps to the first or last item" },
    { keys: ["A", "Z"], range: true, does: "Jumps to the next item starting with that letter" },
    { keys: ["Esc"], does: "Closes and returns focus to the trigger" },
  ],

  accessibility: [
    "The trigger is a button; items are menuitem, menuitemcheckbox or menuitemradio, with checked state.",
    "Give an icon-only trigger an aria-label. The agent uses the same name.",
    "Disabled items stay announced but are skipped by the keyboard.",
    "Focus returns to the trigger when the menu closes.",
    "Reduced motion drops the popup's scale and keeps the fade.",
  ],
} satisfies ComponentDoc;
