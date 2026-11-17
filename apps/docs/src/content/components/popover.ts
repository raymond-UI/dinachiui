import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "popover",
  description: "A panel anchored to a trigger, opened by a person or an agent.",
  usage: `import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function Filters() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Filters</PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Filters</PopoverTitle>
        <PopoverDescription>Narrow the list by status and owner.</PopoverDescription>
      </PopoverContent>
    </Popover>
  )
}`,
  anatomy: `<Popover>
  <PopoverTrigger />
  <PopoverPortal>
    <PopoverBackdrop />
    <PopoverPositioner>
      <PopoverPopup>
        <PopoverArrow />
        <PopoverViewport>
          <PopoverTitle />
          <PopoverDescription />
          <PopoverClose />
        </PopoverViewport>
      </PopoverPopup>
    </PopoverPositioner>
  </PopoverPortal>
</Popover>`,

  examples: ["popover-close", "popover-default", "popover-positions", "popover-hover", "popover-multi-trigger"],

  parts: [
    {
      name: "Popover",
      summary: "Holds the open state.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starting state when uncontrolled." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "onOpenChangeComplete", type: "(open) => void", description: "Runs once the open or close animation ends." },
        { name: "modal", type: "boolean | \"trap-focus\"", default: "false", description: "Locks page scroll and outside clicks while open. \"trap-focus\" only traps focus." },
        { name: "handle", type: "PopoverHandle", description: "Links triggers rendered elsewhere. Make one with createPopoverHandle()." },
        { name: "children", type: "ReactNode | ({ payload }) => ReactNode", description: "A function receives the opening trigger's payload." },
      ],
    },
    {
      name: "PopoverTrigger",
      summary: "Opens the popup. Names it for agents while closed.",
      props: [
        { name: "render", type: "ReactElement | (props) => ReactElement", description: "Swap the element, keep the behaviour." },
        { name: "openOnHover", type: "boolean", default: "false", description: "Also opens when the pointer rests on it." },
        { name: "delay", type: "number", default: "300", description: "Milliseconds before opening on hover." },
        { name: "closeDelay", type: "number", default: "0", description: "Milliseconds before closing after the pointer leaves." },
        { name: "handle", type: "PopoverHandle", description: "Ties a trigger outside the Popover to it." },
        { name: "payload", type: "unknown", description: "Passed to the Popover's children function when this trigger opens." },
      ],
    },
    {
      name: "PopoverContent",
      summary: "The portal, positioner and popup in one.",
      props: [
        { name: "side", type: "\"top\" | \"right\" | \"bottom\" | \"left\"", default: "\"bottom\"", description: "Which side of the trigger to open on." },
        { name: "align", type: "\"start\" | \"center\" | \"end\"", default: "\"center\"", description: "Alignment along that side." },
        { name: "sideOffset", type: "number", default: "8", description: "Gap to the trigger, in pixels." },
        { name: "alignOffset", type: "number", description: "Shift along the alignment axis, in pixels." },
        { name: "collisionPadding", type: "number", default: "5", description: "Space kept from the viewport edge." },
        { name: "collisionBoundary", type: "Element | \"clipping-ancestors\"", default: "\"clipping-ancestors\"", description: "What the popup avoids overflowing." },
        { name: "sticky", type: "boolean", default: "false", description: "Stays in view when the trigger scrolls away." },
        { name: "portal", type: "boolean", default: "true", description: "Renders into the body. Set false inside a Dialog or Drawer." },
      ],
    },
    {
      name: "PopoverPortal",
      summary: "Renders its children into the body.",
      props: [],
    },
    {
      name: "PopoverPositioner",
      summary: "Places the popup against the trigger.",
      props: [
        { name: "side", type: "\"top\" | \"right\" | \"bottom\" | \"left\"", default: "\"bottom\"", description: "Which side of the trigger to open on." },
        { name: "sideOffset", type: "number", default: "8", description: "Gap to the trigger, in pixels." },
        { name: "align", type: "\"start\" | \"center\" | \"end\"", default: "\"center\"", description: "Alignment along that side." },
      ],
    },
    {
      name: "PopoverPopup",
      summary: "The panel. Agents see it while open.",
      props: [{ name: "initialFocus", type: "RefObject | boolean", description: "What takes focus when it opens." }],
    },
    {
      name: "PopoverArrow",
      summary: "A pointer from the popup to the trigger.",
      props: [{ name: "children", type: "ReactNode", description: "Replaces the built-in arrow." }],
    },
    {
      name: "PopoverViewport",
      summary: "Animates content when a shared popup switches triggers.",
      props: [],
    },
    {
      name: "PopoverTitle",
      summary: "The heading; names the popup.",
      props: [{ name: "children", type: "ReactNode", description: "Also the name the agent reads while open.", agent: true }],
    },
    {
      name: "PopoverDescription",
      summary: "Describes the popup.",
      props: [],
    },
    {
      name: "PopoverClose",
      summary: "A button that closes the popup.",
      props: [{ name: "render", type: "ReactElement | (props) => ReactElement", description: "Swap the element, keep the behaviour." }],
    },
    {
      name: "PopoverBackdrop",
      summary: "A dimmed layer under the popup.",
      props: [],
    },
    {
      name: "createPopoverHandle",
      summary: "Links detached triggers to one Popover.",
      props: [],
    },
  ],

  notes: [
    {
      title: "Inside a Dialog or Drawer",
      body: "`PopoverContent` portals into the body by default. Pass `portal={false}` inside a `Dialog` or `Drawer` to stay in their stacking and focus scope.",
    },
    {
      title: "One popup, many triggers",
      body: "Pass one `createPopoverHandle()` to the `Popover` and each `PopoverTrigger`, and give each trigger a `payload`. The children function receives it; `PopoverViewport` animates between contents. Agents see triggers outside the `Popover` as plain buttons.",
    },
  ],

  agent: {
    kind: "popover",
    reads: [
      { field: "label", means: "The trigger's name while closed; while open, the PopoverTitle, falling back to the trigger's name." },
      { field: "open", means: "Whether the popup is showing." },
    ],
    actions: [
      { call: "open()", does: "Opens the popup. Only while closed." },
      { call: "close()", does: "Closes the popup. Only while open." },
    ],
    refusal:
      "While open, the popover and its contents are listed before the page. An agent's change runs through onOpenChange; isAgentChange(details) is true for it, and details.cancel() refuses it. The agent is told the app refused.",
    example: `await agent.act({
  steps: [{ ref: "Settings", action: "open" }],
})`,
  },

  keyboard: [
    { keys: ["Space", "Enter"], does: "Opens or closes the popup from the trigger" },
    { keys: ["Tab"], does: "Moves focus through the popup's content" },
    { keys: ["Esc"], does: "Closes and returns focus to the trigger" },
  ],

  accessibility: [
    "The popup is a dialog, named by PopoverTitle and described by PopoverDescription.",
    "The trigger reports whether the popup is open.",
    "Give an icon-only trigger an aria-label. The agent reads the same name.",
    "Focus moves into the popup on open and back to the trigger on close.",
  ],
} satisfies ComponentDoc;
