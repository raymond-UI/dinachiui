import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "dialog",
  description: "A modal window over the page.",
  usage: `import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function RenameProject() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Rename project</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>The new name shows everywhere at once.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`,
  anatomy: `<Dialog>
  <DialogTrigger />
  <DialogContent>
    <DialogHeader>
      <DialogTitle />
      <DialogDescription />
    </DialogHeader>
    <DialogFooter>
      <DialogClose />
    </DialogFooter>
  </DialogContent>
</Dialog>`,

  examples: ["dialog-default", "dialog-controlled", "dialog-nested", "dialog-form"],

  parts: [
    {
      name: "Dialog",
      summary: "Holds the open state.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starting open state when uncontrolled." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs on open or close, for people and agents. details.cancel() refuses it.", agent: true },
        { name: "modal", type: "boolean | \"trap-focus\"", default: "true", description: "Traps focus, locks page scroll and blocks outside clicks. `trap-focus` only traps focus." },
        { name: "disablePointerDismissal", type: "boolean", default: "false", description: "Keeps the dialog open on an outside click." },
        { name: "onOpenChangeComplete", type: "(open) => void", description: "Runs once the open or close animation finishes." },
      ],
    },
    {
      name: "DialogTrigger",
      summary: "The button that opens the dialog.",
      props: [
        { name: "render", type: "ReactElement", description: "Swap the element, keep the behaviour." },
        { name: "children", type: "ReactNode", description: "Also the agent's label while closed.", agent: true },
      ],
    },
    {
      name: "DialogContent",
      summary: "Portal, backdrop, viewport and popup in one.",
      props: [
        { name: "initialFocus", type: "boolean | RefObject | (type) => element", description: "Where focus goes on open. Passed to the popup." },
        { name: "finalFocus", type: "boolean | RefObject | (type) => element", description: "Where focus goes on close. Passed to the popup." },
      ],
    },
    {
      name: "DialogTitle",
      summary: "The heading that names the dialog.",
      props: [{ name: "children", type: "ReactNode", description: "Also the agent's label while open.", agent: true }],
    },
    {
      name: "DialogDescription",
      summary: "Supporting text, announced with the title.",
      props: [],
    },
    {
      name: "DialogClose",
      summary: "An outline button that closes the dialog.",
      props: [{ name: "render", type: "ReactElement", description: "Swap the element. Built-in styles are dropped." }],
    },
    {
      name: "DialogHeader",
      summary: "Stacks the title and description.",
      props: [],
    },
    {
      name: "DialogFooter",
      summary: "Actions: stacked, then a row from sm.",
      props: [],
    },
    {
      name: "DialogPortal",
      summary: "Renders its children into the body.",
      props: [
        { name: "keepMounted", type: "boolean", default: "false", description: "Keeps the popup in the DOM while closed." },
        { name: "container", type: "HTMLElement | RefObject", description: "Where to portal. Defaults to the body." },
      ],
    },
    {
      name: "DialogBackdrop",
      summary: "The dimmed layer behind the popup.",
      props: [],
    },
    {
      name: "DialogViewport",
      summary: "A fixed, scrollable layer that centres the popup.",
      props: [],
    },
    {
      name: "DialogPopup",
      summary: "The window, for composing layers yourself.",
      props: [
        { name: "initialFocus", type: "boolean | RefObject | (type) => element", description: "Where focus goes on open." },
        { name: "finalFocus", type: "boolean | RefObject | (type) => element", description: "Where focus goes on close." },
      ],
    },
  ],

  notes: [
    {
      title: "Composing the layers",
      body: "`DialogContent` is `DialogPortal`, `DialogBackdrop`, `DialogViewport` and `DialogPopup` stacked in that order. Compose them yourself to style or drop a layer; the agent still finds the popup.",
    },
    {
      title: "Popups inside a dialog",
      body: "A Select inside a dialog renders its list in place by default, so it stays inside the dialog's focus trap and stacking. The **With form** example composes Input, Select, Radio, Checkbox and Textarea this way.",
    },
  ],

  agent: {
    kind: "dialog",
    reads: [
      { field: "label", means: "The DialogTitle while open. The trigger's name while closed, or while open with no title." },
      { field: "open", means: "Whether the dialog is showing. Open dialogs are listed first." },
    ],
    actions: [
      { call: "open()", does: "While closed. act returns the opened dialog under `appeared`." },
      { call: "close()", does: "While open." },
    ],
    refusal:
      "An agent's open or close runs through onOpenChange. isAgentChange(details) is true for it; details.cancel() refuses it and tells the agent. Controls inside report the dialog's title as `in`.",
    example: `await agent.act({
  steps: [{ ref: "Open Dialog", action: "open" }],
})`,
  },

  keyboard: [
    { keys: ["Space", "Enter"], does: "Opens the dialog from the trigger" },
    { keys: ["Tab"], does: "Moves focus, kept inside the dialog while modal" },
    { keys: ["Esc"], does: "Closes and returns focus to the trigger" },
  ],

  accessibility: [
    "The popup is a dialog named by DialogTitle and described by DialogDescription.",
    "Give every dialog a DialogTitle; the agent reads the same name.",
    "While modal, focus is trapped and the page behind is inert.",
    "Focus returns to the trigger on close, unless finalFocus says otherwise.",
    "Reduced motion turns the animation into a fade.",
  ],
} satisfies ComponentDoc;
