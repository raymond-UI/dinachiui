import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "drawer",
  description: "A panel that slides in from an edge, for people and agents.",
  usage: `import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function Settings() {
  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger render={<Button variant="outline" />}>Open settings</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Changes save as you make them.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Done</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}`,
  anatomy: `<Drawer>
  <DrawerTrigger />
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle />
      <DrawerDescription />
    </DrawerHeader>
    <DrawerFooter>
      <DrawerClose />
    </DrawerFooter>
  </DrawerContent>
  <DrawerSwipeArea />
</Drawer>`,

  examples: ["drawer-default", "drawer-sides", "drawer-navigation"],

  parts: [
    {
      name: "Drawer",
      summary: "Holds the open and swipe state.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starting open state when uncontrolled." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs on open and close, from either side. details.cancel() refuses it.", agent: true },
        { name: "swipeDirection", type: '"up" | "down" | "left" | "right"', default: '"down"', description: "The swipe that dismisses the drawer. Match it to `side`." },
        { name: "modal", type: "boolean | \"trap-focus\"", default: "true", description: "Traps focus, locks page scroll and blocks outside clicks. `trap-focus` only traps focus." },
        { name: "disablePointerDismissal", type: "boolean", default: "false", description: "Keeps the drawer open on an outside click." },
        { name: "snapPoints", type: "(number | string)[]", description: "Resting heights. Fractions of the viewport, pixels, or px and rem strings." },
      ],
    },
    {
      name: "DrawerTrigger",
      summary: "The button that opens the drawer.",
      props: [
        { name: "render", type: "ReactElement", description: "Swap the element, keep the behaviour." },
        { name: "children", type: "ReactNode", description: "Also the name the agent reads while the drawer is closed.", agent: true },
      ],
    },
    {
      name: "DrawerContent",
      summary: "Portal, backdrop and scrolling panel in one.",
      props: [
        { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"right"', description: "The edge the panel enters from." },
        { name: "initialFocus", type: "boolean | RefObject | (type) => element", description: "Where focus goes on open." },
        { name: "finalFocus", type: "boolean | RefObject | (type) => element", description: "Where focus goes on close." },
      ],
    },
    {
      name: "DrawerTitle",
      summary: "The heading that names the drawer.",
      props: [{ name: "children", type: "ReactNode", description: "Also the name the agent reads while open.", agent: true }],
    },
    {
      name: "DrawerDescription",
      summary: "Supporting text, announced with the title.",
      props: [],
    },
    {
      name: "DrawerClose",
      summary: "A button that closes the drawer. Unstyled.",
      props: [{ name: "render", type: "ReactElement", description: "Swap the element, such as a Button." }],
    },
    {
      name: "DrawerHeader",
      summary: "Stacks the title and description.",
      props: [],
    },
    {
      name: "DrawerFooter",
      summary: "Bottom actions, in a row from sm.",
      props: [],
    },
    {
      name: "DrawerSwipeArea",
      summary: "An invisible strip that swipes the drawer open.",
      props: [
        { name: "swipeDirection", type: '"up" | "down" | "left" | "right"', description: "The swipe that opens it. Defaults to the opposite of the Drawer's." },
        { name: "disabled", type: "boolean", default: "false", description: "Stops the strip from opening the drawer." },
      ],
    },
    {
      name: "DrawerPortal",
      summary: "Portals children to the body. DrawerContent includes it.",
      props: [],
    },
    {
      name: "DrawerBackdrop",
      summary: "The dimmed layer; fades with the swipe.",
      props: [],
    },
  ],

  notes: [
    {
      title: "Swipe direction",
      body: "`side` only places the panel. The dismiss swipe comes from `swipeDirection` on `Drawer`, default `down`. For the default right-hand panel, pass `swipeDirection=\"right\"`; for `side=\"left\"`, pass `\"left\"`.",
    },
    {
      title: "Swiping",
      body: "- The backdrop dims with the drag.\n- A flick closes faster than a slow release past the threshold.\n- A click close takes the normal duration.",
    },
  ],

  agent: {
    kind: "dialog",
    reads: [
      { field: "label", means: "The DrawerTitle while open. The trigger's name while closed, or while open with no title." },
      { field: "open", means: "Whether the drawer is showing. Open drawers are listed first." },
    ],
    actions: [
      { call: "open()", does: "While closed. act returns the opened drawer under `appeared`." },
      { call: "close()", does: "While open." },
    ],
    refusal:
      "An agent's open or close runs through onOpenChange. isAgentChange(details) is true for it, and details.cancel() refuses it; the agent is told the app refused. Controls inside report the drawer's title as `in`.",
    example: `await agent.act({
  steps: [{ ref: "Open Drawer", action: "open" }],
})`,
  },

  keyboard: [
    { keys: ["Space", "Enter"], does: "Opens the drawer from the trigger" },
    { keys: ["Tab"], does: "Moves focus, kept inside the drawer while modal" },
    { keys: ["Esc"], does: "Closes and returns focus to the trigger" },
  ],

  accessibility: [
    "The panel is a dialog named by DrawerTitle and described by DrawerDescription.",
    "Give every drawer a DrawerTitle. The agent reads the same name.",
    "While modal, focus is trapped and the page cannot scroll or take clicks.",
    "Focus returns to the trigger when the drawer closes.",
    "Reduced motion fades the panel in place instead of sliding.",
  ],
} satisfies ComponentDoc;
