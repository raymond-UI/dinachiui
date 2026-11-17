import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "navigation-menu",
  description: "Site navigation with panels of links, opened by a person or an agent.",
  usage: `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

export function SiteNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
            <NavigationMenuLink href="/analytics">Analytics</NavigationMenuLink>
            <NavigationMenuLink href="/billing">Billing</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup>
            <NavigationMenuViewport />
          </NavigationMenuPopup>
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  )
}`,
  anatomy: `<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger />
      <NavigationMenuContent>
        <NavigationMenuLink />
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink />
    </NavigationMenuItem>
  </NavigationMenuList>
  <NavigationMenuPortal>
    <NavigationMenuBackdrop />
    <NavigationMenuPositioner>
      <NavigationMenuPopup>
        <NavigationMenuArrow />
        <NavigationMenuViewport />
      </NavigationMenuPopup>
    </NavigationMenuPositioner>
  </NavigationMenuPortal>
</NavigationMenu>`,

  examples: ["navigation-menu-default", "navigation-menu-simple", "navigation-menu-arrow", "navigation-menu-backdrop"],

  parts: [
    {
      name: "NavigationMenu",
      summary: "Holds which item is open.",
      props: [
        { name: "value", type: "any", description: "Controlled value: the open item's value, or null." },
        { name: "defaultValue", type: "any", default: "null", description: "The item open at first when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs for people and agents. details.cancel() keeps the item as it was.", agent: true },
        { name: "delay", type: "number", default: "50", description: "Milliseconds before opening on hover." },
        { name: "closeDelay", type: "number", default: "50", description: "Milliseconds before closing after the pointer leaves." },
        { name: "orientation", type: "\"horizontal\" | \"vertical\"", default: "\"horizontal\"", description: "Which way the list runs, and which arrow keys move through it." },
      ],
    },
    {
      name: "NavigationMenuList",
      summary: "The row of items.",
      props: [],
    },
    {
      name: "NavigationMenuItem",
      summary: "One entry: a trigger with content, or a single link.",
      props: [
        { name: "value", type: "any", default: "useId()", description: "Identifies the item in value and onValueChange.", agent: true },
      ],
    },
    {
      name: "NavigationMenuTrigger",
      summary: "Opens its content. Chevron turns while open.",
      props: [
        { name: "children", type: "ReactNode", description: "Also the name the agent reads.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Stops the trigger opening its content." },
      ],
    },
    {
      name: "NavigationMenuContent",
      summary: "One item's panel, shown in the viewport.",
      props: [],
    },
    {
      name: "NavigationMenuLink",
      summary: "A link, at the top level or inside content.",
      props: [
        { name: "href", type: "string", description: "Where it goes. The agent reads it as the link's value.", agent: true },
        { name: "active", type: "boolean", default: "false", description: "Marks the current page with aria-current." },
        { name: "closeOnClick", type: "boolean", default: "false", description: "Closes the menu when the link is clicked." },
        { name: "render", type: "ReactElement", description: "Swap the element, for example for a router link." },
      ],
    },
    {
      name: "NavigationMenuPortal",
      summary: "Renders the popup into the body.",
      props: [],
    },
    {
      name: "NavigationMenuPositioner",
      summary: "Places the popup under the list.",
      props: [
        { name: "side", type: "\"top\" | \"right\" | \"bottom\" | \"left\"", default: "\"bottom\"", description: "Which side of the list to open on." },
        { name: "sideOffset", type: "number", default: "0", description: "Gap to the list, in pixels." },
        { name: "align", type: "\"start\" | \"center\" | \"end\"", default: "\"center\"", description: "Alignment along that side." },
      ],
    },
    {
      name: "NavigationMenuPopup",
      summary: "The animated container around the viewport.",
      props: [],
    },
    {
      name: "NavigationMenuViewport",
      summary: "Shows open content; resizes between items.",
      props: [],
    },
    {
      name: "NavigationMenuArrow",
      summary: "Popup pointer. Goes inside NavigationMenuPopup.",
      props: [{ name: "children", type: "ReactNode", description: "Replaces the built-in arrow." }],
    },
    {
      name: "NavigationMenuBackdrop",
      summary: "Dims the page. Goes inside NavigationMenuPortal.",
      props: [],
    },
    {
      name: "NavigationMenuIndicator",
      summary: "A static diamond under the list.",
      props: [],
    },
  ],

  notes: [
    {
      title: "Viewport",
      body: "Each `NavigationMenuContent` sits with its item in markup but shows inside `NavigationMenuViewport` while open. Render the portal, positioner, popup and viewport once, after the list.",
    },
  ],

  agent: {
    kind: "menu",
    reads: [
      { field: "label", means: "The trigger's text, for an item with a trigger." },
      { field: "open", means: "Whether that item's content is showing." },
      { field: "link value", means: "Each NavigationMenuLink is listed as link, with its href as value." },
    ],
    actions: [
      { call: "open()", does: "Opens the item. Only while closed." },
      { call: "close()", does: "Closes the item. Only while open." },
      { call: "press()", does: "Clicks a link, at the top level or inside an open item." },
    ],
    refusal:
      "Each item with a trigger is its own menu; a link-only item is listed as the link. An agent's change runs through onValueChange. isAgentChange(details) is true for it, and details.cancel() keeps the item as it was; the agent is told the app refused.",
    example: `await agent.act({
  steps: [{ ref: "Getting Started", action: "open" }],
})`,
  },

  keyboard: [
    { keys: ["←", "→"], does: "Moves along a horizontal list" },
    { keys: ["Space", "Enter"], does: "Opens or closes the focused item" },
    { keys: ["↓"], does: "Opens the focused item in a horizontal menu" },
    { keys: ["Esc"], does: "Closes the open item" },
  ],

  accessibility: [
    "The root is a nav landmark; the list is a ul.",
    "Triggers expose open state and the popup they control.",
    "An active link carries `aria-current=\"page\"`.",
    "Content closes when focus leaves both the trigger and the popup.",
  ],
} satisfies ComponentDoc;
