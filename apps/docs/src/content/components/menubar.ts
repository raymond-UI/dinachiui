import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "menubar",
  description: "A row of application menus, run by a person or an agent.",
  usage: `import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarPortal,
  MenubarPositioner,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function AppMenubar() {
  return (
    <Menubar aria-label="Editor">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarPortal>
          <MenubarPositioner>
            <MenubarContent>
              <MenubarItem onClick={() => newFile()}>New file</MenubarItem>
              <MenubarItem onClick={() => save()}>Save</MenubarItem>
            </MenubarContent>
          </MenubarPositioner>
        </MenubarPortal>
      </MenubarMenu>
    </Menubar>
  )
}`,
  anatomy: `<Menubar>
  <MenubarMenu>
    <MenubarTrigger />
    <MenubarPortal>
      <MenubarPositioner>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel />
            <MenubarItem>
              <MenubarShortcut />
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarCheckboxItem />
          <MenubarRadioGroup>
            <MenubarRadioItem />
          </MenubarRadioGroup>
          <MenubarSub>
            <MenubarSubTrigger />
            <MenubarSubContent />
          </MenubarSub>
        </MenubarContent>
      </MenubarPositioner>
    </MenubarPortal>
  </MenubarMenu>
</Menubar>`,

  examples: ["menubar-default", "menubar-checkbox", "menubar-submenu"],

  parts: [
    {
      name: "Menubar",
      summary: "Holds the menus and moves focus between them.",
      props: [
        { name: "modal", type: "boolean", default: "true", description: "Locks page scroll and outside clicks while a menu is open." },
        { name: "loopFocus", type: "boolean", default: "true", description: "Wraps focus from the last trigger to the first." },
        { name: "disabled", type: "boolean", default: "false", description: "Disables every menu in the bar." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Which arrow keys move between menus." },
        { name: "aria-label", type: "string", description: "Names the bar. The agent reports it as `in` on each menu.", agent: true },
      ],
    },
    {
      name: "MenubarMenu",
      summary: "One menu. Holds its open state.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starting open state when uncontrolled." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs on open or close, for people and agents. `details.cancel()` refuses.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Ignores interaction." },
      ],
    },
    {
      name: "MenubarTrigger",
      summary: "The button that opens its menu.",
      props: [
        { name: "children", type: "ReactNode", description: "The label. Also the name the agent reads.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks the trigger." },
      ],
    },
    {
      name: "MenubarPortal",
      summary: "Renders the popup into the body.",
      props: [],
    },
    {
      name: "MenubarPositioner",
      summary: "Places the popup against its trigger.",
      props: [
        { name: "side", type: '"top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"', default: '"bottom"', description: "Which side of the trigger the popup goes on." },
        { name: "align", type: '"start" | "center" | "end"', default: '"start"', description: "Alignment along that side." },
        { name: "sideOffset", type: "number", default: "4", description: "Gap to the trigger, in pixels." },
      ],
    },
    {
      name: "MenubarContent",
      summary: "The popup, without portal or positioner.",
      props: [{ name: "className", type: "string", description: "Merged with the popup styles." }],
    },
    {
      name: "MenubarItem",
      summary: "One action.",
      props: [
        { name: "onClick", type: "(event) => void", description: "Runs the action. An agent's press triggers it too.", agent: true },
        { name: "closeOnClick", type: "boolean", default: "true", description: "Closes the menu once clicked." },
        { name: "disabled", type: "boolean", default: "false", description: "Skipped by the keyboard, refused for agents.", agent: true },
        { name: "inset", type: "boolean", default: "false", description: "Indents the item to line up with checkbox and radio items." },
      ],
    },
    {
      name: "MenubarCheckboxItem",
      summary: "A toggle item, checked when on.",
      props: [
        { name: "checked", type: "boolean", description: "Controlled checked state.", agent: true },
        { name: "defaultChecked", type: "boolean", default: "false", description: "Starting state when uncontrolled." },
        { name: "onCheckedChange", type: "(checked, details) => void", description: "Runs when it toggles." },
        { name: "closeOnClick", type: "boolean", default: "false", description: "Closes the menu once clicked." },
        { name: "disabled", type: "boolean", default: "false", description: "Skipped by the keyboard, refused for agents.", agent: true },
      ],
    },
    {
      name: "MenubarRadioGroup",
      summary: "Holds the value of its radio items.",
      props: [
        { name: "value", type: "any", description: "Controlled value." },
        { name: "defaultValue", type: "any", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs when another radio item is chosen." },
      ],
    },
    {
      name: "MenubarRadioItem",
      summary: "One radio choice, dotted when chosen.",
      props: [
        { name: "value", type: "any", description: "What the group's onValueChange receives." },
        { name: "disabled", type: "boolean", default: "false", description: "Skipped by the keyboard, refused for agents.", agent: true },
      ],
    },
    {
      name: "MenubarGroup",
      summary: "Groups items under a MenubarLabel.",
      props: [{ name: "children", type: "ReactNode", description: "A MenubarLabel, then items." }],
    },
    {
      name: "MenubarLabel",
      summary: "The heading of a group.",
      props: [{ name: "inset", type: "boolean", default: "false", description: "Indents it to line up with inset items." }],
    },
    {
      name: "MenubarSeparator",
      summary: "A line between items or groups.",
      props: [],
    },
    {
      name: "MenubarShortcut",
      summary: "A keyboard hint. Display only; binds no key.",
      props: [{ name: "children", type: "ReactNode", description: "The shortcut text, such as `⌘S`." }],
    },
    {
      name: "MenubarSub",
      summary: "Holds a nested menu.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs when the submenu opens or closes." },
      ],
    },
    {
      name: "MenubarSubTrigger",
      summary: "Opens a submenu; shows a chevron.",
      props: [
        { name: "openOnHover", type: "boolean", default: "true", description: "Opens the submenu on hover." },
        { name: "inset", type: "boolean", default: "false", description: "Indents it to line up with inset items." },
      ],
    },
    {
      name: "MenubarSubContent",
      summary: "Submenu popup with its own portal and positioner.",
      props: [{ name: "className", type: "string", description: "Merged with the popup styles." }],
    },
  ],

  notes: [
    {
      title: "Composing the popup",
      body: "Wrap `MenubarContent` in `MenubarPortal` and `MenubarPositioner`, as in the usage above. `MenubarSubContent` brings its own.",
    },
  ],

  agent: {
    kind: "menu",
    reads: [
      { field: "label", means: "The trigger's text." },
      { field: "open", means: "Whether that menu's popup is showing." },
      { field: "in", means: "The menubar's aria-label, when it has one." },
    ],
    actions: [
      { call: "open() / close()", does: "Whichever fits the current state. The menu stays listed at its trigger." },
      { call: "press() on an item", does: "Items in the open menu are listed as `menuitem`. Press runs it as a click." },
      { call: "setChecked(true) on a checkbox item", does: "Toggles it. A radio item takes only press." },
    ],
    refusal:
      "Open and close run through MenubarMenu's onOpenChange. isAgentChange(details) is true for an agent's change; details.cancel() refuses it and the agent is told. An item press is an ordinary click to onClick and onCheckedChange. Disabled items refuse on their own.",
    example: `await agent.act({
  steps: [
    { ref: "File", action: "open" },
    { ref: "New Tab", action: "press" },
  ],
})`,
  },

  keyboard: [
    { keys: ["←", "→"], does: "Moves between menus in the bar" },
    { keys: ["Enter", "Space", "↓"], does: "Opens the focused menu" },
    { keys: ["↑", "↓"], does: "Moves the highlight inside an open menu" },
    { keys: ["→"], does: "Opens the highlighted submenu" },
    { keys: ["Esc"], does: "Closes the menu and returns focus to its trigger" },
  ],

  accessibility: [
    "The bar has the menubar role; triggers open menus; items expose checked state.",
    "Name the bar with aria-label when a page has more than one.",
    "Disabled items stay announced but are skipped by the keyboard.",
    "Reduced motion drops the popup's scale and keeps the fade.",
  ],
} satisfies ComponentDoc;
