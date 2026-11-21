import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "breadcrumb",
  description: "Shows where a page sits, and steps back up to any level in one move.",
  usage: `import { Breadcrumb } from "@/components/ui/breadcrumb"

export function RoomPath() {
  return (
    <Breadcrumb
      items={[
        { label: "Properties", href: "/properties" },
        { label: "Harbour House", href: "/properties/harbour-house" },
        { label: "Rooms", href: "/properties/harbour-house/rooms" },
        { label: "214 Sea View Double" },
      ]}
    />
  )
}`,

  examples: ["breadcrumb-default", "breadcrumb-collapse", "breadcrumb-phone", "breadcrumb-router"],

  parts: [
    {
      name: "Breadcrumb",
      summary: "The `<nav>` and everything in it. Levels, separators, the folded menu and the phone sheet are rendered for you.",
      props: [
        { name: "items", type: "BreadcrumbItem[]", description: "From the root to the current page, each `{ label, href?, render? }`. The last is the current page.", agent: true },
        { name: "hideCurrent", type: "boolean", default: "false", description: "Leaves the current page out of the trail, for pages whose heading already names it." },
        { name: "presentation", type: '"auto" | "trail" | "back"', default: '"auto"', description: "`back` is one link to the parent with the trail in a sheet. `auto` is `back` below 768px, and in any container too narrow to read the trail." },
        { name: "floating", type: "boolean", default: "false", description: "Draws `back` as frosted pills that read over a photo." },
        { name: "onNavigate", type: "(item, details) => void", description: "Runs before every move, for people and agents. `details.reason` is `link-press`, `menu-press`, `back-press`, `sheet-press` or, for an agent, `imperative-action`. `details.cancel()` refuses the move. `details.event.preventDefault()` only stops the link, for a move your router makes.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "aria-label", type: "string", default: '"Breadcrumb"', description: "Names the nav and the phone sheet." },
      ],
    },
  ],

  notes: [
    {
      title: "Folding",
      body: "The trail is measured, not breakpoint-driven. As the container narrows, middle levels fold into one `…` menu, one at a time and only as far as needed. A level that is kept is never cut short. The root and the parent always stay. Levels before the last are capped in width; the last truncates, with its full name in a tooltip. With `auto`, a container too narrow for even those to read turns the trail into the back link.\n\n`breadcrumbFit()` is the measurement as a function, for a trail of your own. Pass `readable` and it returns 0 when even the fewest levels would truncate below that width.",
    },
    {
      title: "Current page",
      body: 'The last item is the current page: plain text with `aria-current="page"`, never a link. When the heading below already names it, `hideCurrent` drops it and the parent ends the trail.',
    },
    {
      title: "Phone",
      body: "Below 768px the breadcrumb is one back link to the parent. The path button, or holding the back link, opens the whole trail in a sheet, root first so the nearest levels sit lowest, by the thumb. Long names wrap there rather than truncate. Over a photo, `floating` frosts both buttons; place the nav over the image yourself.",
    },
    {
      title: "Routers",
      body: "Give an item `render`, such as `<NextLink href=\"/rooms\" />`, and every place that level appears, the trail, the menu and the sheet, uses your router's link.\n\nOr move in `onNavigate`: call your router and `details.event.preventDefault()`. That stops the browser's own link, for people and agents alike, and an agent's `goTo` still counts as done. `details.cancel()` is for refusing a move, and tells an agent so.",
    },
    {
      title: "Motion",
      body: "None of its own: a breadcrumb is used many times a day. Hover changes colour only, and folding is instant. The `…` menu and the phone sheet keep Menu's and Drawer's own motion.",
    },
  ],

  agent: {
    kind: "list",
    reads: [
      { field: "label", means: 'The aria-label, "Breadcrumb" by default.' },
      { field: "value", means: "The current page." },
      { field: "items", means: "Every level, root first, folded ones included." },
    ],
    actions: [
      { call: 'goTo("Rooms")', does: "Goes to a level by name, or by position from 1. A folded level is reached through its menu, or the sheet on phones." },
    ],
    refusal:
      "An agent's move runs through onNavigate like anyone's. Its reason is imperative-action, and details.event is the real click, as for a person, so tell an agent's move apart with isAgentChange(details). details.cancel() refuses it. An app that routes the move itself calls details.event.preventDefault() instead, and the step succeeds. A level that is not in the trail is refused with the list, and a level without an href cannot be gone to.",
    example: `await agent.act({
  steps: [{ ref: "Breadcrumb", action: "goTo", args: ["Harbour House"] }],
})`,
  },

  keyboard: [
    { keys: ["Tab"], does: "Moves through the levels and the `…` button" },
    { keys: ["Enter"], does: "Follows a level, or opens the folded levels" },
    { keys: ["↑", "↓"], does: "Moves through the folded levels in the menu" },
    { keys: ["Esc"], does: "Closes the menu or the sheet" },
  ],

  accessibility: [
    'A `<nav>` landmark named "Breadcrumb" unless you name it, holding an ordered list.',
    'The current page has `aria-current="page"` and is not a link.',
    "Separators are hidden from assistive tech.",
    "The `…` button is named for what it holds, such as Show 3 more levels.",
    "On phones the back link reads Back to Rooms, and the path button Show full path, so the trail never needs a long-press.",
    "On phones the back link, the path button and the folded levels are 44px targets.",
  ],
} satisfies ComponentDoc;
